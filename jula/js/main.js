// ===== Water Ripple =====
const canvas = document.getElementById('rippleCanvas');
const ctx = canvas.getContext('2d');
let ripples = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = 110 + Math.random() * 60;
    this.alpha = 0.4;
    this.lineWidth = 2.5;
    this.speed = 2.6 + Math.random() * 1.6;
  }

  update() {
    this.radius += this.speed;
    this.alpha = Math.max(0, 0.4 * (1 - this.radius / this.maxRadius));
    this.lineWidth = Math.max(0.4, 2.5 * (1 - this.radius / this.maxRadius));
  }

  draw() {
    if (this.alpha <= 0) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 107, 91, ${this.alpha})`;
    ctx.lineWidth = this.lineWidth;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.55, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha * 0.5})`;
    ctx.lineWidth = this.lineWidth * 0.6;
    ctx.stroke();
  }

  isDone() {
    return this.alpha <= 0;
  }
}

function createRipple(x, y) {
  ripples.push(new Ripple(x, y));
  if (ripples.length > 12) ripples.shift();
}

function animateRipples() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i];
    r.update();
    r.draw();
    if (r.isDone()) ripples.splice(i, 1);
  }
  requestAnimationFrame(animateRipples);
}
animateRipples();

document.addEventListener('click', (e) => {
  if (e.target.closest('a, button, input, .dock-item, .acc-header, .hire-btn')) return;
  createRipple(e.clientX, e.clientY);
});

document.addEventListener('touchstart', (e) => {
  if (e.target.closest('a, button, input, .dock-item, .acc-header, .hire-btn')) return;
  const t = e.touches[0];
  createRipple(t.clientX, t.clientY);
}, { passive: true });

// Subtle ripple on coral buttons
document.querySelectorAll('.btn-coral').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    const rect = btn.getBoundingClientRect();
    createRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
});

// ===== Dock Active State + Smooth Scroll =====
const sections = document.querySelectorAll('.section');
const dockItems = document.querySelectorAll('.dock-item');

function updateDock() {
  const scrollPos = window.scrollY + window.innerHeight * 0.4;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      dockItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === id) {
          item.classList.add('active');
        }
      });

      // Update logo / hire button color based on section
      const logo = document.querySelector('.logo');
      const hire = document.querySelector('.hire-btn');
      if (id === 'about' || id === 'work') {
        logo.style.color = 'var(--text-dark)';
        hire.style.color = 'var(--text-dark)';
        hire.style.borderColor = 'rgba(0,0,0,0.3)';
      } else {
        logo.style.color = 'var(--white)';
        hire.style.color = 'var(--white)';
        hire.style.borderColor = 'rgba(255,255,255,0.5)';
      }
    }
  });
}

// Section fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

sections.forEach(s => observer.observe(s));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

window.addEventListener('scroll', updateDock, { passive: true });
updateDock();
document.getElementById('home').classList.add('visible');

// ===== Accordion =====
document.querySelectorAll('.acc-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.acc-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.acc-icon').textContent = '+';
    });

    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      header.querySelector('.acc-icon').textContent = '−';
    }
  });
});

// ===== Contact Form =====
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const original = btn.textContent;

  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Message sent!';
    form.reset();

    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 2200);
  }, 1100);
});

console.log('Maria Jula Portfolio ready ✦');
