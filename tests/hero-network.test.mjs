import test from 'node:test';
import assert from 'node:assert/strict';
import { createNetwork, cursorPull, projectNode } from '../lib/hero-network.mjs';

test('the illustration is deterministic with unique valid edges and varied weights', () => {
  const network = createNetwork();
  assert.deepEqual(network, createNetwork());
  const keys = network.edges.map(({ a, b }) => [Math.min(a, b), Math.max(a, b)].join('-'));
  assert.equal(new Set(keys).size, keys.length);
  for (const edge of network.edges) {
    assert.notEqual(edge.a, edge.b);
    assert.ok(network.nodes[edge.a] && network.nodes[edge.b]);
  }
  assert.ok(new Set(network.edges.map((edge) => edge.width)).size > 3);
});

test('the larger field extends beyond the hero window and stays finite during motion', () => {
  const { nodes } = createNetwork();
  const positions = nodes.map((node) => projectNode(node, 0));
  assert.ok(nodes.length >= 400);
  assert.ok(nodes.filter((node) => node.floating).length >= 80);
  assert.ok(positions.some((p) => p.x < 0));
  assert.ok(positions.some((p) => p.x > 1400));
  assert.ok(positions.some((p) => p.y < 0));
  assert.ok(positions.some((p) => p.y > 600));
  assert.notDeepEqual(
    positions,
    nodes.map((node) => projectNode(node, 10)),
  );
  for (let time = 0; time < 120; time += 2) {
    for (const pointer of [null, { x: 0, y: 0 }, { x: 1400, y: 600 }]) {
      for (const node of nodes) {
        const p = projectNode(node, time, pointer);
        assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y));
        assert.ok(Math.abs(p.x) < 3000 && Math.abs(p.y) < 2000);
        assert.ok(Number.isFinite(p.radius) && p.radius > 0);
      }
    }
  }
});

test('cursor attraction draws nearby points closer without dragging distant points', () => {
  const point = { x: 240, y: 140 };
  const pointer = { x: 290, y: 180 };
  const pull = cursorPull(point, pointer);
  assert.ok(pull.x > 0 && pull.y > 0);
  const before = Math.hypot(pointer.x - point.x, pointer.y - point.y);
  const after = Math.hypot(pointer.x - point.x - pull.x, pointer.y - point.y - pull.y);
  assert.ok(after < before);
  assert.deepEqual(cursorPull(point, null), { x: 0, y: 0 });
  const distant = cursorPull(point, { x: 500, y: 360 });
  assert.equal(Math.hypot(distant.x, distant.y), 0);
  assert.deepEqual(cursorPull(point, point), { x: 0, y: 0 });
});
