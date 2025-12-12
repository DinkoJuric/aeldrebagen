# iOS Deployment Guide - TestFlight

Step-by-step instructions to deploy Tryg to TestFlight for beta testing.

## Prerequisites

- **macOS** with Xcode 15+ installed
- **Apple Developer Account** ($99/year)
- App Store Connect access

## Quick Start

### 1. Build the Web App
```bash
cd tryg-app
npm run build
npx cap sync ios
```

### 2. Open in Xcode
```bash
npx cap open ios
```

This opens the Xcode project at `ios/App/App.xcworkspace`

### 3. Configure Signing in Xcode

1. Select **App** in the project navigator
2. Go to **Signing & Capabilities** tab
3. Set **Team** to your Apple Developer account
4. Change **Bundle Identifier** if needed (currently: `dk.tryg.app`)

### 4. Set App Version

1. In Xcode, select **App** target
2. Set **Version** to `1.0.0`
3. Set **Build** to `1` (increment for each TestFlight upload)

### 5. Archive & Upload

1. Select **Any iOS Device** as build target (not simulator)
2. Menu: **Product → Archive**
3. When archive completes, click **Distribute App**
4. Choose **App Store Connect** → **Upload**
5. Follow prompts to complete upload

### 6. TestFlight Setup

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to your app → **TestFlight** tab
3. Wait for build processing (15-30 min)
4. Add **Internal Testers** (up to 100, instant access)
5. Or create **External Testing Group** (up to 10,000, requires review)

## Useful Commands

```bash
# Rebuild and sync after code changes
npm run build && npx cap sync ios

# Open Xcode
npx cap open ios

# Check Capacitor doctor for issues
npx cap doctor
```

## App Icon & Splash Screen

To customize app icons and splash screen:

1. Replace `ios/App/App/Assets.xcassets/AppIcon.appiconset/` images
2. Or install Capacitor Assets plugin:
   ```bash
   npm install @capacitor/assets --save-dev
   npx capacitor-assets generate --iconBackgroundColor "#0D9488"
   ```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Signing error | Add Apple Developer account in Xcode preferences |
| Build fails | Run `npx cap sync ios` after any web changes |
| White screen in app | Check browser console via Safari → Develop menu |
| Upload rejected | Increment Build number before re-uploading |

---

*Once build is processing on TestFlight, invite testers via their Apple ID email.*
