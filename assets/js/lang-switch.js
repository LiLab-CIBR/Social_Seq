(function () {
  'use strict';

  var scriptEl = null;
  var scripts = document.getElementsByTagName('script');
  for (var i = 0; i < scripts.length; i++) {
    if (/lang-switch\.js/.test(scripts[i].src || '')) {
      scriptEl = scripts[i];
      break;
    }
  }

  var basePath = '';
  if (scriptEl) {
    var m = /^(.*)\/assets\/js\/lang-switch\.js$/.exec(scriptEl.src);
    if (m) {
      basePath = m[1];
    }
  }

  var path = location.pathname;
  var enIdx = path.indexOf('/en/');
  var currentLang = enIdx !== -1 ? 'en' : 'zh';
  var baseDir = basePath ? basePath.replace(location.origin, '') : '';

  var enUrl;
  var zhUrl;

  if (currentLang === 'en') {
    zhUrl = location.origin + (path.slice(0, enIdx) + '/' + path.slice(enIdx + 4)).replace(/\/{2,}/g, '/');
    enUrl = location.href.split('#')[0];
  } else {
    var rest = path.slice(baseDir.length).replace(/^\/+/, '');
    enUrl = (basePath || location.origin) + '/en/' + rest;
    zhUrl = location.href.split('#')[0];
  }

  var labels = { en: 'English', zh: '中文' };

  function item(lang, url) {
    var a = document.createElement('a');
    a.className = 'lang-switch-item' + (lang === currentLang ? ' active' : '');
    a.href = url;
    a.textContent = labels[lang];
    a.setAttribute('data-lang', lang);
    if (lang === currentLang) {
      a.setAttribute('aria-current', 'true');
    }
    return a;
  }

  var container = document.createElement('div');
  container.className = 'lang-switch';

  var button = document.createElement('button');
  button.className = 'lang-switch-btn';
  button.type = 'button';
  button.setAttribute('aria-label', 'Switch language');
  button.setAttribute('aria-haspopup', 'true');
  button.setAttribute('aria-expanded', 'false');
  button.textContent = '中/En';

  var menu = document.createElement('div');
  menu.className = 'lang-switch-menu';
  menu.hidden = true;
  menu.appendChild(item('zh', zhUrl));
  menu.appendChild(item('en', enUrl));

  container.appendChild(menu);
  container.appendChild(button);

  var host = document.querySelector('.wy-nav-content');
  if (host) {
    host.appendChild(container);
  } else {
    document.body.appendChild(container);
  }

  function close() {
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
  }

  button.addEventListener('click', function (ev) {
    ev.stopPropagation();
    menu.hidden = !menu.hidden;
    button.setAttribute('aria-expanded', String(!menu.hidden));
  });

  document.addEventListener('click', function (ev) {
    if (!container.contains(ev.target)) {
      close();
    }
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') {
      close();
    }
  });
})();
