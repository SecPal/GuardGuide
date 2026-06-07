import { Head, useForm } from '@inertiajs/react';
import { useLingui } from '@lingui/react';
import { Building2, MapPinned, Pencil, Plus } from 'lucide-react';
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

const sitesPath = '/sites';
const emptyOption = '__none__';

type SiteFormData = {
    name: string;
    customer_id: string;
    organizational_unit_id: string;
};

type Site = {
    id: string;
    name: string;
    customer_id: string;
    customer_name: string | null;
    organizational_unit_id: string | null;
    organizational_unit_name: string | null;
    can_update: boolean;
};

type Option = {
    id: string;
    name: string;
};

type PageProps = {
    sites: Site[];
    customers: Option[];
    organizationalUnits: Option[];
    canCreateSites: boolean;
};

export default function Sites({
    sites,
    customers,
    organizationalUnits,
    canCreateSites,
}: PageProps) {
    const { i18n } = useLingui();
    const editableSites = sites.filter((site) => site.can_update);
    const [selectedSiteId, setSelectedSiteId] = useState<string | null>(
        editableSites[0]?.id ?? null,
    );

    const selectedSite = useMemo(
        () => editableSites.find((site) => site.id === selectedSiteId) ?? null,
        [editableSites, selectedSiteId],
    );

    return (
        <>
            <Head title={i18n._('sites.metaTitle')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    title={i18n._('sites.heading.title')}
                    description={i18n._('sites.heading.description')}
                />

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
                    <section className="rounded-md border bg-background">
                        <div className="border-b px-4 py-3">
                            <h2 className="text-sm font-medium">
                                {i18n._('sites.list.title')}
                            </h2>
                        </div>

                        <div className="space-y-2 p-3">
                            {sites.length > 0 ? (
                                sites.map((site) => (
                                    <SiteRow
                                        key={site.id}
                                        site={site}
                                        selected={selectedSiteId === site.id}
                                        onSelect={setSelectedSiteId}
                                    />
                                ))
                            ) : (
                                <div className="flex min-h-40 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                                    {i18n._('sites.list.empty')}
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="space-y-6">
                        {canCreateSites && (
                            <section className="rounded-md border bg-background p-4">
                                <div className="mb-4 flex items-center gap-2">
                                    <Plus className="size-4" />
                                    <Heading
                                        variant="small"
                                        title={i18n._('sites.createForm.title')}
                                    />
                                </div>

                                <SiteCreateForm
                                    customers={customers}
                                    organizationalUnits={organizationalUnits}
                                />
                            </section>
                        )}

                        <section className="rounded-md border bg-background p-4">
                            <div className="mb-4 flex items-center gap-2">
                                <Pencil className="size-4" />
                                <Heading
                                    variant="small"
                                    title={i18n._('sites.editForm.title')}
                                />
                            </div>

                            {selectedSite ? (
                                <SiteEditForm
                                    key={selectedSite.id}
                                    site={selectedSite}
                                    customers={customers}
                                    organizationalUnits={organizationalUnits}
                                />
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {i18n._('sites.editForm.placeholder')}
                                </p>
                            )}
                        </section>
                    </aside>
                </div>
            </div>
        </>
    );
}

function SiteCreateForm({
    customers,
    organizationalUnits,
}: {
    customers: Option[];
    organizationalUnits: Option[];
}) {
    const { i18n } = useLingui();
    const form = useForm<SiteFormData>({
        name: '',
        customer_id: customers[0]?.id ?? '',
        organizational_unit_id: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post(sitesPath, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                form.setData('customer_id', customers[0]?.id ?? '');
                form.clearErrors();
            },
        });
    }

    return (
        <form className="space-y-4" onSubmit={submit}>
            <SiteFields
                data={form.data}
                errors={form.errors}
                customers={customers}
                organizationalUnits={organizationalUnits}
                onChange={form.setData}
            />

            <Button
                type="submit"
                disabled={form.processing || form.data.customer_id === ''}
            >
                <Plus />
                {i18n._('sites.createForm.submit')}
            </Button>
        </form>
    );
}

function SiteEditForm({
    site,
    customers,
    organizationalUnits,
}: {
    site: Site;
    customers: Option[];
    organizationalUnits: Option[];
}) {
    const { i18n } = useLingui();
    const form = useForm<SiteFormData>({
        name: site.name,
        customer_id: site.customer_id,
        organizational_unit_id: site.organizational_unit_id ?? '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.put(`${sitesPath}/${site.id}`, {
            preserveScroll: true,
            onSuccess: () => form.clearErrors(),
        });
    }

    return (
        <form className="space-y-4" onSubmit={submit}>
            <SiteFields
                data={form.data}
                errors={form.errors}
                customers={customers}
                organizationalUnits={organizationalUnits}
                onChange={form.setData}
            />

            <Button
                type="submit"
                disabled={form.processing || form.data.customer_id === ''}
            >
                {i18n._('sites.editForm.submit')}
            </Button>
        </form>
    );
}

function SiteFields({
    data,
    errors,
    customers,
    organizationalUnits,
    onChange,
}: {
    data: SiteFormData;
    errors: Partial<Record<keyof SiteFormData, string>>;
    customers: Option[];
    organizationalUnits: Option[];
    onChange: <TKey extends keyof SiteFormData>(
        key: TKey,
        value: SiteFormData[TKey],
    ) => void;
}) {
    const { i18n } = useLingui();
    const fieldId = useId();
    const nameId = `${fieldId}-name`;
    const customerId = `${fieldId}-customer`;
    const organizationalUnitId = `${fieldId}-organizational-unit`;

    return (
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor={nameId}>{i18n._('sites.fields.name')}</Label>
                <Input
                    id={nameId}
                    value={data.name}
                    onChange={(event) => onChange('name', event.target.value)}
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={customerId}>
                    {i18n._('sites.fields.customer')}
                </Label>
                <Select
                    value={data.customer_id}
                    onValueChange={(value) => onChange('customer_id', value)}
                >
                    <SelectTrigger id={customerId} className="w-full">
                        <SelectValue
                            placeholder={i18n._(
                                'sites.fields.customerPlaceholder',
                            )}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                                {customer.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.customer_id} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={organizationalUnitId}>
                    {i18n._('sites.fields.organizationalUnit')}
                </Label>
                <Select
                    value={data.organizational_unit_id || emptyOption}
                    onValueChange={(value) =>
                        onChange(
                            'organizational_unit_id',
                            value === emptyOption ? '' : value,
                        )
                    }
                >
                    <SelectTrigger id={organizationalUnitId} className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={emptyOption}>
                            {i18n._('sites.fields.organizationalUnitNone')}
                        </SelectItem>
                        {organizationalUnits.map((unit) => (
                            <SelectItem key={unit.id} value={unit.id}>
                                {unit.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.organizational_unit_id} />
            </div>
        </div>
    );
}

function SiteRow({
    site,
    selected,
    onSelect,
}: {
    site: Site;
    selected: boolean;
    onSelect: (siteId: string) => void;
}) {
    const { i18n } = useLingui();
    const rowContent = (
        <>
            <MapPinned className="size-4 text-muted-foreground" />
            <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{site.name}</span>
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex min-w-0 items-center gap-1">
                        <Building2 className="size-3" />
                        <span className="truncate">
                            {site.customer_name ??
                                i18n._('sites.list.unknownCustomer')}
                        </span>
                    </span>
                    {site.organizational_unit_name && (
                        <span className="truncate">
                            {site.organizational_unit_name}
                        </span>
                    )}
                </span>
            </span>
        </>
    );

    if (!site.can_update) {
        return (
            <div className="flex min-h-12 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm">
                {rowContent}
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={() => onSelect(site.id)}
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
