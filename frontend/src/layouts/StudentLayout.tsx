import { Outlet } from "react-router-dom";
import { StudentHeader } from "@/components/student/StudentHeader";
import { StudentSidebar } from "@/components/student/StudentSidebar";

export function StudentLayout() {
  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />
      <div className="flex">
        <StudentSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
