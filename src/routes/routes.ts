import React from "react"
import RoutePath from "./route.interface"
import routesDashboard from "./dashboard.route"

const Page404 = React.lazy(() => import("../app/errors/404"))

const routes: RoutePath[] = [
    {name: 'Page 404', path: '/404', component: Page404, restrictedBy: null},
    ...routesDashboard,
]

export default routes