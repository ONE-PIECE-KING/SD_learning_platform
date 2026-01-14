import { Link } from "react-router-dom";
import { ShoppingCart, LogOut, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navLinks = [
  { label: "首頁", href: "/" },
  { label: "課程總覽", href: "/courses" },
  { label: "一對一諮詢", href: "/consult" },
  { label: "資源分享", href: "/resources" },
];

export function StudentHeader() {
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">桑</span>
          </div>
          <span className="font-bold text-foreground hidden sm:block">桑尼資料科學</span>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden lg:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜尋課程..."
                className="w-48 pl-9 h-9 bg-muted/50"
              />
            </div>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-cta text-cta-foreground text-[10px] rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-cta text-cta-foreground text-[10px] rounded-full flex items-center justify-center">
                2
              </span>
            </Link>
          </Button>

          {/* User Avatar & Logout */}
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">王</span>
            </div>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
