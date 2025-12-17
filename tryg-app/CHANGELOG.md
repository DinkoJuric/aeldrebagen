# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Refactor
- **TypeScript Migration**: Converted entire UI layer (`SeniorView`, `RelativeView`, `App`, `AppCore`, `main`), all custom hooks (`useAuth`, `useCareCircle`, etc.), and utility functions to TypeScript (`.tsx`/`.ts`).
- **Feature Folders**: Restructured codebase into domain-specific feature folders (`features/tasks`, `features/helpExchange`, etc.) with barrel exports.
- **Cleanup**: Removed legacy `types.js` and consolidated types in `types.ts` and component interfaces. Updated `ARCHITECTURE.md` to reflect new structure.
