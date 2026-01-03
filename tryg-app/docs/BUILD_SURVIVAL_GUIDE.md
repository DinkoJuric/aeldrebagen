# 🛡️ The 15-Build Survival Guide
*How to conquer the App Store on a budget*

## 1. The Golden Rule of Quota Management
**Credits are for "Release Candidates" only.**
Never use a cloud credit to check if a button color looks right.

| Activity | Where to do it | Cost |
| :--- | :--- | :--- |
| **Development** | Chrome / Edge Browser | **Free** |
| **Logic Testing** | Browser + Mobile View (F12) | **Free** |
| **Native Features** | Local Android Emulator (Android Studio) | **Free** |
| **Final Release** | EAS Cloud Build | **1 Credit** |

---

## 2. Strategy: "Scattered" Testers (Remote Testing)
Since your testers are scattered across Denmark, you cannot physically plug their phones into your laptop. Here is the most efficient workflow:

### 🤖 Android (Easy & Flexible)
**The "Direct Download" Method**
1.  **Build**: Run `eas build --platform android --profile preview`.
2.  **Result**: EAS gives you a link to download an `.apk` file.
3.  **Distribute**:
    *   Upload that `.apk` to Google Drive / Dropbox.
    *   Send the link to your testers via Messenger/Email.
    *   They click "Install" (they may need to allow "Unknown Sources").
**Cost**: 1 Build Credit = Updates everyone (if they all download the same file).

### 🍎 iOS (The Walled Garden)
Apple makes this harder. You cannot just send a file to an iPhone users unless you are a large enterprise.
**The "TestFlight" Method (Recommended)**
1.  **Requirement**: You MUST have an Apple Developer Account ($99/year).
2.  **Build**: Run `eas build --platform ios --profile production` (or preview).
3.  **Distribute**:
    *   Upload the build to **TestFlight** (Apple's testing app).
    *   Add your testers' email addresses in App Store Connect.
    *   They get an email + notification to install the "Beta" version.
**Cost**: 1 Build Credit = Updates everyone.

> [!IMPORTANT]
> **The "Free Account" Trap (Crucial for your decision)**
> You asked: *"What if I get all 10 IDs today?"*
>
> **The Good News:** It would only cost **1 Build Credit** to build the app for everyone.
>
> **The Bad News (The Dealbreaker):**
> Without the $99/year account, you are on Apple's "Personal Team" tier. This has severe limitations:
> 1.  **7-Day Expiry**: The app will stop working after 7 days. You must rebuild and reinstall every week.
> 2.  **No "Ad Hoc"**: You technically cannot create a file to email to people. You generally have to install it by plugging their phone into your computer (or using complex workarounds).
>
> **Verdict:**
> For scattered testers, the Free Tier is not viable.
> **Recommendation:** Focus your remote testing on **Android/Web** (Free). Use your 1 iOS device for local verification.

---

## 3. The "Batch" Workflow
Do not send updates for every typo fix. Batch your work into "Releases".

**Example Week:**
*   **Mon-Thu**: You work locally. You verify mostly in Chrome. You maybe run `npx cap run android` on your own phone to feel the "native" vibe.
*   **Friday**: You are happy with the week's work.
    *   Run **ONE** build command: `npx eas-cli build --platform all` (Uses 2 credits: 1 Android + 1 iOS).
    *   Send the new Android link and TestFlight notification to your group.
    *   "Hey guys, version 0.2 is out! Check out the new dark mode."

**Result**: 8-10 credits used per month. You are safe!
