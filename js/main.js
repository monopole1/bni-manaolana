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

// スクロール終端へ到達するたび、フッターを上から下へ波で見せる
(function () {
  var footer = document.querySelector('.site-footer');
  var reveal = footer && footer.querySelector('.footer-ocean-reveal');
  if (!footer || !reveal) return;

  reveal.querySelectorAll('.sea-creature').forEach(function (creature) {
    var angle = Math.random() * Math.PI * 2;
    var distance = 70 + Math.random() * 150;
    creature.style.setProperty('--creature-duration', (1.2 + Math.random() * 1.4) + 's');
    creature.style.setProperty('--creature-delay', (.1 + Math.random() * .4) + 's');
    creature.style.setProperty('--creature-drift', (Math.cos(angle) * distance) + 'px');
    creature.style.setProperty('--creature-rise', (Math.sin(angle) * distance) + 'px');
    creature.style.setProperty('--creature-rotate', ((Math.random() - .5) * 50) + 'deg');
    creature.style.setProperty('--creature-end-rotate', ((Math.random() - .5) * 100) + 'deg');
  });

  var foam = reveal.querySelector('.footer-ocean-reveal__foam');
  for (var i = 0; i < 1000; i++) {
    var bubble = document.createElement('i');
    bubble.className = 'footer-bubble';
    bubble.style.setProperty('--bubble-x', (Math.random() * 100) + '%');
    bubble.style.setProperty('--bubble-size', (3 + Math.random() * 12) + 'px');
    bubble.style.setProperty('--bubble-delay', (Math.random() * .35) + 's');
    bubble.style.setProperty('--bubble-drift', ((Math.random() - .5) * 90) + 'px');
    if (foam) foam.appendChild(bubble);
  }

  var wasAtEnd = false;
  var waveTimer;
  function randomWaveShape() {
    var points = ['0% 46%'];
    for (var point = 1; point < 13; point++) {
      var x = Math.round(point * 100 / 12);
      var y = Math.round(24 + Math.random() * 30);
      points.push(x + '% ' + y + '%');
    }
    points.push('100% 100%', '0% 100%');
    return 'polygon(' + points.join(',') + ')';
  }
  function playAtScrollEnd() {
    var distance = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
    var atEnd = distance <= 8;
    if (!atEnd || wasAtEnd) {
      wasAtEnd = atEnd;
      return;
    }
    wasAtEnd = true;
    window.clearInterval(waveTimer);
    var foam = reveal.querySelector('.footer-ocean-reveal__foam');
    if (foam) {
      foam.style.clipPath = randomWaveShape();
      waveTimer = window.setInterval(function () {
        foam.style.clipPath = randomWaveShape();
      }, 140);
      window.setTimeout(function () { window.clearInterval(waveTimer); }, 2400);
    }
    reveal.classList.remove('is-open', 'creatures-visible');
    void reveal.offsetWidth;
    reveal.classList.add('creatures-visible');
    window.setTimeout(function () {
      reveal.classList.add('is-open');
    }, 500);
  }
  window.addEventListener('scroll', playAtScrollEnd, { passive: true });
  window.addEventListener('resize', playAtScrollEnd);
})();

// 波が引いた後、星を持った人物がサーフィンしてロゴに着地する
(function () {
  var logoWrap = document.querySelector('.hero__logo-wrap');
  var logo = logoWrap && logoWrap.querySelector('.hero__logo');
  if (!logoWrap || !logo) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  logoWrap.classList.add('is-awaiting-surfer');
  var surfer = document.createElement('img');
  surfer.src = 'images/logo-surfer.png';
  surfer.alt = '';
  surfer.setAttribute('aria-hidden', 'true');

  window.setTimeout(function () {
    var rect = logo.getBoundingClientRect();
    var surferSize = Math.max(150, rect.width * .7);
    var endX = rect.left + rect.width * .15;
    var endY = rect.top - rect.height * .01;
    var startX = window.innerWidth + surferSize * .1;
    var startY = Math.min(window.innerHeight - surferSize * .78, rect.top + rect.height * .62);
    surfer.className = 'hero-surfer';
    surfer.style.setProperty('--surfer-size', surferSize + 'px');
    document.body.appendChild(surfer);

    var flight = surfer.animate([
      { transform: 'translate3d(' + startX + 'px,' + startY + 'px,0) rotate(-13deg) scale(.78)', opacity: 0 },
      { transform: 'translate3d(' + (startX - window.innerWidth * .18) + 'px,' + (startY - 34) + 'px,0) rotate(-7deg) scale(.84)', opacity: 1, offset: .14 },
      { transform: 'translate3d(' + (endX + (startX - endX) * .54) + 'px,' + (startY + 18) + 'px,0) rotate(8deg) scale(.9)', opacity: 1, offset: .42 },
      { transform: 'translate3d(' + (endX + (startX - endX) * .22) + 'px,' + (endY - 42) + 'px,0) rotate(-5deg) scale(.96)', opacity: 1, offset: .72 },
      { transform: 'translate3d(' + (endX + 8) + 'px,' + (endY - 8) + 'px,0) rotate(-1deg) scale(.995)', opacity: 1, offset: .86 },
      { transform: 'translate3d(' + (endX + 2) + 'px,' + (endY - 2) + 'px,0) rotate(0deg) scale(1)', opacity: .72, offset: .98 },
      { transform: 'translate3d(' + endX + 'px,' + endY + 'px,0) rotate(0deg) scale(1)', opacity: 0 }
    ], {
      duration: 3400,
      easing: 'cubic-bezier(.2,.72,.18,1)',
      fill: 'forwards'
    });

    // 着地少し前から完成ロゴを重ね、両者をクロスフェードさせる
    window.setTimeout(function () {
      logoWrap.classList.remove('is-awaiting-surfer');
      logoWrap.classList.add('is-surfer-arrived');
      surfer.classList.add('is-landing');
    }, 1760);

    flight.onfinish = function () {
      if (surfer.parentNode) surfer.parentNode.removeChild(surfer);
    };
  }, 2750);
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

// 初回ロード時に海の波が画面を上へ流れてページを見せる
(function () {
  if (!document.getElementById('wave-noise')) {
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    defs.setAttribute('aria-hidden', 'true');
    defs.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    defs.innerHTML = '<filter id="wave-noise" x="-10%" y="-20%" width="120%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.045" numOctaves="3" seed="7" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G"/></filter>';
    document.body.appendChild(defs);
  }
  var overlay = document.createElement('div');
  overlay.className = 'ocean-reveal';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = '<span class="ocean-reveal__swell"></span><span class="ocean-reveal__foam"></span><span class="ocean-reveal__spray"></span><div class="top-sea-creatures" aria-hidden="true">🐬 🐢 🦑 🦐 ⭐ 🐴 🐚 🛸 🐙 🐡</div>';
  document.body.appendChild(overlay);

  var topCreatures = overlay.querySelector('.top-sea-creatures');
  topCreatures.textContent = '';
  ['🐬','🐢','🦑','🦐','⭐','𓆝','🐚','𓆟','🐙','🐡'].forEach(function (icon) {
    var creature = document.createElement('span');
    creature.textContent = icon;
    creature.className = 'top-sea-creature';
    var angle = Math.random() * Math.PI * 2;
    var distance = 70 + Math.random() * 170;
    creature.style.setProperty('--creature-x', (8 + Math.random() * 84) + '%');
    creature.style.setProperty('--creature-y', (24 + Math.random() * 55) + '%');
    creature.style.setProperty('--creature-size', (2.2 + Math.random() * 3.6) + 'rem');
    creature.style.setProperty('--creature-delay', (.1 + Math.random() * .4) + 's');
    creature.style.setProperty('--creature-duration', (1.2 + Math.random() * 1.2) + 's');
    creature.style.setProperty('--creature-drift-x', (Math.cos(angle) * distance) + 'px');
    creature.style.setProperty('--creature-drift-y', (Math.sin(angle) * distance) + 'px');
    topCreatures.appendChild(creature);
  });

  var foam = overlay.querySelector('.ocean-reveal__foam');
  function randomTopWaveShape() {
    var points = ['0% 46%'];
    for (var point = 1; point < 13; point++) {
      var x = Math.round(point * 100 / 12);
      var y = Math.round(20 + Math.random() * 34);
      points.push(x + '% ' + y + '%');
    }
    points.push('100% 100%', '0% 100%');
    return 'polygon(' + points.join(',') + ')';
  }
  var topWaveTimer = window.setInterval(function () {
    if (foam) foam.style.clipPath = randomTopWaveShape();
  }, 140);
  window.setTimeout(function () { window.clearInterval(topWaveTimer); }, 2600);
  overlay.classList.add('creatures-visible');
  window.setTimeout(function () { overlay.classList.add('is-open'); }, 500);

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    overlay.classList.add('ocean-reveal--reduced');
  }

  window.setTimeout(function () {
    overlay.classList.add('is-complete');
    window.setTimeout(function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, reducedMotion ? 500 : 2600);
  }, 40);
})();
