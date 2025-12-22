// Mock for virtual:pwa-register/react
// This virtual module only exists during Vite build with vite-plugin-pwa
// In tests, we provide this mock instead
export const useRegisterSW = () => ({
    offlineReady: [false, () => { }],
    needRefresh: [false, () => { }],
    updateServiceWorker: () => Promise.resolve(),
});
