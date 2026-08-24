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
        "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
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
    if (request.method === "POST") {
      const body = await request.json() as { name?: string };
      const name = body.name;
      
      if (!name || name.trim() === "") {
        return new Response(JSON.stringify({ error: "Skill name is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const cleanName = name.trim();
      const maxOrderRow = await db.prepare("SELECT MAX(sort_order) as max_order FROM skills").first<{ max_order: number | null }>();
      const sortOrder = (maxOrderRow?.max_order ?? 0) + 1;

      await db.prepare("INSERT OR IGNORE INTO skills (name, sort_order) VALUES (?, ?)")
        .bind(cleanName, sortOrder)
        .run();

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (request.method === "DELETE") {
      const url = new URL(request.url);
      let name = url.searchParams.get("name");

      if (!name) {
        try {
          const body = await request.json() as { name?: string };
          name = body.name || null;
        } catch (e) {}
      }

      if (!name) {
        return new Response(JSON.stringify({ error: "Missing skill name" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      await db.prepare("DELETE FROM skills WHERE name = ?").bind(name).run();

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
