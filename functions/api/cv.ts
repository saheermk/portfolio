interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const row = await context.env.DB.prepare(
      "SELECT value FROM site_config WHERE key = ?"
    ).bind("cv_file_base64").first<{ value: string }>();

    if (!row || !row.value) {
      // Fallback: Redirect to the static PDF file
      return Response.redirect(new URL("/saheermk-cv.pdf", context.request.url), 302);
    }

    // Convert base64 string back to binary buffer
    const binaryString = atob(row.value);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Response(bytes.buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="SaheerMK-CV.pdf"',
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error: any) {
    // Safety fallback redirection
    return Response.redirect(new URL("/saheermk-cv.pdf", context.request.url), 302);
  }
};
