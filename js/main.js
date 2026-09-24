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

// 長いプロフィール文をカード内で開閉する
(function () {
  var buttons = document.querySelectorAll('.js-read-more');

  buttons.forEach(function (button) {
    var text = button.previousElementSibling;
    if (!text || !text.classList.contains('js-read-more-text')) return;

    button.addEventListener('click', function () {
      var expanded = text.classList.toggle('is-expanded');
      button.setAttribute('aria-expanded', String(expanded));
      button.textContent = expanded ? '閉じる' : 'もっと読む';
    });
  });
})();

// 写真差し替え用のダミーファイル名を各写真枠に付与
(function () {
  var photos = document.querySelectorAll('.photo');

  photos.forEach(function (photo, index) {
    var fileName = 'member-' + String(index + 1).padStart(2, '0') + '.jpg';
    photo.setAttribute('data-photo', fileName);
  });
})();

// ヒーローロゴの星に、控えめなきらめきを重ねる
(function () {
  var wraps = document.querySelectorAll('.sparkle-logo-wrap');
  if (!wraps.length) return;

  // ロゴの星がある上部の領域に、位置とタイミングをずらした光を配置
  var sparkles = [
    { x: 49, y: 5, size: 18, delay: 0 },
    { x: 56, y: 8, size: 13, delay: .18 },
    { x: 45, y: 11, size: 11, delay: .36 },
    { x: 61, y: 4, size: 10, delay: .55 },
    { x: 40, y: 7, size: 8, delay: .73 },
    { x: 66, y: 10, size: 9, delay: .91 },
    { x: 52, y: 14, size: 7, delay: .12 },
    { x: 37, y: 13, size: 6, delay: .29 },
    { x: 70, y: 6, size: 7, delay: .47 },
    { x: 47, y: 2, size: 6, delay: .64 },
    { x: 59, y: 14, size: 6, delay: .82 },
    { x: 43, y: 16, size: 5, delay: 1 }
  ];

  wraps.forEach(function (wrap) {
    sparkles.forEach(function (sparkle) {
      var star = document.createElement('span');
      star.className = 'logo-sparkle';
      star.setAttribute('aria-hidden', 'true');
      star.style.setProperty('--sparkle-x', sparkle.x + '%');
      star.style.setProperty('--sparkle-y', sparkle.y + '%');
      star.style.setProperty('--sparkle-size', (sparkle.size * 1.5) + 'px');
      star.style.setProperty('--sparkle-delay', sparkle.delay + 's');
      wrap.appendChild(star);
    });
  });
})();
