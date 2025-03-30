"use client";

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/theme/useTheme';

// Use a more complex structure for glitch sections
interface GlitchPoint {
  row: number;
  col: number;
}

interface GlitchSection {
  points: GlitchPoint[];  // Collection of points instead of a rectangle
  duration: number;
  startTime: number;
  intensity: number;
}

export default function GlitchTextBackground() {
  const { theme } = useTheme();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [glitchSections, setGlitchSections] = useState<GlitchSection[]>([]);
  const forceRagnarokRef = useRef<boolean>(false);
  const animationRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const gridRef = useRef<string[][]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const matrixChars = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ01123456789:・.=*+-<>';

  // ALICE character patterns (simplified ASCII art style)
  const alicePatterns = {
    'A': [
      [0,1,0,0],
      [1,0,1,0],
      [1,1,1,0],
      [1,0,1,0],
      [1,0,1,0]
    ],
    'L': [
      [1,0,0,0],
      [1,0,0,0],
      [1,0,0,0],
      [1,0,0,0],
      [1,1,1,0]
    ],
    'I': [
      [1,1,1,0],
      [0,1,0,0],
      [0,1,0,0],
      [0,1,0,0],
      [1,1,1,0]
    ],
    'C': [
      [0,1,1,0],
      [1,0,0,0],
      [1,0,0,0],
      [1,0,0,0],
      [0,1,1,0]
    ],
    'E': [
      [1,1,1,0],
      [1,0,0,0],
      [1,1,1,0],
      [1,0,0,0],
      [1,1,1,0]
    ]
  };

  // Helper function to generate random shapes
  const generateRandomShape = (rows: number, cols: number, complexity: number): GlitchPoint[] => {
    const points: GlitchPoint[] = [];
    
    // Choose a random starting point
    const centerRow = forceRagnarokRef.current ? Math.floor(rows * 0.25) : Math.floor(Math.random() * rows);
    const centerCol = forceRagnarokRef.current ? Math.floor(cols / 2) : Math.floor(Math.random() * cols);
    
    // Decide shape type - force ALICE shape if needed
    const shapeType = forceRagnarokRef.current ? 5 : Math.floor(Math.random() * 5);
    
    if (shapeType === 5) {
      // ALICE text shape
      const letterWidth = 6;
      const letterSpacing = 3;
      const word = "ALICE";
      const totalWidth = (word.length * letterWidth) + ((word.length - 1) * letterSpacing);
      
      // Center horizontally
      const startCol = Math.max(0, centerCol - Math.floor(totalWidth / 2));
      const startRow = centerRow;
      
      // Generate points for each letter
      for (let letterIndex = 0; letterIndex < word.length; letterIndex++) {
        const letter = word[letterIndex];
        const pattern = alicePatterns[letter as keyof typeof alicePatterns];
        
        if (pattern) {
          for (let r = 0; r < pattern.length; r++) {
            for (let c = 0; c < pattern[0].length; c++) {
              if (pattern[r][c]) {
                const row = startRow + r;
                const col = startCol + (letterIndex * (letterWidth + letterSpacing)) + c;
                
                if (row >= 0 && row < rows && col >= 0 && col < cols) {
                  points.push({ row, col });
                }
              }
            }
          }
        }
      }
      
      // Reset the force flag after generating
      if (forceRagnarokRef.current) {
        forceRagnarokRef.current = false;
      }
    } else if (shapeType === 0) {
      // Vertical line with jagged edges
      const height = 3 + Math.floor(Math.random() * 15);
      const width = 1 + Math.floor(Math.random() * 3);
      
      for (let r = 0; r < height; r++) {
        const rowOffset = (centerRow + r) % rows;
        // Create jagged edges by varying the width
        const jaggedness = Math.floor(Math.random() * 3) - 1;
        const thisWidth = Math.max(1, width + jaggedness);
        
        for (let c = 0; c < thisWidth; c++) {
          const colOffset = (centerCol + c - Math.floor(thisWidth/2)) % cols;
          if (colOffset >= 0) {
            points.push({ row: rowOffset, col: colOffset });
          }
        }
      }
    } else if (shapeType === 1) {
      // Horizontal line with varying thickness
      const width = 5 + Math.floor(Math.random() * 20);
      const height = 1 + Math.floor(Math.random() * 3);
      
      for (let c = 0; c < width; c++) {
        const colOffset = (centerCol + c) % cols;
        const thisHeight = Math.max(1, height + (Math.random() < 0.3 ? 1 : 0));
        
        for (let r = 0; r < thisHeight; r++) {
          const rowOffset = (centerRow + r) % rows;
          if (rowOffset >= 0 && colOffset >= 0) {
            points.push({ row: rowOffset, col: colOffset });
          }
        }
      }
    } else if (shapeType === 2) {
      // L-shape
      const height = 3 + Math.floor(Math.random() * 10);
      const width = 3 + Math.floor(Math.random() * 10);
      
      // Vertical part
      for (let r = 0; r < height; r++) {
        const rowOffset = (centerRow + r) % rows;
        if (rowOffset >= 0) {
          points.push({ row: rowOffset, col: centerCol });
        }
      }
      
      // Horizontal part
      for (let c = 0; c < width; c++) {
        const colOffset = (centerCol + c) % cols;
        if (colOffset >= 0) {
          points.push({ row: centerRow, col: colOffset });
        }
      }
    } else if (shapeType === 3) {
      // Scattered points (like static)
      const pointCount = 10 + Math.floor(Math.random() * 40);
      const radius = 5 + Math.floor(Math.random() * 15);
      
      for (let i = 0; i < pointCount; i++) {
        const rowOffset = (centerRow + Math.floor(Math.random() * (radius*2)) - radius) % rows;
        const colOffset = (centerCol + Math.floor(Math.random() * (radius*2)) - radius) % cols;
        
        if (rowOffset >= 0 && colOffset >= 0) {
          points.push({ row: rowOffset, col: colOffset });
        }
      }
    } else {
      // Diagonal line
      const length = 5 + Math.floor(Math.random() * 15);
      const direction = Math.random() < 0.5 ? 1 : -1;
      
      for (let i = 0; i < length; i++) {
        const rowOffset = (centerRow + i) % rows;
        const colOffset = (centerCol + (i * direction)) % cols;
        
        if (rowOffset >= 0 && colOffset >= 0 && colOffset < cols) {
          points.push({ row: rowOffset, col: colOffset });
          
          // Add some thickness to the diagonal
          if (Math.random() < 0.4) {
            const extraRow = rowOffset + (Math.random() < 0.5 ? 1 : -1);
            if (extraRow >= 0 && extraRow < rows) {
              points.push({ row: extraRow, col: colOffset });
            }
          }
        }
      }
    }
    
    return points;
  };

  useEffect(() => {
    const calculateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDimensions({ width, height });
      
      const fontSize = 14;
      const cellWidth = 15;
      const cellHeight = 18;
      
      const cols = Math.ceil(width / cellWidth);
      const rows = Math.ceil(height / cellHeight);
      
      const newGrid: string[][] = [];
      for (let r = 0; r < rows; r++) {
        const row: string[] = [];
        for (let c = 0; c < cols; c++) {
          row.push(getRandomChar());
        }
        newGrid.push(row);
      }
      
      gridRef.current = newGrid;
    };

    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    
    return () => {
      window.removeEventListener('resize', calculateDimensions);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Create new glitch sections randomly and schedule RAGNAROK appearances
  useEffect(() => {
    const createGlitchInterval = setInterval(() => {
      if (!gridRef.current.length) return;
      
      const rows = gridRef.current.length;
      const cols = gridRef.current[0].length;
      
      // Create a new glitch section with random shape
      const complexity = Math.random(); // 0-1, controls shape complexity
      const points = generateRandomShape(rows, cols, complexity);
      
      // Make RAGNAROK appear with higher intensity if forced
      const newGlitch: GlitchSection = {
        points,
        duration: 200 + Math.random() * 800,
        startTime: performance.now(),
        intensity: forceRagnarokRef.current ? 0.8 + Math.random() * 0.2 : 0.5 + Math.random() * 0.5
      };
      
      setGlitchSections(prev => [...prev, newGlitch]);
      
      // Randomly change some characters
      const newGrid = [...gridRef.current];
      const changeCount = Math.floor(Math.random() * 10) + 5;
      
      for (let i = 0; i < changeCount; i++) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        newGrid[r][c] = getRandomChar();
      }
      
      gridRef.current = newGrid;
      
    }, 100); // Create new glitch sections every 100ms
    
    // Set up timer to periodically force RAGNAROK to appear
    const ragnarokTimer = setInterval(() => {
      forceRagnarokRef.current = true;
    }, 10000); // Every 10 seconds
    
    // Force RAGNAROK to appear immediately
    forceRagnarokRef.current = true;
    
    return () => {
      clearInterval(createGlitchInterval);
      clearInterval(ragnarokTimer);
    };
  }, []);

  // Render the grid and glitch effects
  useEffect(() => {
    const canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;
    if (!canvas || !dimensions.width) return;
    
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    const fontSize = 14;
    const cellWidth = 15;
    const cellHeight = 18;
    
    ctx.font = `${fontSize}px monospace`;
    
    const animate = (timestamp: number) => {
      // Fill the canvas with the theme background color
      if (theme === 'dark') {
        ctx.fillStyle = 'rgb(0, 0, 0)'; // Black background for dark theme
      } else {
        ctx.fillStyle = 'rgb(255, 255, 255)'; // White background for light theme
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Remove expired glitch sections
      setGlitchSections(prev => prev.filter(section => 
        timestamp - section.startTime < section.duration
      ));
      
      // Create a map of glitched points for efficient lookup
      const glitchMap = new Map<string, { intensity: number, progress: number, elapsed: number }>();
      
      // Process all glitch sections
      glitchSections.forEach(section => {
        const elapsed = timestamp - section.startTime;
        const progress = elapsed / section.duration;
        
        // Sin wave for fading in and out
        const fadeEffect = Math.sin(progress * Math.PI);
        
        section.points.forEach(point => {
          const key = `${point.row},${point.col}`;
          const flicker = 0.5 + 0.5 * Math.sin(elapsed * 0.1);
          
          // Allow higher intensity points to override lower ones
          const existing = glitchMap.get(key);
          const newIntensity = section.intensity * fadeEffect * flicker;
          
          if (!existing || existing.intensity < newIntensity) {
            glitchMap.set(key, { 
              intensity: newIntensity,
              progress,
              elapsed
            });
          }
        });
      });

      // Draw the character grid with glitch effects
      for (let r = 0; r < gridRef.current.length; r++) {
        for (let c = 0; c < gridRef.current[r].length; c++) {
          const char = gridRef.current[r][c];
          const x = c * cellWidth;
          const y = r * cellHeight + fontSize;
          
          // Default dim brightness
          let brightness = 0.0; 
          
          // Check if this cell is glitched
          const glitchInfo = glitchMap.get(`${r},${c}`);
          
          if (glitchInfo) {
            brightness = Math.max(brightness, glitchInfo.intensity);
            
            // Occasionally replace character during glitch
            if (Math.random() < 0.03) {
              gridRef.current[r][c] = getRandomChar();
            }
          }
          
          // Calculate color based on theme and brightness
          if (brightness > 0) {
            // For dark theme: use white text with varying opacity
            // For light theme: use black text with varying opacity
            const opacity = brightness;
            const rgb = theme === 'dark' ? 255 : 0; // White for dark theme, black for light theme
            
            ctx.fillStyle = `rgba(${rgb}, ${rgb}, ${rgb}, ${opacity})`;
            
            // Add glow for brighter characters
            if (brightness > 0.6) {
              // Glow effect should match text color
              ctx.shadowColor = theme === 'dark'
                ? 'rgba(255, 255, 255, 0.5)'  // White glow in dark theme
                : 'rgba(0, 0, 0, 0.5)';       // Black glow in light theme
              ctx.shadowBlur = 3;
            } else {
              ctx.shadowBlur = 0;
            }
            
            // Draw the character
            ctx.fillText(char, x, y);
          }
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, glitchSections, theme]);
  
  const getRandomChar = () => {
    return matrixChars[Math.floor(Math.random() * matrixChars.length)];
  };
  
  return (
    <canvas 
      id="matrix-canvas"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7, backgroundColor: 'var(--background)' }}
    />
  );
} 