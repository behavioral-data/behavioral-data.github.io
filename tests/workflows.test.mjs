import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('manual production deployment is limited to the repository default branch', () => {
  const workflow = fs.readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  assert.match(workflow, /if: github\.ref == format\('refs\/heads\/\{0\}', github\.event\.repository\.default_branch\)/);
});
