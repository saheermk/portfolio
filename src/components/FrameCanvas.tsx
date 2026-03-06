import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { preloadFrames } from '../utils/frameLoader';
import metadata from '../../public/frames/frames.json';


gsap.registerPlugin(ScrollTrigger);

export const FrameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    const loadedFrames = preloadFrames(metadata.frameCount, (i) => {
      return `/frames/frame_${i.toString().padStart(4, '0')}.webp`;
    });
    setFrames(loadedFrames);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || frames.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let currentFrameIndex = 1;

    const drawImageProp = (img: HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.width;
      const ih = img.height;
      const hRatio = cw / iw;
      const vRatio = ch / ih;
      const ratio = Math.max(hRatio, vRatio); // object-fit: cover
      const cx = (cw - iw * ratio) / 2;
      const cy = (ch - ih * ratio) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, 0, 0, iw, ih, cx, cy, iw * ratio, ih * ratio);
    };

    const renderFrame = (index: number) => {
      const safeIndex = Math.max(1, Math.min(metadata.frameCount, index));
      const img = frames[safeIndex];
      if (img && img.complete && img.naturalHeight !== 0) {
        drawImageProp(img);
      } else if (img) {
        img.onload = () => {
          // ensure we only draw if it's still the active frame
          if (currentFrameIndex === safeIndex) {
            drawImageProp(img);
          }
        };
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(currentFrameIndex);
    };

    window.addEventListener('resize', resize);
    resize();

    // Attach scroll trigger to the whole document
    const scrollTrigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0, // scrubbing logic handled by Lenis smooth scroll
      onUpdate: (self) => {
        const p = self.progress;
        const targetFrame = Math.round(p * (metadata.frameCount - 1)) + 1;
        if (targetFrame !== currentFrameIndex) {
          currentFrameIndex = targetFrame;
          requestAnimationFrame(() => renderFrame(currentFrameIndex));
        }
      }
    });

    return () => {
      window.removeEventListener('resize', resize);
      scrollTrigger.kill();
    };
  }, [frames]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};
