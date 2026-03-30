// Cruz Cybersecurity — Main JS

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');

    if (toggle && links) {
        toggle.addEventListener('click', function () {
            links.classList.toggle('active');
        });

        // Close menu when a link is clicked
        links.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                links.classList.remove('active');
            });
        });
    }

    // Contact form handler
    var form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var data = new FormData(form);
            var name = data.get('name');
            var company = data.get('company');
            var email = data.get('email');
            var phone = data.get('phone');
            var service = data.get('service');
            var message = data.get('message');

            // Build mailto link as a simple starting point
            // Replace with a form service (Formspree, Netlify Forms, etc.) later
            var subject = encodeURIComponent('Security Assessment Inquiry — ' + company);
            var body = encodeURIComponent(
                'Name: ' + name + '\n' +
                'Company: ' + company + '\n' +
                'Email: ' + email + '\n' +
                'Phone: ' + phone + '\n' +
                'Service: ' + service + '\n\n' +
                'Message:\n' + message
            );

            // TODO: Replace with your actual email
            window.location.href = 'mailto:contact@cruzcybersecurity.com?subject=' + subject + '&body=' + body;

            // Show confirmation
            form.innerHTML = '<div style="text-align:center;padding:40px 0;">' +
                '<h3 style="margin-bottom:12px;">Message sent!</h3>' +
                '<p style="color:#64748b;">We\'ll get back to you within 24 hours.</p>' +
                '</div>';
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Navbar background on scroll
    var nav = document.querySelector('.nav');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 10) {
            nav.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });
});
