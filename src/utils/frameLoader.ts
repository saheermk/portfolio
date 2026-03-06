export function preloadFrames(frameCount: number, pathTemplate: (index: number) => string): HTMLImageElement[] {
  const frames: HTMLImageElement[] = new Array(frameCount + 1);
  
  // High priority preload for first 30 frames
  for (let i = 1; i <= Math.min(30, frameCount); i++) {
    const img = new Image();
    img.src = pathTemplate(i);
    frames[i] = img;
  }

  // Lazy load the rest in the background
  const lazyLoad = () => {
    for (let i = 31; i <= frameCount; i++) {
      const img = new Image();
      img.src = pathTemplate(i);
      frames[i] = img;
    }
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(lazyLoad);
  } else {
    setTimeout(lazyLoad, 200);
  }

  return frames;
}
