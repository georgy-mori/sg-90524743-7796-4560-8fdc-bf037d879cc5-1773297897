import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Bell, 
  User,
  Settings,
  LogOut,
  Heart,
  Calendar,
  Wallet,
  Package,
  MessageSquare,
  BarChart3,
  Users,
  Shield
} from "lucide-react";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const router = useRouter();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Load user error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out"
      });
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to logout",
        variant: "destructive"
      });
    }
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "vendor":
        return "/vendor/dashboard";
      case "renter":
        return "/renter/dashboard";
      default:
        return "/";
    }
  };

  const getNavLinks = () => {
    if (!user) {
      return [
        { label: "Browse Equipment", href: "/browse" },
        { label: "How It Works", href: "/#how-it-works" },
        { label: "For Vendors", href: "/#for-vendors" }
      ];
    }

    switch (user.role) {
      case "admin":
        return [
          { label: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
          { label: "Users", href: "/admin/users", icon: Users },
          { label: "Listings", href: "/admin/listings", icon: Package },
          { label: "Bookings", href: "/admin/bookings", icon: Calendar }
        ];
      case "vendor":
        return [
          { label: "Dashboard", href: "/vendor/dashboard", icon: BarChart3 },
          { label: "Listings", href: "/vendor/listings", icon: Package },
          { label: "Bookings", href: "/vendor/bookings", icon: Calendar },
          { label: "Wallet", href: "/vendor/wallet", icon: Wallet },
          { label: "Analytics", href: "/vendor/analytics", icon: BarChart3 },
          { label: "Messages", href: "/vendor/messages", icon: MessageSquare }
        ];
      case "renter":
        return [
          { label: "Dashboard", href: "/renter/dashboard", icon: BarChart3 },
          { label: "Browse", href: "/browse", icon: Package },
          { label: "My Bookings", href: "/renter/bookings", icon: Calendar },
          { label: "Favorites", href: "/renter/favorites", icon: Heart },
          { label: "Wallet", href: "/renter/wallet", icon: Wallet },
          { label: "Messages", href: "/renter/messages", icon: MessageSquare }
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={user ? getDashboardLink() : "/"} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">EquipRent</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
            ) : user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-slate-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.full_name?.charAt(0) || "U"}
                      </span>
                    </div>
                  </button>

                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-slate-200">
                          <p className="font-medium text-slate-900">{user.full_name}</p>
                          <p className="text-sm text-slate-600">{user.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full capitalize">
                            {user.role}
                          </span>
                        </div>

                        <div className="py-1">
                          <Link
                            href="/profile"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </Link>
                          <Link
                            href="/profile?tab=settings"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </Link>
                        </div>

                        <div className="border-t border-slate-200 py-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-red-600 w-full"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => router.push("/auth/login")}>
                  Login
                </Button>
                <Button onClick={() => router.push("/auth/register")}>
                  Get Started
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-slate-600" />
              ) : (
                <Menu className="w-6 h-6 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-lg text-slate-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}