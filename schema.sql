-- Database schema for Saheer's Portfolio

-- 1. Projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  stack_json TEXT NOT NULL, -- JSON array of strings: '["React", "TypeScript"]'
  link TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL, -- 'square' | 'wide' | 'tall'
  sort_order INTEGER DEFAULT 0
);

-- 2. Skills table
CREATE TABLE IF NOT EXISTS skills (
  name TEXT PRIMARY KEY,
  sort_order INTEGER DEFAULT 0
);

-- 3. Site Configuration table
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Seed Data

-- Projects Seeds
INSERT INTO projects (id, title, category, description, image_url, stack_json, link, aspect_ratio, sort_order)
VALUES 
  (
    'resulta', 
    'Resulta', 
    'Web App', 
    'A school exam results platform that runs entirely in the browser, no server needed. Students type in their details and get results instantly, powered by Google Sheets as the data source. Hosted on Cloudflare Pages.', 
    '/projects/resulta.png', 
    '["React 18", "TypeScript", "Tailwind CSS", "Framer Motion", "Cloudflare Pages"]', 
    'https://resulta.pages.dev', 
    'wide', 
    1
  ),
  (
    'share-file', 
    'Share File', 
    'Android / Networking', 
    'An Android app that lets you share files over Wi-Fi without needing the internet. Has a clean interface and can dig deep into your file system. Built from scratch in Kotlin.', 
    '/projects/share-file.png', 
    '["Kotlin", "Jetpack Compose", "Java Sockets"]', 
    'https://github.com/saheermk/share-file', 
    'tall', 
    2
  ),
  (
    'booko', 
    'Booko', 
    'Web Platform', 
    'A book management system for libraries and schools. Keeps track of the catalog, who borrowed what, and user accounts. Built to be simple enough for everyday use.', 
    '/projects/booko.png', 
    '["React", "Django", "REST API", "Tailwind CSS", "PostgreSQL"]', 
    'https://booko.pages.dev/', 
    'square', 
    3
  ),
  (
    'no-sleep', 
    'No Sleep', 
    'Android App', 
    'A small Android app that keeps your screen from going to sleep. That''s it. Open source, no ads, does one thing well. Built with Kotlin and Jetpack Compose.', 
    '/projects/no-sleep.png', 
    '["Kotlin", "Jetpack Compose", "Android", "Open Source"]', 
    'https://github.com/saheermk/no-sleep', 
    'square', 
    4
  );

-- Skills Seeds
INSERT INTO skills (name, sort_order) VALUES
  ('React', 1),
  ('React Native', 2),
  ('TypeScript', 3),
  ('Django', 4),
  ('Python', 5),
  ('Tailwind CSS', 6),
  ('Framer Motion', 7),
  ('REST APIs', 8),
  ('PostgreSQL', 9),
  ('Cloudflare Pages', 10),
  ('Git / GitHub', 11),
  ('Kotlin', 12),
  ('Jetpack Compose', 13),
  ('Vite', 14);

-- Site Configuration Seeds
INSERT INTO site_config (key, value) VALUES
  ('name', 'Saheer MK'),
  ('shortName', 'Saheer'),
  ('role', 'Full Stack Developer'),
  ('email', 'saheeermk@gmail.com'),
  ('cv_url', '/saheermk-cv.pdf'),
  ('github', 'https://github.com/saheermk'),
  ('linkedin', 'https://linkedin.com/in/saheermk'),
  ('seo_title', 'Saheer MK | Full Stack Developer | React, Django & React Native'),
  ('seo_description', 'Saheer MK is a freelance full stack developer from Kerala, India. Works with React, Django, TypeScript, and React Native to build web and mobile apps.'),
  ('seo_url', 'https://saheermk.pages.dev/');
