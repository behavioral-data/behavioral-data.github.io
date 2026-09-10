// A fixed distribution keeps the server-rendered illustration and hydration identical.
export function createNetwork() {
  const random = (index, salt) => {
    const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
    return value - Math.floor(value);
  };
  const nodes = Array.from({ length: 410 }, (_, i) => {
    const free = i >= 320;
    const floating = free || (i % 20 < 7 && i % 2 === 0);
    const x = free
      ? (random(i, 1) - 0.5) * 1920
      : ((i % 20) / 19 - 0.5) * 1920 + (random(i, 1) - 0.5) * 80;
    const y = free
      ? (random(i, 2) - 0.5) * 1000
      : (Math.floor(i / 20) / 15 - 0.5) * 1000 + (random(i, 2) - 0.5) * 70;
    return {
      x,
      y,
      z: (random(i, 3) - 0.5) * 280,
      radius: floating ? 2.2 + random(i, 4) * 4 : 3.8 + random(i, 4) * 3.6,
      phase: i * 1.7,
      floating,
    };
  });
  const edges = [];
  const seen = new Set();
  nodes.forEach((node, i) => {
    if (node.floating) return;
    const neighbors = nodes
      .map((other, j) => ({
        j,
        distance: Math.hypot(node.x - other.x, node.y - other.y, node.z - other.z),
      }))
      .filter(({ j }) => j !== i && !nodes[j].floating)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2 + (i % 2));
    for (const [rank, { j }] of neighbors.entries()) {
      const key = [Math.min(i, j), Math.max(i, j)].join('-');
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({
        a: i,
        b: j,
        width: rank < 2 ? 2.8 + ((i * 3 + j) % 5) * 0.55 : 1 + (i % 3) * 0.3,
      });
    }
  });
  return { nodes, edges };
}

export function projectNode(node, time, pointer = null) {
  const yaw = Math.sin(time * 0.12) * 0.1;
  const pitch = Math.sin(time * 0.09) * 0.07;
  const x = node.x * Math.cos(yaw) + node.z * Math.sin(yaw);
  const z = -node.x * Math.sin(yaw) + node.z * Math.cos(yaw);
  const y = node.y * Math.cos(pitch) - z * Math.sin(pitch);
  const depth = node.y * Math.sin(pitch) + z * Math.cos(pitch);
  const perspective = 1600 / (1600 - depth);
  const parallaxX = pointer ? (pointer.x - 700) * (depth / 280) * 0.045 : 0;
  const parallaxY = pointer ? (pointer.y - 300) * (depth / 280) * 0.045 : 0;
  const drift = node.floating ? 22 : 12;
  return {
    x: 700 + (x + Math.sin(time * 0.4 + node.phase) * drift) * perspective + parallaxX,
    y: 300 + (y + Math.cos(time * 0.35 + node.phase) * drift) * perspective + parallaxY,
    radius: node.radius * perspective,
  };
}

export function cursorPull(point, pointer) {
  if (!pointer) return { x: 0, y: 0 };
  const dx = pointer.x - point.x;
  const dy = pointer.y - point.y;
  const distance = Math.hypot(dx, dy);
  const influence = Math.max(0, 1 - distance / 230);
  const strength = influence * influence * 1.1;
  return { x: dx * strength, y: dy * strength };
}
