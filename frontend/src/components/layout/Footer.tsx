import { Link } from "react-router-dom";
import { Mail, Phone, Facebook, Linkedin, Youtube, Github } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    courses: [
      { label: "Python 入門", href: "/courses/python-intro" },
      { label: "機器學習實戰", href: "/courses/ml-practice" },
      { label: "資料視覺化", href: "/courses/data-viz" },
      { label: "SQL 資料庫", href: "/courses/sql-database" },
    ],
    resources: [
      { label: "技術新訊", href: "/resources/tech-news" },
      { label: "知識分享", href: "/resources/knowledge" },
      { label: "轉職案例", href: "/resources/career-cases" },
      { label: "提示詞工程", href: "/resources/prompt-engineering" },
    ],
    company: [
      { label: "關於我們", href: "/about" },
      { label: "成為講師", href: "/become-teacher" },
      { label: "合作夥伴", href: "/partners" },
      { label: "隱私政策", href: "/privacy" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
    { icon: Github, href: "https://github.com", label: "GitHub" },
  ];

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground">
                <span className="text-xl font-bold text-primary">桑</span>
              </div>
              <span className="text-xl font-bold">桑尼資料科學</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-primary-foreground/70">
              從零基礎到實戰應用，我們提供最完整的資料科學學習路徑。
              讓你掌握 Python、機器學習、AI 等核心技能，開啟數據職涯新篇章。
            </p>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-2 text-sm">
              <a href="mailto:hello@sunnyds.com" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Mail className="h-4 w-4" />
                hello@sunnyds.com
              </a>
              <a href="tel:+886-2-1234-5678" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Phone className="h-4 w-4" />
                +886-2-1234-5678
              </a>
            </div>
          </div>

          {/* Courses Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              熱門課程
            </h4>
            <ul className="space-y-2">
              {footerLinks.courses.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              資源分享
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              關於我們
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 md:flex-row">
          <p className="text-sm text-primary-foreground/60">
            © {currentYear} 桑尼資料科學. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground/70 transition-colors hover:bg-primary-foreground/20 hover:text-primary-foreground"
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
