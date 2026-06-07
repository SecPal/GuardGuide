import { Head, useForm } from '@inertiajs/react';
import { useLingui } from '@lingui/react';
import { Building2, Pencil, Plus } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const customersPath = '/customers';
const emptyOption = '__none__';

type CustomerFormData = {
    name: string;
    organizational_unit_id: string;
};

type Customer = CustomerFormData & {
    id: string;
    organizational_unit_name: string | null;
    sites_count: number;
    can_update: boolean;
};

type Option = {
    id: string;
    name: string;
};

type PageProps = {
    customers: Customer[];
    canCreateCustomers: boolean;
    customerOrganizationOptions: Option[];
    resolvedOrganizationId: string | null;
    mustChooseOrganization: boolean;
    organizationSelectionLocked: boolean;
};

export default function Customers({
    customers,
    canCreateCustomers,
    customerOrganizationOptions,
    resolvedOrganizationId,
    mustChooseOrganization,
    organizationSelectionLocked,
}: PageProps) {
    const { i18n } = useLingui();
    const editableCustomers = customers.filter(
        (customer) => customer.can_update,
    );
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
        editableCustomers[0]?.id ?? null,
    );

    const selectedCustomer = useMemo(
        () =>
            editableCustomers.find(
                (customer) => customer.id === selectedCustomerId,
            ) ?? null,
        [editableCustomers, selectedCustomerId],
    );

    return (
        <>
            <Head title={i18n._('customers.metaTitle')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    title={i18n._('customers.heading.title')}
                    description={i18n._('customers.heading.description')}
                />

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
                    <section className="rounded-md border bg-background">
                        <div className="border-b px-4 py-3">
                            <h2 className="text-sm font-medium">
                                {i18n._('customers.list.title')}
                            </h2>
                        </div>

                        <div className="space-y-2 p-3">
                            {customers.length > 0 ? (
                                customers.map((customer) => (
                                    <CustomerRow
                                        key={customer.id}
                                        customer={customer}
                                        selected={
                                            selectedCustomerId === customer.id
                                        }
                                        onSelect={setSelectedCustomerId}
                                    />
                                ))
                            ) : (
                                <div className="flex min-h-40 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                                    {i18n._('customers.list.empty')}
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="space-y-6">
                        {canCreateCustomers && (
                            <section className="rounded-md border bg-background p-4">
                                <div className="mb-4 flex items-center gap-2">
                                    <Plus className="size-4" />
                                    <Heading
                                        variant="small"
                                        title={i18n._(
                                            'customers.createForm.title',
                                        )}
                                    />
                                </div>

                                <CustomerCreateForm
                                    customerOrganizationOptions={
                                        customerOrganizationOptions
                                    }
                                    resolvedOrganizationId={
                                        resolvedOrganizationId
                                    }
                                    mustChooseOrganization={
                                        mustChooseOrganization
                                    }
                                    organizationSelectionLocked={
                                        organizationSelectionLocked
                                    }
                                />
                            </section>
                        )}

                        <section className="rounded-md border bg-background p-4">
                            <div className="mb-4 flex items-center gap-2">
                                <Pencil className="size-4" />
                                <Heading
                                    variant="small"
                                    title={i18n._('customers.editForm.title')}
                                />
                            </div>

                            {selectedCustomer ? (
                                <CustomerEditForm
                                    key={selectedCustomer.id}
                                    customer={selectedCustomer}
                                />
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {i18n._('customers.editForm.placeholder')}
                                </p>
                            )}
                        </section>
                    </aside>
                </div>
            </div>
        </>
    );
}

function CustomerCreateForm({
    customerOrganizationOptions,
    resolvedOrganizationId,
    mustChooseOrganization,
    organizationSelectionLocked,
}: {
    customerOrganizationOptions: Option[];
    resolvedOrganizationId: string | null;
    mustChooseOrganization: boolean;
    organizationSelectionLocked: boolean;
}) {
    const { i18n } = useLingui();
    const form = useForm<CustomerFormData>({
        name: '',
        organizational_unit_id: resolvedOrganizationId ?? '',
    });
    const canSubmit =
        !form.processing &&
        customerOrganizationOptions.length > 0 &&
        (!mustChooseOrganization || form.data.organizational_unit_id !== '');

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post(customersPath, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset('name');
                form.setData(
                    'organizational_unit_id',
                    resolvedOrganizationId ?? '',
                );
                form.clearErrors();
            },
        });
    }

    return (
        <form className="space-y-4" onSubmit={submit}>
            <CustomerFields
                data={form.data}
                errors={form.errors}
                customerOrganizationOptions={customerOrganizationOptions}
                organizationSelectionLocked={organizationSelectionLocked}
                showOrganizationField={customerOrganizationOptions.length > 0}
                onChange={form.setData}
            />

            {customerOrganizationOptions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    {i18n._('customers.createForm.noOrganizations')}
                </p>
            )}

            <Button type="submit" disabled={!canSubmit}>
                <Plus />
                {i18n._('customers.createForm.submit')}
            </Button>
        </form>
    );
}

function CustomerEditForm({ customer }: { customer: Customer }) {
    const { i18n } = useLingui();
    const form = useForm<CustomerFormData>({
        name: customer.name,
        organizational_unit_id: customer.organizational_unit_id,
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.put(`${customersPath}/${customer.id}`, {
            preserveScroll: true,
            onSuccess: () => form.clearErrors(),
        });
    }

    return (
        <form className="space-y-4" onSubmit={submit}>
            <CustomerFields
                data={form.data}
                errors={form.errors}
                customerOrganizationOptions={[]}
                organizationSelectionLocked
                showOrganizationField={false}
                onChange={form.setData}
            />

            {customer.organizational_unit_name && (
                <div className="grid gap-2">
                    <Label>
                        {i18n._('customers.fields.organizationalUnit')}
                    </Label>
                    <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                        {customer.organizational_unit_name}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {i18n._('customers.editForm.organizationLocked')}
                    </p>
                </div>
            )}

            <Button type="submit" disabled={form.processing}>
                {i18n._('customers.editForm.submit')}
            </Button>
        </form>
    );
}

function CustomerFields({
    data,
    errors,
    customerOrganizationOptions,
    organizationSelectionLocked,
    showOrganizationField,
    onChange,
}: {
    data: CustomerFormData;
    errors: Partial<Record<keyof CustomerFormData, string>>;
    customerOrganizationOptions: Option[];
    organizationSelectionLocked: boolean;
    showOrganizationField: boolean;
    onChange: <TKey extends keyof CustomerFormData>(
        key: TKey,
        value: CustomerFormData[TKey],
    ) => void;
}) {
    const { i18n } = useLingui();
    const fieldId = useId();
    const nameId = `${fieldId}-name`;
    const organizationId = `${fieldId}-organizational-unit`;

    return (
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor={nameId}>
                    {i18n._('customers.fields.name')}
                </Label>
                <Input
                    id={nameId}
                    value={data.name}
                    onChange={(event) => onChange('name', event.target.value)}
                    required
                />
                <InputError message={errors.name} />
            </div>

            {showOrganizationField && (
                <div className="grid gap-2">
                    <Label htmlFor={organizationId}>
                        {i18n._('customers.fields.organizationalUnit')}
                    </Label>
                    <Select
                        value={data.organizational_unit_id || emptyOption}
                        onValueChange={(value) =>
                            onChange(
                                'organizational_unit_id',
                                value === emptyOption ? '' : value,
                            )
                        }
                        disabled={organizationSelectionLocked}
                    >
                        <SelectTrigger id={organizationId} className="w-full">
                            <SelectValue
                                placeholder={i18n._(
                                    'customers.fields.organizationalUnitPlaceholder',
                                )}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {!organizationSelectionLocked && (
                                <SelectItem value={emptyOption}>
                                    {i18n._(
                                        'customers.fields.organizationalUnitPlaceholder',
                                    )}
                                </SelectItem>
                            )}
                            {customerOrganizationOptions.map((unit) => (
                                <SelectItem key={unit.id} value={unit.id}>
                                    {unit.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.organizational_unit_id} />
                    <p className="text-xs text-muted-foreground">
                        {organizationSelectionLocked
                            ? i18n._(
                                  'customers.fields.organizationalUnitLocked',
                              )
                            : i18n._('customers.fields.organizationalUnitHelp')}
                    </p>
                </div>
            )}
        </div>
    );
}

function CustomerRow({
    customer,
    selected,
    onSelect,
}: {
    customer: Customer;
    selected: boolean;
    onSelect: (customerId: string) => void;
}) {
    const { i18n } = useLingui();
    const rowContent = (
        <>
            <Building2 className="size-4 text-muted-foreground" />
            <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">
                    {customer.name}
                </span>
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>
                        {i18n._('customers.list.siteCount', {
                            count: customer.sites_count,
                        })}
                    </span>
                    {customer.organizational_unit_name && (
                        <span className="truncate">
                            {customer.organizational_unit_name}
                        </span>
                    )}
                </span>
            </span>
        </>
    );

    if (!customer.can_update) {
        return (
            <div className="flex min-h-12 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm">
                {rowContent}
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={() => onSelect(customer.id)}
            className={`flex min-h-12 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                selected
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent/60'
            }`}
        >
            {rowContent}
        </button>
    );
}
