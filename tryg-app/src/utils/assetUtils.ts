
/**
 * Resolves an asset path by prepending the Vite base URL.
 * Handles leading/trailing slashes to avoid double slashes.
 * 
 * @param path The path to the asset (e.g., "onboarding/video.mp4")
 * @returns The full resolved path (e.g., "/aeldrebagen/onboarding/video.mp4")
 */
export const resolvePath = (path: string): string => {
    // Remove leading slash if present to avoid double slash with BASE_URL
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // import.meta.env.BASE_URL always ends with a slash in Vite
    return `${import.meta.env.BASE_URL}${cleanPath}`;
};
