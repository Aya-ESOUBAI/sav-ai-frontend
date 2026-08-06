import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: z.enum(["CLIENT", "TECHNICIEN", "RESPONSABLE_SAV", "ADMINISTRATEUR"], {
    message: "Veuillez sélectionner un rôle valide",
  }),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

// Schéma Zod pour le formulaire de mise à jour du profil
export const ProfileUpdateSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"), // L'email n'est pas modifiable
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
}).refine(
  (data) => {
    if (data.newPassword && data.newPassword.length > 0 && !data.currentPassword) {
      return false;
    }
    return true;
  },
  {
    message: "Le mot de passe actuel est requis pour définir un nouveau mot de passe",
    path: ["currentPassword"],
  }
).refine(
  (data) => {
    if (data.newPassword && data.newPassword.length > 0 && data.newPassword.length < 6) {
      return false;
    }
    return true;
  },
  {
    message: "Le nouveau mot de passe doit contenir au moins 6 caractères",
    path: ["newPassword"],
  }
);

export type ProfileUpdateFormData = z.infer<typeof ProfileUpdateSchema>;

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    nom: string;
    email: string;
    role: "CLIENT" | "TECHNICIEN" | "RESPONSABLE_SAV" | "ADMINISTRATEUR";
  };
}