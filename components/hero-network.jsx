'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createNetwork, cursorPull, projectNode } from '@/lib/hero-network.mjs';

const network = createNetwork();
const initial = network.nodes.map((node) => projectNode(node, 0));

export default function HeroNetwork() {
  const gradientId = useId();
  const svgRef = useRef(null);
  const pointer = useRef(null);
  const parallax = useRef({ x: 700, y: 300 });
  const time = useRef(0);
  const offsets = useRef(network.nodes.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 })));
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const svg = svgRef.current;
    const dots = [...svg.querySelectorAll('circle')];
    const lines = [...svg.querySelectorAll('line')];
    const hero = svg.closest('.hero');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const gradient = svg.querySelector('linearGradient');
    function fitColors() {
      const matrix = svg.getScreenCTM();
      if (!matrix) return;
      const bounds = svg.getBoundingClientRect();
      const inverse = matrix.inverse();
      gradient.setAttribute('x1', new DOMPoint(bounds.left, bounds.top).matrixTransform(inverse).x);
      gradient.setAttribute(
        'x2',
        new DOMPoint(bounds.right, bounds.top).matrixTransform(inverse).x,
      );
    }
    const resize = new ResizeObserver(fitColors);
    resize.observe(svg);
    fitColors();
    let visible = false;
    let frame = 0;
    let last = 0;

    function draw(projected) {
      const positions = projected.map((point, i) => {
        const offset = offsets.current[i];
        const x = point.x + offset.x;
        const y = point.y + offset.y;
        dots[i].setAttribute('cx', x);
        dots[i].setAttribute('cy', y);
        dots[i].setAttribute('r', point.radius);
        return { ...point, x, y };
      });
      network.edges.forEach((edge, i) => {
        const a = positions[edge.a];
        const b = positions[edge.b];
        lines[i].setAttribute('x1', a.x);
        lines[i].setAttribute('y1', a.y);
        lines[i].setAttribute('x2', b.x);
        lines[i].setAttribute('y2', b.y);
      });
    }

    function tick(now) {
      const step = Math.min((now - (last || now)) / 1000, 1 / 30);
      last = now;
      time.current += step;
      const destination = pointer.current || { x: 700, y: 300 };
      const easing = 1 - Math.exp(-step * 0.55);
      parallax.current.x += (destination.x - parallax.current.x) * easing;
      parallax.current.y += (destination.y - parallax.current.y) * easing;
      const projected = network.nodes.map((node) =>
        projectNode(node, time.current, parallax.current),
      );
      projected.forEach((point, i) => {
        const target = cursorPull(point, pointer.current);
        const offset = offsets.current[i];
        offset.vx += ((target.x - offset.x) * 1.8 - offset.vx * 3) * step;
        offset.vy += ((target.y - offset.y) * 1.8 - offset.vy * 3) * step;
        offset.x += offset.vx * step;
        offset.y += offset.vy * step;
      });
      draw(projected);
      frame = requestAnimationFrame(tick);
    }

    function sync() {
      cancelAnimationFrame(frame);
      last = 0;
      setReducedMotion(motion.matches);
      if (!paused && !motion.matches && visible && !document.hidden) {
        frame = requestAnimationFrame(tick);
      }
    }

    function followPointer(event) {
      if (paused || motion.matches) return;
      const matrix = svg.getScreenCTM();
      if (!matrix) return;
      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
      pointer.current = { x: point.x, y: point.y };
    }
    const clearPointer = () => (pointer.current = null);
    const releaseTouch = (event) => {
      if (event.pointerType !== 'mouse') clearPointer();
    };
    hero.addEventListener('pointermove', followPointer, { passive: true });
    hero.addEventListener('pointerleave', clearPointer);
    hero.addEventListener('pointercancel', clearPointer);
    hero.addEventListener('pointerup', releaseTouch);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) pointer.current = null;
      sync();
    });
    observer.observe(svg);
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      hero.removeEventListener('pointermove', followPointer);
      hero.removeEventListener('pointerleave', clearPointer);
      hero.removeEventListener('pointercancel', clearPointer);
      hero.removeEventListener('pointerup', releaseTouch);
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [paused]);

  return (
    <div className="hero-network">
      <svg
        ref={svgRef}
        viewBox="0 0 1400 600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2="1400"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#0f5ba9" />
            <stop offset="50%" stopColor="#5b3895" />
            <stop offset="100%" stopColor="#b4227a" />
          </linearGradient>
        </defs>
        <g strokeLinecap="round" stroke={`url(#${gradientId})`}>
          {network.edges.map((edge) => (
            <line
              key={`${edge.a}-${edge.b}`}
              x1={initial[edge.a].x}
              y1={initial[edge.a].y}
              x2={initial[edge.b].x}
              y2={initial[edge.b].y}
              strokeWidth={edge.width}
            />
          ))}
        </g>
        {network.nodes.map((node, i) => (
          <circle
            key={i}
            cx={initial[i].x}
            cy={initial[i].y}
            r={initial[i].radius}
            fill={`url(#${gradientId})`}
          />
        ))}
      </svg>
      {!reducedMotion && (
        <button
          className="network-toggle"
          onClick={() => {
            pointer.current = null;
            setPaused(!paused);
          }}
          aria-label={paused ? 'Play network animation' : 'Pause network animation'}
        >
          <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>
          {paused ? 'Play' : 'Pause'}
        </button>
      )}
    </div>
  );
}
