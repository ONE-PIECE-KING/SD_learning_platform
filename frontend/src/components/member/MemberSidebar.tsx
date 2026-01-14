import { NavLink, useLocation } from "react-router-dom";
import { 
  BookOpen, 
  Receipt, 
  Users, 
  Settings, 
  User, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Upload,
  BarChart3,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMemberRole, MemberRole } from "@/contexts/MemberRoleContext";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: MemberRole[]; // Which roles can see this item
}

const navItems: NavItem[] = [
  // Student items
  { title: "我的課程", url: "/member/my-courses", icon: BookOpen, roles: ["student"] },
  { title: "購課記錄", url: "/member/history", icon: Receipt, roles: ["student"] },
  
  // Teacher items
  { title: "課程上架", url: "/member/course-upload", icon: Upload, roles: ["teacher"] },
  { title: "統計分析", url: "/member/statistics", icon: BarChart3, roles: ["teacher"] },
  { title: "老師聯絡簿", url: "/member/teacher-contact", icon: MessageSquare, roles: ["teacher"] },
  
  // Shared items
  { title: "一對一諮詢", url: "/member/consult", icon: Users, roles: ["student", "teacher"] },
  { title: "個人簡介", url: "/member/profile", icon: User, roles: ["student", "teacher"] },
  { title: "資源分享", url: "/member/resources", icon: Share2, roles: ["student", "teacher"] },
  { title: "設定", url: "/member/settings", icon: Settings, roles: ["student", "teacher"] },
];

export function MemberSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { role, toggleRole, isStudent, isTeacher } = useMemberRole();

  // Filter nav items based on current role
  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen bg-card border-r border-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo area with role indicator */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-foreground">會員中心</span>
            <Badge variant={isTeacher ? "default" : "secondary"} className="text-xs">
              {isTeacher ? "老師" : "學生"}
            </Badge>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Role Toggle (for demo purposes) */}
      {!collapsed && (
        <div className="p-4 border-b border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleRole}
            className="w-full text-xs"
          >
            切換為{isStudent ? "老師" : "學生"}模式
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + "/");
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* CTA Section */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-4">
            {isStudent ? (
              <>
                <p className="text-sm font-medium text-foreground mb-2">需要幫助？</p>
                <p className="text-xs text-muted-foreground mb-3">預約一對一諮詢，解決學習疑問</p>
                <Button variant="cta" size="sm" className="w-full" asChild>
                  <NavLink to="/member/consult">立即預約</NavLink>
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground mb-2">開始教學</p>
                <p className="text-xs text-muted-foreground mb-3">上架你的第一堂課程</p>
                <Button variant="cta" size="sm" className="w-full" asChild>
                  <NavLink to="/member/course-upload">上架課程</NavLink>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
