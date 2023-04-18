import React from "react"
import RoutePath from "./route.interface"
import Path from "./path.enum"

const DefaultPage = React.lazy(() => import("../app/dashboard/default/default.page"))
const CollectionsPage = React.lazy(() => import("../app/dashboard/collections/collections.page"))
const CollectionPage = React.lazy(() => import("../app/dashboard/collections/collection.page"))
const ProjectsPage = React.lazy(() => import("../app/dashboard/projects/projects.page"))
const DeployContractPage = React.lazy(() => import("../app/dashboard/contracts/deploy/page"))
const DeployCustomContractPage = React.lazy(() => import("../app/dashboard/contracts/deploy/custom.page"))
const DeployIMXContractPage = React.lazy(() => import("../app/dashboard/contracts/deploy/imx.page"))

const routes: RoutePath[] = [
    {
        name: 'Home',
        path: Path.HOME,
        component: DefaultPage,
        restrictedBy: null
    },
    {
        name: 'Projects',
        path: Path.APP_PROJECTS,
        component: ProjectsPage,
        restrictedBy: null
    },
    {
        name: 'Collections',
        path: Path.APP_COLLECTIONS,
        component: CollectionsPage,
        restrictedBy: null
    },
    {
        name: 'Collection',
        path: Path.APP_COLLECTIONS_Details,
        component: CollectionPage,
        restrictedBy: null
    },
    {
        name: 'Deploy Contract',
        path: Path.APP_CONTRACT_DEPLOY,
        component: DeployContractPage,
        restrictedBy: null
    },
    {
        name: 'Custom Contract',
        path: Path.APP_CONTRACT_DEPLOY_Custom,
        component: DeployCustomContractPage,
        restrictedBy: null
    },
    {
        name: 'IMX Contract',
        path: Path.APP_CONTRACT_DEPLOY_Imx,
        component: DeployIMXContractPage,
        restrictedBy: null
    }
]

export default routes