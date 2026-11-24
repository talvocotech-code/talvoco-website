(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var header = $('.site-header'), nav = $('#nav'), burger = $('#burger'), toTop = $('#toTop');
  var closeMenu = function () { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); };
  var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); toTop.classList.toggle('show', window.scrollY > 700); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open); document.body.classList.toggle('menu-open', open);
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('click', function (e) { if (nav.classList.contains('open') && !e.target.closest('.site-header')) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', function () { if (window.innerWidth > 820) closeMenu(); });

  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(el); });
    // active menu link
    var links = [].slice.call(nav.querySelectorAll('a[href^="#"]:not(.btn)'));
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) links.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + e.target.id; a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var t = $(a.getAttribute('href')); if (t) spy.observe(t); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  $('#yr').textContent = new Date().getFullYear();

  // Front-end only form: opens the visitor's email app with the message ready to send.
  var form = $('#form'), note = $('#note');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, ok = true;
    ['name', 'email', 'need'].forEach(function (k) {
      var v = f[k].value.trim(), bad = !v || (k === 'email' && !/^\S+@\S+\.\S+$/.test(v));
      f[k].setAttribute('aria-invalid', bad); if (bad) ok = false;
    });
    if (!ok) { note.textContent = 'Please fill in your name, a valid email and what you need.'; return; }
    var body = 'Name: ' + f.name.value.trim() + '\nEmail: ' + f.email.value.trim() +
      (f.company.value.trim() ? '\nCompany: ' + f.company.value.trim() : '') + '\n\n' + f.need.value.trim();
    window.location.href = 'mailto:talvocotech@gmail.com?subject=' + encodeURIComponent('Free consultation request') + '&body=' + encodeURIComponent(body);
    note.textContent = 'Opening your email app. If nothing opens, email talvocotech@gmail.com or message us on WhatsApp.';
  });
})();
