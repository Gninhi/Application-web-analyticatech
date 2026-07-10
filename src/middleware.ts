import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware de sécurité niveau bancaire.
 *
 * Implémente :
 *  1. CSRF protection (double-submit cookie pattern)
 *     - GET : génère et pose un cookie CSRF si absent
 *     - POST/PUT/DELETE : valide que le header X-CSRF-Token match le cookie
 *  2. Bot detection — bloque les User-Agents suspects (scanners, outils d'attaque)
 *  3. Request size validation — bloque les payloads surdimensionnés
 *  4. Security headers additionnels (complément à next.config.ts)
 *  5. Audit logging des requêtes bloquées
 */

const CSRF_COOKIE = "at-csrf";
const CSRF_HEADER = "x-csrf-token";
const MAX_BODY_SIZE = 16384; // 16 KB max pour les POST

// User-Agents suspects (scanners, outils d'attaque, bots malveillants)
const SUSPICIOUS_UA_PATTERNS = [
  "sqlmap",
  "nikto",
  "nmap",
  "masscan",
  "dirb",
  "gobuster",
  "wpscan",
  "hydra",
  "metasploit",
  "burp",
  "owasp",
  "acunetix",
  "nessus",
  "zgrab",
  "semrushbot",
  "ahrefsbot",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;
  const ua = req.headers.get("user-agent") || "";

  // 1. Bot detection — bloque les UA suspects
  const lowerUa = ua.toLowerCase();
  const isSuspicious = SUSPICIOUS_UA_PATTERNS.some((p) => lowerUa.includes(p));
  // Les navigateurs légitimes contiennent "Mozilla/5.0"
  const isLegitBrowser = ua.includes("Mozilla/5.0");

  if (isSuspicious || (!isLegitBrowser && method !== "GET" && method !== "HEAD")) {
    console.warn(`[SECURITY] Blocked suspicious request: ${method} ${pathname} UA=${ua.slice(0, 60)}`);
    return new NextResponse("Forbidden", {
      status: 403,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // 2. CSRF protection — seulement sur les routes API mutatives
  if (method === "POST" || method === "PUT" || method === "DELETE" || method === "PATCH") {
    if (pathname.startsWith("/api/")) {
      const cookieToken = req.cookies.get(CSRF_COOKIE)?.value;
      const headerToken = req.headers.get(CSRF_HEADER);

      if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        console.warn(`[SECURITY] CSRF token mismatch on ${method} ${pathname}`);
        return NextResponse.json(
          {
            success: false,
            message: "Token de sécurité invalide. Veuillez rafraîchir la page.",
          },
          { status: 403 }
        );
      }
    }
  }

  // 3. Request size validation
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
    console.warn(`[SECURITY] Oversized request blocked: ${method} ${pathname} size=${contentLength}`);
    return new NextResponse("Payload Too Large", {
      status: 413,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // 4. Prépare la réponse
  const res = NextResponse.next();

  // 5. Pose le cookie CSRF si absent (double-submit pattern)
  if (!req.cookies.has(CSRF_COOKIE)) {
    const token = generateToken();
    res.cookies.set(CSRF_COOKIE, token, {
      httpOnly: false, // doit être lisible par le client (pour le header)
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 24h
    });
  }

  // 6. Security headers additionnels
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "no-referrer");

  return res;
}

/**
 * Génère un token CSRF aléatoire (32 bytes → hex).
 * Utilise l'API Web Crypto (disponible en Edge Runtime).
 */
function generateToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|services|logo.svg|robots.txt).*)",
  ],
};
