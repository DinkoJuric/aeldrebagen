/**
 * RelativeViewLayout - Dumb layout shell for the Relative dashboard
 * 
 * This is a pure layout component with no business logic.
 * Uses "slot" pattern for composability.
 */

import React, { ReactNode } from 'react';

interface RelativeViewLayoutProps {
    header?: ReactNode;
    content: ReactNode;
    footer?: ReactNode;
    modals?: ReactNode;
    backgroundClass?: string;
}

export const RelativeViewLayout: React.FC<RelativeViewLayoutProps> = ({
    header,
    content,
    footer,
    modals,
    backgroundClass = 'bg-stone-50'
}) => (
    <div className={`flex flex-col h-full ${backgroundClass}`}>
        {/* Header slot */}
        {header && <div className="z-10 flex-shrink-0">{header}</div>}

        {/* Main content area - scrollable */}
        <main className="flex-1 overflow-y-auto">
            {content}
        </main>

        {/* Footer slot (e.g., bottom navigation) */}
        {footer && <div className="z-20 flex-shrink-0">{footer}</div>}

        {/* Modals slot - rendered at top level for proper z-index */}
        {modals}
    </div>
);

export default RelativeViewLayout;
