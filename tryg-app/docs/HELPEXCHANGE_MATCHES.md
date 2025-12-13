# HelpExchange Match Reference

Quick reference for all match pairs and how they trigger celebrations.

---

## Offer ↔ Request Matches

When someone's **offer** aligns with another's **request**, a celebration appears.

| Offer ID | Offer Label | Request ID | Request Label | Celebration |
|----------|-------------|------------|---------------|-------------|
| `cook` | Lave mad til dig | `shop` | Hjælp med indkøb | 🍽️ "Lav et måltid sammen!" |
| `visit` | Komme på besøg | `company` | Holde med selskab | ☕ "Tid til en hyggelig visit!" |
| `drive` | Køre dig et sted hen | `transport` | Transport til aftale | 🚗 "Koordinér turen!" |
| `garden` | Hjælpe i haven | `outdoor` | Aktivitet udendørs | 🌿 "Tid i haven sammen!" |
| `tech` | Hjælpe med teknologi | `help-tech` | Hjælp med teknologi | 💻 "Tech-hjælp!" |

---

## Status ↔ Request Matches

When someone's **status** aligns with another's **request**.

| Status ID | Status Label | Request ID | Request Label | Celebration |
|-----------|--------------|------------|---------------|-------------|
| `available` | Har tid til snak | `talk` | Vil gerne snakke | 📞 "Ring nu - der er tid!" |
| `home` | Hjemme | `visit` | Vil gerne have besøg | 🏠 "Kom forbi!" |

---

## Senior's Available Offers (HELP_OFFERS in constants.js)

| ID | Label | Emoji |
|----|-------|-------|
| `listen` | Har tid til at snakke | 👂 |
| `stories` | Vil gerne fortælle historier | 📖 |
| `cook` | Kan lave mad til os | 🍳 |
| `teach` | Vil gerne lære fra mig | 📚 |
| `projects` | Har et projekt I kan hjælpe med | 🔧 |

---

## Senior's Available Requests (HELP_REQUESTS in constants.js)

| ID | Label | Emoji |
|----|-------|-------|
| `shop` | Hjælp til storindkøb | 🛒 |
| `transport` | Transport til læge/aftale | 🚗 |
| `outdoors` | Gå en tur sammen | 🚶 |
| `tech` | Hjælp med telefon/computer | 📱 |
| `company` | Bare noget selskab | ☕ |

---

## Relative's Available Offers (RELATIVE_OFFERS in helpExchangeConfig.js)

| ID | Label | Emoji |
|----|-------|-------|
| `cook` | Lave mad til dig | 🍳 |
| `visit` | Komme på besøg | ☕ |
| `drive` | Køre dig et sted hen | 🚗 |
| `shop` | Handle ind for dig | 🛒 |
| `garden` | Hjælpe i haven | 🌿 |
| `tech` | Hjælpe med teknologi | 💻 |
| `call` | Ringe og snakke | 📞 |
| `company` | Holde dig med selskab | 🤗 |

---

## Relative's Available Requests (RELATIVE_REQUESTS in helpExchangeConfig.js)

| ID | Label | Emoji |
|----|-------|-------|
| `recipe` | Lære en opskrift | 📖 |
| `advice` | Gode råd | 💡 |
| `story` | Høre en historie | 📚 |
| `babysit` | Hjælp med børnene | 👶 |
| `craft` | Lave noget kreativt sammen | 🎨 |

---

## Adding New Matches

To add a new match pair, edit `src/config/helpExchangeConfig.js`:

```javascript
// Add to MATCH_PAIRS array
{
    offerId: 'your_offer_id',
    requestId: 'your_request_id',
    celebration: {
        emoji: '🎉',
        title: 'Match title!',
        message: 'Description of the match',
        cta: 'Action button text',
        action: 'action-id'
    }
}
```

For status-based matches, add to `STATUS_MATCHES` array with `statusId` instead of `offerId`.
