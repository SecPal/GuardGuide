import type { SharedPageProps } from '@inertiajs/core';
import { Link, usePage } from '@inertiajs/react';
import { useLingui } from '@lingui/react';
import {
    BookOpen,
    Building2,
    FolderGit2,
    LayoutGrid,
    Network,
    ShieldCheck,
    MapPinned,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as customersIndex } from '@/routes/customers';
import { index as organizationalUnitsIndex } from '@/routes/organizational-units';
import { index as sitesIndex } from '@/routes/sites';
import { redirect as userAssignmentsRedirect } from '@/routes/user-assignments';
import { redirect as userRolesRedirect } from '@/routes/user-roles';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { i18n } = useLingui();
    const { auth } = usePage<SharedPageProps>().props;

    const mainNavItems: NavItem[] = [
        {
            title: i18n._('sidebar.dashboard'),
            href: dashboard(),
            icon: LayoutGrid,
        },
        ...(auth.can.organizationalUnits.view
            ? [
                  {
                      title: i18n._('sidebar.organizationalUnits'),
                      href: organizationalUnitsIndex(),
                      icon: Network,
                  },
              ]
            : []),
        ...(auth.can.customers.view
            ? [
                  {
                      title: i18n._('sidebar.customers'),
                      href: customersIndex(),
                      icon: Building2,
                  },
              ]
            : []),
        ...(auth.can.sites.view
            ? [
                  {
                      title: i18n._('sidebar.sites'),
                      href: sitesIndex(),
                      icon: MapPinned,
                  },
              ]
            : []),
        ...(auth.can.userAssignments.view
            ? [
                  {
                      title: i18n._('sidebar.userAssignments'),
                      href: userAssignmentsRedirect(),
                      icon: Users,
                  },
              ]
            : []),
        ...(auth.can.userRoles.view
            ? [
                  {
                      title: i18n._('sidebar.userRoles'),
                      href: userRolesRedirect(),
                      icon: ShieldCheck,
                  },
              ]
            : []),
    ];

    const footerNavItems: NavItem[] = [
        {
            title: i18n._('sidebar.repository'),
            href: 'https://github.com/laravel/react-starter-kit',
            icon: FolderGit2,
        },
        {
            title: i18n._('sidebar.documentation'),
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
