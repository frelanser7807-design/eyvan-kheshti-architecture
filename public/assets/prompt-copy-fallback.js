document.addEventListener('click', async (event) => {
  const button = event.target.closest('.seo-route-fallback [data-copy-prompt]');
  if (!button) return;
  const source = document.getElementById(button.dataset.copyPrompt);
  if (!source) return;
  const value = source.textContent;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(value);
  } catch {
    const field = document.createElement('textarea');
    field.value = value;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    if (!copied) { button.textContent = 'Select the text below'; source.focus(); return; }
  }
  button.textContent = 'Copied ✓';
  window.setTimeout(() => { button.textContent = 'Copy full prompt'; }, 2000);
});
