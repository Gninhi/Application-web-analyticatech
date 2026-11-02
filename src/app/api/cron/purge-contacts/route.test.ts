import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { deleteMany } = vi.hoisted(() => ({ deleteMany: vi.fn() }));
vi.mock("@/lib/db/client", () => ({ db: { contactRequest: { deleteMany } } }));

const SECRET = "secret-de-test-0123456789";

async function call(authorization?: string) {
  vi.resetModules();
  const { GET } = await import("./route");
  return GET(
    new NextRequest("http://localhost:3000/api/cron/purge-contacts", {
      headers: authorization ? { authorization } : {},
    })
  );
}

describe("GET /api/cron/purge-contacts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    deleteMany.mockResolvedValue({ count: 2 });
    vi.stubEnv("CRON_SECRET", SECRET);
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-02T03:30:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it("supprime les demandes dont le dernier échange date de plus de 3 ans", async () => {
    const res = await call(`Bearer ${SECRET}`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, deleted: 2 });
    expect(deleteMany).toHaveBeenCalledWith({
      where: { updatedAt: { lt: new Date("2023-11-02T03:30:00Z") } },
    });
  });

  it("refuse un appel sans le bon secret", async () => {
    expect((await call()).status).toBe(401);
    expect((await call("Bearer mauvais-secret-0123456789")).status).toBe(401);
    expect(deleteMany).not.toHaveBeenCalled();
  });

  it("refuse toute exécution si CRON_SECRET n'est pas configuré (fail-closed)", async () => {
    vi.stubEnv("CRON_SECRET", "");
    expect((await call("Bearer ")).status).toBe(401);
    expect(deleteMany).not.toHaveBeenCalled();
  });
});
