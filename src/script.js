class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
    this.total = 0;
    this.updateCartBadge();
  }
  addItem(product) {
    const existingItem = this.items.find(
      item => item.id === product.id && item.size === product.size
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.saveCart();
    this.updateCartBadge();
    this.showNotification('Product added to cart');
  }

  removeItem(productId, size) {
    this.items = this.items.filter(item => !(item.id === productId && item.size === size));
    this.saveCart();
    this.updateCartBadge();
  }

  updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    const total = this.items.reduce((sum, item) => sum + item.quantity, 0);
    if (!badge) return; // guard if markup is missing
    badge.textContent = total;
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
}

// Newsletter Form Validation
function validateNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  const emailInput = document.getElementById('newsletterEmail');
  const successMessage = document.getElementById('newsletterSuccess');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!emailInput.value.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i)) {
      form.classList.add('was-validated');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      successMessage.classList.remove('d-none');
      form.reset();
      form.classList.remove('was-validated');
      setTimeout(() => successMessage.classList.add('d-none'), 5000);
    }, 1000);
  });
}

// Product Quick View
function initializeQuickView() {
  document.querySelectorAll('[data-quick-view]').forEach(button => {
    button.addEventListener('click', e => {
      const productId = e.currentTarget.dataset.productId;
      // Fetch product details and show modal
      showQuickViewModal(productId);
    });
  });
}

function showQuickViewModal(productId) {
  // Implementation for quick view modal
}

// Initialize all functionality
// Scroll Reveal Function
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );

  const revealOnScroll = () => {
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 100) {
        element.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check
}

// Parallax Effect Function
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-section');

  window.addEventListener('scroll', () => {
    parallaxElements.forEach(element => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.3;
      element.style.backgroundPosition = `center ${rate}px`;
    });
  });
}

// Float Animation Function
function initFloatingElements() {
  const images = document.querySelectorAll('.img-fluid');
  images.forEach((img, index) => {
    if (index % 2 === 0) {
      // Add floating effect to every other image
      img.classList.add('floating-element');
    }
  });
}

// Lazy-load assets (images, srcset, iframes, videos, background images)
function initLazyAssets() {
  const selector = 'img[data-src], img[data-srcset], iframe[data-src], video[data-src], [data-bg]';

  function loadElement(el) {
    const tag = el.tagName && el.tagName.toLowerCase();
    if (tag === 'img') {
      if (el.dataset.src) el.src = el.dataset.src;
      if (el.dataset.srcset) el.srcset = el.dataset.srcset;
      el.classList.add('lazyloaded');
      el.removeAttribute('data-src');
      el.removeAttribute('data-srcset');
    } else if (tag === 'iframe') {
      if (el.dataset.src) el.src = el.dataset.src;
      el.removeAttribute('data-src');
    } else if (tag === 'video') {
      // set sources, then load
      Array.from(el.querySelectorAll('source')).forEach(s => {
        if (s.dataset.src) {
          s.src = s.dataset.src;
          s.removeAttribute('data-src');
        }
      });
      if (el.dataset.src) {
        el.src = el.dataset.src;
        el.removeAttribute('data-src');
      }
      try {
        el.load();
      } catch (err) {
        // ignore
      }
      el.classList.add('lazyloaded');
    } else {
      // background element
      const bg = el.dataset.bg;
      if (bg) {
        // preload image before applying to avoid flash
        const img = new Image();
        img.onload = () => {
          el.style.backgroundImage = `url('${bg}')`;
          el.classList.add('bg-loaded');
        };
        img.src = bg;
        el.removeAttribute('data-bg');
      }
    }
  }

  // If IntersectionObserver not supported, eagerly load
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll(selector).forEach(loadElement);
    return;
  }

  const lazyObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadElement(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '200px 0px', threshold: 0.01 }
  );

  document.querySelectorAll(selector).forEach(el => {
    // Hint to browser for native lazy support where possible
    if (el.tagName && el.tagName.toLowerCase() === 'img') el.loading = 'lazy';
    lazyObserver.observe(el);
  });
}

// Performance optimization for images
function optimizeImages() {
  const images = document.querySelectorAll('img[src]');
  images.forEach(img => {
    if (!img.loading) {
      img.loading = 'lazy'; // Add lazy loading to all images
    }
    // Add error handling for images
    img.onerror = function () {
      this.style.display = 'none'; // Hide broken images
    };
  });
}

// Back to top functionality
function initBackToTop() {
  const backToTopButton = document.getElementById('backToTop');
  if (!backToTopButton) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

// Optimize performance with IntersectionObserver
function initLazyLoading() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  document.querySelectorAll('.lazy-load').forEach(el => observer.observe(el));
}

// Mobile optimization
function initMobileOptimization() {
  // Improve touch targets
  document.querySelectorAll('.nav-link, .btn, .social-icon').forEach(el => {
    el.style.minHeight = '44px';
    el.style.minWidth = '44px';
  });

  // Handle mobile menu
  const navbar = document.querySelector('.navbar-collapse');
  if (navbar) {
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target) && navbar.classList.contains('show')) {
        navbar.classList.remove('show');
      }
    });
  }
}

// Reviews functionality
let currentPage = 1;
const limit = 10;

function loadReviews(page) {
  fetch(`https://691ee1f2bb52a1db22bf8912.mockapi.io/Reviews?page=${page}&limit=${limit}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('reviews-container');
      container.innerHTML = '';
      if (data.length === 0) {
        container.innerHTML =
          '<div class="carousel-item active"><p class="text-center">No more reviews.</p></div>';
        return;
      }
      data.forEach((review, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'carousel-item' + (index === 0 ? ' active' : '');
        itemDiv.innerHTML = `
          <div class="text-center">
            <img src="${review.avatar}" class="img-fluid" alt="${
          review.name
        }" style="max-width: 500px;" onerror="this.src='./assets/images/placeholder.png'">
          </div>
          <div class="carousel-caption d-none d-md-block">
            <h5>${review.name}</h5>
            <p>${new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        `;
        container.appendChild(itemDiv);
      });
      document.getElementById('page-info').textContent = `Page ${page}`;
    })
    .catch(err => console.error('Error loading reviews:', err));
}

document.addEventListener('DOMContentLoaded', function () {
  // Initialize Shopping Cart
  window.cart = new ShoppingCart();

  // Initialize Newsletter Validation
  validateNewsletterForm();

  // Initialize Quick View
  initializeQuickView();

  // Initialize new effects
  initScrollReveal();
  initParallax();
  initFloatingElements();
  // Initialize new optimizations
  optimizeImages();
  initBackToTop();
  initLazyLoading();
  initMobileOptimization();
  initLazyAssets();

  const carouselElem = document.getElementById('testimonialCarousel');
  if (carouselElem && window.bootstrap && typeof window.bootstrap.Carousel === 'function') {
    const carousel = new bootstrap.Carousel(carouselElem);
    const thumbs = document.querySelectorAll('.testimonial-img-thumb');

    // Cập nhật active state cho thumbnails
    function updateThumbnails(slideIndex) {
      thumbs.forEach((thumb, index) => {
        if (index === slideIndex) {
          thumb.classList.add('active');
        } else {
          thumb.classList.remove('active');
        }
      });
    }

    // Xử lý sự kiện click trên thumbnails
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const slideIndex = parseInt(thumb.getAttribute('data-bs-slide-to'));
        if (!isNaN(slideIndex)) {
          carousel.to(slideIndex);
          updateThumbnails(slideIndex);
        }
      });
    });

    // Xử lý sự kiện slide.bs.carousel
    carouselElem.addEventListener('slide.bs.carousel', function (e) {
      updateThumbnails(e.to);
    });

    // Set active cho thumbnail đầu tiên khi load trang
    updateThumbnails(0);
  }
  window.addEventListener('load', function () {
    var loader = document.getElementById('loader-overlay');
    if (loader) loader.style.display = 'none';
  });

  // Hiệu ứng lazy loading cho các section
  const lazySections = document.querySelectorAll('.lazy-section');
  const observer = new window.IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          const loader = section.querySelector('.loader');
          const content = section.querySelector('.content');
          if (loader && content) {
            loader.style.display = 'block';
            setTimeout(() => {
              loader.style.display = 'none';
              content.style.display = 'block';
            }, 800); // thời gian loading
          }
          obs.unobserve(section);
        }
      });
    },
    { threshold: 0.2 }
  );
  lazySections.forEach(section => observer.observe(section));

  // Initialize Reviews
  loadReviews(currentPage);
  document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadReviews(currentPage);
    }
  });
  document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    loadReviews(currentPage);
  });
});
