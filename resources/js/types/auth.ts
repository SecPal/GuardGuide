export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    /**
     * The authenticated user, or `null` for guest requests. Inertia shares
     * `$request->user()` here, which is `null` whenever there is no
     * authenticated session (e.g. the welcome page or auth screens), so
     * consumers must guard before dereferencing.
     */
    user: User | null;
    can: {
        organizationalUnits: {
            view: boolean;
        };
        customers: {
            view: boolean;
        };
        sites: {
            view: boolean;
        };
        userAssignments: {
            view: boolean;
        };
        userRoles: {
            view: boolean;
        };
        roles: {
            view: boolean;
        };
    };
};

/* @chisel-passkeys */
export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};
/* @end-chisel-passkeys */

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
