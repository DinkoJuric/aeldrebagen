import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Heart, Users, FileText, Gamepad2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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

import { AppTab } from '../types';

export interface BottomNavigationProps {
    activeTab: AppTab;
    onTabChange: (tab: AppTab) => void;
    onViewReport?: () => void; // Keep for now, but will likely be removed
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
const BottomNavigationComponent: React.FC<BottomNavigationProps> = ({
    activeTab,
    onTabChange,
}) => {
    const { t } = useTranslation();

    return (
        <div className="sticky bottom-0 left-0 right-0 theme-card border-t border-stone-200 px-2 py-2 pb-5 z-40">
            <div className="flex justify-around items-center max-w-sm mx-auto">
                <NavTab
                    icon={<Heart className={cn("w-6 h-6", activeTab === 'daily' && "fill-teal-100")} />}
                    label={t('bottom_nav_daily')}
                    onClick={() => onTabChange('daily')}
                    isActive={activeTab === 'daily'}
                    activeColor="teal"
                />

                <NavTab
                    icon={<Users className={cn("w-6 h-6", activeTab === 'family' && "fill-indigo-100")} />}
                    label={t('bottom_nav_family')}
                    onClick={() => onTabChange('family')}
                    isActive={activeTab === 'family'}
                    activeColor="indigo"
                />

                <NavTab
                    icon={<FileText className={cn("w-6 h-6", activeTab === 'health' && "fill-sky-100")} />}
                    label={t('bottom_nav_report')} // User can rename this in i18n later if they want "Health"
                    onClick={() => onTabChange('health')}
                    isActive={activeTab === 'health'}
                    activeColor="indigo" // Or another color variant if added
                />

                <NavTab
                    icon={<Gamepad2 className={cn("w-6 h-6", activeTab === 'spil' && "fill-purple-100")} />}
                    label={t('bottom_nav_spil')}
                    onClick={() => onTabChange('spil')}
                    isActive={activeTab === 'spil'}
                    activeColor="purple"
                />
            </div>
        </div>
    );
};

export const BottomNavigation = React.memo(BottomNavigationComponent);
BottomNavigation.displayName = 'BottomNavigation';


export const RelativeBottomNavigation = BottomNavigation;

export default BottomNavigation;
