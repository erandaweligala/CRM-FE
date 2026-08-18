import AccessTokenModel from "../model/AccessToken.Model";

/**
 * Authentication bypass switch.
 *
 * When enabled the UI skips the Keycloak login round trip completely and boots
 * straight into the home page with a synthetic session. Nothing in the app asks
 * for a token, refreshes one, or reacts to 401/403 responses while this is on.
 *
 * The Secure Request Handler (crm-srh) is configured to forward every request
 * without authentication, so no bearer token is required by the backend either.
 */
export const AUTH_BYPASS_ENABLED = true;

/**
 * Synthetic session used while {@link AUTH_BYPASS_ENABLED} is on. It replaces the
 * decoded JWT so components that read user details keep working. Menu, action and
 * attribute permission checks all short circuit to "allowed" in
 * `permission.service.ts`, so the permission lists here are only placeholders.
 */
export const BYPASS_SESSION: AccessTokenModel = {
    sub: "bypass-user",
    idleTimeRange: 31536000, // 1 year in seconds - the idle logout timer is disabled anyway
    refreshTimeRange: 31536000,
    tid: "bypass-tenant",
    customProperties: [],
    permissions: {
        menuids: [],
        components: []
    },
    ttype: "access",
    name: "Bypass User",
    exp: 4102444800, // 2100-01-01
    iat: 0,
    email: "bypass-user@localhost",
    userId: "bypass-user"
};
