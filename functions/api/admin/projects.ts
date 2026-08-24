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
  // Handle CORS OPTIONS preflight
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  }

  // Verify Admin authorization
  if (!verifyAuth(context.request.headers, context.env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  const { request, env } = context;
  const db = env.DB;

  try {
    // 1. CREATE (POST)
    if (request.method === "POST") {
      const project = await request.json() as any;
      
      let projectId = project.id;
      if (!projectId && project.title) {
        // Generate clean URL-friendly slug
        projectId = project.title
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
          
        // Check if ID already exists to prevent duplicate key errors
        const existing = await db.prepare("SELECT id FROM projects WHERE id = ?").bind(projectId).first();
        if (existing) {
          projectId = `${projectId}-${Math.random().toString(36).substring(2, 6)}`;
        }
      }

      if (!projectId || !project.title || !project.category || !project.description) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const stackJson = JSON.stringify(project.stack || []);
      
      // Compute automatic sort order
      const maxOrderRow = await db.prepare("SELECT MAX(sort_order) as max_order FROM projects").first<{ max_order: number | null }>();
      const sortOrder = (maxOrderRow?.max_order ?? 0) + 1;

      await db.prepare(
        "INSERT INTO projects (id, title, category, description, image_url, stack_json, link, aspect_ratio, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(
        projectId,
        project.title,
        project.category,
        project.description,
        project.image_url || "",
        stackJson,
        project.link || "",
        project.aspect_ratio || "square",
        sortOrder
      ).run();

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. UPDATE (PUT)
    if (request.method === "PUT") {
      const project = await request.json() as any;
      if (!project.id || !project.title || !project.category || !project.description) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const stackJson = JSON.stringify(project.stack || []);

      await db.prepare(
        "UPDATE projects SET title = ?, category = ?, description = ?, image_url = ?, stack_json = ?, link = ?, aspect_ratio = ?, sort_order = ? WHERE id = ?"
      ).bind(
        project.title,
        project.category,
        project.description,
        project.image_url || "",
        stackJson,
        project.link || "",
        project.aspect_ratio || "square",
        project.sort_order || 0,
        project.id
      ).run();

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. DELETE (DELETE)
    if (request.method === "DELETE") {
      const url = new URL(request.url);
      let id = url.searchParams.get("id");

      if (!id) {
        try {
          const body = await request.json() as { id?: string };
          id = body.id || null;
        } catch (e) {
          id = null;
        }
      }

      if (!id) {
        return new Response(JSON.stringify({ error: "Missing project id" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      await db.prepare("DELETE FROM projects WHERE id = ?").bind(id).run();

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
