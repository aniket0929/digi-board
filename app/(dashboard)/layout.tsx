import { Navbar } from "./_component/navbar";
import { OrganisationSidebar } from "./_component/organisation-sidebar";
import { Sidebar } from "./_component/sidebar";

interface DashboardLayoutProps{
    children:React.ReactNode;
}

const DashboardLayout=({
    children,
}:DashboardLayoutProps)=>{
    return (
        <main className="h-full ">
            <Sidebar/>
            <div className="pl-[60px] h-full">
                <div className="flex gap-x-3 h-full">
                    <OrganisationSidebar/>
                    <div className="h-full flex-1">
                        {/* add a navbar here  */}
                        <Navbar/>
                    {children}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default DashboardLayout;