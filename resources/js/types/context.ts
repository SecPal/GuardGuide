export type ContextSource = 'assigned' | 'site';

export type EffectiveOrganizationalUnitContext = {
    id: string;
    type: string;
    name: string;
    parent_id: string | null;
    sources: ContextSource[];
};

export type EffectiveCustomerContext = {
    id: string;
    name: string;
    sources: ContextSource[];
};

export type EffectiveSiteContext = {
    id: string;
    customer_id: string;
    customer_name: string | null;
    organizational_unit_id: string | null;
    organizational_unit_name: string | null;
    name: string;
    sources: ContextSource[];
};

export type EffectiveUserContext = {
    organizationalUnits: EffectiveOrganizationalUnitContext[];
    customers: EffectiveCustomerContext[];
    sites: EffectiveSiteContext[];
};
