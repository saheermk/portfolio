interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { results } = await context.env.DB.prepare(
      "SELECT key, value FROM site_config"
    ).all();
    
    const config: Record<string, string> = {};
    results.forEach((row: any) => {
      config[row.key] = row.value;
    });
    
    // Construct the structured config object expected by frontend components
    const mappedConfig = {
      name: config.name || "Saheer MK",
      shortName: config.shortName || "Saheer",
      role: config.role || "Full Stack Developer",
      email: config.email || "saheeermk@gmail.com",
      cvUrl: "/api/cv",
      hasCustomCv: !!config.cv_file_base64,
      links: {
        github: config.github || "https://github.com/saheermk",
        linkedin: config.linkedin || "https://linkedin.com/in/saheermk"
      },
      seo: {
        title: config.seo_title || "Saheer MK | Full Stack Developer | React, Django & React Native",
        description: config.seo_description || "Saheer MK is a freelance full stack developer from Kerala, India. Works with React, Django, TypeScript, and React Native to build web and mobile apps.",
        url: config.seo_url || "https://saheermk.pages.dev/"
      }
    };
    
    return new Response(JSON.stringify(mappedConfig), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
