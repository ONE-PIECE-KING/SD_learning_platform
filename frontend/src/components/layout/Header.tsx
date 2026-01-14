import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "首頁" },
    { href: "/courses", label: "課程總覽" },
    { href: "/consult", label: "一對一諮詢" },
    { href: "/resources", label: "資源分享" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">桑</span>
          </div>
          <span className="hidden text-lg font-bold text-foreground sm:inline-block">
            桑尼資料科學
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              <Button
                variant="nav"
                size="sm"
                className={isActive(link.href) ? "bg-secondary text-secondary-foreground" : ""}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="icon" aria-label="搜尋">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="購物車" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cta text-xs text-cta-foreground">
              0
            </span>
          </Button>
          <Button variant="outline" size="sm">
            登入
          </Button>
          <Button variant="cta" size="sm">
            免費註冊
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="選單"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container flex flex-col gap-2 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  variant="nav"
                  className={`w-full justify-start ${isActive(link.href) ? "bg-secondary" : ""}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              <Button variant="outline" className="w-full">
                登入
              </Button>
              <Button variant="cta" className="w-full">
                免費註冊
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
