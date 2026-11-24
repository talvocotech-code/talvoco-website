(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var header = $('.site-header'), nav = $('#nav'), burger = $('#burger');
  var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(el); });
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
