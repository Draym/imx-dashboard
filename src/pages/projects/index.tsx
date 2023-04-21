import {ImxContext} from "@/clients/imx/imx-sdk"
import RequireImx from "@/components/wallet/require-imx"

export interface ProjectsPageProps {
    context: ImxContext
}

function ProjectsPage(props: ProjectsPageProps) {
    const {address} = props.context
    return <div>Projects page: welcome {address}</div>
}

const page = () => <RequireImx target={(context: ImxContext) => <ProjectsPage context={context}/>}/>
export default page