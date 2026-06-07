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

const customersPath = '/customers';

type CustomerFormData = {
    name: string;
};

type Customer = CustomerFormData & {
    id: string;
    sites_count: number;
    can_update: boolean;
};

type PageProps = {
    customers: Customer[];
    canCreateCustomers: boolean;
};

export default function Customers({
    customers,
    canCreateCustomers,
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

                                <CustomerCreateForm />
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

function CustomerCreateForm() {
    const { i18n } = useLingui();
    const form = useForm<CustomerFormData>({
        name: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post(customersPath, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                form.clearErrors();
            },
        });
    }

    return (
        <form className="space-y-4" onSubmit={submit}>
            <CustomerFields
                data={form.data}
                errors={form.errors}
                onChange={form.setData}
            />

            <Button type="submit" disabled={form.processing}>
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
                onChange={form.setData}
            />

            <Button type="submit" disabled={form.processing}>
                {i18n._('customers.editForm.submit')}
            </Button>
        </form>
    );
}

function CustomerFields({
    data,
    errors,
    onChange,
}: {
    data: CustomerFormData;
    errors: Partial<Record<keyof CustomerFormData, string>>;
    onChange: <TKey extends keyof CustomerFormData>(
        key: TKey,
        value: CustomerFormData[TKey],
    ) => void;
}) {
    const { i18n } = useLingui();
    const fieldId = useId();
    const nameId = `${fieldId}-name`;

    return (
        <div className="grid gap-2">
            <Label htmlFor={nameId}>{i18n._('customers.fields.name')}</Label>
            <Input
                id={nameId}
                value={data.name}
                onChange={(event) => onChange('name', event.target.value)}
                required
            />
            <InputError message={errors.name} />
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
                <span className="block text-xs text-muted-foreground">
                    {i18n._('customers.list.siteCount', {
                        count: customer.sites_count,
                    })}
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
