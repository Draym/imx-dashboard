import Dashboard from "../page"

function DefaultPage() {

    return <div>Welcome</div>
}

const page =() => <Dashboard content={<DefaultPage/>}/>
export default page