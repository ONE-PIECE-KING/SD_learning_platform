import { NavLink, useLocation } from "react-router-dom";
import { BookOpen, Receipt, Users, Settings, User, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { title: "我的課程", url: "/student/my-courses", icon: BookOpen },
  { title: "購課記錄", url: "/student/history", icon: Receipt },
  { title: "一對一諮詢", url: "/student/consult", icon: Users },
  { title: "設定", url: "/student/settings", icon: Settings },
  { title: "個人簡介", url: "/student/profile", icon: User },
  { title: "資源分享", url: "/student/resources", icon: Share2 },
];

export function StudentSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen bg-card border-r border-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo area */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <span className="font-bold text-lg text-foreground">學生中心</span>
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

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
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
            <p className="text-sm font-medium text-foreground mb-2">需要幫助？</p>
            <p className="text-xs text-muted-foreground mb-3">預約一對一諮詢，解決學習疑問</p>
            <Button variant="cta" size="sm" className="w-full" asChild>
              <NavLink to="/student/consult">立即預約</NavLink>
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}
