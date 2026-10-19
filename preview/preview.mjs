import { THEME_TOKENS } from '/src/tokens.mjs';

const body = document.body;
const scheme = document.querySelector('#scheme');
const media = matchMedia('(prefers-color-scheme: dark)');
const storageKey = 'inkstone-preview';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch {}
if (['light', 'dark', 'system'].includes(saved.scheme)) scheme.value = saved.scheme;

function applyScheme() {
  const dark = scheme.value === 'dark' || (scheme.value === 'system' && media.matches);
  const mode = dark ? 'dark' : 'light';
  body.toggleAttribute('data-ds-dark-theme', dark);
  document.documentElement.style.colorScheme = mode;
  for (const [name, values] of Object.entries(THEME_TOKENS)) body.style.setProperty(name, values[mode]);
  try { localStorage.setItem(storageKey, JSON.stringify({ scheme: scheme.value })); } catch {}
}
scheme.addEventListener('change', applyScheme);
media.addEventListener('change', applyScheme);
applyScheme();

let toastTimer;
function toast(text) {
  const el = document.querySelector('.toast');
  el.textContent = text;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 3300);
}

const appearance = document.querySelector('#appearance');
const panel = document.querySelector('#appearance-panel');
appearance.addEventListener('click', () => {
  panel.hidden = !panel.hidden;
  appearance.setAttribute('aria-expanded', String(!panel.hidden));
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !panel.hidden) {
    panel.hidden = true; appearance.setAttribute('aria-expanded', 'false'); appearance.focus();
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault(); document.querySelector('#search').focus();
  }
});
document.addEventListener('click', event => {
  if (!panel.hidden && !panel.contains(event.target) && !appearance.contains(event.target)) {
    panel.hidden = true; appearance.setAttribute('aria-expanded', 'false');
  }
});
const slider = document.querySelector('#font-size');
slider.addEventListener('input', () => {
  body.style.setProperty('--preview-body-size', `${slider.value}px`);
  document.querySelector('#font-size-value').value = `${slider.value} px`;
});
document.querySelector('#wenkai').addEventListener('change', event => {
  if (event.target.checked) body.style.removeProperty('--dsh-font-family-text');
  else body.style.setProperty('--dsh-font-family-text', '"Microsoft YaHei", system-ui, sans-serif');
});
document.querySelectorAll('.sidebar-toggle').forEach(button => button.addEventListener('click', () => {
  if (innerWidth <= 760) { body.classList.remove('sidebar-collapsed'); body.classList.toggle('sidebar-mobile-open'); }
  else body.classList.toggle('sidebar-collapsed');
}));
const search = document.querySelector('#search');
search.addEventListener('input', () => {
  const items = [...document.querySelectorAll('.session')];
  items.forEach(item => { item.hidden = !item.textContent.toLowerCase().includes(search.value.trim().toLowerCase()); });
  document.querySelector('.empty-search').hidden = items.some(item => !item.hidden);
});
const originalMessages = document.querySelector('#messages').innerHTML;
document.querySelectorAll('.session').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.session').forEach(item => {
    item.classList.toggle('active', item === button);
    if (item === button) item.setAttribute('aria-current', 'page'); else item.removeAttribute('aria-current');
  });
  document.querySelector('#session-title').textContent = button.querySelector('span').textContent;
  const messages = document.querySelector('#messages');
  messages.innerHTML = originalMessages;
  if (button.dataset.session !== 'binary') {
    const user = messages.querySelector('.user-message p');
    user.textContent = button.dataset.session === 'prefix' ? '前缀和为什么可以配合哈希表使用？' : '帮我整理一下今天的阅读笔记。';
    const reading = messages.querySelector('.reading');
    reading.replaceChildren();
    const heading = document.createElement('h2'); heading.textContent = '留一点空间，给新的思考';
    const paragraph = document.createElement('p'); paragraph.textContent = '这是主题的空白会话样式。可以在下方输入内容，查看中文、标点与段落的阅读效果。';
    reading.append(heading, paragraph);
  }
  bindCopy();
  document.querySelector('#transcript').scrollTop = 0;
  body.classList.remove('sidebar-mobile-open');
}));
const draft = document.querySelector('#draft');
const send = document.querySelector('#send');
draft.addEventListener('input', () => { send.disabled = draft.value.trim().length === 0; });
document.querySelector('#composer').addEventListener('submit', event => {
  event.preventDefault();
  const text = draft.value.trim();
  if (!text) return;
  const article = document.createElement('article'); article.className = 'user-message';
  const paragraph = document.createElement('p'); paragraph.textContent = text; article.append(paragraph);
  document.querySelector('#messages').append(article);
  draft.value = ''; send.disabled = true;
  const transcript = document.querySelector('#transcript'); transcript.scrollTop = transcript.scrollHeight;
  toast('已显示你的预览消息；此页面不调用模型。');
});
draft.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); document.querySelector('#composer').requestSubmit(); }
});
document.querySelector('#new-chat').addEventListener('click', () => {
  document.querySelector('#messages').replaceChildren();
  document.querySelector('#session-title').textContent = '新建会话';
  document.querySelectorAll('.session').forEach(item => { item.classList.remove('active'); item.removeAttribute('aria-current'); });
  draft.focus(); body.classList.remove('sidebar-mobile-open');
});
document.querySelector('#about').addEventListener('click', () => toast('墨白 0.1.4 · 参考你本地的 Minimal E-ink 与霞鹜文楷。'));
for (const id of ['workspace', 'workspace-add', 'attachment']) document.querySelector(`#${id}`).addEventListener('click', () => toast('这是主题预览。工作区与附件由 Harness 原生功能提供。'));
async function copy(text, button) {
  try { await navigator.clipboard.writeText(text); toast('已复制'); }
  catch { toast('当前浏览器没有允许复制，请直接选择文字复制。'); }
  button.focus();
}
function bindCopy() {
  const codeButton = document.querySelector('#copy-code');
  codeButton?.addEventListener('click', () => copy(document.querySelector('#code-sample').textContent, codeButton));
  const answerButton = document.querySelector('#copy-answer');
  answerButton?.addEventListener('click', () => copy(document.querySelector('.reading').innerText, answerButton));
}
bindCopy();
