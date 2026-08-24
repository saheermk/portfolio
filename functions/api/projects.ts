interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const limitHeader = context.request.headers.get("X-Limit");
    const offsetHeader = context.request.headers.get("X-Offset");

    let query = "SELECT * FROM projects ORDER BY sort_order ASC";
    const params: number[] = [];

    if (limitHeader) {
      query += " LIMIT ?";
      params.push(parseInt(limitHeader, 10));
      if (offsetHeader) {
        query += " OFFSET ?";
        params.push(parseInt(offsetHeader, 10));
      }
    }

    const { results } = await context.env.DB.prepare(query).bind(...params).all();
    
    // Parse the JSON array of stack technologies back into a normal JS array
    const projects = results.map((row: any) => {
      let stack = [];
      try {
        stack = JSON.parse(row.stack_json || "[]");
      } catch (e) {
        stack = [];
      }
      return {
        id: row.id,
        title: row.title,
        category: row.category,
        description: row.description,
        image: row.image_url, // map DB image_url to image property expected by frontend
        stack: stack,
        link: row.link,
        aspectRatio: row.aspect_ratio,
        sortOrder: row.sort_order
      };
    });

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Expose-Headers": "X-Total-Count",
      "Access-Control-Allow-Headers": "Content-Type, X-Limit, X-Offset"
    };

    const totalCountResult = await context.env.DB.prepare(
      "SELECT COUNT(*) as count FROM projects"
    ).first<{ count: number }>();
    
    if (totalCountResult) {
      headers["X-Total-Count"] = String(totalCountResult.count);
    }
    
    return new Response(JSON.stringify(projects), {
      headers
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
