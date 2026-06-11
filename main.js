/**
 * GORYL SHOP — main.js
 * Nettoyé : suppression du code dupliqué, délai preloader corrigé à 2s
 */

document.addEventListener('DOMContentLoaded', () => {

    // ─── NAV ACTIVE STATE AU SCROLL ─────────────────────────
    const navLinks = document.querySelectorAll('.nav-links a');

    const sections = document.querySelectorAll('section[id]');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => scrollObserver.observe(s));

    // ─── SMOOTH SCROLL SUR LES LIENS NAV ────────────────────
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
            // Fermer le menu mobile si ouvert
            document.querySelector('.mobile-nav')?.classList.remove('open');
            document.querySelector('.burger')?.classList.remove('open');
        });
    });

    // ─── BURGER MENU MOBILE ──────────────────────────────────
    const burger = document.querySelector('.burger');
    const mobileNav = document.querySelector('.mobile-nav');

    if (burger && mobileNav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('open');
            mobileNav.classList.toggle('open');
        });

        // Fermer le menu sur clic d'un lien mobile
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('open');
                mobileNav.classList.remove('open');
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    setTimeout(() => {
                        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
                    }, 300);
                }
            });
        });
    }

    // ─── SYNC TUNETOO IFRAME (postMessage) ──────────────────
    const cartBadge = document.getElementById('cart-badge');
    const userIcon  = document.getElementById('user-icon');

    window.addEventListener('message', (event) => {
        if (!event.data) return;
        const data = event.data;

        // Sync panier
        if (data.type === 'cart_update' || data.cart_count !== undefined) {
            const count = data.cart_count ?? data.quantity ?? data.payload?.count;
            if (count !== undefined && cartBadge) {
                cartBadge.textContent = count;
                cartBadge.classList.toggle('active', parseInt(count) > 0);
            }
        }

        // Sync connexion utilisateur
        if (data.type === 'user_logged_in' || data.logged_in === true) {
            userIcon?.classList.add('user-active');
        }
    });

});