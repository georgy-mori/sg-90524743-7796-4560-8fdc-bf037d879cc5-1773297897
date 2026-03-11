import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  ShieldCheck,
  Camera,
  Save,
  Lock,
  Bell,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock user data
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+234 800 123 4567",
    address: "123 Victoria Island, Lagos",
    city: "Lagos",
    state: "Lagos State",
    country: "Nigeria",
    bio: "Equipment rental enthusiast with 5+ years of experience.",
    company: "Doe Equipment Services",
    joinDate: "January 2024",
    isVerified: true,
    role: "vendor",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <>
      <SEO
        title="My Profile - EquipRent"
        description="Manage your EquipRent profile, security settings, and preferences."
      />
      <div className="min-h-screen flex flex-col">
        <Header isAuthenticated userRole={user.role as "vendor"} />
        
        <main className="flex-1 bg-muted/30 py-8">
          <div className="container-wide px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="font-heading font-bold text-3xl mb-2">My Profile</h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>

            {/* Success Alert */}
            {showSuccess && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Profile updated successfully!
                </AlertDescription>
              </Alert>
            )}

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <Card className="p-6">
                  {/* Avatar Section */}
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-2xl font-bold">
                          {user.firstName[0]}{user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <h3 className="font-heading font-bold text-xl">
                        {user.firstName} {user.lastName}
                      </h3>
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant={user.role === "vendor" ? "default" : "secondary"}>
                          {user.role === "vendor" ? "Vendor" : "Renter"}
                        </Badge>
                        {user.isVerified && (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Member since {user.joinDate}
                      </p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Profile Completion</span>
                      <span className="font-semibold">85%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[85%]" />
                    </div>
                  </div>
                </Card>
              </aside>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <Card className="p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-4 lg:w-[500px]">
                      <TabsTrigger value="personal">Personal</TabsTrigger>
                      <TabsTrigger value="security">Security</TabsTrigger>
                      <TabsTrigger value="notifications">Notifications</TabsTrigger>
                      <TabsTrigger value="billing">Billing</TabsTrigger>
                    </TabsList>

                    {/* Personal Information Tab */}
                    <TabsContent value="personal" className="space-y-6 mt-6">
                      <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                              <Input
                                id="firstName"
                                defaultValue={user.firstName}
                                className="pl-10"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              defaultValue={user.lastName}
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                              <Input
                                id="email"
                                type="email"
                                defaultValue={user.email}
                                className="pl-10"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                              <Input
                                id="phone"
                                defaultValue={user.phone}
                                className="pl-10"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            defaultValue={user.bio}
                            rows={3}
                            placeholder="Tell us about yourself..."
                          />
                        </div>

                        {user.role === "vendor" && (
                          <div className="space-y-2">
                            <Label htmlFor="company">Company Name</Label>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                              <Input
                                id="company"
                                defaultValue={user.company}
                                className="pl-10"
                              />
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                            <Input
                              id="address"
                              defaultValue={user.address}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              defaultValue={user.city}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              defaultValue={user.state}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              defaultValue={user.country}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3">
                          <Button type="button" variant="outline">
                            Cancel
                          </Button>
                          <Button type="submit" className="btn-action" disabled={isSaving}>
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </form>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="space-y-6 mt-6">
                      <div className="space-y-4">
                        <h3 className="font-heading font-semibold text-lg">Change Password</h3>
                        
                        <form onSubmit={handleSave} className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                              <Input
                                id="currentPassword"
                                type="password"
                                className="pl-10"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                              <Input
                                id="newPassword"
                                type="password"
                                className="pl-10"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                              <Input
                                id="confirmNewPassword"
                                type="password"
                                className="pl-10"
                              />
                            </div>
                          </div>

                          <Button type="submit" className="btn-action">
                            Update Password
                          </Button>
                        </form>

                        <div className="pt-6 border-t space-y-4">
                          <h3 className="font-heading font-semibold text-lg">Two-Factor Authentication</h3>
                          <Alert>
                            <ShieldCheck className="h-4 w-4" />
                            <AlertDescription>
                              Add an extra layer of security to your account
                            </AlertDescription>
                          </Alert>
                          <Button variant="outline">
                            Enable 2FA
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="space-y-6 mt-6">
                      <div className="space-y-4">
                        <h3 className="font-heading font-semibold text-lg">Email Notifications</h3>
                        
                        <div className="space-y-4">
                          {[
                            { label: "Booking Updates", description: "Get notified about booking confirmations and updates" },
                            { label: "Payment Notifications", description: "Receive alerts for successful payments and payouts" },
                            { label: "New Messages", description: "Get notified when you receive new messages" },
                            { label: "Marketing Emails", description: "Receive news, updates, and promotional offers" },
                            { label: "Security Alerts", description: "Important security notifications about your account" },
                          ].map((item, index) => (
                            <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                              <div className="space-y-1">
                                <div className="font-medium">{item.label}</div>
                                <div className="text-sm text-muted-foreground">{item.description}</div>
                              </div>
                              <Button variant="outline" size="sm">
                                Enabled
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Billing Tab */}
                    <TabsContent value="billing" className="space-y-6 mt-6">
                      <div className="space-y-4">
                        <h3 className="font-heading font-semibold text-lg">Payment Methods</h3>
                        
                        <Alert>
                          <CreditCard className="h-4 w-4" />
                          <AlertDescription>
                            No payment methods added yet. Add a card for faster checkouts.
                          </AlertDescription>
                        </Alert>

                        <Button className="btn-action">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Add Payment Method
                        </Button>

                        <div className="pt-6 border-t space-y-4">
                          <h3 className="font-heading font-semibold text-lg">Billing History</h3>
                          <p className="text-sm text-muted-foreground">
                            View and download your billing history and invoices
                          </p>
                          <Button variant="outline">
                            View Billing History
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}