// @ts-check
/**
 * Skeleton Loading Components
 * 
 * Skeleton screens reduce perceived loading time by showing
 * placeholder shapes that match the content being loaded.
 * Much better UX than spinners for seniors.
 */

import React from 'react';

/**
 * Base skeleton block with pulse animation
 */
export const Skeleton = ({ className = '', style = {} }) => (
    <div
        className={`bg-stone-200 rounded-2xl animate-pulse ${className}`}
        style={style}
    />
);

/**
 * Skeleton for task cards (medicine/daily tasks)
 */
export const SkeletonTaskCard = () => (
    <div className="bg-stone-100 rounded-2xl p-4 animate-pulse">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-stone-200 rounded-full" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-stone-200 rounded w-3/4" />
                <div className="h-3 bg-stone-200 rounded w-1/2" />
            </div>
        </div>
    </div>
);

/**
 * Skeleton for status/presence cards
 */
export const SkeletonStatusCard = () => (
    <div className="bg-stone-100 rounded-2xl p-4 animate-pulse">
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-stone-200 rounded-full" />
            <div className="flex-1 space-y-2">
                <div className="h-5 bg-stone-200 rounded w-1/2" />
                <div className="h-3 bg-stone-200 rounded w-1/3" />
            </div>
            <div className="w-16 h-8 bg-stone-200 rounded-full" />
        </div>
    </div>
);

/**
 * Skeleton for the Senior Status Card in RelativeView
 */
export const SkeletonSeniorCard = () => (
    <div className="bg-stone-100 rounded-2xl p-5 animate-pulse">
        <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-stone-200 rounded-full" />
            <div className="flex-1 space-y-3">
                <div className="h-5 bg-stone-200 rounded w-2/3" />
                <div className="h-4 bg-stone-200 rounded w-1/2" />
                <div className="flex gap-2 mt-3">
                    <div className="h-6 w-16 bg-stone-200 rounded-full" />
                    <div className="h-6 w-16 bg-stone-200 rounded-full" />
                    <div className="h-6 w-16 bg-stone-200 rounded-full" />
                </div>
            </div>
        </div>
    </div>
);

/**
 * Skeleton for activity feed items
 */
export const SkeletonFeedItem = () => (
    <div className="bg-stone-50 rounded-xl p-3 animate-pulse flex items-center gap-3">
        <div className="w-10 h-10 bg-stone-200 rounded-full" />
        <div className="flex-1 space-y-2">
            <div className="h-4 bg-stone-200 rounded w-4/5" />
            <div className="h-3 bg-stone-200 rounded w-1/3" />
        </div>
    </div>
);

/**
 * Skeleton loader for task list (multiple cards)
 */
export const SkeletonTaskList = ({ count = 3 }) => (
    <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonTaskCard key={i} />
        ))}
    </div>
);

/**
 * Skeleton loader for activity feed (multiple items)
 */
export const SkeletonFeed = ({ count = 4 }) => (
    <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonFeedItem key={i} />
        ))}
    </div>
);

/**
 * Full page skeleton for initial app load
 */
export const SkeletonPage = () => (
    <div className="p-6 space-y-6 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <div className="h-6 bg-stone-200 rounded w-32" />
                <div className="h-4 bg-stone-200 rounded w-24" />
            </div>
            <div className="w-12 h-12 bg-stone-200 rounded-full" />
        </div>

        {/* Content skeleton */}
        <SkeletonSeniorCard />
        <SkeletonTaskList count={3} />
    </div>
);

export default {
    Skeleton,
    SkeletonTaskCard,
    SkeletonStatusCard,
    SkeletonSeniorCard,
    SkeletonFeedItem,
    SkeletonTaskList,
    SkeletonFeed,
    SkeletonPage
};
