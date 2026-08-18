/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
    readonly VITE_BASE_PATH: string;
    readonly VITE_KEYCLOAK_CLIENT_ID: string;
    readonly VITE_KEYCLOAK_SUCCESS_URL: string;
    readonly VITE_BACKEND_URL: string;
    readonly VITE_KEYCLOAK_END_POINT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}