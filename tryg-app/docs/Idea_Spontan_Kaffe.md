# Spontan Kaffe (The Hygge Signal)
### The Insight
Danish culture revolves around **"Kaffe og Kage,"** but seniors often feel they are "intruding" if they call to ask for a visit.
Spontan Kaffe cuts straight to the core mission 
Reducing loneliness through low-friction connection. 
It is the digital equivalent of an open door.

### The Unicorn Feature: The "Open Door" Signal
A low-friction digital signal to bridge the gap between isolation and social connection.

**How it works:**
1. **The Trigger:** The senior toggles a **"Kaffekande" (Coffee Pot)** icon on their dashboard.
2. **The Notification:** Relatives receive a subtle prompt: *"Mor giver kaffe i eftermiddag. Har du tid?"* (Mom is offering coffee this afternoon. Do you have time?)
3. **The Connection:** The relative taps **"I'm coming!"** and the senior sees a car icon approaching in real-time.

### Why it's a Unicorn
It digitizes the traditional Danish concept of the **"Open Door."** By removing the fear of rejection for the senior and lowering the barrier for the relative, it facilitates effortless, spontaneous visits.


## Implementation plan for "Spontan Kaffe"

### Feature 1: Spontan Kaffe (The Open Door)
We build this as a Status Modifier. It is not just a notification; it is a "Mode" the senior enters.

1. The "Coffee Pot" Toggle (Senior Side) We add a prominent, warm toggle to the SeniorView. When active, it changes their status in the family circle.

Create src/features/coffee/CoffeeToggle.jsx:

JavaScript

import React from 'react';
import { Coffee } from 'lucide-react';
import { useCareCircle } from '../../context/CareCircleContext';
import { usePings } from '../../hooks/usePings';

export const CoffeeToggle = () => {
    const { myStatus, setMyStatus } = useCareCircle();
    const { sendPing } = usePings();

    const isCoffeeTime = myStatus?.status === 'coffee_ready';

    const toggleCoffee = async () => {
        if (isCoffeeTime) {
            // Turn it off (back to normal home)
            await setMyStatus('home');
        } else {
            // Turn it on
            await setMyStatus('coffee_ready');
            // Optional: Send a push to the "Joy Ring"
            await sendPing({ type: 'coffee_invite', message: 'Kaffen er klar! ☕️' });
        }
    };

    return (
        <button
            onClick={toggleCoffee}
            className={`
                relative w-full p-6 rounded-3xl transition-all duration-500 border-2
                flex items-center justify-between overflow-hidden
                ${isCoffeeTime 
                    ? 'bg-amber-100 border-amber-400 shadow-amber-200 shadow-lg scale-[1.02]' 
                    : 'bg-stone-50 border-stone-200 grayscale-[0.5]'}
            `}
        >
            <div className="z-10 text-left">
                <h3 className={`text-xl font-bold ${isCoffeeTime ? 'text-amber-900' : 'text-stone-500'}`}>
                    {isCoffeeTime ? 'Kaffen er klar!' : 'Giv kaffe?'}
                </h3>
                <p className={`text-sm ${isCoffeeTime ? 'text-amber-800' : 'text-stone-400'}`}>
                    {isCoffeeTime ? 'Familien kan se, at du har tid.' : 'Vis at din dør er åben.'}
                </p>
            </div>
            
            {/* The Icon */}
            <div className={`
                w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500
                ${isCoffeeTime ? 'bg-amber-500 text-white animate-bounce-slow' : 'bg-stone-200 text-stone-400'}
            `}>
                <Coffee size={32} />
            </div>

            {/* Background Steam Effect (CSS Decoration) */}
            {isCoffeeTime && (
                <div className="absolute inset-0 bg-amber-500/5 animate-pulse" />
            )}
        </button>
    );
};
2. The "Invitation Card" (Relative Side) In RelativeView.jsx (specifically the PeaceOfMindTab), we listen for this status. If Mom is "Coffee Ready," we show a "Drop Everything" card at the very top.

JavaScript

// Inside PeaceOfMindTab.jsx
const senior = memberStatuses.find(m => m.role === 'senior');

return (
    <div className="space-y-4">
        {senior?.status === 'coffee_ready' && (
            <div className="bg-gradient-to-r from-amber-500 to-orange-400 rounded-2xl p-1 shadow-xl animate-slide-in">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                        <Coffee className="w-8 h-8 text-amber-600 animate-wiggle" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-amber-950">Mor giver kaffe! ☕️</h3>
                        <p className="text-amber-800/80 text-sm">Hun har sat kanden over og har tid til besøg.</p>
                    </div>
                    <Button size="small" variant="primary" onClick={handleAcceptInvite}>
                        Jeg kigger forbi
                    </Button>
                </div>
            </div>
        )}
        {/* ... rest of feed ... */}
    </div>
);