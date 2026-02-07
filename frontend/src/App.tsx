import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import NotFound from "./pages/NotFound";
import { MemberLayout } from "./layouts/MemberLayout";

// Member Pages
import MemberMyCourses from "./pages/member/MyCourses";
import MemberCoursePlayer from "./pages/member/CoursePlayer";
import MemberPurchaseHistory from "./pages/member/PurchaseHistory";
import MemberConsultation from "./pages/member/Consultation";
import MemberSettings from "./pages/member/Settings";
import MemberProfile from "./pages/member/Profile";
import MemberResources from "./pages/member/Resources";
import CourseUpload from "./pages/member/CourseUpload";
import Statistics from "./pages/member/Statistics";
import TeacherContact from "./pages/member/TeacherContact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/courses" element={<Courses />} />

          {/* Member Routes (supports both student and teacher) */}
          <Route path="/member" element={<MemberLayout />}>
            {/* Shared routes */}
            <Route path="my-courses" element={<MemberMyCourses />} />
            <Route path="course/:courseId" element={<MemberCoursePlayer />} />
            <Route path="history" element={<MemberPurchaseHistory />} />
            <Route path="consult" element={<MemberConsultation />} />
            <Route path="settings" element={<MemberSettings />} />
            <Route path="profile" element={<MemberProfile />} />
            <Route path="resources" element={<MemberResources />} />

            {/* Teacher-only routes */}
            <Route path="course-upload" element={<CourseUpload />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="teacher-contact" element={<TeacherContact />} />
          </Route>

          {/* Redirect old student routes to member routes */}
          <Route path="/student/*" element={<Navigate to="/member/my-courses" replace />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
