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
    { id: 'cook', label: 'Lave mad til dig', emoji: '🍳' },
    { id: 'visit', label: 'Komme på besøg', emoji: '☕' },
    { id: 'drive', label: 'Køre dig et sted hen', emoji: '🚗' },
    { id: 'shop', label: 'Handle ind for dig', emoji: '🛒' },
    { id: 'garden', label: 'Hjælpe i haven', emoji: '🌿' },
    { id: 'tech', label: 'Hjælpe med teknologi', emoji: '💻' },
    { id: 'call', label: 'Ringe og snakke', emoji: '📞' },
    { id: 'company', label: 'Holde dig med selskab', emoji: '🤗' }
];

// All available requests for relatives to make
export const RELATIVE_REQUESTS = [
    { id: 'recipe', label: 'Lære en opskrift', emoji: '📖' },
    { id: 'advice', label: 'Gode råd', emoji: '💡' },
    { id: 'story', label: 'Høre en historie', emoji: '📚' },
    { id: 'babysit', label: 'Hjælp med børnene', emoji: '👶' },
    { id: 'craft', label: 'Lave noget kreativt sammen', emoji: '🎨' }
];

// Senior's available offers (what they can contribute)
export const SENIOR_OFFERS = [
    { id: 'listen', label: 'Jeg kan hjælpe med at lytte', emoji: '👂' },
    { id: 'recipe', label: 'Jeg har en god opskrift', emoji: '👩‍🍳' },
    { id: 'stories', label: 'Vil gerne høre om jeres dag', emoji: '💬' },
    { id: 'cook', label: 'Kan lave mad til os', emoji: '🍳' }, // Match for shop
    { id: 'teach', label: 'Vil gerne lære fra mig', emoji: '📚' }
];

// Senior's available requests (what they need)
export const SENIOR_REQUESTS = [
    { id: 'call', label: 'Kan nogen ringe mig i dag?', emoji: '📞' },
    { id: 'shop', label: 'Hjælp til indkøb denne uge', emoji: '🛒' }, // Match for cook
    { id: 'transport', label: 'Følgeskab til lægen/aftale', emoji: '🚗' }, // Match for drive
    { id: 'company', label: 'Bare noget selskab', emoji: '☕' }, // Match for visit
    { id: 'outdoor', label: 'Gå en tur sammen', emoji: '🌿' }, // Match for garden
    { id: 'help-tech', label: 'Hjælp med telefon/computer', emoji: '📱' } // Match for tech
];

export default { MATCH_PAIRS, STATUS_MATCHES, RELATIVE_OFFERS, RELATIVE_REQUESTS, SENIOR_OFFERS, SENIOR_REQUESTS };
