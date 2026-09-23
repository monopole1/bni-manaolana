// スマホ用ハンバーガーメニューの開閉
(function () {
  var btn = document.querySelector('.menu-toggle');
  var nav = document.getElementById('gnav');
  if (!btn || !nav) return;

  function setOpen(open) {
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    nav.classList.toggle('is-open', open);
  }

  btn.addEventListener('click', function () {
    setOpen(btn.getAttribute('aria-expanded') !== 'true');
  });

  // メニュー内のリンクを押したら閉じる
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  // Escキーで閉じる
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  // PC幅に戻ったら状態をリセット
  window.matchMedia('(min-width: 901px)').addEventListener('change', function (mq) {
    if (mq.matches) setOpen(false);
  });
})();
