import { Link } from "react-router-dom";
import { ShoppingCart, LogOut, Home, BookOpen, Users, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "首頁", href: "/", icon: Home },
  { label: "課程總覽", href: "/courses", icon: BookOpen },
  { label: "一對一諮詢", href: "/consult", icon: Users },
  { label: "資源分享", href: "/resources", icon: Share2 },
];

export function MemberHeader() {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">桑</span>
          </div>
          <span className="font-bold text-lg text-foreground hidden md:block">桑尼資料科學</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Button key={link.href} variant="ghost" size="sm" asChild>
              <Link to={link.href} className="flex items-center gap-2">
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">登出</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
