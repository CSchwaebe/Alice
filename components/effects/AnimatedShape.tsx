import { motion } from "framer-motion";

interface AnimatedShapeProps {
  type: 'circle' | 'triangle' | 'square';
  className?: string;
}

export default function AnimatedShape({ type, className = '' }: AnimatedShapeProps) {
  const SYMBOL_HEIGHT = 100;

  const shape = {
    strokeWidth: 10,
    strokeLinecap: "round" as const,
    fill: "transparent",
    transformOrigin: "center",
  };

  // Helper functions to create paths
  const getCirclePath = () => {
    const radius = SYMBOL_HEIGHT / 2;
    const centerX = SYMBOL_HEIGHT;
    const centerY = SYMBOL_HEIGHT;
    return `M ${centerX} ${centerY - radius} A ${radius} ${radius} 0 1 1 ${centerX} ${centerY + radius} A ${radius} ${radius} 0 1 1 ${centerX} ${centerY - radius}`;
  };

  const getTrianglePath = () => {
    const size = 120;
    const height = SYMBOL_HEIGHT;
    const centerX = SYMBOL_HEIGHT;
    const y = (SYMBOL_HEIGHT * 2 - height) / 2;
    return `M ${centerX} ${y} L ${centerX + size/2} ${y + height} L ${centerX - size/2} ${y + height} Z`;
  };

  const getSquarePath = () => {
    const size = SYMBOL_HEIGHT;
    const x = (SYMBOL_HEIGHT * 2 - size) / 2;
    const y = (SYMBOL_HEIGHT * 2 - size) / 2;
    return `M ${x} ${y} h ${size} v ${size} h -${size} Z`;
  };

  const getPath = () => {
    switch (type) {
      case 'circle': return getCirclePath();
      case 'triangle': return getTrianglePath();
      case 'square': return getSquarePath();
      default: return '';
    }
  };

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${SYMBOL_HEIGHT * 2} ${SYMBOL_HEIGHT * 2}`}
      className={className}
      style={{ maxHeight: SYMBOL_HEIGHT * 2 }}
    >
      <path
        d={getPath()}
        className="stroke-foreground opacity-50"
        style={shape}
      />
    </svg>
  );
} 