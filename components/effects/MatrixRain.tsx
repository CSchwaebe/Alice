'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/components/theme/useTheme';

interface Drop {
  x: number;
  y: number;
  speed: number;
  char: string;
  opacity: number;
}

export default function MatrixRain() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dropsRef = useRef<Drop[]>([]);
  const animationRef = useRef<number | null>(null);

  // Matrix characters (using a mix of katakana and special characters)
  const matrixChars = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';

  const getRandomChar = () => {
    return matrixChars[Math.floor(Math.random() * matrixChars.length)];
  };

  const createDrop = (x: number, forceY: boolean = false): Drop => {
    return {
      x,
      y: forceY ? Math.random() * window.innerHeight : 0,
      speed: 1 + Math.random() * 3,
      char: getRandomChar(),
      opacity: 0.1 + Math.random() * 0.5
    };
  };

  const initDrops = () => {
    const drops: Drop[] = [];
    const density = Math.floor(window.innerWidth / 20); // One drop every ~20px
    
    for (let i = 0; i < density; i++) {
      const x = (window.innerWidth / density) * i;
      drops.push(createDrop(x, true));
    }
    
    dropsRef.current = drops;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDrops();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Use theme background color with fade effect
      ctx.fillStyle = theme === 'dark' 
        ? 'rgba(0, 0, 0, 0.1)' 
        : 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = '20px monospace';
      
      dropsRef.current.forEach((drop, index) => {
        // Main character - using theme's foreground color
        const mainColor = theme === 'dark'
          ? `rgba(255, 255, 255, ${drop.opacity})` // White in dark theme
          : `rgba(0, 0, 0, ${drop.opacity})`       // Black in light theme
        
        ctx.fillStyle = mainColor;
        ctx.fillText(drop.char, drop.x, drop.y);

        // Trail effect
        let trailY = drop.y;
        let trailOpacity = drop.opacity;
        for (let i = 0; i < 5; i++) {
          trailY -= 20;
          trailOpacity *= 0.5;
          
          if (trailY > 0) {
            // Trail uses same foreground color with reduced opacity
            ctx.fillStyle = theme === 'dark'
              ? `rgba(255, 255, 255, ${trailOpacity})`
              : `rgba(0, 0, 0, ${trailOpacity})`;
            ctx.fillText(getRandomChar(), drop.x, trailY);
          }
        }

        // Update drop position
        drop.y += drop.speed;
        
        // Reset drop when it reaches bottom
        if (drop.y > canvas.height) {
          dropsRef.current[index] = createDrop(drop.x);
        }

        // Randomly change character
        if (Math.random() < 0.05) {
          drop.char = getRandomChar();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8, backgroundColor: 'var(--background)' }}
    />
  );
} 