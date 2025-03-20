"use client";

import { useEffect, useRef, useState } from 'react';

interface GridCell {
  x: number;
  y: number;
  size: number;
  pulsePhase: number;
  pulseSpeed: number;
  baseIntensity: number;
}

export default function CyberscapeBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Monochrome color palette
  const baseColor = '#000000'; // Dark blue-gray background
  const accentColor = '#363636'; // Slightly lighter accent
  const highlightColor = '#2d4c80'; // Highlight for subtle accents
  
  // Grid cells ref
  const gridCellsRef = useRef<GridCell[]>([]);
  const timeRef = useRef<number>(0);
  
  // Initialize grid and set dimensions
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDimensions({ width, height });
      
      // Configure grid
      const cellSize = 50; // Size of each grid cell
      const cells: GridCell[] = [];
      
      // Create grid cells
      for (let x = 0; x < width; x += cellSize) {
        for (let y = 0; y < height; y += cellSize) {
          cells.push({
            x,
            y,
            size: cellSize,
            pulsePhase: Math.random() * Math.PI * 2, // Random starting phase
            pulseSpeed: 0.0003 + Math.random() * 0.0002, // Very slow pulse
            baseIntensity: 0.05 + Math.random() * 0.1 // Very subtle base intensity
          });
        }
      }
      
      gridCellsRef.current = cells;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
  // Animation loop
  useEffect(() => {
    if (!dimensions.width) return;
    
    const canvas = document.getElementById('cyberscape-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    const animate = (timestamp: number) => {
      // Update time reference
      timeRef.current = timestamp;
      
      // Fill background
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid pattern
      drawGrid(ctx, timestamp);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);
  
  const drawGrid = (ctx: CanvasRenderingContext2D, timestamp: number) => {
    const { width, height } = dimensions;
    
    // Draw subtle horizontal and vertical lines across the entire canvas
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 0.5;
    
    // Horizontal lines
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Vertical lines
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw grid cells with varying intensity
    gridCellsRef.current.forEach(cell => {
      // Calculate pulse intensity based on time and cell's individual phase
      const pulseTime = timestamp * cell.pulseSpeed + cell.pulsePhase;
      const pulseValue = (Math.sin(pulseTime) + 1) * 0.5; // Value between 0 and 1
      const intensity = cell.baseIntensity + pulseValue * 0.1; // Very subtle variation
      
      // Only draw cells that are currently in a "higher" intensity state
      if (intensity > 0.1) {
        // Create a subtle gradient inside each cell
        const gradient = ctx.createLinearGradient(
          cell.x, cell.y, 
          cell.x + cell.size, cell.y + cell.size
        );
        
        gradient.addColorStop(0, `rgba(45, 76, 128, ${intensity * 0.2})`);
        gradient.addColorStop(1, `rgba(45, 76, 128, ${intensity * 0.05})`);
        
        // Draw cell interior
        ctx.fillStyle = gradient;
        ctx.fillRect(
          cell.x + 1, 
          cell.y + 1, 
          cell.size - 2, 
          cell.size - 2
        );
        
        // Occasionally draw a smaller accent square in cells
        if (pulseValue > 0.7 && Math.random() > 0.7) {
          ctx.fillStyle = `rgba(45, 76, 128, ${intensity * 0.4})`;
          const innerSize = cell.size * 0.3;
          const innerX = cell.x + (cell.size - innerSize) / 2;
          const innerY = cell.y + (cell.size - innerSize) / 2;
          
          ctx.fillRect(innerX, innerY, innerSize, innerSize);
        }
      }
    });
    
    // Add subtle horizontal "scan line" effect
    const scanLineY = (timestamp * 0.05) % height;
    const scanLineGradient = ctx.createLinearGradient(
      0, scanLineY - 10, 
      0, scanLineY + 10
    );
    
    scanLineGradient.addColorStop(0, 'rgba(45, 76, 128, 0)');
    scanLineGradient.addColorStop(0.5, 'rgba(45, 76, 128, 0.1)');
    scanLineGradient.addColorStop(1, 'rgba(45, 76, 128, 0)');
    
    ctx.fillStyle = scanLineGradient;
    ctx.fillRect(0, scanLineY - 10, width, 20);
  };
  
  // Occasional subtle pulse wave
  useEffect(() => {
    const triggerPulseWave = () => {
      if (Math.random() > 0.6) { // 40% chance to trigger
        // Choose a random grid cell as origin
        const cells = gridCellsRef.current;
        if (cells.length === 0) return;
        
        const originIndex = Math.floor(Math.random() * cells.length);
        const originCell = cells[originIndex];
        
        const originX = originCell.x + originCell.size / 2;
        const originY = originCell.y + originCell.size / 2;
        
        // Create pulse wave by temporarily boosting cells near the origin
        cells.forEach(cell => {
          const cellCenterX = cell.x + cell.size / 2;
          const cellCenterY = cell.y + cell.size / 2;
          
          // Calculate distance from origin
          const dx = cellCenterX - originX;
          const dy = cellCenterY - originY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Add pulse phase offset based on distance
          // This creates a ripple effect outward from the origin
          cell.pulsePhase = (timeRef.current * 0.001 + distance * 0.01) % (Math.PI * 2);
          
          // Also slightly increase base intensity for cells near origin
          if (distance < 300) {
            const boost = Math.max(0, 0.2 * (1 - distance / 300));
            cell.baseIntensity = Math.min(0.3, cell.baseIntensity + boost);
            
            // Gradually return to normal intensity
            setTimeout(() => {
              cell.baseIntensity = 0.05 + Math.random() * 0.1;
            }, Math.floor(1000 + distance * 5));
          }
        });
      }
    };
    
    const pulseInterval = setInterval(triggerPulseWave, 5000);
    
    return () => clearInterval(pulseInterval);
  }, []);
  
  return (
    <canvas 
      id="cyberscape-canvas"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ backgroundColor: baseColor }}
    />
  );
} 