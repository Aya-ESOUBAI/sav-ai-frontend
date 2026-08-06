import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  // Récupération du token JWT depuis les cookies
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Liste des routes publiques (accessibles sans authentification)
  const isPublicRoute =
    pathname === "/login" || pathname === "/forgot-password";

  // 1. Si l'utilisateur N'EST PAS authentifié et tente d'accéder à une route protégée
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Si l'utilisateur EST DÉJÀ authentifié et tente d'accéder à la page de connexion
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configuration des routes interceptées
export const config = {
  matcher: [
    /*
     * Intercepte toutes les routes sauf :
     * - api (les routes API internes)
     * - _next/static (fichiers statiques JS/CSS)
     * - _next/image (optimisation d'images)
     * - favicon.ico et images statiques
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};