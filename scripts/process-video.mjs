import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

const videoPath = path.resolve('video/animation.mp4');
const outDir = path.resolve('public/frames');
const metadataPath = path.resolve('public/frames/frames.json');

const TARGET_FRAMES = 200;

const SECTION_NAMES = ['intro', 'about', 'projects', 'contact', 'extra1', 'extra2', 'extra3'];

async function run() {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log('Probing video...');
  const probeCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`;
  const { stdout: durationStr } = await execAsync(probeCmd);
  const duration = parseFloat(durationStr.trim());
  if (isNaN(duration)) {
    throw new Error('Could not determine video duration.');
  }

  const fps = TARGET_FRAMES / duration;
  console.log(`Video duration: ${duration.toFixed(2)}s. Target FPS: ${fps.toFixed(2)} to get ~${TARGET_FRAMES} frames.`);

  console.log('Extracting frames to WebP...');
  const extractCmd = `ffmpeg -y -i "${videoPath}" -vf "fps=${fps},scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" -c:v libwebp -lossless 0 -compression_level 4 -q:v 80 "${outDir}/frame_%04d.webp"`;
  await execAsync(extractCmd);
  console.log('Frames extracted.');

  console.log('Detecting scenes...');
  const sceneCmd = `ffprobe -v error -f lavfi -i "movie=${videoPath},select='gt(scene,0.2)'" -show_entries frame=pkt_pts_time -of default=noprint_wrappers=1:nokey=1`;
  let sceneTimes = [];
  try {
    const { stdout: sceneOutput } = await execAsync(sceneCmd);
    sceneTimes = sceneOutput.split('\n').map(l => parseFloat(l.trim())).filter(n => !isNaN(n));
  } catch (e) {
    console.warn('Scene detection failed, using fallback.');
  }

  // Create sections
  let sections = [];
  sceneTimes.unshift(0); // Add start
  if (sceneTimes.length <= 1) {
    // Fallback: divide evenly into 4
    for (let i = 0; i < 4; i++) {
       const startF = Math.floor((i / 4) * TARGET_FRAMES);
       const endF = i === 3 ? TARGET_FRAMES : Math.floor(((i + 1) / 4) * TARGET_FRAMES);
       sections.push({ name: SECTION_NAMES[i], start: startF + 1, end: endF });
    }
  } else {
    for (let i = 0; i < sceneTimes.length; i++) {
       const start = sceneTimes[i];
       const end = i < sceneTimes.length - 1 ? sceneTimes[i + 1] : duration;
       let startF = Math.floor(start * fps) + 1;
       let endF = Math.floor(end * fps);
       if (i === sceneTimes.length - 1) endF = TARGET_FRAMES;
       if (endF < startF) continue;
       sections.push({
           name: SECTION_NAMES[Math.min(i, SECTION_NAMES.length - 1)],
           start: startF,
           end: endF
       });
    }
  }
  
  // Count actual generated frames
  const files = fs.readdirSync(outDir).filter(f => f.startsWith('frame_') && f.endsWith('.webp'));
  const actualFrames = files.length;
  
  // Fix bounds just in case
  if (sections.length > 0) {
      sections[sections.length - 1].end = actualFrames;
  }

  const metadata = {
    frameCount: actualFrames,
    fps: fps,
    duration: duration,
    sections: sections
  };

  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`Metadata written to ${metadataPath}`);
  console.log(JSON.stringify(metadata, null, 2));
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
