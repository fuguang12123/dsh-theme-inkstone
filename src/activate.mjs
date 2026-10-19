/** All effects are owned by Cordis; disabling the row removes this layer. */
export function activateTheme(ctx, tokens, css, doc = globalThis.document) {
  const id = 'dsh-theme-inkstone';
  if (typeof ctx.theme?.overrideTokens !== 'function') {
    throw new Error('墨白主题需要支持 theme.overrideTokens 的 DeepSeek Harness（目标版本 0.2.1-rc.2）。');
  }
  ctx.effect(() => ctx.theme.overrideTokens(id, tokens), `${id}: palette and fonts`);
  ctx.effect(() => {
    if (!doc?.body || !doc?.head) return;
    const previous = doc.body.getAttribute('data-dsh-inkstone');
    const style = doc.createElement('style');
    style.dataset.plugin = id;
    style.textContent = css;
    doc.head.appendChild(style);
    doc.body.setAttribute('data-dsh-inkstone', '');
    return () => {
      style.remove();
      if (previous === null) doc.body.removeAttribute('data-dsh-inkstone');
      else doc.body.setAttribute('data-dsh-inkstone', previous);
    };
  }, `${id}: markdown accents`);
}
