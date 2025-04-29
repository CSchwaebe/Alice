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

export default function MatrixRainMobile() {
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
      speed: 0.5 + Math.random() * 1.5,
      char: getRandomChar(),
      opacity: 0.2 + Math.random() * 0.5
    };
  };

  const initDrops = () => {
    const drops: Drop[] = [];
    const density = Math.floor(window.innerWidth / 8);
    
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
      // Clear the canvas with a transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Smaller font size for mobile
      ctx.font = '12px monospace';
      
      dropsRef.current.forEach((drop, index) => {
        // Main character - using theme's foreground color with blur effect
        const mainColor = theme === 'dark'
          ? `rgba(255, 255, 255, ${drop.opacity})`
          : `rgba(0, 0, 0, ${drop.opacity})`
        
        // Draw the main character with increased blur effect
        ctx.fillStyle = mainColor;
        ctx.shadowBlur = 8;
        ctx.shadowColor = mainColor;
        ctx.fillText(drop.char, drop.x, drop.y);
        ctx.shadowBlur = 0;

        // Trail effect with shorter trail for mobile
        let trailY = drop.y;
        let trailOpacity = drop.opacity;
        for (let i = 0; i < 3; i++) {
          trailY -= 12;
          trailOpacity *= 0.6;
          
          if (trailY > 0) {
            const trailColor = theme === 'dark'
              ? `rgba(255, 255, 255, ${trailOpacity})`
              : `rgba(0, 0, 0, ${trailOpacity})`;
            
            // Draw trail characters with increased blur effect
            ctx.fillStyle = trailColor;
            ctx.shadowBlur = 8;
            ctx.shadowColor = trailColor;
            ctx.fillText(getRandomChar(), drop.x, trailY);
            ctx.shadowBlur = 0;
          }
        }

        // Update drop position
        drop.y += drop.speed;
        
        // Reset drop when it reaches bottom
        if (drop.y > canvas.height) {
          dropsRef.current[index] = createDrop(drop.x);
        }

        // Less frequent character changes for better performance
        if (Math.random() < 0.03) {
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
      className="fixed inset-0 pointer-events-none z-10"
      style={{ backgroundColor: 'transparent', opacity: 0.3 }}
    />
  );
} 