import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
}

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterData) {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            role: data.role,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");

      // 2. Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.full_name,
        phone: data.phone,
        role: data.role,
        email_verified: false,
      });

      if (profileError) throw profileError;

      // 3. Create wallet for user
      const { error: walletError } = await supabase.from("wallets").insert({
        user_id: authData.user.id,
        balance: 0,
      });

      if (walletError) throw walletError;

      return { user: authData.user, session: authData.session };
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(error.message || "Registration failed");
    }
  }

  /**
   * Login user
   */
  async login(data: LoginData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      return { user: authData.user, session: authData.session };
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login failed");
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error(error.message || "Logout failed");
    }
  }

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error: any) {
      console.error("Get session error:", error);
      return null;
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<Profile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return profile;
    } catch (error: any) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", user.id);

      if (error) throw error;

      return true;
    } catch (error: any) {
      console.error("Update profile error:", error);
      throw new Error(error.message || "Profile update failed");
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error("Password reset error:", error);
      throw new Error(error.message || "Password reset failed");
    }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error("Update password error:", error);
      throw new Error(error.message || "Password update failed");
    }
  }

  /**
   * Check if user has specific role
   */
  async hasRole(role: UserRole): Promise<boolean> {
    try {
      const profile = await this.getCurrentUser();
      return profile?.role === role;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user role
   */
  async getUserRole(): Promise<UserRole | null> {
    try {
      const profile = await this.getCurrentUser();
      return profile?.role || null;
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();