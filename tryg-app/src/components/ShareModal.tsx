import React, { useState } from 'react';
import { X, Copy, Users, Shield, Edit3, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';
import { FamilyConstellation } from '../features/familyPresence';
import { Avatar } from './ui/Avatar';
import { Member } from '../types';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface ShareModalProps {
    members: any[];
    inviteCode: string | null;
    onGetInviteCode: () => Promise<void>;
    onClose: () => void;
    seniorName: string;
    currentUserId?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
    members,
    inviteCode,
    onGetInviteCode,
    onClose,
    seniorName,
    currentUserId
}) => {
    const { t } = useTranslation();

    // State for editing ANY member
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [editName, setEditName] = useState('');
    const [editRelationship, setEditRelationship] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // When clicking a member in constellation, open edit mode
    const handleMemberClick = (member: Member) => {
        console.log('📝 Editing member:', member);
        setEditingMember(member);
        setEditName(member.displayName || '');
        setEditRelationship(member.relationship || '');
    };

    // Save member updates directly to Firestore (POC - allows editing any member)
    const handleSaveMember = async () => {
        if (!editingMember) {
            console.error('❌ No editingMember');
            return;
        }

        // The docId should be set when members are loaded from Firestore
        // It's the document ID in careCircleMemberships collection
        const memberId = editingMember.docId;

        if (!memberId) {
            console.error('❌ No docId found on member:', editingMember);
            alert('Kunne ikke finde medlem-ID. Tjek konsollen.');
            return;
        }

        console.log('💾 Saving to:', memberId, { displayName: editName, relationship: editRelationship });

        setLoading(true);
        try {
            const memberRef = doc(db, 'careCircleMemberships', memberId);

            await setDoc(memberRef, {
                displayName: editName,
                relationship: editRelationship
            }, { merge: true });

            console.log('✅ Updated member:', memberId);
            setEditingMember(null);
        } catch (error) {
            console.error('Failed to update member:', error);
            alert('Fejl ved opdatering. Tjek konsollen.');
        } finally {
            setLoading(false);
        }
    };

    // Get avatar ID based on name
    const getAvatarId = (name: string) => {
        const lower = name?.toLowerCase() || '';
        if (lower.includes('fatima') || lower === 'test user') return 'fatima';
        if (lower === 'brad') return 'brad';
        if (lower.includes('juzu') || lower.includes('dinko')) return 'brad'; // For POC
        return 'louise';
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-md h-[85vh] sm:h-auto sm:max-h-[90vh] sm:rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl animate-slide-up">
                {/* Header */}
                <div className="px-6 py-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-stone-800">{t('family_circle')}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-stone-200 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-stone-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Edit Member Modal (inline) */}
                    {editingMember && (
                        <section className="space-y-4 animate-fade-in">
                            <div className="flex items-center gap-2 text-teal-600">
                                <Edit3 className="w-4 h-4" />
                                <h3 className="text-sm font-bold uppercase tracking-wider">
                                    Rediger medlem
                                </h3>
                            </div>

                            <div className="bg-teal-50 rounded-2xl p-4 border-2 border-teal-200">
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar
                                        id={getAvatarId(editingMember.displayName)}
                                        size="lg"
                                    />
                                    <div>
                                        <h3 className="font-bold text-stone-900">{editingMember.displayName}</h3>
                                        <p className="text-xs text-stone-500">{editingMember.role}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">
                                            Navn
                                        </label>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white text-stone-900"
                                            placeholder="Navn"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">
                                            Relation til {seniorName}
                                        </label>
                                        <input
                                            type="text"
                                            value={editRelationship}
                                            onChange={(e) => setEditRelationship(e.target.value)}
                                            className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white text-stone-900"
                                            placeholder="F.eks. Søn, Datter, Nevø..."
                                        />
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            onClick={() => setEditingMember(null)}
                                            disabled={loading}
                                            className="flex-1"
                                        >
                                            Annuller
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="small"
                                            onClick={handleSaveMember}
                                            disabled={loading}
                                            className="flex-1"
                                        >
                                            {loading ? 'Gemmer...' : 'Gem'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Invite Code Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-stone-600">
                            <Shield className="w-4 h-4" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">{t('invite_code')}</h3>
                        </div>

                        <div className="bg-stone-50 rounded-2xl p-6 border-2 border-dashed border-stone-200 text-center relative group">
                            {inviteCode ? (
                                <>
                                    <p className="text-3xl font-mono font-bold tracking-[0.2em] text-stone-800 mb-2">{inviteCode}</p>
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        className="mx-auto flex items-center gap-2"
                                        onClick={() => copyToClipboard(inviteCode)}
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4 text-teal-600" />
                                                Kopieret!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                {t('copy', 'Kopier')}
                                            </>
                                        )}
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="primary"
                                    className="w-full"
                                    onClick={onGetInviteCode}
                                >
                                    {t('show_invite_code')}
                                </Button>
                            )}
                        </div>
                        <p className="text-xs text-stone-400 text-center leading-relaxed">
                            {t('invite_notice', 'Del denne kode med familiemedlemmer, du ønsker at invitere til din Care Circle.')}
                        </p>
                    </section>

                    {/* Family Constellation Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-stone-600">
                            <Users className="w-4 h-4" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">{t('family_heart')}</h3>
                        </div>

                        <p className="text-xs text-stone-500 text-center">
                            👆 Tryk på et familiemedlem for at redigere deres profil
                        </p>

                        <div className="bg-stone-50 rounded-3xl p-4 border border-stone-100 flex justify-center">
                            <div className="scale-90 sm:scale-100 origin-center py-4">
                                <FamilyConstellation
                                    members={members as any}
                                    centerMemberName={seniorName}
                                    currentUserId={currentUserId}
                                    onMemberClick={handleMemberClick}
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer safe area */}
                <div className="h-8 sm:h-6" />
            </div>
        </div>
    );
};

export default ShareModal;
