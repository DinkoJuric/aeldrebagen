/**
 * PWA Notification Helper
 * Provides utilities for requesting notification permissions and displaying
 * medication reminders as browser notifications.
 */

/**
 * Request notification permission from the user.
 * Returns true if granted, false otherwise.
 */
export async function requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
        console.warn('📵 This browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission === 'denied') {
        console.warn('🚫 Notification permission was previously denied');
        return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
}

/**
 * Check if notifications are currently supported and permitted.
 */
export function isNotificationEnabled(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
}

/**
 * Show a medication reminder notification.
 */
export function showMedicationReminder(taskTitle: string, time: string): void {
    if (!isNotificationEnabled()) {
        console.warn('⚠️ Cannot show notification - not enabled');
        return;
    }

    const notification = new Notification(`💊 ${taskTitle}`, {
        body: `Det er tid til ${taskTitle} (${time})`,
        icon: '/icons/pill-192.png',
        tag: `medication-${taskTitle}-${time}`,
        requireInteraction: true,
    });

    notification.onclick = () => {
        window.focus();
        notification.close();
    };

    // Auto-close after 30 seconds
    setTimeout(() => notification.close(), 30000);
}

/**
 * Schedule a notification for a specific time today.
 * Returns a timeout ID that can be used to cancel the notification.
 */
export function scheduleNotification(
    taskTitle: string,
    timeString: string // 'HH:MM' format
): number | null {
    if (!isNotificationEnabled()) {
        return null;
    }

    const [hours, minutes] = timeString.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        0
    );

    // If the time has already passed today, don't schedule
    if (scheduledTime <= now) {
        return null;
    }

    const msUntilNotification = scheduledTime.getTime() - now.getTime();

    const timeoutId = window.setTimeout(() => {
        showMedicationReminder(taskTitle, timeString);
    }, msUntilNotification);

    console.log(`⏰ Scheduled notification for ${taskTitle} at ${timeString} (in ${Math.round(msUntilNotification / 60000)} minutes)`);

    return timeoutId;
}
