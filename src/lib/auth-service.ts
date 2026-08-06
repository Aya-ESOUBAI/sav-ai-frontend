import Cookies from "js-cookie";
import { LoginFormData, AuthResponse, ProfileUpdateFormData } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const authService = {
  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Identifiants invalides ou serveur indisponible.");
    }

    const result: AuthResponse = await response.json();

    Cookies.set("token", result.access_token, { expires: 7, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
    Cookies.set("user", JSON.stringify(result.user), { expires: 7 });

    return result;
  },

  // Appel API pour mettre à jour les informations du profil
  async updateProfile(data: ProfileUpdateFormData) {
    const token = Cookies.get("token");

    const response = await fetch(`${API_URL}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Erreur lors de la mise à jour du profil.");
    }

    const updatedUser = await response.json();
    
    // Mettre à jour le cookie utilisateur local
    const currentUser = JSON.parse(Cookies.get("user") || "{}");
    Cookies.set("user", JSON.stringify({ ...currentUser, nom: updatedUser.nom || data.nom }), { expires: 7 });

    return updatedUser;
  },

  logout() {
    Cookies.remove("token");
    Cookies.remove("user");
    window.location.href = "/login";
  },

  getToken() {
    return Cookies.get("token");
  },
};