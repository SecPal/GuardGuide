import OrganizationalUnitController from './OrganizationalUnitController'
import UserAssignmentController from './UserAssignmentController'
import Settings from './Settings'

const Controllers = {
    OrganizationalUnitController: Object.assign(OrganizationalUnitController, OrganizationalUnitController),
    UserAssignmentController: Object.assign(UserAssignmentController, UserAssignmentController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers