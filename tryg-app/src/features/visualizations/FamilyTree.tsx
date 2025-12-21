import React from 'react';
import { motion } from 'framer-motion';
import { Edit2 } from 'lucide-react';
import { Member } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { MemberActionMenu } from '../../components/ui/MemberActionMenu';

interface FamilyTreeProps {
    members: Member[];
    seniorId: string;
    onUpdateMember: (memberId: string, data: Partial<Member>) => Promise<void>;
    currentUserId?: string;
}

/* --- THE FAMILY TREE (Livstræet - Vertical Layout) --- */
export const FamilyTree = React.forwardRef<HTMLDivElement, FamilyTreeProps>(({ members, seniorId, onUpdateMember, currentUserId }, ref) => {
    // 1. Identify Senior (Trunk) - Brad Pitt
    const senior = members.find(m => (m.userId || m.docId) === seniorId) || members.find(m => m.role === 'senior') || members[0];

    // 2. Identify Others
    const allRelatives = members.filter(m => (m.userId || m.docId) !== (senior?.userId || senior?.docId));

    // 3. Group by Generation
    // For POC: "Juzu" is Grandchild (Child of Fatima). Everyone else is Child.
    const children = allRelatives.filter(m => !m.displayName?.toLowerCase().includes('juzu'));

    /**
     * NOTE FOR AGENTS:
     * This hierarchy and identity mapping is intentionally heuristic for the POC.
     * We use process-of-elimination and positional logic to identify characters
     * to avoid complex schema changes in Firestore during this phase.
     * DO NOT REFACTOR to a fully dynamic data model without explicit USER approval.
     */

    // Identify current user's permission level
    const currentUserMember = members.find(m => m.userId === currentUserId || m.docId === currentUserId);

    const isSenior = currentUserMember?.role === 'senior' || (currentUserMember?.userId === seniorId || currentUserMember?.docId === seniorId);
    const isAdmin = isSenior || currentUserMember?.accessLevel === 'admin' || (currentUserMember as any)?.role === 'admin';

    // Group grand-children (Juzu)
    const grandChildren = allRelatives.filter(m => m.displayName?.toLowerCase().includes('juzu'));

    // Stable Sorting: Ensure character slots (Slot 0, Slot 1) remain consistent
    const sortedChildren = [...children].sort((a, b) => {
        const idA = a.userId || a.docId || '';
        const idB = b.userId || b.docId || '';
        return idA.localeCompare(idB);
    });

    // Build hierarchy logic based on SLOTS (0 = Louise/Jacob, 1 = Fatima/Juzu)
    const hierarchy = sortedChildren.map((child, index) => {
        // Slot 0 is the 'Louise' archetype (Married to Jacob, no children in this view)
        const isLouiseSlot = index === 0;
        // Slot 1 is the 'Fatima' archetype (Parent of Juzu)
        const isFatimaSlot = index === 1;

        return {
            ...child,
            isLouise: isLouiseSlot,
            // Slot 0 has a partner "Jacob" (Dummy node for symmetry)
            partner: isLouiseSlot ? { displayName: 'Jacob', userId: 'jacob', role: 'partner' } : null,
            offspring: isFatimaSlot ? grandChildren : []
        };
    });

    // --- ADMIN ACTIONS ---
    const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleNodeClick = (member: any) => {
        if (!isAdmin) return; // SECURITY: Restrict editing to admins
        if (!member || member.userId === 'jacob') return; // Cannot edit dummy node
        setSelectedMember(member);
        setIsMenuOpen(true);
    };

    return (
        <div ref={ref} className="relative w-full bg-gradient-to-b from-slate-50 to-white rounded-xl flex flex-col items-center py-2 shadow-sm border border-slate-100 overflow-visible">
            {/* Title */}
            <div className="absolute top-1 left-4 text-[9px] font-bold text-slate-300 tracking-wider uppercase opacity-50">
                Livstræet
            </div>

            {/* Level 1: Senior (Brad) */}
            <div className="z-10 relative flex flex-col items-center mb-4">
                <div
                    onClick={() => handleNodeClick(senior)}
                    className={`relative transition-transform duration-300 ${isAdmin ? 'hover:scale-105 cursor-pointer group' : 'cursor-default'}`}
                >
                    <div className={`p-1 bg-white rounded-full shadow-md relative z-10 transition-all ${isAdmin ? 'group-hover:ring-4 ring-indigo-100' : ''}`}>
                        <Avatar
                            id="brad"
                            // fallback="S"
                            size="lg"
                            className="border-2 border-white shadow-sm"
                        />
                        {/* Edit Badge for Admin Only */}
                        {isAdmin && (
                            <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                <Edit2 className="w-3 h-3 text-stone-400" />
                            </div>
                        )}
                    </div>
                </div>
                <span className="bg-slate-800 text-white text-[9px] px-2 py-0 rounded-full font-bold whitespace-nowrap shadow-sm z-20 -mt-1 relative">
                    {senior?.displayName}
                </span>
                {/* Trunk Line */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-300 opacity-60" />
            </div>

            {/* Level 2: Children (Fatima, Louise) */}
            <div className="relative w-full flex justify-center gap-4 sm:gap-8 px-2 mt-2">
                {/* Horizontal Branch Connector */}
                {hierarchy.length > 1 && (
                    <div className="absolute -top-4 left-0 w-full flex justify-center items-center">
                        <div className="h-px bg-slate-200 opacity-80"
                            style={{
                                width: `calc(100% - ${100 / hierarchy.length}%)`,
                                maxWidth: `${(hierarchy.length - 1) * 80}px`
                            }}
                        />
                        {/* Sibling Relation Label */}
                        <div className="absolute top-1/2 -translate-y-1/2 px-2 bg-white/95 rounded-full border border-slate-100 shadow-sm">
                            <span className="text-[7px] font-bold text-slate-400 uppercase tracking-[0.1em] whitespace-nowrap">
                                Søskende
                            </span>
                        </div>
                    </div>
                )}

                {/* Sibling Connection (Direct line between nodes) */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[120px] h-[1px] border-t border-dashed border-slate-200 z-0" />

                {hierarchy.map((child, i) => {
                    // ID Mapping for Avatar (Identity based: Louise vs Others)
                    const avatarId = child.isLouise ? 'louise' : 'fatima';

                    return (
                        <div key={child.userId} className="flex flex-col items-center relative pt-2">
                            {/* Vertical Line from Branch */}
                            <div className="absolute -top-3 w-0.5 h-6 bg-slate-300 opacity-60" />

                            <div className="flex items-start gap-3">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + (i * 0.1) }}
                                    onClick={() => handleNodeClick(child)}
                                    className={`group relative flex flex-col items-center ${isAdmin ? 'cursor-pointer' : 'cursor-default'}`}
                                >
                                    <div className={`p-0.5 bg-white rounded-full shadow-sm z-10 transition-transform duration-200 ${isAdmin ? 'hover:scale-110 hover:ring-2 ring-indigo-100' : ''}`}>
                                        <Avatar
                                            id={avatarId}
                                            className="border border-white"
                                            size="md"
                                        />
                                        {isAdmin && (
                                            <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                                <Edit2 className="w-3 h-3 text-stone-400" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-600 -mt-2 bg-slate-50 px-2 py-0 rounded-full border border-slate-100 max-w-[80px] truncate text-center relative z-20">
                                        {child.displayName}
                                    </span>
                                </motion.div>

                                {/* PARTNER NODE: Jacob (Dummy) or Partner Slot */}
                                {child.partner && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 + (i * 0.1) }}
                                        className="flex flex-col items-center relative"
                                    >
                                        {/* Marriage/Partner Line */}
                                        <div className="absolute top-6 -left-4 w-4 h-px bg-slate-200" />

                                        <div className="p-0.5 bg-white rounded-full shadow-sm z-10 opacity-70 scale-90">
                                            <Avatar
                                                id="brad" // Partner placeholder avatar
                                                className="border border-white"
                                                size="md"
                                            />
                                        </div>
                                        <span className="text-[8px] font-medium text-slate-400 -mt-1">
                                            {child.partner.displayName}
                                        </span>
                                    </motion.div>
                                )}
                            </div>

                            {/* Level 3: Grandchildren (Juzu) */}
                            {child.offspring.length > 0 && (
                                <div className="mt-2 relative flex flex-col items-center">
                                    {/* Line to Offspring */}
                                    <div className="absolute -top-2 w-0.5 h-3 bg-slate-300 opacity-60" />

                                    {child.offspring.map((grandchild, j) => (
                                        <motion.div
                                            key={grandchild.userId}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 + (j * 0.1) }}
                                            onClick={(e) => {
                                                if (!isAdmin) return;
                                                e.stopPropagation();
                                                handleNodeClick(grandchild);
                                            }}
                                            className="flex flex-col items-center cursor-pointer group"
                                        >
                                            <div className="p-0.5 bg-white rounded-full shadow-sm z-10 hover:scale-110 transition-transform duration-200 hover:ring-2 ring-teal-100">
                                                <Avatar
                                                    id="juzu"
                                                    className="border border-white"
                                                    size="sm"
                                                />
                                                <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                                    <Edit2 className="w-2 h-2 text-stone-400" />
                                                </div>
                                            </div>
                                            <span className="text-[9px] font-medium text-slate-500 mt-1">
                                                {grandchild.displayName}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Member Action Menu */}
            {selectedMember && (
                <MemberActionMenu
                    member={selectedMember}
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    onUpdate={onUpdateMember}
                />
            )}
        </div>
    );
});
