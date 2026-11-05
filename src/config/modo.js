// Com EXPO_PUBLIC_MODO_DEMO=1 no .env o app roda sem Firebase, com dados de exemplo em memória.
// Útil para desenvolver telas sem internet. O padrão é o banco real.
export const MODO_DEMO = process.env.EXPO_PUBLIC_MODO_DEMO === "1";
