// Fluid background: slow, overlapping colour blobs drawn on a canvas.
// Skipped when the visitor has asked for reduced motion.
(function () {
  var canvas = document.getElementById('flow');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canvas && canvas.getContext && !reduce) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var blobs = [
      { x: 0.2, y: 0.3, r: 0.42, c: [77, 122, 91], sx: 0.00021, sy: 0.00017, px: 0.0, py: 1.3 },
      { x: 0.8, y: 0.2, r: 0.38, c: [183, 102, 61], sx: 0.00017, sy: 0.00023, px: 2.1, py: 0.4 },
      { x: 0.6, y: 0.8, r: 0.45, c: [31, 59, 45], sx: 0.00019, sy: 0.00014, px: 4.0, py: 2.2 },
      { x: 0.1, y: 0.9, r: 0.3, c: [214, 190, 140], sx: 0.00025, sy: 0.00019, px: 1.2, py: 3.7 }
    ];
    var w = 0, h = 0, start = performance.now(), frame = null;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(now) {
      var t = now - start;
      ctx.clearRect(0, 0, w, h);
      var size = Math.max(w, h);
      blobs.forEach(function (b) {
        var x = (b.x + Math.sin(t * b.sx + b.px) * 0.12) * w;
        var y = (b.y + Math.cos(t * b.sy + b.py) * 0.12) * h;
        var r = b.r * size;
        var g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(' + b.c.join(',') + ', 0.55)');
        g.addColorStop(1, 'rgba(' + b.c.join(',') + ', 0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });
      frame = requestAnimationFrame(draw);
    }

    // Pause when the tab is hidden to save battery.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(frame);
      } else {
        frame = requestAnimationFrame(draw);
      }
    });

    window.addEventListener('resize', resize);
    resize();
    frame = requestAnimationFrame(draw);
  } else if (canvas) {
    canvas.style.display = 'none';
  }

  // Lightbox: click any gallery photo to view it full size.
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = lightbox.querySelector('img');
  var closeBtn = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery img').forEach(function (img) {
    img.addEventListener('click', function () {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.hidden = false;
      closeBtn.focus();
    });
  });

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
})();
