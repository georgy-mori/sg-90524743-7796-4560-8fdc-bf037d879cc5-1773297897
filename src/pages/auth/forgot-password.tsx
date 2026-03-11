import Link from "next/link";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <SEO
        title="Forgot Password - EquipRent"
        description="Reset your EquipRent account password. Enter your email to receive password reset instructions."
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <Card className="w-full max-w-md p-8">
            {!isSubmitted ? (
              <>
                {/* Logo & Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                      <Package className="w-10 h-10 text-primary-foreground" />
                    </div>
                  </div>
                  <h1 className="font-heading font-bold text-3xl mb-2">
                    Forgot Password?
                  </h1>
                  <p className="text-muted-foreground">
                    No worries! Enter your email and we'll send you reset instructions.
                  </p>
                </div>

                {/* Reset Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-action"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full gap-2"
                    asChild
                  >
                    <Link href="/auth/login">
                      <ArrowLeft className="w-4 h-4" />
                      Back to Login
                    </Link>
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
                      Check Your Email
                    </h1>
                    <p className="text-muted-foreground">
                      We've sent password reset instructions to
                    </p>
                    <p className="font-semibold text-primary">
                      {email}
                    </p>
                  </div>

                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription className="text-sm text-blue-800">
                      Didn't receive the email? Check your spam folder or{" "}
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="font-semibold underline hover:no-underline"
                      >
                        try again
                      </button>
                    </AlertDescription>
                  </Alert>

                  <Button className="w-full btn-action" asChild>
                    <Link href="/auth/login">
                      Return to Login
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