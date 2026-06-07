import { Head, router, useForm } from '@inertiajs/react';
import { i18n } from '@lingui/core';
import { useLingui } from '@lingui/react';
import { Plus, ShieldCheck, Trash2, UserRound } from 'lucide-react';
import type { FormEvent } from 'react';
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
import { translateRoleLabel } from '@/lib/access-i18n';
import {
    destroy as destroyUserRole,
    index as userRolesIndex,
    redirect as userRolesRedirect,
    store as storeUserRole,
} from '@/routes/user-roles';

const noSelectionValue = '__none__';

type UserOption = {
    id: number;
    name: string;
    email: string;
};

type RoleOption = {
    id: number;
    name: string;
    label: string;
};

type PageProps = {
    selectedUser: UserOption;
    users: UserOption[];
    assignments: {
        roles: RoleOption[];
    };
    options: {
        roles: RoleOption[];
    };
    canManageRoles: boolean;
};

export default function UserRoles({
    selectedUser,
    users,
    assignments,
    options,
    canManageRoles,
}: PageProps) {
    const { i18n } = useLingui();
    const assignedRoleIds = new Set(assignments.roles.map((role) => role.id));
    const availableRoles = options.roles.filter(
        (role) => !assignedRoleIds.has(role.id),
    );

    return (
        <>
            <Head title={i18n._('userRoles.metaTitle')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title={i18n._('userRoles.heading.title')}
                        description={i18n._('userRoles.heading.description')}
                    />

                    <div className="w-full sm:w-80">
                        <Select
                            value={String(selectedUser.id)}
                            onValueChange={(value) =>
                                router.visit(userRolesIndex.url(Number(value)))
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

                <section className="rounded-md border bg-background p-4">
                    <div className="mb-4 flex items-center gap-2">
                        <ShieldCheck className="size-4" />
                        <Heading
                            variant="small"
                            title={i18n._('userRoles.roles.title')}
                        />
                    </div>

                    {canManageRoles && (
                        <div className="mb-5">
                            <AddRoleForm
                                userId={selectedUser.id}
                                options={availableRoles}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        {assignments.roles.length > 0 ? (
                            assignments.roles.map((role) => (
                                <RoleRow
                                    key={role.id}
                                    role={role}
                                    userId={selectedUser.id}
                                    canManageRoles={canManageRoles}
                                />
                            ))
                        ) : (
                            <div className="rounded-md border border-dashed px-3 py-5 text-center text-sm text-muted-foreground">
                                {i18n._('userRoles.roles.empty')}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}

function AddRoleForm({
    userId,
    options,
}: {
    userId: number;
    options: RoleOption[];
}) {
    const { i18n } = useLingui();
    const form = useForm({
        role_id: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post(storeUserRole.url(userId), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    return (
        <form className="max-w-xl space-y-3" onSubmit={submit}>
            <Select
                value={form.data.role_id || noSelectionValue}
                onValueChange={(value) =>
                    form.setData(
                        'role_id',
                        value === noSelectionValue ? '' : value,
                    )
                }
                disabled={options.length === 0}
            >
                <SelectTrigger className="w-full">
                    <SelectValue
                        placeholder={i18n._(
                            'userRoles.roles.selectPlaceholder',
                        )}
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={noSelectionValue} disabled>
                        {i18n._('userRoles.roles.selectPlaceholder')}
                    </SelectItem>
                    {options.map((role) => (
                        <SelectItem key={role.id} value={String(role.id)}>
                            {translateRoleLabel(i18n, role.name, role.label)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <InputError message={form.errors.role_id} />
            <Button
                type="submit"
                disabled={form.processing || !form.data.role_id}
            >
                <Plus />
                {i18n._('userRoles.roles.add')}
            </Button>
        </form>
    );
}

function RoleRow({
    role,
    userId,
    canManageRoles,
}: {
    role: RoleOption;
    userId: number;
    canManageRoles: boolean;
}) {
    const { i18n } = useLingui();
    const form = useForm({});
    const displayLabel = translateRoleLabel(i18n, role.name, role.label);

    return (
        <div className="flex min-h-12 items-center gap-3 rounded-md border px-3 py-2">
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{displayLabel}</p>
                <p className="truncate text-xs text-muted-foreground">
                    {role.name}
                </p>
            </div>
            {canManageRoles && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={form.processing}
                    onClick={() =>
                        form.delete(
                            destroyUserRole.url({
                                user: userId,
                                role: role.id,
                            }),
                            { preserveScroll: true },
                        )
                    }
                    aria-label={i18n._('userRoles.roles.removeAriaLabel', {
                        role: displayLabel,
                    })}
                >
                    <Trash2 />
                </Button>
            )}
        </div>
    );
}

UserRoles.layout = () => ({
    breadcrumbs: [
        {
            title: () => i18n._('userRoles.breadcrumb'),
            href: userRolesRedirect.url(),
        },
    ],
});
