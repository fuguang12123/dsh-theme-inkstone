import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { PALETTES, THEME_TOKENS } from '../src/tokens.mjs';
import { activateTheme } from '../src/activate.mjs';

function luminance(hex) {
  const rgb = hex.match(/[a-f0-9]{2}/gi).map(part => parseInt(part, 16) / 255)
    .map(channel => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + .05) / (values[1] + .05);
}

test('body, muted, placeholder, headings and action text remain legible in both palettes', () => {
  for (const [mode, palette] of Object.entries(PALETTES)) {
    for (const background of ['canvas', 'surface', 'subtle', 'hover']) {
      for (const text of ['ink', 'secondary', 'muted', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
        assert.ok(contrast(palette[text], palette[background]) >= 4.5,
          `${mode} ${text} on ${background}: ${contrast(palette[text], palette[background]).toFixed(2)}`);
      }
    }
    assert.ok(contrast(palette.inverse, palette.action) >= 4.5);
    assert.ok(contrast(palette.inverse, palette.actionHover) >= 4.5);
    assert.ok(contrast(THEME_TOKENS['--inkstone-nav-on-fill'][mode],
      THEME_TOKENS['--inkstone-nav-fill'][mode]) >= 4.5);
    assert.ok(contrast(THEME_TOKENS['--inkstone-nav-on-fill'][mode],
      THEME_TOKENS['--inkstone-nav-action-hover'][mode]) >= 4.5);
  }
});

test('built client registers lazily and enable/disable restores DOM and token layer', async () => {
  const source = await readFile(new URL('../dist/client.js', import.meta.url), 'utf8');
  let registration;
  vm.runInNewContext(source, { window: { __ModuleLoader__: { load(value) { registration = value; } } } });
  assert.equal(registration.id, 'dsh-theme-inkstone');
  const plugin = registration.factory();
  assert.equal(plugin.inject.join(','), 'theme');
  const attributes = new Map([['data-dsh-inkstone', 'existing-value']]);
  const styles = [];
  const disposers = [];
  const layers = new Map();
  const doc = {
    body: { getAttribute: key => attributes.has(key) ? attributes.get(key) : null,
      setAttribute: (key, value) => attributes.set(key, value), removeAttribute: key => attributes.delete(key) },
    head: { appendChild: tag => styles.push(tag) },
    createElement() { const tag = { dataset: {}, remove: () => styles.splice(styles.indexOf(tag), 1) }; return tag; },
  };
  const ctx = {
    effect(fn) { const dispose = fn(); if (dispose) disposers.push(dispose); },
    theme: { overrideTokens(id, tokens) {
      assert.ok(Object.keys(tokens).length >= 75);
      for (const value of Object.values(tokens)) {
        assert.equal(typeof value.light, 'string'); assert.equal(typeof value.dark, 'string');
      }
      layers.set(id, tokens); return () => layers.delete(id);
    } },
  };
  // Evaluate the packaged factory in its browser environment, not the ESM helper.
  let browserPlugin;
  vm.runInNewContext(source, { document: doc, window: { __ModuleLoader__: { load(value) { browserPlugin = value.factory(); } } } });
  browserPlugin.apply(ctx);
  assert.equal(styles.length, 1); assert.equal(layers.size, 1);
  assert.equal(styles[0].dataset.plugin, 'dsh-theme-inkstone');
  assert.equal(attributes.get('data-dsh-inkstone'), '');
  for (const dispose of disposers.reverse()) dispose();
  assert.equal(styles.length, 0); assert.equal(layers.size, 0);
  assert.equal(attributes.get('data-dsh-inkstone'), 'existing-value');
});

test('unsupported runtime fails before installing effects or changing preferences', () => {
  let effects = 0;
  assert.throws(() => activateTheme({ effect() { effects++; } }, THEME_TOKENS, '', undefined), /overrideTokens/);
  assert.equal(effects, 0);
  assert.match(THEME_TOKENS['--dsw-font-family'].light, /var\(--dsh-font-family-text,/);
  assert.match(THEME_TOKENS['--ds-font-family-code'].light, /var\(--dsh-font-family-code,/);
  assert.equal(THEME_TOKENS['--dsh-content-font-size'], undefined);
});
