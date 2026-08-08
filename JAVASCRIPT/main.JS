// ============================================
// FEECENT - Main JavaScript
// ============================================

(function () {
  "use strict";

  // DOM Elements
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.querySelector(".nav-links");
  const navbar = document.querySelector(".navbar");
  const contactForm = document.getElementById("contactForm");
  const faqItems = document.querySelectorAll(".faq-item");

  // ============================================
  // Mobile Menu Toggle
  // ============================================
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      const icon = this.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-times");
      }
    });
  }

  // Close mobile menu when clicking a link
  if (navLinks) {
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        const menuBtnIcon = mobileMenuBtn?.querySelector("i");
        if (menuBtnIcon) {
          menuBtnIcon.classList.add("fa-bars");
          menuBtnIcon.classList.remove("fa-times");
        }
      });
    });
  }

  // ============================================
  // Navbar Scroll Effect
  // ============================================
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavbarScroll);
  handleNavbarScroll();

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Update URL without jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  // ============================================
  // FAQ Accordion
  // ============================================
  if (faqItems.length) {
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      if (question) {
        question.addEventListener("click", () => {
          // Close other items
          faqItems.forEach((other) => {
            if (other !== item && other.classList.contains("active")) {
              other.classList.remove("active");
            }
          });
          item.classList.toggle("active");
        });
      }
    });
  }

  // ============================================
  // Contact Form Submission
  // ============================================
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn?.innerHTML;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Sending...';
      }

      // Collect form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());

      // Simulate API call (replace with actual endpoint)
      setTimeout(() => {
        showToast(
          "Thank you for your message. We'll get back to you soon!",
          "success",
        );
        contactForm.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }, 1500);

      // Uncomment to use actual API
      /*
      try {
        const response = await fetch('https://your-api.com/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (response.ok) {
          showToast('Message sent successfully!', 'success');
          contactForm.reset();
        } else {
          showToast('Failed to send message. Please try again.', 'error');
        }
      } catch (error) {
        showToast('Network error. Please try again.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
      */
    });
  }

  // ============================================
  // Toast Notification System
  // ============================================
  function showToast(message, type = "info") {
    const existingToast = document.querySelector(".toast");
    if (existingToast) existingToast.remove();

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icons = {
      success: "fa-check-circle",
      error: "fa-exclamation-circle",
      info: "fa-info-circle",
      warning: "fa-exclamation-triangle",
    };

    toast.innerHTML = `
      <i class="fas ${icons[type] || icons.info}"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }

  // ============================================
  // Animated Counter for Stats
  // ============================================
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
      start += increment;
      if (start < target) {
        element.textContent = Math.floor(start).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    }

    updateCounter();
  }

  // Intersection Observer for stats animation
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statNumbers = entry.target.querySelectorAll(".stat-number");
          statNumbers.forEach((stat) => {
            const target = parseInt(stat.getAttribute("data-target"));
            if (target && !stat.classList.contains("animated")) {
              stat.classList.add("animated");
              animateCounter(stat, target);
            }
          });
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  const statsSection = document.querySelector(".hero-stats");
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ============================================
  // Lazy Loading Images
  // ============================================
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute("data-src");
          if (src) {
            img.src = src;
            img.removeAttribute("data-src");
          }
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // ============================================
  // Set Current Year in Footer
  // ============================================
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ============================================
  // Status Page - Fetch System Status
  // ============================================
  async function loadSystemStatus() {
    const statusContainer = document.getElementById("statusGrid");
    if (!statusContainer) return;

    // Simulated status data (replace with actual API call)
    const services = [
      {
        name: "Mobile App",
        status: "operational",
        message: "All systems operational",
      },
      {
        name: "Card Processing",
        status: "operational",
        message: "Normal processing speed",
      },
      {
        name: "Transfers",
        status: "operational",
        message: "Instant transfers working",
      },
      {
        name: "Customer Support",
        status: "operational",
        message: "Responding within minutes",
      },
      { name: "API", status: "operational", message: "100% uptime" },
      {
        name: "Push Notifications",
        status: "operational",
        message: "Delivering as expected",
      },
    ];

    statusContainer.innerHTML = services
      .map(
        (service) => `
      <div class="status-card">
        <div class="status-indicator">
          <div class="indicator-dot ${service.status}"></div>
          <span class="status-name">${service.name}</span>
        </div>
        <div class="status-message">${service.message}</div>
      </div>
    `,
      )
      .join("");
  }

  loadSystemStatus();

  // ============================================
  // Load Incidents (Status Page)
  // ============================================
  async function loadIncidents() {
    const incidentList = document.getElementById("incidentList");
    if (!incidentList) return;

    // Simulated incidents (replace with actual API)
    const incidents = [
      {
        title: "Scheduled Maintenance",
        date: "March 15, 2024",
        resolved: true,
      },
      { title: "API Latency Issue", date: "March 10, 2024", resolved: true },
      { title: "Card Processing Delay", date: "March 5, 2024", resolved: true },
    ];

    incidentList.innerHTML = incidents
      .map(
        (incident) => `
      <div class="incident-item">
        <div class="incident-title">
          ${incident.resolved ? "✅" : "⚠️"} ${incident.title}
        </div>
        <div class="incident-date">${incident.date}</div>
      </div>
    `,
      )
      .join("");
  }

  loadIncidents();

  // ============================================
  // Cookie Consent Banner
  // ============================================
  function initCookieConsent() {
    const consentGiven = localStorage.getItem("cookieConsent");
    if (consentGiven) return;

    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.innerHTML = `
      <div class="cookie-content">
        <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
        <div class="cookie-buttons">
          <button class="btn btn-primary btn-sm" id="acceptCookies">Accept</button>
          <button class="btn btn-ghost btn-sm" id="declineCookies">Decline</button>
        </div>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      .cookie-banner {
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: white;
        border-radius: 16px;
        padding: 1rem;
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideUp 0.3s ease;
      }
      @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .cookie-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
      }
      .cookie-content p {
        margin: 0;
        font-size: 0.875rem;
        flex: 1;
      }
      .cookie-buttons {
        display: flex;
        gap: 0.5rem;
      }
      .btn-sm {
        padding: 0.5rem 1rem;
        font-size: 0.75rem;
      }
      @media (max-width: 640px) {
        .cookie-content {
          flex-direction: column;
          text-align: center;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(banner);

    document.getElementById("acceptCookies")?.addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "accepted");
      banner.remove();
    });

    document.getElementById("declineCookies")?.addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "declined");
      banner.remove();
    });
  }

  initCookieConsent();

  // ============================================
  // Back to Top Button
  // ============================================
  const backToTop = document.createElement("button");
  backToTop.className = "back-to-top";
  backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTop.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: var(--shadow-md);
  `;
  document.body.appendChild(backToTop);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTop.style.opacity = "1";
      backToTop.style.visibility = "visible";
    } else {
      backToTop.style.opacity = "0";
      backToTop.style.visibility = "hidden";
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ============================================
  // Download Links Handler
  // ============================================
  const downloadButtons = document.querySelectorAll(
    ".download-btn, .store-badge",
  );
  downloadButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const platform =
        btn.getAttribute("data-platform") ||
        (btn.querySelector("strong")?.textContent || "").toLowerCase();

      // Analytics tracking (optional)
      console.log(`Download clicked: ${platform}`);

      // Show toast for demo
      if (!btn.href || btn.href === "#") {
        e.preventDefault();
        showToast(
          `App download will be available soon on ${platform || "app stores"}!`,
          "info",
        );
      }
    });
  });

  // ============================================
  // Expose functions globally
  // ============================================
  window.showToast = showToast;
  window.FeecentWebsite = {
    showToast,
    scrollToTop: () => window.scrollTo({ top: 0, behavior: "smooth" }),
  };

  console.log("FEECENT Website initialized");
})();
