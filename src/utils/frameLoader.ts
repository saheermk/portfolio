export function preloadFrames(frameCount: number, pathTemplate: (index: number) => string): HTMLImageElement[] {
  const frames: HTMLImageElement[] = new Array(frameCount + 1);
  
  // High priority preload for *ONLY* the very first frame to unblock initial render
  const firstFrame = new Image();
  firstFrame.src = pathTemplate(1);
  frames[1] = firstFrame;

  // Lazy load the rest in the background completely deferred
  const lazyLoad = () => {
    // Only start lazy loading *after* the first frame is actually ready
    if (!firstFrame.complete) {
      firstFrame.onload = doLazyLoad;
    } else {
      doLazyLoad();
    }
  };

  const doLazyLoad = () => {
    // Load in small batches to not freeze the main thread
    let current = 2;
    const batchSize = 10;

    const loadBatch = () => {
      const end = Math.min(current + batchSize - 1, frameCount);
      for (let i = current; i <= end; i++) {
        const img = new Image();
        img.src = pathTemplate(i);
        frames[i] = img;
      }
      current += batchSize;
      
      if (current <= frameCount) {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(loadBatch);
        } else {
          setTimeout(loadBatch, 50);
        }
      }
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadBatch);
    } else {
      setTimeout(loadBatch, 50);
    }
  };

  // Wait until the entire window has finished loading its critical assets
  if (document.readyState === 'complete') {
    lazyLoad();
  } else {
    window.addEventListener('load', () => {
      // Give the browser a tiny bit of breathing room after onload
      setTimeout(lazyLoad, 100);
    });
  }

  return frames;
}
