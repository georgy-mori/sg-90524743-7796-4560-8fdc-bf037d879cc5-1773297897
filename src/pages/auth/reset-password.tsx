import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { authService } from "@/services/authService";

export default function ResetPasswordPage() {
  const router = useRouter();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    
    setIsLoading(true);
    
    try {
      await authService.updatePassword(password);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. The link might have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6) return { strength: 33, label: "Weak", color: "bg-red-500" };
    if (password.length < 10) return { strength: 66, label: "Medium", color: "bg-orange-500" };
    return { strength: 100, label: "Strong", color: "bg-green-500" };
  };

  const strength = passwordStrength();

  return (
    <>
      <SEO
        title="Reset Password - EquipRent"
        description="Create a new password for your EquipRent account."
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <Card className="w-full max-w-md p-8">
            {!isSuccess ? (
              <>
                {/* Logo & Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                      <Package className="w-10 h-10 text-primary-foreground" />
                    </div>
                  </div>
                  <h1 className="font-heading font-bold text-3xl mb-2">
                    Reset Password
                  </h1>
                  <p className="text-muted-foreground">
                    Create a new strong password for your account
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert className="mb-6 bg-red-50 border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Reset Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Password strength</span>
                          <span className={`font-semibold ${
                            strength.strength === 33 ? "text-red-600" :
                            strength.strength === 66 ? "text-orange-600" :
                            "text-green-600"
                          }`}>
                            {strength.label}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${strength.color} transition-all duration-300`}
                            style={{ width: `${strength.strength}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        className="pl-10 pr-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-action"
                    disabled={isLoading || !password || !confirmPassword}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h1 className="font-heading font-bold text-2xl">
                      Password Reset Successful!
                    </h1>
                    <p className="text-muted-foreground">
                      Your password has been successfully reset. You can now login with your new password.
                    </p>
                  </div>

                  <Button className="w-full btn-action" asChild>
                    <Link href="/auth/login">
                      Continue to Login
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </Card>
        </main>

        <Footer />
      </div>
    </>
  );
}