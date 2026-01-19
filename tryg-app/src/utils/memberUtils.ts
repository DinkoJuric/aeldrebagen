
/**
 * Utility functions for member-related logic.
 * Consolidates logic for avatar selection and status icons to reduce duplication.
 */

/**
 * Determines the avatar ID based on the user's role and name.
 * Uses heuristic name matching for POC purposes.
 *
 * @param role - The role of the user ('senior' | 'relative' | etc.)
 * @param name - The display name of the user
 * @returns The avatar ID string (e.g., 'senior', 'louise', 'brad', 'fatima')
 */
export const getAvatarId = (role: string, name: string = ''): string => {
    if (role === 'senior') return 'senior';

    const lowerName = name.toLowerCase();

    if (lowerName.includes('louise')) return 'louise';
    if (lowerName.includes('juzu')) return 'juzu';
    if (lowerName.includes('brad') || lowerName.includes('senior')) return 'brad';

    // Default fallback for relatives
    return 'fatima';
};

/**
 * Maps a status ID to a corresponding icon ID for the Avatar component.
 *
 * @param statusId - The status identifier (e.g., 'work', 'home')
 * @returns The icon ID string
 */
export const getStatusIconId = (statusId: string): string => {
    const statusMap: Record<string, string> = {
        'work': 'work',
        'home': 'home',
        'traveling': 'car',
        'available': 'coffee',
        'busy': 'moon',
        'good': 'home',
        'default': 'home'
    };

    return statusMap[statusId] || 'home';
};
