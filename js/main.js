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

// 役職・メンバー情報を一元化し、追加分も含めて指定順に描画
(function () {
  var people = {
    watanabe: { photo: 'member-01.png', name: '渡辺 将基', kana: 'わたなべ まさき', company: '株式会社大向電設', category: '商工業施設電気工事', url: 'https://taiko-densetsu.com/', text: '「遊ざる者、働くべからず」をモットーに、栃木県那須塩原市・山形県新庄市で電気工事店を営んでおります。電気工事は難しいですよね？節電をやる？補助金は使える？小さなことでも、一度ご相談ください。', contact: '電気設備工事・エアコン工事' },
    ohashiTomoko: { photo: 'member-04.png', name: '大橋 智子', kana: 'おおはし ともこ', company: '行政書士大橋智子事務所', category: '夢をかなえるまちづくり行政書士', url: 'https://tomoko-dreamtown.jp/', text: '相続・遺言・終活を中心に、任意後見・死後事務など、人生の「もしも」に備えるお手伝いをしています。親の相続が心配な方、遺言を書いておきたい方、ひとり暮らしの将来が不安な方など、家族のこれからを考え始めた方をご紹介ください。', contact: 'カフェやサロン・飲食店、福祉・介護事業・保育施設、建設業' },
    watanabeShota: { photo: 'member-06.png', name: '渡部 翔大', kana: 'わたなべ しょうた', company: 'ファイナンシャルアドバイザー', category: '証券業', url: 'https://www.jw-advisers.co.jp/', text: '豊かな暮らしを実現するための頼れる伴走者として、お客様に常に寄り添い、将来ビジョンに沿った資産運用・資産保全・お金に関する問題全体に的確なソリューションを提供いたします。', contact: '公認会計士・税理士・不動産業・銀行員・信託銀行員' },
    suga: { photo: 'member-02.png', name: '須賀 修一', kana: 'すが しゅういち', company: '株式会社須賀建設', category: '高性能住宅新築リフォーム', url: 'https://sugakensetsu.jp/', text: '冬暖かく夏涼しい。そんな高性能で快適な家に住んでみませんか？新築はもちろん、リフォームでも実現できます。地熱利用２４時間換気で空気もキレイに、おうち時間の充実ならお任せください。', contact: '保険代理店・ファイナンシャルプランナー' },
    shiraishi: { photo: 'member-08.png', name: '白石 龍馬', kana: 'しらいし りょうま', company: '株式会社番町投資不動産', category: '不動産トータルコーディネーター', url: 'https://bancho-toushi.co.jp/', text: '不動産を通じて、お客様の資産を最適化。ヒアリングから人生設計、金融機関開拓、物件選定、建築設計、管理、アフターフォロー、相続・資産継承まで一気通貫で展開しています。', contact: '住宅販売・士業・FP・保険業・IFA等' },
    inaba: { photo: 'member-07.png', name: '稲葉 俊桓', kana: 'いなば としゆき', company: '稲葉塗装工業株式会社', category: '建築・塗装', url: 'http://inabatosou.com/', text: '『塗装明るい街くり』塗装実績1300棟以上！最先端ハイグレード塗装を安心価格にてご提案します。', contact: '工務店・建設業・不動産業・工場・企業' },
    ijima: { photo: 'member-05.png', name: '飯島 諸', kana: 'いいじま りょう', company: '合同会社ライーブ', category: '残置物撤去', url: 'http://inabatosou.com/', text: '残置物撤去、引越しに伴う付帯業務をノンストップで行い、価格・スピード感・窓口統一の安心感をご提供します。', contact: '不動産業・士業・解体業' },
    hashimoto: { photo: 'member-10.png', name: '橋本 悟志', kana: 'はしもと さとし', company: 'タイガーワークス', category: '便利屋', url: 'https://r.goope.jp/tigerworks', text: '電気・ガス・水道インフラや医療系資格も多数持っている買取もできる便利屋です。小さなことから大きなことまで、どんなことでもお気軽にご相談下さい。', contact: '電気・水道・ガス工事・買取・仕入れ・解体・片付け・遺品整理・医療機器メンテナンス' },
    kawata: { photo: 'member-11.png', name: '川田 裕祥', kana: 'かわた ゆうしょう', company: 'エルライズ株式会社', category: '業務改善ITサポート', url: 'https://elrise.co.jp', text: '企業や組織課題に対し、テクノロジー力で柔軟かつ実践的なソリューションを提供しています。経験豊富なエンジニア人材をチーム一員としてご提案・ご提供しています。', contact: '経営コンサルタント・中小企業診断士・ITコンサルタント・OA機器・複合機販売・法人保険営業' },
    ohashiTakao: { photo: 'member-03.png', name: '大橋 孝生', kana: 'おおはし たかお', company: '株式会社エース', category: '内装仕上業', url: 'https://www.as-interior.com/', text: '高い技術力と、どんな内装工事にも対応できる幅広い対応力が強みです。技術を最大限に活かした施工で、お客様に信頼とご満足をお届けします。', contact: '不動産屋・事務機器販売店・元請建設業者・そこぬけ楽しい人' },
    ayabe: { photo: 'member-09.png', name: '綾部 篤', kana: 'あやべ あつし', company: 'ファームリンク株式会社', category: '野菜EC販売', url: 'https://qr.paps.jp/zbiPq', text: 'ネット販売を通じてこだわり食材を安心してご購入いただける環境を提供しています。新商品の販売先や販売戦略・市場調査のご相談も承ります。', contact: 'スーパーバイヤー・飲食店経営者・食品製造業者・食品生産者・OEM製造業' }
  };
  var leadership = [['プレジデント','watanabe'],['バイスプレジデント','ohashiTomoko'],['書記兼会計','watanabeShota'],['エデュケーションコーディネーター','suga']];
  var support = [['ビジターホストコーディネーター、メンターコーディネーター','shiraishi'],['グロースコーディネーター','hashimoto'],['WEBマスター','kawata'],['イベント委員長','inaba'],['BCP委員','ijima'],['推薦のことば担当','watanabeShota']];
  var membership = [['メンバーシップ委員評価担当','ayabe'],['メンバーシップ委員規定運用担当','hashimoto'],['メンバーシップ委員審査担当','ohashiTakao'],['メンバーシップ委員ディベロップメント担当','inaba']];
  function officer(pair) { var p = people[pair[1]], li = document.createElement('li'); li.className = 'officer'; li.innerHTML = '<div class="photo"><img src="images/' + p.photo + '" alt="' + pair[0] + ' ' + p.name + '" width="136" height="136"></div><p class="officer__role">' + pair[0] + '</p><p class="officer__name">' + p.name + '</p><p class="officer__company">' + p.company + '<br>' + p.category + '</p><a class="officer__link" href="' + p.url + '" target="_blank" rel="noopener noreferrer">ホームページ</a><p class="officer__text js-read-more-text">' + p.text + '<br><span class="contact-list-label">コンタクトリスト</span><br>' + p.contact + '</p><button class="read-more js-read-more" type="button" aria-expanded="false">もっと読む</button>'; return li; }
  var groups = document.querySelectorAll('#team .officer-grid');
  [leadership, support, membership].forEach(function (list, i) { if (!groups[i]) { var g = document.createElement('div'); g.className = 'group'; g.innerHTML = '<div class="group-label"><h3>' + ['リーダーシップチーム','サポートチーム','メンバーシップ委員会'][i] + '</h3></div><ul class="officer-grid"></ul>'; document.querySelector('#team .container').appendChild(g); groups = document.querySelectorAll('#team .officer-grid'); } groups[i].replaceChildren.apply(groups[i], list.map(officer)); });
  var cats = { 'cat-food': ['ayabe'], 'cat-realestate': ['suga','ohashiTakao','watanabe','shiraishi','inaba'], 'cat-finance': ['watanabeShota'], 'cat-health': ['ijima'], 'cat-business': ['ohashiTomoko','hashimoto','kawata'] };
  Object.keys(cats).forEach(function (id) { var grid = document.querySelector('#' + id + ' .member-grid'); if (!grid) return; grid.replaceChildren.apply(grid, cats[id].map(function (key) { var p = people[key], li = document.createElement('li'); li.className = 'member'; li.innerHTML = '<div class="member__head"><div class="photo"><img src="images/' + p.photo + '" alt="' + p.name + ' ' + p.category + '" width="136" height="136"></div><div class="member__info"><span class="member__tag">' + p.category + '</span><p class="member__name">' + p.name + '</p><p class="member__company">' + p.company + '</p></div></div><a class="member__link" href="' + p.url + '" target="_blank" rel="noopener noreferrer">ホームページ</a><p class="member__text">' + p.text + '<br><span class="contact-list-label">コンタクトリスト</span><br>' + p.contact + '</p>'; return li; })); });
  document.querySelectorAll('.js-read-more').forEach(function (button) { button.addEventListener('click', function () { var text = button.previousElementSibling; var expanded = text.classList.toggle('is-expanded'); button.setAttribute('aria-expanded', String(expanded)); button.textContent = expanded ? '閉じる' : 'もっと読む'; }); });
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
