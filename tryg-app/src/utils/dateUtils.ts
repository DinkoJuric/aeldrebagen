import { Timestamp } from 'firebase/firestore';
import { FirestoreDate } from '../types';

/**
 * Safely converts a FirestoreDate (Timestamp | Date | string | number | null) to a JavaScript Date object.
 * Returns null if the input is invalid or null.
 */
export function toJsDate(date: FirestoreDate | undefined): Date | null {
    if (!date) return null;

    if (date instanceof Date) {
        return date;
    }

    if (date instanceof Timestamp) {
        return date.toDate();
    }

    // Handle "Timestamp-like" objects (if types are lost at runtime)
    if (typeof date === 'object' && 'toDate' in date) {
        return (date as { toDate: () => Date }).toDate();
    }

    // String or Number (milliseconds)
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d;
}

/**
 * Formats a FirestoreDate to a readable time string (HH:MM)
 */
export function formatTime(date: FirestoreDate | undefined): string {
    const d = toJsDate(date);
    if (!d) return '';
    return d.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
}
