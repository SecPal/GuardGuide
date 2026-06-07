import { Head, useForm, usePage } from '@inertiajs/react';
import { i18n } from '@lingui/core';
import { useLingui } from '@lingui/react';
import { Plus, Save, Shield, Trash2, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    translatePermissionDescription,
    translatePermissionLabel,
    translateRoleLabel,
} from '@/lib/access-i18n';
import {
    destroy as destroyRole,
    index as rolesIndex,
    store as storeRole,
    update as updateRole,
} from '@/routes/roles';

type RoleRecord = {
    id: number;
    name: string;
    label: string;
    permissions: string[];
    usersCount: number;
    canUpdate: boolean;
    canDelete: boolean;
};

type PermissionRecord = {
    name: string;
    description: string;
};

type PageProps = {
    roles: RoleRecord[];
    permissions: PermissionRecord[];
    capabilities: {
        create: boolean;
        update: boolean;
        delete: boolean;
    };
};

type RoleFormData = {
    name: string;
    label: string;
    permissions: string[];
};

function formDataFromRole(role: RoleRecord | null): RoleFormData {
    if (role === null) {
        return {
            name: '',
            label: '',
            permissions: [],
        };
    }

    return {
        name: role.name,
        label: role.label,
        permissions: role.permissions,
    };
}

export default function Roles({ roles, permissions, capabilities }: PageProps) {
    const { i18n } = useLingui();
    const pageProps = usePage<{ roles: RoleRecord[] }>().props;
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(
        roles[0]?.id ?? null,
    );
    const [isCreating, setIsCreating] = useState(roles.length === 0);
    const selectedRole =
        roles.find((role) => role.id === selectedRoleId) ?? null;

    const pendingCreatedNameRef = useRef<string | null>(null);

    const form = useForm<RoleFormData>(formDataFromRole(selectedRole));
    const rawRoleError = (form.errors as Record<string, string | undefined>)
        .role;
    const roleError =
        rawRoleError !== undefined ? i18n._(rawRoleError) : undefined;

    useEffect(() => {
        if (isCreating) {
            form.setData(formDataFromRole(null));
            form.clearErrors();

            return;
        }

        if (selectedRole !== null) {
            form.setData(formDataFromRole(selectedRole));
            form.clearErrors();
        }
        // `form` is intentionally omitted: useForm returns a new object reference
        // on every render, so including it would cause an infinite loop.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCreating, selectedRole]);

    useEffect(() => {
        if (pendingCreatedNameRef.current === null || isCreating) {
            return;
        }

        const createdRole = pageProps.roles.find(
            (r) => r.name === pendingCreatedNameRef.current,
        );

        if (createdRole !== undefined) {
            pendingCreatedNameRef.current = null;
            setSelectedRoleId(createdRole.id);
        }
    }, [isCreating, pageProps.roles]);

    function selectRole(roleId: number) {
        setSelectedRoleId(roleId);
        setIsCreating(false);
    }

    function startCreate() {
        setSelectedRoleId(null);
        setIsCreating(true);
    }

    function togglePermission(permissionName: string, checked: boolean) {
        form.setData(
            'permissions',
            checked
                ? [...form.data.permissions, permissionName].sort()
                : form.data.permissions.filter(
                      (name) => name !== permissionName,
                  ),
        );
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isCreating) {
            const submittedName = form.data.name;

            form.post(storeRole.url(), {
                preserveScroll: true,
                onSuccess: () => {
                    pendingCreatedNameRef.current = submittedName;
                    setIsCreating(false);
                },
            });

            return;
        }

        if (selectedRole === null) {
            return;
        }

        form.put(updateRole.url(selectedRole.id), {
            preserveScroll: true,
        });
    }

    const canEditCurrent = isCreating
        ? capabilities.create
        : (selectedRole?.canUpdate ?? false);

    return (
        <>
            <Head title={i18n._('roles.metaTitle')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title={i18n._('roles.heading.title')}
                        description={i18n._('roles.heading.description')}
                    />

                    {capabilities.create && (
                        <Button type="button" onClick={startCreate}>
                            <Plus />
                            {i18n._('roles.actions.create')}
                        </Button>
                    )}
                </div>

                <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
                    <section className="rounded-md border bg-background">
                        <div className="border-b px-4 py-3">
                            <Heading
                                variant="small"
                                title={i18n._('roles.list.title')}
                                description={i18n._('roles.list.description')}
                            />
                        </div>

                        <div className="space-y-2 p-3">
                            {roles.length > 0 ? (
                                roles.map((role) => {
                                    const active =
                                        !isCreating &&
                                        selectedRoleId === role.id;
                                    const displayLabel = translateRoleLabel(
                                        i18n,
                                        role.name,
                                        role.label,
                                    );

                                    return (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() => selectRole(role.id)}
                                            className={`flex w-full flex-col gap-2 rounded-md border px-3 py-3 text-left transition-colors ${
                                                active
                                                    ? 'border-primary bg-primary/5'
                                                    : 'hover:bg-accent'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium">
                                                        {displayLabel}
                                                    </p>
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {role.name}
                                                    </p>
                                                </div>
                                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Users className="size-3.5" />
                                                    {role.usersCount}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {i18n._(
                                                    'roles.list.permissionCount',
                                                    {
                                                        count: role.permissions
                                                            .length,
                                                    },
                                                )}
                                            </p>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="rounded-md border border-dashed px-3 py-8 text-center text-sm text-muted-foreground">
                                    {i18n._('roles.list.empty')}
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="rounded-md border bg-background p-4">
                        <div className="mb-5 flex items-center gap-2">
                            <Shield className="size-4" />
                            <Heading
                                variant="small"
                                title={i18n._(
                                    isCreating
                                        ? 'roles.editor.createTitle'
                                        : 'roles.editor.editTitle',
                                )}
                                description={i18n._(
                                    isCreating
                                        ? 'roles.editor.createDescription'
                                        : 'roles.editor.editDescription',
                                )}
                            />
                        </div>

                        {isCreating || selectedRole !== null ? (
                            <form className="space-y-6" onSubmit={submit}>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="role-label">
                                            {i18n._('roles.fields.label')}
                                        </Label>
                                        <Input
                                            id="role-label"
                                            value={form.data.label}
                                            onChange={(event) =>
                                                form.setData(
                                                    'label',
                                                    event.target.value,
                                                )
                                            }
                                            disabled={!canEditCurrent}
                                        />
                                        <InputError
                                            message={form.errors.label}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role-name">
                                            {i18n._('roles.fields.name')}
                                        </Label>
                                        <Input
                                            id="role-name"
                                            value={form.data.name}
                                            onChange={(event) =>
                                                form.setData(
                                                    'name',
                                                    event.target.value,
                                                )
                                            }
                                            disabled={!canEditCurrent}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            {i18n._('roles.fields.nameHint')}
                                        </p>
                                        <InputError
                                            message={form.errors.name}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <Label>
                                            {i18n._('roles.fields.permissions')}
                                        </Label>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {i18n._(
                                                'roles.fields.permissionsHint',
                                            )}
                                        </p>
                                    </div>

                                    <div className="grid gap-3 md:grid-cols-2">
                                        {permissions.map((permission) => {
                                            const permissionLabel =
                                                translatePermissionLabel(
                                                    i18n,
                                                    permission.name,
                                                );
                                            const permissionDescription =
                                                translatePermissionDescription(
                                                    i18n,
                                                    permission.name,
                                                    permission.description,
                                                );

                                            return (
                                                <label
                                                    key={permission.name}
                                                    className="flex items-start gap-3 rounded-md border px-3 py-3"
                                                >
                                                    <Checkbox
                                                        checked={form.data.permissions.includes(
                                                            permission.name,
                                                        )}
                                                        onCheckedChange={(
                                                            checked,
                                                        ) =>
                                                            togglePermission(
                                                                permission.name,
                                                                checked ===
                                                                    true,
                                                            )
                                                        }
                                                        disabled={
                                                            !canEditCurrent
                                                        }
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium">
                                                            {permissionLabel}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {
                                                                permissionDescription
                                                            }
                                                        </p>
                                                        <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground/70">
                                                            {permission.name}
                                                        </p>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>

                                    <InputError
                                        message={form.errors.permissions}
                                    />
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    {canEditCurrent && (
                                        <Button
                                            type="submit"
                                            disabled={form.processing}
                                        >
                                            <Save />
                                            {i18n._(
                                                isCreating
                                                    ? 'roles.actions.saveNew'
                                                    : 'roles.actions.saveChanges',
                                            )}
                                        </Button>
                                    )}

                                    {!isCreating &&
                                        selectedRole !== null &&
                                        capabilities.delete &&
                                        (selectedRole.canDelete ? (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                disabled={form.processing}
                                                onClick={() =>
                                                    form.delete(
                                                        destroyRole.url(
                                                            selectedRole.id,
                                                        ),
                                                        {
                                                            preserveScroll: true,
                                                            onSuccess: () => {
                                                                setSelectedRoleId(
                                                                    roles.find(
                                                                        (
                                                                            role,
                                                                        ) =>
                                                                            role.id !==
                                                                            selectedRole.id,
                                                                    )?.id ??
                                                                        null,
                                                                );
                                                            },
                                                        },
                                                    )
                                                }
                                            >
                                                <Trash2 />
                                                {i18n._('roles.actions.delete')}
                                            </Button>
                                        ) : selectedRole.usersCount > 0 ? (
                                            <p className="text-sm text-muted-foreground">
                                                {i18n._(
                                                    'roles.actions.deleteBlocked',
                                                    {
                                                        count: selectedRole.usersCount,
                                                    },
                                                )}
                                            </p>
                                        ) : null)}
                                </div>

                                <InputError message={roleError} />
                            </form>
                        ) : (
                            <div className="rounded-md border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
                                {i18n._('roles.editor.empty')}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}

Roles.layout = () => ({
    breadcrumbs: [
        {
            title: () => i18n._('roles.breadcrumb'),
            href: rolesIndex.url(),
        },
    ],
});
