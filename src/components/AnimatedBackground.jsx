import { useEffect, useRef } from 'react';

const AnimatedBackground = ({ isDarkMode }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const orbsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio || 1;

    const colors = [
      { r: 74, g: 144, b: 226 },
      { r: 80, g: 201, b: 195 },
      { r: 233, g: 75, b: 138 },
      { r: 243, g: 115, b: 53 },
      { r: 255, g: 169, b: 77 },
      { r: 155, g: 89, b: 182 }
    ];

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(pixelRatio, pixelRatio);
      return { width, height };
    };

    const createOrbs = (width, height) => {
      const numOrbs = 6;
      const orbs = [];
      for (let i = 0; i < numOrbs; i++) {
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseX: Math.random() * width,
          baseY: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.39, // Increased by 30% (0.3 * 1.3 = 0.39)
          vy: (Math.random() - 0.5) * 0.39, // Increased by 30%
          radius: Math.random() * 200 + 250,
          color: colors[i % colors.length],
          phase: Math.random() * Math.PI * 2,
          speed: 0.00065 + Math.random() * 0.00039 // Increased by 30%
        });
      }
      return orbs;
    };

    const { width, height } = resize();
    orbsRef.current = createOrbs(width, height);

    const handleResize = () => {
      const { width: newWidth, height: newHeight } = resize();
      orbsRef.current = createOrbs(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      const width = canvas.width / pixelRatio;
      const height = canvas.height / pixelRatio;

      ctx.clearRect(0, 0, width, height);

      const baseGradient = ctx.createLinearGradient(0, 0, width, height);
      if (isDarkMode) {
        // Dark grey/charcoal gradient
        baseGradient.addColorStop(0, '#121212');
        baseGradient.addColorStop(0.5, '#1a1a1a');
        baseGradient.addColorStop(1, '#0d0d0d');
      } else {
        baseGradient.addColorStop(0, '#f8f9fa');
        baseGradient.addColorStop(1, '#e9ecef');
      }
      ctx.fillStyle = baseGradient;
      ctx.fillRect(0, 0, width, height);

      const baseOpacity = isDarkMode ? 0.35 : 0.25;

      orbsRef.current.forEach((orb) => {
        orb.phase += orb.speed;
        // Increased floating movement by 30% (30 * 1.3 = 39)
        const floatX = Math.sin(orb.phase) * 39;
        const floatY = Math.cos(orb.phase * 0.8) * 39;

        // Remove mouse interaction - only autonomous movement
        orb.x = orb.baseX + floatX;
        orb.y = orb.baseY + floatY;

        orb.baseX += orb.vx;
        orb.baseY += orb.vy;

        if (orb.baseX < -100 || orb.baseX > width + 100) orb.vx *= -1;
        if (orb.baseY < -100 || orb.baseY > height + 100) orb.vy *= -1;

        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius
        );

        gradient.addColorStop(0, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, ${baseOpacity})`);
        gradient.addColorStop(0.5, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, ${baseOpacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(
          orb.x - orb.radius,
          orb.y - orb.radius,
          orb.radius * 2,
          orb.radius * 2
        );
      });

      ctx.globalCompositeOperation = 'overlay';
      if (isDarkMode) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      }
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default AnimatedBackground;

