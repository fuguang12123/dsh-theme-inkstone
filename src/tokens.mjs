export const PLUGIN_ID = 'dsh-theme-inkstone';

// The reference vault uses Minimal E-ink: white/black surfaces and inverted
// interaction states. Muted levels below are an adaptation for a dense app UI.
export const PALETTES = Object.freeze({
  light: Object.freeze({
    canvas: '#ffffff', surface: '#ffffff', subtle: '#f5f5f5', hover: '#ededed',
    ink: '#161616', secondary: '#454545', muted: '#666666', border: '#9b9b9b',
    strongBorder: '#454545', inverse: '#ffffff', action: '#161616',
    actionHover: '#343434', selection: '#161616',
    h1: '#a52a3a', h2: '#a44d23', h3: '#80600a', h4: '#40652a', h5: '#315f86', h6: '#704991',
  }),
  dark: Object.freeze({
    canvas: '#000000', surface: '#090909', subtle: '#171717', hover: '#242424',
    ink: '#f2f2f2', secondary: '#d0d0d0', muted: '#a5a5a5', border: '#777777',
    strongBorder: '#bcbcbc', inverse: '#000000', action: '#f2f2f2',
    actionHover: '#d0d0d0', selection: '#f2f2f2',
    h1: '#ed8f9b', h2: '#e6a476', h3: '#e5c378', h4: '#afca88', h5: '#96bad6', h6: '#b8a1d6',
  }),
});

export const FONT_TEXT = 'var(--dsh-font-family-text, "霞鹜文楷", "LXGW WenKai", "Microsoft YaHei", system-ui, sans-serif)';
export const FONT_CODE = 'var(--dsh-font-family-code, "霞鹜文楷等宽", "LXGW WenKai Mono", Consolas, "Microsoft YaHei", monospace)';

export function createThemeTokens() {
  const tokens = {};
  const set = (names, value) => {
    for (const name of names.split(' ')) {
      tokens[name] = { light: value(PALETTES.light), dark: value(PALETTES.dark) };
    }
  };
  set('--dsw-alias-bg-base --dsw-alias-bg-layer-1 --dsw-specific-sidebar-fill', p => p.canvas);
  set('--dsw-alias-bg-layer-2 --dsw-alias-bg-overlay --dsw-specific-input-major --dsw-specific-menu --dsw-menu-surface-fill --dsw-alias-menu-group-header-fill --dsw-alias-button-elevated-fill --dsw-alias-button-floating-fill', p => p.surface);
  set('--dsw-alias-bg-layer-3 --dsw-alias-bg-module-platform --dsw-alias-bg-multi-select --dsw-specific-bubble --dsw-specific-login-input --dsw-specific-selector --dsw-specific-tip --dsw-alias-settings-card-fill --dsw-alias-markdown-code-block --dsw-alias-markdown-inline-code --dsw-alias-markdown-tag --dsw-alias-turn-trigger-bg', p => p.subtle);
  set('--dsw-alias-interactive-bg-hover --dsw-alias-interactive-bg-hover-solid --dsw-alias-button-floating-hover --dsw-specific-sidebar-nav-item-hover --dsw-alias-markdown-code-block-banner --dsw-alias-markdown-citation --dsw-alias-turn-trigger-bg-hover --dsw-alias-button-ghost-active-fill', p => p.hover);
  set('--dsw-alias-label-primary --dsw-alias-label-primary-bluish --dsw-alias-label-primary-dimmed --dsw-alias-brand-primary --dsw-alias-brand-text --dsw-alias-link --dsw-alias-label-deep-diving --dsw-alias-label-deep-diving-shimmer --dsw-alias-state-business-primary --dsw-focus-ring-color', p => p.ink);
  set('--dsw-alias-label-secondary --dsw-alias-menu-icon', p => p.secondary);
  set('--dsw-alias-label-tertiary --dsw-alias-label-caption', p => p.muted);
  set('--dsw-alias-label-primary-foreground --dsw-alias-label-primary-inverted --dsw-alias-brand-primary-invert', p => p.inverse);
  set('--dsw-alias-button-primary-fill --dsw-alias-button-info-fill --dsw-alias-button-contrast-fill', p => p.action);
  set('--dsw-alias-button-primary-hover --dsw-alias-button-info-hover', p => p.actionHover);
  set('--dsw-alias-interactive-bg-active --dsw-alias-interactive-bg-hover-accent --dsw-specific-sidebar-nav-item-active --dsw-specific-sidebar-nav-item-active-accent --dsw-specific-bubble-highlight --dsw-alias-state-business-tertiary --dsw-alias-button-ghost-active-hover', p => p.hover);
  set('--dsw-alias-border-l1 --dsw-alias-border-l2 --dsw-alias-border-l2-darkmode-thin --dsw-alias-settings-card-stroke --dsw-alias-button-ghost-active-border', p => p.border);
  set('--dsw-alias-border-l3 --dsw-alias-border-l4', p => p.strongBorder);
  set('--dsw-alias-scrollbar-bg-l1 --dsw-alias-scrollbar-bg-l2', p => p.border);
  set('--dsw-alias-scrollbar-hover-l1 --dsw-alias-scrollbar-hover-l2', p => p.strongBorder);
  set('--dsw-alias-bg-document-preview', p => p.subtle);
  set('--dsw-alias-label-document-preview', p => p.secondary);
  set('--dsw-alias-tooltip-bg --dsw-alias-toast-bg', p => p.ink);
  set('--dsw-alias-tooltip-key-bg', p => p.secondary);
  set('--dsw-alias-tooltip-label --dsw-alias-toast-label', p => p.inverse);
  set('--inkstone-selection', p => p.selection);
  set('--inkstone-selection-text', p => p.inverse);
  set('--inkstone-nav-ink --inkstone-nav-fill', p => p.canvas === '#ffffff' ? '#000000' : '#ffffff');
  set('--inkstone-nav-on-fill', p => p.canvas);
  set('--inkstone-nav-action-hover', p => p.canvas === '#ffffff' ? '#2a2a2a' : '#d5d5d5');
  for (let level = 1; level <= 6; level++) set(`--inkstone-h${level}`, p => p[`h${level}`]);
  set('--dsw-font-family', () => FONT_TEXT);
  set('--ds-font-family-code', () => FONT_CODE);
  set('--dsw-menu-backdrop-filter', () => 'none');
  for (const [size, px] of Object.entries({ xs: 3, sm: 5, md: 8, lg: 10, xl: 12, panel: 12 })) {
    set(`--dsw-radius-${size}`, () => `${px}px`);
  }
  return tokens;
}

export const THEME_TOKENS = createThemeTokens();
