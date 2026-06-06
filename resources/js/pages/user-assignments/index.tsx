import { Head, router, useForm } from '@inertiajs/react';
import { i18n } from '@lingui/core';
import { useLingui } from '@lingui/react';
import { Building2, Landmark, Plus, Trash2, UserRound } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    index as userAssignmentsIndex,
    redirect as userAssignmentsRedirect,
} from '@/routes/user-assignments';
import * as customerAssignments from '@/routes/user-assignments/customers';
import * as orgUnitAssignments from '@/routes/user-assignments/organizational-units';
import * as siteAssignments from '@/routes/user-assignments/sites';

const noSelectionValue = '__none__';

type UserOption = {
    id: number;
    name: string;
    email: string;
};

type OrganizationalUnitOption = {
    id: string;
    type: string;
    name: string;
};

type CustomerOption = {
    id: string;
    name: string;
};

type SiteOption = {
    id: string;
    customer_id: string;
    customer_name: string | null;
    name: string;
};

type PageProps = {
    selectedUser: UserOption;
    users: UserOption[];
    assignments: {
        organizationalUnits: OrganizationalUnitOption[];
        customers: CustomerOption[];
        sites: SiteOption[];
    };
    options: {
        organizationalUnits: OrganizationalUnitOption[];
        customers: CustomerOption[];
        sites: SiteOption[];
    };
};

export default function UserAssignments({
    selectedUser,
    users,
    assignments,
    options,
}: PageProps) {
    const { i18n } = useLingui();
    const assignedUnitIds = new Set(
        assignments.organizationalUnits.map((unit) => unit.id),
    );
    const assignedCustomerIds = new Set(
        assignments.customers.map((customer) => customer.id),
    );
    const assignedSiteIds = new Set(assignments.sites.map((site) => site.id));

    const availableUnits = options.organizationalUnits.filter(
        (unit) => !assignedUnitIds.has(unit.id),
    );
    const availableCustomers = options.customers.filter(
        (customer) => !assignedCustomerIds.has(customer.id),
    );
    const availableSites = options.sites.filter(
        (site) =>
            assignedCustomerIds.has(site.customer_id) &&
            !assignedSiteIds.has(site.id),
    );

    return (
        <>
            <Head title={i18n._('userAssignments.metaTitle')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title={i18n._('userAssignments.heading.title')}
                        description={i18n._(
                            'userAssignments.heading.description',
                        )}
                    />

                    <div className="w-full sm:w-80">
                        <Select
                            value={String(selectedUser.id)}
                            onValueChange={(value) =>
                                router.visit(
                                    userAssignmentsIndex.url(Number(value)),
                                )
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem
                                        key={user.id}
                                        value={String(user.id)}
                                    >
                                        {user.name} ({user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <section className="rounded-md border bg-background p-4">
                    <div className="flex items-center gap-3">
                        <UserRound className="size-5 text-muted-foreground" />
                        <div className="min-w-0">
                            <h2 className="truncate text-base font-medium">
                                {selectedUser.name}
                            </h2>
                            <p className="truncate text-sm text-muted-foreground">
                                {selectedUser.email}
                            </p>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-3">
                    <AssignmentSection
                        icon={<Building2 className="size-4" />}
                        title={i18n._('userAssignments.orgUnits.title')}
                        emptyText={i18n._('userAssignments.orgUnits.empty')}
                        form={
                            <AddOrganizationalUnitForm
                                userId={selectedUser.id}
                                options={availableUnits}
                            />
                        }
                    >
                        {assignments.organizationalUnits.map((unit) => (
                            <AssignmentRow
                                key={unit.id}
                                title={unit.name}
                                subtitle={unit.type}
                                deleteUrl={orgUnitAssignments.destroy.url({ user: selectedUser.id, organizationalUnit: unit.id })}
                            />
                        ))}
                    </AssignmentSection>

                    <AssignmentSection
                        icon={<Landmark className="size-4" />}
                        title={i18n._('userAssignments.customers.title')}
                        emptyText={i18n._('userAssignments.customers.empty')}
                        form={
                            <AddCustomerForm
                                userId={selectedUser.id}
                                options={availableCustomers}
                            />
                        }
                    >
                        {assignments.customers.map((customer) => (
                            <AssignmentRow
                                key={customer.id}
                                title={customer.name}
                                deleteUrl={customerAssignments.destroy.url({ user: selectedUser.id, customer: customer.id })}
                            />
                        ))}
                    </AssignmentSection>

                    <AssignmentSection
                        icon={<Building2 className="size-4" />}
                        title={i18n._('userAssignments.sites.title')}
                        emptyText={i18n._('userAssignments.sites.empty')}
                        form={
                            <AddSiteForm
                                userId={selectedUser.id}
                                options={availableSites}
                                hasCustomerAssignment={
                                    assignments.customers.length > 0
                                }
                            />
                        }
                    >
                        {assignments.sites.map((site) => (
                            <AssignmentRow
                                key={site.id}
                                title={site.name}
                                subtitle={
                                    site.customer_name ??
                                    i18n._(
                                        'userAssignments.sites.unknownCustomer',
                                    )
                                }
                                deleteUrl={siteAssignments.destroy.url({ user: selectedUser.id, site: site.id })}
                            />
                        ))}
                    </AssignmentSection>
                </div>
            </div>
        </>
    );
}

function AddOrganizationalUnitForm({
    userId,
    options,
}: {
    userId: number;
    options: OrganizationalUnitOption[];
}) {
    const { i18n } = useLingui();
    const form = useForm({
        organizational_unit_id: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post(orgUnitAssignments.store.url(userId), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    return (
        <form className="space-y-3" onSubmit={submit}>
            <Select
                value={form.data.organizational_unit_id || noSelectionValue}
                onValueChange={(value) =>
                    form.setData(
                        'organizational_unit_id',
                        value === noSelectionValue ? '' : value,
                    )
                }
                disabled={options.length === 0}
            >
                <SelectTrigger className="w-full">
                    <SelectValue
                        placeholder={i18n._(
                            'userAssignments.orgUnits.selectPlaceholder',
                        )}
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={noSelectionValue} disabled>
                        {i18n._('userAssignments.orgUnits.selectPlaceholder')}
                    </SelectItem>
                    {options.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                            {unit.name} ({unit.type})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <InputError message={form.errors.organizational_unit_id} />
            <Button
                type="submit"
                disabled={form.processing || !form.data.organizational_unit_id}
            >
                <Plus />
                {i18n._('userAssignments.add')}
            </Button>
        </form>
    );
}

function AddCustomerForm({
    userId,
    options,
}: {
    userId: number;
    options: CustomerOption[];
}) {
    const { i18n } = useLingui();
    const form = useForm({
        customer_id: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post(customerAssignments.store.url(userId), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    return (
        <form className="space-y-3" onSubmit={submit}>
            <Select
                value={form.data.customer_id || noSelectionValue}
                onValueChange={(value) =>
                    form.setData(
                        'customer_id',
                        value === noSelectionValue ? '' : value,
                    )
                }
                disabled={options.length === 0}
            >
                <SelectTrigger className="w-full">
                    <SelectValue
                        placeholder={i18n._(
                            'userAssignments.customers.selectPlaceholder',
                        )}
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={noSelectionValue} disabled>
                        {i18n._('userAssignments.customers.selectPlaceholder')}
                    </SelectItem>
                    {options.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <InputError message={form.errors.customer_id} />
            <Button
                type="submit"
                disabled={form.processing || !form.data.customer_id}
            >
                <Plus />
                {i18n._('userAssignments.add')}
            </Button>
        </form>
    );
}

function AddSiteForm({
    userId,
    options,
    hasCustomerAssignment,
}: {
    userId: number;
    options: SiteOption[];
    hasCustomerAssignment: boolean;
}) {
    const { i18n } = useLingui();
    const form = useForm({
        site_id: '',
    });
    const disabled = !hasCustomerAssignment || options.length === 0;

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post(siteAssignments.store.url(userId), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    return (
        <form className="space-y-3" onSubmit={submit}>
            <Select
                value={form.data.site_id || noSelectionValue}
                onValueChange={(value) =>
                    form.setData(
                        'site_id',
                        value === noSelectionValue ? '' : value,
                    )
                }
                disabled={disabled}
            >
                <SelectTrigger className="w-full">
                    <SelectValue
                        placeholder={i18n._(
                            'userAssignments.sites.selectPlaceholder',
                        )}
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={noSelectionValue} disabled>
                        {i18n._('userAssignments.sites.selectPlaceholder')}
                    </SelectItem>
                    {options.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                            {site.name} (
                            {site.customer_name ??
                                i18n._('userAssignments.sites.unknownCustomer')}
                            )
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <InputError message={form.errors.site_id} />
            <Button
                type="submit"
                disabled={form.processing || disabled || !form.data.site_id}
            >
                <Plus />
                {i18n._('userAssignments.add')}
            </Button>
        </form>
    );
}

function AssignmentSection({
    icon,
    title,
    emptyText,
    form,
    children,
}: {
    icon: ReactNode;
    title: string;
    emptyText: string;
    form: ReactNode;
    children: ReactNode;
}) {
    const hasChildren = Array.isArray(children)
        ? children.length > 0
        : !!children;

    return (
        <section className="rounded-md border bg-background p-4">
            <div className="mb-4 flex items-center gap-2">
                {icon}
                <Heading variant="small" title={title} />
            </div>

            <div className="mb-5">{form}</div>

            <div className="space-y-2">
                {hasChildren ? (
                    children
                ) : (
                    <div className="rounded-md border border-dashed px-3 py-5 text-center text-sm text-muted-foreground">
                        {emptyText}
                    </div>
                )}
            </div>
        </section>
    );
}

function AssignmentRow({
    title,
    subtitle,
    deleteUrl,
}: {
    title: string;
    subtitle?: string;
    deleteUrl: string;
}) {
    const { i18n } = useLingui();
    const form = useForm({});

    return (
        <div className="flex min-h-12 items-center gap-3 rounded-md border px-3 py-2">
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{title}</p>
                {subtitle && (
                    <p className="truncate text-xs text-muted-foreground">
                        {subtitle}
                    </p>
                )}
            </div>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={form.processing}
                onClick={() => form.delete(deleteUrl, { preserveScroll: true })}
                aria-label={i18n._('userAssignments.removeAriaLabel', {
                    title,
                })}
            >
                <Trash2 />
            </Button>
        </div>
    );
}

UserAssignments.layout = () => ({
    breadcrumbs: [
        {
            title: () => i18n._('userAssignments.breadcrumb'),
            href: userAssignmentsRedirect.url(),
        },
    ],
});
