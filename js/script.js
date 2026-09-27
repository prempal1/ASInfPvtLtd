document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (toggleButton && mobileMenu) {
    toggleButton.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      toggleButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      if (!item) return;
      item.classList.toggle('active');
    });
  });

  document.querySelectorAll('.filter-chip[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      const group = button.closest('[data-filter-group]');
      if (!group) return;
      group.querySelectorAll('.filter-chip').forEach((chip) => chip.classList.toggle('active', chip === button));

      if (filter === 'all') {
        group.parentElement.querySelectorAll('[data-service-category]').forEach((card) => {
          card.hidden = false;
        });
        return;
      }

      group.parentElement.querySelectorAll('[data-service-category]').forEach((card) => {
        const matches = card.dataset.serviceCategory.toLowerCase() === filter.toLowerCase();
        card.hidden = !matches;
      });
    });
  });

  document.querySelectorAll('form[data-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const statusEl = form.querySelector('.form-status');
      const required = form.querySelectorAll('[required]');
      let valid = true;

      required.forEach((field) => {
        if (!field.value.trim()) {
          valid = false;
          field.setAttribute('aria-invalid', 'true');
        } else {
          field.setAttribute('aria-invalid', 'false');
        }
      });

      if (!valid) {
        if (statusEl) {
          statusEl.textContent = 'Please complete the required fields before submitting.';
          statusEl.className = 'form-status error';
        }
        return;
      }

      const isContactForm = form.dataset.form === 'contact';
      if (isContactForm) {
        const values = {
          name: document.getElementById('contact-full-name')?.value || '',
          company: document.getElementById('contact-company')?.value || '',
          email: document.getElementById('contact-email')?.value || '',
          phone: document.getElementById('contact-phone')?.value || '',
          projectType: document.getElementById('contact-project-type')?.value || '',
          location: document.getElementById('contact-location')?.value || '',
          capacity: document.getElementById('contact-capacity')?.value || '',
          message: document.getElementById('contact-message')?.value || ''
        };

        const emailAddress = window.siteConfig?.company?.email || 'hello@anandshreeinfra.com';
        const subject = encodeURIComponent('Website Enquiry - Anand Shree Infra Private Limited');
        const body = encodeURIComponent(
          [
            'New website enquiry',
            '',
            `Name: ${values.name}`,
            `Company: ${values.company}`,
            `Email: ${values.email}`,
            `Phone: ${values.phone}`,
            `Project Type: ${values.projectType}`,
            `Location: ${values.location}`,
            `Project Capacity: ${values.capacity}`,
            'Message:',
            values.message
          ].join('\n')
        );

        if (statusEl) {
          statusEl.textContent = 'Your enquiry has been prepared in your email app. Please send it to continue.';
          statusEl.className = 'form-status success';
        }

        form.reset();
        window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
        return;
      }

      if (statusEl) {
        statusEl.textContent = 'Thank you. Our team will get back to you shortly.';
        statusEl.className = 'form-status success';
      }
      form.reset();
    });
  });

  document.querySelectorAll('[data-stat-value]').forEach((el) => {
    const target = Number(el.dataset.statValue || 0);
    if (!Number.isFinite(target)) return;
    let start = 0;
    const duration = 900;
    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const value = Math.round(progress * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  const fillConfigFields = () => {
    const cfg = window.siteConfig || {};
    const info = cfg.company || {};
    document.querySelectorAll('[data-config="company-name"]').forEach((el) => {
      el.textContent = info.name || 'Anand Shree Infra Private Limited';
    });
    document.querySelectorAll('[data-config="tagline"]').forEach((el) => {
      el.textContent = info.tagline || 'Building Infrastructure. Powering Progress.';
    });
    document.querySelectorAll('[data-config="email"]').forEach((el) => {
      el.textContent = info.email || '[VERIFY]';
      if (info.email && info.email !== '[VERIFY]') el.setAttribute('href', `mailto:${info.email}`);
    });
    document.querySelectorAll('[data-config="phone"]').forEach((el) => {
      el.textContent = info.phone || '[VERIFY]';
      if (info.phone && info.phone !== '[VERIFY]') el.setAttribute('href', `tel:${info.phone}`);
    });
    document.querySelectorAll('[data-config="address"]').forEach((el) => {
      el.textContent = info.address || '[VERIFY]';
    });
    document.querySelectorAll('[data-config="headquarters"]').forEach((el) => {
      el.textContent = info.headquarters || 'Hyderabad, Telangana, India';
    });
    document.querySelectorAll('[data-config="current-year"]').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  };

  const setFallbackForImage = (img) => {
    img.addEventListener('error', () => {
      const original = img.getAttribute('src');
      if (!original || !original.includes('/public/images/')) {
        img.src = '/public/images/fallback/project-placeholder.svg';
        return;
      }
      img.src = '/public/images/fallback/project-placeholder.svg';
    }, { once: true });
  };

  document.querySelectorAll('img').forEach(setFallbackForImage);
  fillConfigFields();
});
