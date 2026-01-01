export interface SeverityLevel {
    id: 'mild' | 'moderate' | 'severe';
    label: string;
    emoji: string;
    color: string;
}

export interface BodyRegion {
    id: string;
    label: string;
    emoji: string;
    severity?: Omit<SeverityLevel, 'color'>; // When selected, we store severity details
}

// Body regions for pain mapping - ordered anatomically (top → bottom)
// Returns localized labels using translation function
export const getBodyRegions = (t: (key: string) => string): BodyRegion[] => [
    { id: 'head', label: t('body_head'), emoji: '🧠' },
    { id: 'neck', label: t('body_neck'), emoji: '🦴' },
    { id: 'chest', label: t('body_chest'), emoji: '❤️' },
    { id: 'back', label: t('body_back'), emoji: '🔙' },
    { id: 'stomach', label: t('body_stomach'), emoji: '🤢' },
    { id: 'leftArm', label: t('body_left_arm'), emoji: '💪' },
    { id: 'rightArm', label: t('body_right_arm'), emoji: '💪' },
    { id: 'leftLeg', label: t('body_left_leg'), emoji: '🦵' },
    { id: 'rightLeg', label: t('body_right_leg'), emoji: '🦵' },
];

// Pain severity levels - simple 3-level scale (localized)
export const getSeverityLevels = (t: (key: string) => string): SeverityLevel[] => [
    { id: 'mild', label: t('severity_mild'), emoji: '🙂', color: 'bg-green-100 border-green-400 text-green-700' },
    { id: 'moderate', label: t('severity_moderate'), emoji: '😐', color: 'bg-amber-100 border-amber-400 text-amber-700' },
    { id: 'severe', label: t('severity_severe'), emoji: '😣', color: 'bg-rose-100 border-rose-400 text-rose-700' },
];

// Keep the old exports for backwards compatibility (Danish fallback)
export const BODY_REGIONS: BodyRegion[] = [
    { id: 'head', label: 'Hoved', emoji: '🧠' },
    { id: 'neck', label: 'Nakke', emoji: '🦴' },
    { id: 'chest', label: 'Bryst', emoji: '❤️' },
    { id: 'back', label: 'Ryg', emoji: '🔙' },
    { id: 'stomach', label: 'Mave', emoji: '🤢' },
    { id: 'leftArm', label: 'Venstre arm', emoji: '💪' },
    { id: 'rightArm', label: 'Højre arm', emoji: '💪' },
    { id: 'leftLeg', label: 'Venstre ben', emoji: '🦵' },
    { id: 'rightLeg', label: 'Højre ben', emoji: '🦵' },
];

export const SEVERITY_LEVELS: SeverityLevel[] = [
    { id: 'mild', label: 'Lidt', emoji: '🙂', color: 'bg-green-100 border-green-400 text-green-700' },
    { id: 'moderate', label: 'Noget', emoji: '😐', color: 'bg-amber-100 border-amber-400 text-amber-700' },
    { id: 'severe', label: 'Meget', emoji: '😣', color: 'bg-rose-100 border-rose-400 text-rose-700' },
];

// Get label for body region by ID
export const getBodyRegionLabel = (id: string) => {
    const region = BODY_REGIONS.find(r => r.id === id);
    return region ? region.label : id;
};

// Get emoji for body region by ID
export const getBodyRegionEmoji = (id: string) => {
    const region = BODY_REGIONS.find(r => r.id === id);
    return region ? region.emoji : '📍';
};

// Get severity info by ID
export const getSeverityInfo = (id: string) => {
    return SEVERITY_LEVELS.find(s => s.id === id);
};
