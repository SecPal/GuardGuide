import OrganizationalUnitController from './OrganizationalUnitController'
import CustomerController from './CustomerController'
import UserAssignmentController from './UserAssignmentController'
import UserRoleController from './UserRoleController'
import Settings from './Settings'

const Controllers = {
    OrganizationalUnitController: Object.assign(OrganizationalUnitController, OrganizationalUnitController),
    CustomerController: Object.assign(CustomerController, CustomerController),
    UserAssignmentController: Object.assign(UserAssignmentController, UserAssignmentController),
    UserRoleController: Object.assign(UserRoleController, UserRoleController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers