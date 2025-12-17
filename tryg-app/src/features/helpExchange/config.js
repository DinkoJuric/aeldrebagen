// HelpExchange Match Pairs Configuration
// Easy to extend - just add new entries to the arrays

// Match pairs: when an offer matches a request
export const MATCH_PAIRS = [
    {
        offerId: 'cook',
        requestId: 'shop',
        celebration: {
            emoji: '🍽️',
            title: 'Perfekt match!',
            message: 'I kan lave et måltid sammen',
            cta: 'Planlæg madlavning',
            action: 'plan-meal'
        }
    },
    {
        offerId: 'visit',
        requestId: 'company',
        celebration: {
            emoji: '☕',
            title: 'Match!',
            message: 'Tid til en hyggelig visit',
            cta: 'Aftal besøg',
            action: 'plan-visit'
        }
    },
    {
        offerId: 'drive',
        requestId: 'transport',
        celebration: {
            emoji: '🚗',
            title: 'Transport-match!',
            message: 'Koordinér turen sammen',
            cta: 'Planlæg kørsel',
            action: 'plan-transport'
        }
    },
    {
        offerId: 'garden',
        requestId: 'outdoor',
        celebration: {
            emoji: '🌿',
            title: 'Have-match!',
            message: 'Tid i haven sammen',
            cta: 'Planlæg havearbejde',
            action: 'plan-garden'
        }
    },
    {
        offerId: 'tech',
        requestId: 'help-tech',
        celebration: {
            emoji: '💻',
            title: 'Tech-hjælp!',
            message: 'Hjælp med teknologi',
            cta: 'Ring og hjælp',
            action: 'call'
        }
    }
];

// Status-based matches: when a status aligns with a request
export const STATUS_MATCHES = [
    {
        statusId: 'available',  // "Har tid til snak"
        requestId: 'talk',
        celebration: {
            emoji: '📞',
            title: 'Tid til en snak!',
            message: 'Ring nu - der er tid til at snakke',
            cta: 'Ring nu',
            action: 'call'
        }
    },
    {
        statusId: 'home',  // "Hjemme"
        requestId: 'visit',
        celebration: {
            emoji: '🏠',
            title: 'Kom forbi!',
            message: 'Der er nogen hjemme - perfekt til et besøg',
            cta: 'Aftal besøg',
            action: 'plan-visit'
        }
    }
];

// All available offers for relatives to choose from
export const RELATIVE_OFFERS = [
    { id: 'cook', label: 'Lave mad til dig', emoji: '🍳', sprite: { sheet: '1', pos: 'top-left' } },
    { id: 'visit', label: 'Komme på besøg', emoji: '☕', sprite: { sheet: '1', pos: 'top-right' } },
    { id: 'drive', label: 'Køre dig et sted hen', emoji: '🚗', sprite: { sheet: '1', pos: 'bottom-left' } },
    { id: 'shop', label: 'Handle ind for dig', emoji: '🛒', sprite: { sheet: '2', pos: 'top-left' } },
    { id: 'garden', label: 'Hjælpe i haven', emoji: '🌿', sprite: { sheet: '1', pos: 'bottom-right' } },
    { id: 'tech', label: 'Hjælpe med teknologi', emoji: '💻', sprite: { sheet: '2', pos: 'top-right' } },
    { id: 'call', label: 'Ringe og snakke', emoji: '📞', sprite: { sheet: '2', pos: 'top-right' } }, // Reusing tech/talk icon
    { id: 'company', label: 'Holde dig med selskab', emoji: '🤗', sprite: { sheet: '1', pos: 'top-right' } }
];

// All available requests for relatives to make
export const RELATIVE_REQUESTS = [
    { id: 'recipe', label: 'Lære en opskrift', emoji: '📖', sprite: { sheet: '2', pos: 'bottom-left' } },
    { id: 'advice', label: 'Gode råd', emoji: '💡', sprite: { sheet: '2', pos: 'top-right' } },
    { id: 'story', label: 'Høre en historie', emoji: '📚', sprite: { sheet: '2', pos: 'bottom-left' } },
    { id: 'babysit', label: 'Hjælp med børnene', emoji: '👶', sprite: { sheet: '2', pos: 'bottom-right' } },
    { id: 'craft', label: 'Lave noget kreativt sammen', emoji: '🎨', sprite: { sheet: '2', pos: 'bottom-right' } }
];

// Senior's available offers (what they can contribute)
export const SENIOR_OFFERS = [
    { id: 'listen', label: 'Jeg kan hjælpe med at lytte', emoji: '👂', sprite: { sheet: '1', pos: 'top-right' } },
    { id: 'recipe', label: 'Jeg har en god opskrift', emoji: '👩‍🍳', sprite: { sheet: '1', pos: 'top-left' } },
    { id: 'stories', label: 'Vil gerne høre om jeres dag', emoji: '💬', sprite: { sheet: '1', pos: 'top-right' } },
    { id: 'cook', label: 'Kan lave mad til os', emoji: '🍳', sprite: { sheet: '1', pos: 'top-left' } }, // Match for shop
    { id: 'teach', label: 'Vil gerne lære fra mig', emoji: '📚', sprite: { sheet: '2', pos: 'bottom-left' } }
];

// Senior's available requests (what they need)
export const SENIOR_REQUESTS = [
    { id: 'call', label: 'Kan nogen ringe mig i dag?', emoji: '📞', sprite: { sheet: '2', pos: 'top-right' } },
    { id: 'shop', label: 'Hjælp til indkøb denne uge', emoji: '🛒', sprite: { sheet: '2', pos: 'top-left' } }, // Match for cook
    { id: 'transport', label: 'Følgeskab til lægen/aftale', emoji: '🚗', sprite: { sheet: '1', pos: 'bottom-left' } }, // Match for drive
    { id: 'company', label: 'Bare noget selskab', emoji: '☕', sprite: { sheet: '1', pos: 'top-right' } }, // Match for visit
    { id: 'outdoor', label: 'Gå en tur sammen', emoji: '🌿', sprite: { sheet: '1', pos: 'bottom-right' } }, // Match for garden
    { id: 'help-tech', label: 'Hjælp med telefon/computer', emoji: '📱', sprite: { sheet: '2', pos: 'top-right' } } // Match for tech
];

export default { MATCH_PAIRS, STATUS_MATCHES, RELATIVE_OFFERS, RELATIVE_REQUESTS, SENIOR_OFFERS, SENIOR_REQUESTS };
