// GPU Optimization for High-Performance Rendering
class GPUOptimizer {
  constructor() {
    this.checkGPUSupport();
    this.enableHighPerformance();
  }

  checkGPUSupport() {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        console.log('GPU Vendor:', vendor);
        console.log('GPU Renderer:', renderer);
      }
      
      // Log capabilities
      console.log('Max Texture Size:', gl.getParameter(gl.MAX_TEXTURE_SIZE));
      console.log('Max Viewport Dims:', gl.getParameter(gl.MAX_VIEWPORT_DIMS));
      console.log('Max Vertex Attributes:', gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
      console.log('Max Texture Image Units:', gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
    }
  }

  enableHighPerformance() {
    // Force GPU acceleration on critical elements
    const style = document.createElement('style');
    style.textContent = `
      /* Force GPU acceleration */
      .gpu-accelerated,
      .hero-2025,
      .card-2025,
      .nav-2025,
      .reveal-2025,
      [data-parallax] {
        transform: translateZ(0);
        will-change: transform;
        backface-visibility: hidden;
        perspective: 1000px;
      }
      
      /* Optimize animations for GPU */
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      /* High-quality image rendering */
      img, svg {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
      }
      
      /* Smooth scrolling with GPU */
      html {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }
      
      /* GPU-accelerated filters */
      .blur-effect {
        filter: blur(0px);
        transform: translateZ(0);
      }
    `;
    document.head.appendChild(style);
    
    // Enable high refresh rate animations
    this.enableHighRefreshRate();
  }

  enableHighRefreshRate() {
    // Detect display refresh rate
    let fps = 60;
    let lastTime = performance.now();
    let frames = 0;
    
    const detectFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        fps = Math.round(frames * 1000 / (currentTime - lastTime));
        console.log('Display FPS:', fps);
        
        // Adjust animation timing for high refresh displays
        if (fps > 60) {
          document.documentElement.style.setProperty('--animation-fps', fps);
          document.documentElement.classList.add('high-refresh-rate');
        }
        
        frames = 0;
        lastTime = currentTime;
      }
      
      if (frames < 10) {
        requestAnimationFrame(detectFPS);
      }
    };
    
    requestAnimationFrame(detectFPS);
  }

  // Enable WebGL context for advanced graphics
  createWebGLContext(canvas, options = {}) {
    const defaultOptions = {
      alpha: true,
      antialias: true,
      depth: true,
      desynchronized: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
      stencil: false
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    return canvas.getContext('webgl2', mergedOptions) || 
           canvas.getContext('webgl', mergedOptions);
  }
}

// Initialize GPU optimization
document.addEventListener('DOMContentLoaded', () => {
  new GPUOptimizer();
});

// Export for use in other modules
window.GPUOptimizer = GPUOptimizer;