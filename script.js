document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var mainNav = document.getElementById('main-nav');

  menuToggle.addEventListener('click', function () {
    var isOpen = mainNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var answer = item.querySelector('.faq-a');

    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others (single-open accordion)
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });

      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 'px';
    });
  });

  /* ---------- Testimonial slider ---------- */
  var track = document.getElementById('storyTrack');
  var stories = track ? track.querySelectorAll('.story') : [];
  var dotsWrap = document.getElementById('storyDots');
  var prevBtn = document.getElementById('storyPrev');
  var nextBtn = document.getElementById('storyNext');
  var current = 0;
  var autoTimer;

  if (stories.length) {
    stories.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Show story ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); resetAuto(); });
      dotsWrap.appendChild(dot);
    });

    function render() {
      stories.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
      dotsWrap.querySelectorAll('button').forEach(function (d, i) {
        d.classList.toggle('is-active', i === current);
      });
    }

    function goTo(i) {
      current = (i + stories.length) % stories.length;
      render();
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(function () { goTo(current + 1); }, 6000);
    }

    prevBtn.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); resetAuto(); });

    render();
    resetAuto();
  }

  /* ---------- Booking form validation ---------- */
  var form = document.getElementById('bookForm');
  var formBody = document.getElementById('formBody');
  var successPanel = document.getElementById('successPanel');
  var resetBtn = document.getElementById('resetForm');

  var validators = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Enter your full name.'; },
    email: function (v) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(v.trim()) ? '' : 'Enter a valid email address.';
    },
    phone: function (v) {
      var digits = v.replace(/\D/g, '');
      return digits.length >= 7 ? '' : 'Enter a valid phone number.';
    },
    reason: function (v) { return v ? '' : 'Let us know what the visit is for.'; }
  };

  function showError(field, message) {
    var wrap = document.getElementById(field).closest('.field');
    var errEl = document.getElementById('err-' + field);
    wrap.classList.toggle('has-error', !!message);
    errEl.textContent = message;
  }

  Object.keys(validators).forEach(function (field) {
    var el = document.getElementById(field);
    el.addEventListener('blur', function () {
      showError(field, validators[field](el.value));
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    Object.keys(validators).forEach(function (field) {
      var el = document.getElementById(field);
      var message = validators[field](el.value);
      showError(field, message);
      if (message) valid = false;
    });

    if (!valid) {
      var firstError = form.querySelector('.has-error input, .has-error select');
      if (firstError) firstError.focus();
      return;
    }

    // Simulate a successful booking request
    formBody.hidden = true;
    successPanel.hidden = false;
  });

  resetBtn.addEventListener('click', function () {
    form.reset();
    Object.keys(validators).forEach(function (field) { showError(field, ''); });
    successPanel.hidden = true;
    formBody.hidden = false;
    document.getElementById('name').focus();
  });

});
