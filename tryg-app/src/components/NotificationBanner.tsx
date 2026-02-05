import React from 'react';
import { NotificationType } from '../types';

interface NotificationBannerProps {
  notification: NotificationType | null;
}

export function NotificationBanner({ notification }: NotificationBannerProps) {
  return (
    <div
      className={`
        absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl z-[60]
        transform transition-all duration-500 ease-out border border-stone-200
        ${notification ? 'translate-y-12 opacity-100' : '-translate-y-40 opacity-0'}
      `}
    >
      {notification && (
        <div className="flex gap-3 items-center">
          <div className="bg-teal-100 p-2 rounded-xl">
            <notification.icon className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h4 className="font-bold theme-text text-sm">{notification.title}</h4>
            <p className="theme-text-muted text-xs opacity-80">{notification.body}</p>
          </div>
        </div>
      )}
    </div>
  );
}
