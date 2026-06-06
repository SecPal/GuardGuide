import OrganizationalUnitController from './OrganizationalUnitController'
import Settings from './Settings'

const Controllers = {
    OrganizationalUnitController: Object.assign(OrganizationalUnitController, OrganizationalUnitController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers