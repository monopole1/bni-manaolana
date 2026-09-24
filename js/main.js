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

// メンバー紹介カードにダミーのホームページリンクを追加
(function () {
  var members = document.querySelectorAll('.member');

  members.forEach(function (member, index) {
    var company = member.querySelector('.member__company');
    if (!company) return;

    var link = document.createElement('a');
    link.href = 'https://taiko-densetsu.com/' + (index + 1);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'member__link';
    link.textContent = 'ホームページ';

    company.insertAdjacentElement('afterend', link);
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
