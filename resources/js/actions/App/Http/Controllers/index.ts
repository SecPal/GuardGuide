import OrganizationalUnitController from './OrganizationalUnitController'
import UserAssignmentController from './UserAssignmentController'
import UserRoleController from './UserRoleController'
import Settings from './Settings'

const Controllers = {
    OrganizationalUnitController: Object.assign(OrganizationalUnitController, OrganizationalUnitController),
    UserAssignmentController: Object.assign(UserAssignmentController, UserAssignmentController),
    UserRoleController: Object.assign(UserRoleController, UserRoleController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers