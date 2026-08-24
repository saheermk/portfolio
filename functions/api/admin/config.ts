interface Env {
  DB: D1Database;
  ADMIN_PASSWORD?: string;
}

function verifyAuth(headers: Headers, env: Env): boolean {
  const adminPassword = env.ADMIN_PASSWORD || "admin";
  const authHeader = headers.get("Authorization");
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/, "");
  return token === adminPassword;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  }

  if (!verifyAuth(context.request.headers, context.env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  const { request, env } = context;
  const db = env.DB;

  try {
    if (request.method === "PUT") {
      const config = await request.json() as Record<string, string>;
      
      // Perform batch upserts
      const statements = Object.entries(config).map(([key, value]) => {
        return db.prepare("INSERT INTO site_config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
          .bind(key, String(value));
      });

      if (statements.length > 0) {
        await db.batch(statements);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
