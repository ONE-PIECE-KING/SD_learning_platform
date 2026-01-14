import { Outlet } from "react-router-dom";
import { MemberHeader } from "@/components/member/MemberHeader";
import { MemberSidebar } from "@/components/member/MemberSidebar";
import { MemberRoleProvider } from "@/contexts/MemberRoleContext";

export function MemberLayout() {
  return (
    <MemberRoleProvider>
      <div className="min-h-screen bg-background">
        <MemberHeader />
        <div className="flex">
          <MemberSidebar />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </MemberRoleProvider>
  );
}
