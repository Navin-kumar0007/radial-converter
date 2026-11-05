// Points the main button at the download for this device. Without it the button goes to the list.
(() => {
  const agent = navigator.userAgent;
  const touchMac = /Macintosh/.test(agent) && navigator.maxTouchPoints > 1;
  let id = null;
  if (/iPhone|iPad|iPod/.test(agent) || touchMac) id = 'iphone';
  else if (/Android/.test(agent)) id = 'android';
  else if (/Windows/.test(agent)) id = 'windows';
  else if (/Macintosh/.test(agent)) id = 'mac';
  if (!id) return;

  const card = document.getElementById(id);
  const link = card.querySelector('.button');
  const main = document.getElementById('get');
  card.classList.add('yours');
  main.href = link.href;
  main.textContent = link.dataset.main;
  if (id === 'iphone') document.getElementById('browser').hidden = true;
})();
