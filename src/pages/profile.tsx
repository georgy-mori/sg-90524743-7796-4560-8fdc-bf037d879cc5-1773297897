import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera,
  Save,
  Shield,
  Bell,
  Lock,
  Loader2
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const router = useRouter();
  const { toast } = useToast();
  const { tab = "profile" } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    bio: ""
  });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }
      setUser(currentUser);
      setFormData({
        full_name: currentUser.full_name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        location: currentUser.location || "",
        bio: currentUser.bio || ""
      });
    } catch (error) {
      console.error("Load profile error:", error);
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await authService.updateProfile(formData);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      await loadProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.new_password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      await authService.updatePassword(passwordData.new_password);
      toast({
        title: "Success",
        description: "Password changed successfully"
      });
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: ""
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile Information", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: Lock }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEO title="Profile Settings" description="Manage your account settings" />
      
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
            <p className="text-slate-600 mt-1">Manage your profile and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <Card className="p-4 h-fit">
              <nav className="space-y-1">
                {tabs.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => router.push(`/profile?tab=${item.id}`)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      tab === item.id
                        ? "bg-primary text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </Card>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {tab === "profile" && (
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {user?.full_name?.charAt(0) || "U"}
                        </span>
                      </div>
                      <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg hover:bg-slate-50">
                        <Camera className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{user?.full_name}</h2>
                      <p className="text-slate-600">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full capitalize">
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <div className="relative mt-2">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <Input
                            id="full_name"
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative mt-2">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            disabled
                            className="pl-10 bg-slate-50"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative mt-2">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="location">Location</Label>
                        <div className="relative mt-2">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <Input
                            id="location"
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        className="mt-2"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              {tab === "security" && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Change Password</h2>
                  
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <Label htmlFor="current_password">Current Password</Label>
                      <div className="relative mt-2">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="current_password"
                          type="password"
                          value={passwordData.current_password}
                          onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="new_password">New Password</Label>
                      <div className="relative mt-2">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="new_password"
                          type="password"
                          value={passwordData.new_password}
                          onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirm_password">Confirm New Password</Label>
                      <div className="relative mt-2">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="confirm_password"
                          type="password"
                          value={passwordData.confirm_password}
                          onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              {tab === "notifications" && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Notification Preferences</h2>
                  <p className="text-slate-600">Configure how you receive notifications</p>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Email Notifications</p>
                        <p className="text-sm text-slate-600">Receive booking updates via email</p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">SMS Notifications</p>
                        <p className="text-sm text-slate-600">Get important alerts via SMS</p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                  </div>
                </Card>
              )}

              {tab === "settings" && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Account Settings</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="font-medium text-slate-900 mb-2">Account Status</p>
                      <p className="text-sm text-slate-600 mb-3">
                        Your account is currently <span className="text-green-600 font-medium">Active</span>
                      </p>
                      {user?.role === "vendor" && (
                        <p className="text-sm text-slate-600">
                          KYC Status: <span className="text-primary font-medium capitalize">{user.kyc_status}</span>
                        </p>
                      )}
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="font-medium text-red-900 mb-2">Danger Zone</p>
                      <p className="text-sm text-red-700 mb-3">
                        Permanently delete your account and all associated data
                      </p>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}