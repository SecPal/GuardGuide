import OrganizationalUnitController from './OrganizationalUnitController'
import CustomerController from './CustomerController'
import SiteController from './SiteController'
import UserAssignmentController from './UserAssignmentController'
import UserRoleController from './UserRoleController'
import RoleManagementController from './RoleManagementController'
import Settings from './Settings'

const Controllers = {
    OrganizationalUnitController: Object.assign(OrganizationalUnitController, OrganizationalUnitController),
    CustomerController: Object.assign(CustomerController, CustomerController),
    SiteController: Object.assign(SiteController, SiteController),
    UserAssignmentController: Object.assign(UserAssignmentController, UserAssignmentController),
    UserRoleController: Object.assign(UserRoleController, UserRoleController),
    RoleManagementController: Object.assign(RoleManagementController, RoleManagementController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers