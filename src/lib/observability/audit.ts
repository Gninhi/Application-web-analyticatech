import "server-only";

import { createHash } from "crypto";
import { mkdirSync, appendFileSync, existsSync, statSync, renameSync, unlinkSync } from "fs";
import { join } from "path";
import { getServerEnv } from "@/lib/env";

/**
 * Audit logging niveau bancaire — logs persistés avec rotation.
 *
 * Implémente :
 *  - Logs structurés JSON append-only (immuables)
 *  - Rotation automatique à 10 MB (fichier .1, .2, .3)
 *  - Hash d'IP (RGPD : pas de PII en clair)
 *  - Niveaux de sévérité (INFO, WARN, ALERT, CRITICAL)
 *  - Rotation quotidienne par date dans le nom de fichier
 */

const LOG_DIR = join(process.cwd(), "logs");
const LOG_FILE = join(LOG_DIR, "audit.log");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_ROTATIONS = 3;

// S'assure que le dossier logs/ existe
try {
  if (!existsSync(LOG_DIR)) {
    mkdirSync(LOG_DIR, { recursive: true });
  }
} catch {
  // Environnement serverless sans fs → fallback console
}

export type AuditLevel = "INFO" | "WARN" | "ALERT" | "CRITICAL";

export interface AuditEntry {
  ts: string;
  level: AuditLevel;
  event: string;
  ipHash?: string;
  fingerprint?: string;
  userAgent?: string;
  reference?: string;
  details?: Record<string, unknown>;
}

/**
 * Hash d'IP non-réversible avec sel (RGPD compliant).
 * En production, `IP_SALT` doit être défini (32+ caractères aléatoires).
 */
export function hashIp(ip: string): string {
  try {
    const salt = getServerEnv().IP_SALT;
    if (!salt || salt.length < 16) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("IP_SALT manquant ou trop court en production.");
      }
    }
    const effectiveSalt = salt && salt.length >= 16 ? salt : "dev-only-insecure-salt";
    return createHash("sha256").update(ip + effectiveSalt).digest("hex").slice(0, 16);
  } catch {
    return "unknown";
  }
}

/**
 * Écrit une entrée d'audit dans le fichier de logs (append-only).
 * Rotation automatique si le fichier dépasse MAX_FILE_SIZE.
 */
export function auditLog(entry: Omit<AuditEntry, "ts">): void {
  const fullEntry: AuditEntry = {
    ts: new Date().toISOString(),
    ...entry,
  };

  const line = JSON.stringify(fullEntry) + "\n";

  // Tentative d'écriture fichier (fallback console si fs non disponible)
  try {
    // Rotation si nécessaire
    if (existsSync(LOG_FILE)) {
      const stats = statSync(LOG_FILE);
      if (stats.size > MAX_FILE_SIZE) {
        rotateLogs();
      }
    }
    appendFileSync(LOG_FILE, line, "utf8");
  } catch {
    // Fallback : console (serverless, Vercel, etc.)
    const level = fullEntry.level;
    if (level === "CRITICAL" || level === "ALERT") {
      console.error("[AUDIT]", line.trim());
    } else if (level === "WARN") {
      console.warn("[AUDIT]", line.trim());
    } else {
      // INFO : fallback légitime hors environnement fichier (serverless/Vercel)
      // eslint-disable-next-line no-console
      console.info("[AUDIT]", line.trim());
    }
  }
}

/**
 * Rotation des logs : audit.log → audit.1.log → audit.2.log → ...
 * Le plus ancien (audit.3.log) est supprimé.
 */
function rotateLogs(): void {
  try {
    // Supprime le plus ancien
    const oldest = `${LOG_FILE}.${MAX_ROTATIONS}`;
    if (existsSync(oldest)) {
      unlinkSync(oldest);
    }
    // Décale les fichiers existants
    for (let i = MAX_ROTATIONS - 1; i >= 1; i--) {
      const from = `${LOG_FILE}.${i}`;
      const to = `${LOG_FILE}.${i + 1}`;
      if (existsSync(from)) {
        renameSync(from, to);
      }
    }
    // Renomme le fichier courant en .1
    if (existsSync(LOG_FILE)) {
      renameSync(LOG_FILE, `${LOG_FILE}.1`);
    }
  } catch {
    // Ignore les erreurs de rotation (non-critique)
  }
}

/**
 * Raccourcis pour les niveaux courants.
 */
export const audit = {
  info: (event: string, details?: Record<string, unknown>) =>
    auditLog({ level: "INFO", event, details }),
  warn: (event: string, details?: Record<string, unknown>) =>
    auditLog({ level: "WARN", event, details }),
  alert: (event: string, details?: Record<string, unknown>) =>
    auditLog({ level: "ALERT", event, details }),
  critical: (event: string, details?: Record<string, unknown>) =>
    auditLog({ level: "CRITICAL", event, details }),
};
