/* ===================================
   O SANTO MOVIMENTO - JAVASCRIPT
   Animações, Interatividade e Efeitos
   =================================== */

// Marca que JS está ativo (para habilitar estilos progressivos)
document.documentElement.classList.add('js');

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initNavbarScroll();
    initSmoothScroll();
    initCounterAnimation();
    initParallaxEffect();
    initAccordionAnimations();
    initCardHoverEffects();
    initScrollToTop();
    initActiveNavLink();
});

// ===== ANIMAÇÕES AO SCROLL =====
function initScrollAnimations() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        return;
    }

    const elements = document.querySelectorAll(
        '.hero-content, .section-title, .section-text, .valor-card, .modalidade-card, .resultado-card, .info-card, .equipe-card, .accordion-item, .pessoas-card'
    );

    // Aplica classe reveal e delay (stagger) para itens em grid
    elements.forEach((el, index) => {
        el.classList.add('reveal');

        // Stagger leve: em cards, o delay fica mais perceptível
        const isCard = el.classList.contains('valor-card') ||
            el.classList.contains('modalidade-card') ||
            el.classList.contains('resultado-card') ||
            el.classList.contains('info-card') ||
            el.classList.contains('accordion-item') ||
            el.classList.contains('pessoas-card');

        const delay = isCard ? Math.min(240, (index % 6) * 60) : 0;
        el.style.setProperty('--reveal-delay', `${delay}ms`);
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -10% 0px'
        }
    );

    elements.forEach((el) => observer.observe(el));
}

// ===== EFEITO DE NAVBAR AO SCROLL =====
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Adicionar sombra ao navbar quando scrollar
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initActiveNavLink() {
    const links = Array.from(document.querySelectorAll('.navbar-nav .nav-link'));
    const sections = links
        .map((link) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return null;
            const section = document.querySelector(href);
            return section ? { link, section } : null;
        })
        .filter(Boolean);

    if (!sections.length) return;

    const setActive = () => {
        const scrollY = window.scrollY || window.pageYOffset;
        const offset = 120;

        let current = sections[0];
        for (const item of sections) {
            if (item.section.offsetTop - offset <= scrollY) {
                current = item;
            }
        }

        links.forEach((l) => l.classList.remove('active'));
        current.link.classList.add('active');
    };

    setActive();
    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(setActive);
    });
}

// ===== SCROLL SUAVE =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Fechar navbar mobile se aberto
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const toggler = document.querySelector('.navbar-toggler');
                    toggler.click();
                }
            }
        });
    });
}

// ===== ANIMAÇÃO DE CONTADORES =====
function initCounterAnimation() {
    // Criar elementos de contadores se necessário
    const statsSection = document.querySelector('.resultados-section');
    if (statsSection) {
        // Adicionar contadores dinâmicos
        const stats = [
            { number: 50, label: 'Alunos Ativos' },
            { number: 5, label: 'Anos de Experiência' },
            { number: 98, label: 'Taxa de Satisfação' }
        ];

        // Animação de números ao scroll
        const observerStats = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observerStats.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observerStats.observe(statsSection);
    }
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}

// ===== EFEITO PARALLAX =====
function initParallaxEffect() {
    const heroSection = document.querySelector('.hero-section');
    const heroBackground = document.querySelector('.hero-background');

    if (heroBackground) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            const heroRect = heroSection.getBoundingClientRect();

            if (heroRect.top < window.innerHeight && heroRect.bottom > 0) {
                const parallaxValue = scrollPosition * 0.5;
                heroBackground.style.transform = `translateY(${parallaxValue}px)`;
            }
        });
    }
}

// ===== ANIMAÇÕES DO ACCORDION =====
function initAccordionAnimations() {
    const accordionButtons = document.querySelectorAll('.accordion-button');

    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover animação de outros itens
            document.querySelectorAll('.accordion-button').forEach(btn => {
                if (btn !== this) {
                    btn.classList.remove('animated');
                }
            });

            // Adicionar animação ao item clicado
            this.classList.add('animated');
        });
    });
}

// ===== EFEITOS DE HOVER NAS CARDS =====
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.valor-card, .modalidade-card, .resultado-card, .info-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}

// ===== ANIMAÇÃO DE ENTRADA DO HERO =====
window.addEventListener('load', function() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 1s ease-out';
    }
});

// ===== SCROLL TO TOP BUTTON =====
function initScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background-color: #FF6B35;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        z-index: 999;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    `;

    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 8px 20px rgba(255, 107, 53, 0.4)';
    });

    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
    });
}

// Inicializar scroll to top
initScrollToTop();

// ===== ANIMAÇÃO DE NÚMEROS =====
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ===== LAZY LOADING DE IMAGENS =====
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }
}

// Inicializar lazy loading
initLazyLoading();

// ===== VALIDAÇÃO DE FORMULÁRIOS =====
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
}

// Inicializar validação de formulários
initFormValidation();

// ===== EFEITO DE DIGITAÇÃO =====
function typeWriter(element, text, speed = 50) {
    let index = 0;
    element.textContent = '';

    const type = () => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    };

    type();
}

// ===== NOTIFICAÇÕES TOAST =====
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 2rem;
        background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#FF6B35'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideInLeft 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutLeft 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== EFEITO DE RIPPLE =====
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn-cta, .accordion-button');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                animation: ripple 0.6s ease-out;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Adicionar animação de ripple ao CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutLeft {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-100px);
        }
    }

    .animate-in {
        animation: fadeInUp 0.8s ease-out !important;
    }
`;
document.head.appendChild(rippleStyle);

// Inicializar efeito de ripple
initRippleEffect();

// ===== DETECÇÃO DE NAVEGADOR =====
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';

    if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (ua.indexOf('Safari') > -1) browser = 'Safari';
    else if (ua.indexOf('Edge') > -1) browser = 'Edge';

    return browser;
}

// ===== DARK MODE TOGGLE (Opcional) =====
function initDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background-color: #f5f5f5;
        border: 2px solid #FF6B35;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        color: #FF6B35;
        z-index: 998;
        transition: all 0.3s ease;
    `;

    // Desabilitado por padrão, mas disponível se necessário
    // document.body.appendChild(darkModeToggle);

    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.innerHTML = document.body.classList.contains('dark-mode') 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    });
}

// ===== PERFORMANCE MONITORING =====
function logPerformance() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page Load Time: ' + pageLoadTime + 'ms');
    }
}

// Log performance ao carregar
window.addEventListener('load', logPerformance);

// ===== ANALYTICS TRACKING =====
function trackEvent(category, action, label) {
    if (window.gtag) {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Rastrear cliques em CTAs
document.querySelectorAll('.btn-cta').forEach(btn => {
    btn.addEventListener('click', function() {
        trackEvent('engagement', 'cta_click', this.textContent);
    });
});

// ===== CONSOLE LOG CUSTOMIZADO =====
console.log('%cO Santo Movimento', 'color: #FF6B35; font-size: 20px; font-weight: bold;');
console.log('%cTreinamento Funcional com Propósito', 'color: #666666; font-size: 14px;');
console.log('%cSeu corpo é um presente.', 'color: #999999; font-size: 12px; font-style: italic;');
