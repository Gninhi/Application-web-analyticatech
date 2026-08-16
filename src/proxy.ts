import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy de sécurité Next.js 16 (anciennement middleware).
 *
 * Implémente la défense en profondeur niveau bancaire :
 *  1. CSRF protection (double-submit cookie pattern)
 *     - GET : génère et pose un cookie CSRF (at-csrf) si absent
 *     - POST/PUT/DELETE/PATCH : valide que le header X-CSRF-Token match le cookie
 *  2. Bot detection — bloque les User-Agents suspects (scanners, outils d'attaque)
 *  3. Request size validation — bloque les payloads surdimensionnés (> 16 KB)
 *  4. Security headers additionnels (complément à next.config.ts)
 *  5. CSP nonce-based : génère un nonce par requête, le pose en header
 *     `x-nonce` (lu par Next pour ses scripts inline) et émet la
 *     Content-Security-Policy avec `'nonce-…'` à la place de `'unsafe-inline'`
 *     côté scripts. Le script d'init du thème (RootLayout) utilise ce nonce.
 */

const CSRF_COOKIE = "at-csrf";
const CSRF_HEADER = "x-csrf-token";
const MAX_BODY_SIZE = 16384; // 16 KB max pour les requêtes mutatives
const isDev = process.env.NODE_ENV !== "production";

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

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;
  const ua = req.headers.get("user-agent") || "";

  // 1. Bot detection — bloque les UA suspects
  const lowerUa = ua.toLowerCase();
  const isSuspicious = SUSPICIOUS_UA_PATTERNS.some((p) => lowerUa.includes(p));
  const isLegitBrowser = ua.includes("Mozilla/5.0");

  if (isSuspicious || (!isLegitBrowser && method !== "GET" && method !== "HEAD")) {
    console.warn(`[SECURITY] Blocked suspicious request: ${method} ${pathname} UA=${ua.slice(0, 60)}`);
    return new NextResponse("Forbidden", {
      status: 403,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // 2. CSRF protection — sur les routes API mutatives
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

  // 5. CSP nonce-based — un nonce par requête, appliqué aux scripts inline
  //    de Next et à notre script d'init du thème (header x-nonce lu dans
  //    RootLayout). Remplace 'unsafe-inline' côté script-src.
  const nonce = generateToken();
  res.headers.set("x-nonce", nonce);
  res.headers.set("Content-Security-Policy", buildCsp(nonce));

  // 6. Pose le cookie CSRF si absent (double-submit pattern)
  if (!req.cookies.has(CSRF_COOKIE)) {
    const token = generateToken();
    res.cookies.set(CSRF_COOKIE, token, {
      httpOnly: false, // lisible par le client pour alimenter le header x-csrf-token
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 24h
    });
  }

  // 7. Security headers additionnels
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "no-referrer");

  return res;
}

/**
 * Construit la Content-Security-Policy avec le nonce dans script-src.
 * style-src conserve 'unsafe-inline' (styles générés par next/font) —
 * l'injection de style est sans conséquence en comparaison du script.
 */
function buildCsp(nonce: string): string {
  const scriptSrc = [`'self'`, `'nonce-${nonce}'`];
  if (isDev) scriptSrc.push("'unsafe-eval'");

  const connectSrc = isDev
    ? "'self' ws://localhost:* http://localhost:* ws://127.0.0.1:* http://127.0.0.1:*"
    : "'self'";

  const frameSrc = isDev
    ? "'self' http://localhost:* http://127.0.0.1:*"
    : "'none'";

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    `connect-src ${connectSrc}`,
    `frame-src ${frameSrc}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

/**
 * Génère un token CSRF aléatoire (32 bytes → hex) via Web Crypto API.
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
    "/((?!_next/static|_next/image|favicon.ico|services|logo.svg|robots.txt).*)",
  ],
};
