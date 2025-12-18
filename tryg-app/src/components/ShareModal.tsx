import React from 'react';
import { X, Copy, Users, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';
import { FamilyConstellation } from '../features/familyPresence';

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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add a toast here
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-md h-[80vh] sm:h-auto sm:max-h-[85vh] sm:rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl animate-slide-up">
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
                                        <Copy className="w-4 h-4" />
                                        {t('copy', 'Kopier')}
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

                        <div className="bg-stone-50 rounded-3xl p-4 border border-stone-100 flex justify-center">
                            <div className="scale-90 sm:scale-100 origin-center py-4">
                                <FamilyConstellation
                                    members={members as any}
                                    centerMemberName={seniorName}
                                    currentUserId={currentUserId}
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
