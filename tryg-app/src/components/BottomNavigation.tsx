import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Heart, Users, FileText, Gamepad2 } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * Navigation tab variants using CVA
 */
const tabVariants = cva(
    "flex flex-col items-center gap-1 transition-colors",
    {
        variants: {
            state: {
                active: "",
                inactive: "text-stone-400 hover:text-stone-600",
            },
            color: {
                teal: "text-teal-600",
                indigo: "text-indigo-600",
                purple: "text-purple-600",
                stone: "text-stone-400",
            },
        },
        defaultVariants: {
            state: "inactive",
            color: "stone",
        },
    }
);

export interface BottomNavigationProps {
    activeTab: 'daily' | 'family' | 'spil';
    onTabChange: (tab: 'daily' | 'family' | 'spil') => void;
    onViewReport?: () => void;
    onShowReport?: () => void;
}

interface NavTabProps extends VariantProps<typeof tabVariants> {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    isActive: boolean;
    activeColor: 'teal' | 'indigo' | 'purple';
    fillClass?: string;
}

const NavTab: React.FC<NavTabProps> = ({ icon, label, onClick, isActive, activeColor, fillClass }) => (
    <button
        onClick={onClick}
        className={cn(
            tabVariants({
                state: isActive ? 'active' : 'inactive',
                color: isActive ? activeColor : 'stone'
            })
        )}
    >
        <div className={cn("w-6 h-6", isActive && fillClass)}>
            {icon}
        </div>
        <span className="text-xs font-bold">{label}</span>
    </button>
);

/**
 * Unified Bottom Navigation for Senior and Relative Views
 */
export const BottomNavigation: React.FC<BottomNavigationProps> = ({
    activeTab,
    onTabChange,
    onViewReport,
    onShowReport
}) => {
    const handleReport = onViewReport || onShowReport;

    return (
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-4 py-2 z-40">
            <div className="flex justify-between items-center max-w-sm mx-auto">
                <NavTab
                    icon={<Heart className={cn("w-6 h-6", activeTab === 'daily' && "fill-teal-100")} />}
                    label="Min dag"
                    onClick={() => onTabChange('daily')}
                    isActive={activeTab === 'daily'}
                    activeColor="teal"
                />

                <NavTab
                    icon={<Users className={cn("w-6 h-6", activeTab === 'family' && "fill-indigo-100")} />}
                    label="Familie"
                    onClick={() => onTabChange('family')}
                    isActive={activeTab === 'family'}
                    activeColor="indigo"
                />

                <button
                    onClick={handleReport}
                    className={cn(tabVariants({ state: 'inactive' }))}
                >
                    <FileText className="w-6 h-6" />
                    <span className="text-xs font-bold">Rapport</span>
                </button>

                <NavTab
                    icon={<Gamepad2 className={cn("w-6 h-6", activeTab === 'spil' && "fill-purple-100")} />}
                    label="Spil"
                    onClick={() => onTabChange('spil')}
                    isActive={activeTab === 'spil'}
                    activeColor="purple"
                />
            </div>
        </div>
    );
};

export const RelativeBottomNavigation = BottomNavigation;

export default BottomNavigation;
