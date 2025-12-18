import { Crown, Medal, Award, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LeaderboardEntry } from './useWordGame';

interface LeaderboardProps {
    scores: LeaderboardEntry[];
    currentUserId: string;
}

// Leaderboard Component - Family rankings for word game
export const Leaderboard: React.FC<LeaderboardProps> = ({ scores, currentUserId }) => {
    const { t } = useTranslation();
    if (!scores || scores.length === 0) {
        return (
            <div className="bg-stone-50 rounded-xl p-4 text-center">
                <Users className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-stone-400 text-sm">{t('no_one_played_today')}</p>
                <p className="text-stone-300 text-xs">{t('be_the_first')}</p>
            </div>
        );
    }

    // Get medal/rank icon
    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 0: return <Crown className="w-5 h-5 text-amber-500" />;
            case 1: return <Medal className="w-5 h-5 text-stone-400" />;
            case 2: return <Award className="w-5 h-5 text-amber-700" />;
            default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-stone-400">{rank + 1}</span>;
        }
    };

    // Get rank colors
    const getRankStyle = (rank: number, isMe: boolean) => {
        let base = 'flex items-center gap-3 p-3 rounded-xl transition-all';

        if (isMe) {
            return `${base} bg-indigo-50 border-2 border-indigo-200`;
        }

        switch (rank) {
            case 0: return `${base} bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200`;
            case 1: return `${base} bg-stone-50 border border-stone-200`;
            case 2: return `${base} bg-orange-50/50 border border-orange-100`;
            default: return `${base} bg-white border border-stone-100`;
        }
    };

    return (
        <div className="bg-white rounded-2xl p-4 border-2 border-stone-100 shadow-sm">
            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                {t('todays_leaderboard')}
            </h3>

            <div className="space-y-2">
                {scores.map((entry, i) => {
                    const isMe = entry.userId === currentUserId;
                    const percentage = Math.round((entry.score / entry.total) * 100);

                    return (
                        <div key={entry.id} className={getRankStyle(i, isMe)}>
                            {/* Rank icon */}
                            <div className="shrink-0">
                                {getRankIcon(i)}
                            </div>

                            {/* Name and score */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`font-bold text-sm truncate ${isMe ? 'text-indigo-700' : 'text-stone-800'}`}>
                                        {entry.displayName}
                                    </span>
                                    {isMe && (
                                        <span className="text-[10px] bg-indigo-200 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold">
                                            {t('you_caps')}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Score */}
                            <div className="text-right shrink-0">
                                <span className={`text-lg font-bold ${percentage >= 80 ? 'text-green-600' :
                                    percentage >= 60 ? 'text-amber-600' : 'text-stone-600'
                                    }`}>
                                    {entry.score}/{entry.total}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Leaderboard;
