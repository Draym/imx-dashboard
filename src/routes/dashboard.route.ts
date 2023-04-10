import React from "react"
import RoutePath from "./route.interface"
import Path from "./path.enum"

const DefaultPage = React.lazy(() => import("../app/dashboard/default/default.page"))
const CollectionsPage = React.lazy(() => import("../app/dashboard/collections/collections.page"))
const CollectionPage = React.lazy(() => import("../app/dashboard/collections/collection.page"))
const ProjectsPage = React.lazy(() => import("../app/dashboard/projects/projects.page"))

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
    }
]

export default routes