export const roles = ["CLIENT", "TECHNICIEN", "RESPONSABLE_SAV", "ADMINISTRATEUR"] as const;

export type Role = (typeof roles)[number];

export function normalizeRole(value: unknown): Role | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toUpperCase().replace(/[\s-]+/g, "_");
  return (roles as readonly string[]).includes(normalized) ? (normalized as Role) : null;
}

export function roleFromCookie(value?: string): Role | null {
  if (!value) return null;

  try {
    const user = JSON.parse(value) as { role?: unknown };
    return normalizeRole(user.role);
  } catch {
    try {
      const user = JSON.parse(decodeURIComponent(value)) as { role?: unknown };
      return normalizeRole(user.role);
    } catch {
      return null;
    }
  }
}

export function canAccessPath(role: Role | null, pathname: string) {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return role === "ADMINISTRATEUR";
  }

  return true;
}
