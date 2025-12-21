# Design Extraction Prompts

This document captures the specific prompts and strategies used to guide the AI in searching for and extracting high-fidelity designs for Tryg.

## Core Design Philosophy Prompts

The user emphasized looking for "Soulful & High-Fidelity" designs. Key prompts and directives included:

### 1. The "Soulful" Aesthetic
> "Find designs that feel 'soulful' and warm. Avoid clinical, sterile medical interfaces. Look for 'Pumpkin' themes, warm earth tones, and soft rounded corners."

**Result:** This led to the adoption of the "Pumpkin" color palette and the use of Stone/Amber colors instead of standard Gray/Blue.

### 2. High-Fidelity & Premium Feel
> "The design must WOW the user. Use glassmorphism, subtle gradients, and micro-animations. Start with a premium feel, do not build a basic MVP."

**Result:** Implementation of glassmorphism cards, `framer-motion` animations, and high-quality typography (Inter/Outfit).

### 3. Dynamic Interfaces
> "Search for interactive elements. The interface should feel alive. Use hover effects and dynamic states."

**Result:** The Pulse animation in the Family Presence feature and the interactive coffee cup slider.

## Search Strategy Prompts

When asking the agent to assume a design role, the user effectively used prompts like:

- "Act as a world-class UI/UX designer."
- "Search for 'modern elderly care app design' but filter for non-medical aesthetics."
- "Look at 'family connection' apps like Kin for inspiration."
- "Extract the CSS variables for a 'warm, cozy' theme."

## Key Takeaways for Future Agents

- **Don't settle for 'clean'**: 'Clean' often means boring/medical. Aim for 'Warm' and 'Inviting'.
- **Use the `generate_image` tool**: To visualize these concepts before coding (though in this specific session, we relied on code-first iteration).
- **Refer to `web_application_development`**: The system instructions now permanently reflect these prompts under the "Design Aesthetics" section.
