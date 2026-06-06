import { Head, useForm } from '@inertiajs/react';
import { i18n } from '@lingui/core';
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

const orgUnitsPath = '/organizational-units';
const rootParentValue = '__root__';

type UnitFormData = {
    type: string;
    name: string;
    parent_id: string | null;
    sort_order: number;
};

type OrganizationalUnit = UnitFormData & {
    id: string;
    children: OrganizationalUnit[];
};

type FlatOrganizationalUnit = UnitFormData & {
    id: string;
    depth: number;
};

type TypeOption = {
    value: string;
    label: string;
};

type PageProps = {
    units: OrganizationalUnit[];
    flatUnits: FlatOrganizationalUnit[];
    typeOptions: TypeOption[];
};

export default function OrganizationalUnits({
    units,
    flatUnits,
    typeOptions,
}: PageProps) {
    const { i18n } = useLingui();
    const [selectedUnitId, setSelectedUnitId] = useState<string | null>(
        flatUnits[0]?.id ?? null,
    );

    const selectedUnit = useMemo(
        () => flatUnits.find((unit) => unit.id === selectedUnitId) ?? null,
        [flatUnits, selectedUnitId],
    );

    const descendantIds = useMemo(() => {
        if (!selectedUnit) {
            return new Set<string>();
        }

        return collectDescendantIds(units, selectedUnit.id);
    }, [selectedUnit, units]);

    const createForm = useForm<UnitFormData>({
        type: typeOptions[0]?.value ?? 'company',
        name: '',
        parent_id: null,
        sort_order: 0,
    });

    function submitCreate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        createForm.post(orgUnitsPath, {
            preserveScroll: true,
            onSuccess: () => {
                createForm.reset('name');
                createForm.clearErrors();
            },
        });
    }

    return (
        <>
            <Head title={i18n._('orgUnits.metaTitle')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title={i18n._('orgUnits.heading.title')}
                        description={i18n._('orgUnits.heading.description')}
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
                    <section className="rounded-md border bg-background">
                        <div className="border-b px-4 py-3">
                            <h2 className="text-sm font-medium">
                                {i18n._('orgUnits.hierarchy.title')}
                            </h2>
                        </div>

                        <div className="p-3">
                            {units.length > 0 ? (
                                <ul className="space-y-1">
                                    {units.map((unit) => (
                                        <UnitTreeItem
                                            key={unit.id}
                                            unit={unit}
                                            selectedUnitId={selectedUnitId}
                                            onSelect={setSelectedUnitId}
                                        />
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex min-h-40 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                                    {i18n._('orgUnits.hierarchy.empty')}
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="space-y-6">
                        <section className="rounded-md border bg-background p-4">
                            <div className="mb-4 flex items-center gap-2">
                                <Plus className="size-4" />
                                <Heading
                                    variant="small"
                                    title={i18n._('orgUnits.createForm.title')}
                                    description={i18n._(
                                        'orgUnits.createForm.description',
                                    )}
                                />
                            </div>

                            <form className="space-y-4" onSubmit={submitCreate}>
                                <UnitFields
                                    data={createForm.data}
                                    errors={createForm.errors}
                                    typeOptions={typeOptions}
                                    parentOptions={flatUnits}
                                    onChange={createForm.setData}
                                />

                                <Button
                                    type="submit"
                                    disabled={createForm.processing}
                                >
                                    <Plus />
                                    {i18n._('orgUnits.createForm.submit')}
                                </Button>
                            </form>
                        </section>

                        <section className="rounded-md border bg-background p-4">
                            <div className="mb-4 flex items-center gap-2">
                                <Pencil className="size-4" />
                                <Heading
                                    variant="small"
                                    title={i18n._('orgUnits.editForm.title')}
                                    description={i18n._(
                                        'orgUnits.editForm.description',
                                    )}
                                />
                            </div>

                            {selectedUnit ? (
                                <EditUnitForm
                                    key={selectedUnit.id}
                                    selectedUnit={selectedUnit}
                                    typeOptions={typeOptions}
                                    parentOptions={flatUnits}
                                    disabledParentIds={
                                        new Set([
                                            selectedUnit.id,
                                            ...descendantIds,
                                        ])
                                    }
                                />
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {i18n._('orgUnits.editForm.placeholder')}
                                </p>
                            )}
                        </section>
                    </aside>
                </div>
            </div>
        </>
    );
}

function EditUnitForm({
    selectedUnit,
    typeOptions,
    parentOptions,
    disabledParentIds,
}: {
    selectedUnit: FlatOrganizationalUnit;
    typeOptions: TypeOption[];
    parentOptions: FlatOrganizationalUnit[];
    disabledParentIds: Set<string>;
}) {
    const { i18n } = useLingui();
    const form = useForm<UnitFormData>({
        type: selectedUnit.type,
        name: selectedUnit.name,
        parent_id: selectedUnit.parent_id,
        sort_order: selectedUnit.sort_order,
    });

    function submitEdit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.put(`${orgUnitsPath}/${selectedUnit.id}`, {
            preserveScroll: true,
            onSuccess: () => form.clearErrors(),
        });
    }

    return (
        <form className="space-y-4" onSubmit={submitEdit}>
            <UnitFields
                data={form.data}
                errors={form.errors}
                typeOptions={typeOptions}
                parentOptions={parentOptions}
                disabledParentIds={disabledParentIds}
                onChange={form.setData}
            />

            <Button type="submit" disabled={form.processing}>
                {i18n._('orgUnits.editForm.submit')}
            </Button>
        </form>
    );
}

function UnitTreeItem({
    unit,
    selectedUnitId,
    onSelect,
}: {
    unit: OrganizationalUnit;
    selectedUnitId: string | null;
    onSelect: (unitId: string) => void;
}) {
    const { i18n } = useLingui();
    const selected = selectedUnitId === unit.id;

    return (
        <li>
            <button
                type="button"
                onClick={() => onSelect(unit.id)}
                className={`flex min-h-10 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    selected
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent/60'
                }`}
            >
                <Building2 className="size-4 text-muted-foreground" />
                <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                        {unit.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                        {unit.type} · {i18n._('orgUnits.hierarchy.sortOrder')}{' '}
                        {unit.sort_order}
                    </span>
                </span>
                {unit.children.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                        {unit.children.length}
                    </span>
                )}
            </button>

            {unit.children.length > 0 && (
                <ul className="mt-1 ml-6 space-y-1 border-l pl-3">
                    {unit.children.map((child) => (
                        <UnitTreeItem
                            key={child.id}
                            unit={child}
                            selectedUnitId={selectedUnitId}
                            onSelect={onSelect}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}

function UnitFields({
    data,
    errors,
    typeOptions,
    parentOptions,
    disabledParentIds = new Set<string>(),
    onChange,
}: {
    data: UnitFormData;
    errors: Partial<Record<keyof UnitFormData, string>>;
    typeOptions: TypeOption[];
    parentOptions: FlatOrganizationalUnit[];
    disabledParentIds?: Set<string>;
    onChange: <TKey extends keyof UnitFormData>(
        key: TKey,
        value: UnitFormData[TKey],
    ) => void;
}) {
    const { i18n } = useLingui();
    const fieldId = useId();
    const nameId = `${fieldId}-name`;
    const sortOrderId = `${fieldId}-sort-order`;

    return (
        <>
            <div className="grid gap-2">
                <Label htmlFor={nameId}>{i18n._('orgUnits.fields.name')}</Label>
                <Input
                    id={nameId}
                    value={data.name}
                    onChange={(event) => onChange('name', event.target.value)}
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label>{i18n._('orgUnits.fields.type')}</Label>
                <Select
                    value={data.type}
                    onValueChange={(value) => onChange('type', value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {typeOptions.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.type} />
            </div>

            <div className="grid gap-2">
                <Label>{i18n._('orgUnits.fields.parent')}</Label>
                <Select
                    value={data.parent_id ?? rootParentValue}
                    onValueChange={(value) =>
                        onChange(
                            'parent_id',
                            value === rootParentValue ? null : value,
                        )
                    }
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={rootParentValue}>
                            {i18n._('orgUnits.fields.parentRoot')}
                        </SelectItem>
                        {parentOptions.map((unit) => (
                            <SelectItem
                                key={unit.id}
                                value={unit.id}
                                disabled={disabledParentIds.has(unit.id)}
                            >
                                {formatParentOption(unit)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.parent_id} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={sortOrderId}>
                    {i18n._('orgUnits.fields.sortOrder')}
                </Label>
                <Input
                    id={sortOrderId}
                    type="number"
                    min="0"
                    value={data.sort_order}
                    onChange={(event) =>
                        onChange('sort_order', Number(event.target.value))
                    }
                    required
                />
                <InputError message={errors.sort_order} />
            </div>
        </>
    );
}

function collectDescendantIds(units: OrganizationalUnit[], unitId: string) {
    const descendants = new Set<string>();

    function visit(candidates: OrganizationalUnit[]) {
        for (const candidate of candidates) {
            if (candidate.id === unitId) {
                collect(candidate.children);

                return;
            }

            visit(candidate.children);
        }
    }

    function collect(children: OrganizationalUnit[]) {
        for (const child of children) {
            descendants.add(child.id);
            collect(child.children);
        }
    }

    visit(units);

    return descendants;
}

function formatParentOption(unit: FlatOrganizationalUnit) {
    return `${'  '.repeat(unit.depth)}${unit.depth > 0 ? '-> ' : ''}${unit.name}`;
}

OrganizationalUnits.layout = () => ({
    breadcrumbs: [
        {
            title: i18n._('orgUnits.breadcrumb'),
            href: orgUnitsPath,
        },
    ],
});
