import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Menu, X, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

interface CourseResult {
  id: string;
  title: string;
  thumbnail_url?: string;
  price: number;
}

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CourseResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: "/", label: "首頁" },
    { href: "/courses", label: "課程總覽" },
    { href: "/consult", label: "一對一諮詢" },
    { href: "/resources", label: "資源分享" },
  ];

  const isActive = (href: string) => location.pathname === href;

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedSearch.trim()) {
        setSearchResults([]);
        setIsDropdownOpen(false);
        return;
      }

      setIsSearchLoading(true);
      setIsDropdownOpen(true);
      try {
        const response = await fetch(`http://localhost:8000/api/v1/courses?search=${encodeURIComponent(debouncedSearch)}&limit=5`);
        if (response.ok) {
          const data = await response.json();
          // Backend returns { items: [], total: ... } based on our implementation
          setSearchResults(data.items || []);
        }
      } catch (error) {
        console.error("搜尋發生錯誤:", error);
      } finally {
        setIsSearchLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setIsDropdownOpen(false);
    }
  };

  const handleSelectCourse = (courseId: string) => {
    navigate(`/member/course/${courseId}`);
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">桑</span>
          </div>
          <span className="hidden text-lg font-bold text-foreground sm:inline-block">
            桑尼資料科學
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
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

        {/* Search Bar - Desktop */}
        <div className="relative hidden max-w-sm flex-1 md:block" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜尋課程..."
              className="w-full bg-secondary/50 pl-9 focus-visible:bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setIsDropdownOpen(true)}
            />
          </form>

          {/* Search Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 w-full overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-lg animate-in fade-in zoom-in-95">
              {isSearchLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="py-2">
                  <div className="px-3 py-1 text-xs font-medium text-muted-foreground">課程建議</div>
                  {searchResults.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => handleSelectCourse(course.id)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-accent"
                    >
                      <div className="h-10 w-16 shrink-0 overflow-hidden rounded bg-secondary">
                        {course.thumbnail_url ? (
                          <img src={course.thumbnail_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-primary/10">
                            <Search className="h-4 w-4 text-primary/40" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="truncate text-sm font-medium">{course.title}</div>
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-border p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs text-primary"
                      onClick={handleSearchSubmit}
                    >
                      查看所有 "{searchQuery}" 的結果
                    </Button>
                  </div>
                </div>
              ) : searchQuery ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  找不到與 "{searchQuery}" 相關的課程
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
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
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" aria-label="搜尋">
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="選單"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container flex flex-col gap-2 py-4">
            <div className="mb-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="搜尋課程..."
                  className="w-full bg-secondary/50 pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
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
