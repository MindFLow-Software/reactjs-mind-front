import { Header } from "@/components/header"
import { PopupManager } from "@/components/popup-manager"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

export function AppLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Header />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mt-6">
                    <Outlet />
                </div>
                <PopupManager />
            </SidebarInset>
        </SidebarProvider>
    )
}
