// Lightweight Sidebar Initializer - attaches robust handlers early
(function() {
    'use strict';

    function performSidebarToggle(btn) {
        try {
            if (typeof window.toggleSidebar === 'function') {
                window.toggleSidebar();
                return;
            }

            var sidebar = document.getElementById('admin-sidebar');
            var dashboardContent = document.getElementById('dashboard-content');
            var mainContent = document.querySelector('.main-content') || document.querySelector('.settings-content');
            var body = document.body;

            if (sidebar) {
                sidebar.classList.toggle('collapsed');
                sidebar.classList.toggle('active');
            }
            if (dashboardContent) dashboardContent.classList.toggle('sidebar-collapsed');
            if (mainContent) mainContent.classList.toggle('sidebar-collapsed');
            if (body && window.innerWidth < 600) body.classList.toggle('sidebar-open');

            try {
                if (btn) {
                    var expanded = btn.getAttribute('aria-expanded') === 'true';
                    btn.setAttribute('aria-expanded', (!expanded).toString());
                }
            } catch (err) { /* ignore */ }
        } catch (err) {
            console.warn('admin-sidebar-init performSidebarToggle error:', err);
        }
    }

    // Capture-phase handlers
    try {
        document.addEventListener('click', function(e) {
            var btn = e.target && e.target.closest && e.target.closest('.sidebar-toggle');
            if (!btn) return;
            performSidebarToggle(btn);
        }, true);

        document.addEventListener('pointerdown', function(e) {
            var btn = e.target && e.target.closest && e.target.closest('.sidebar-toggle');
            if (!btn) return;
            performSidebarToggle(btn);
        }, true);

        document.addEventListener('keydown', function(e) {
            var active = document.activeElement;
            if (!active) return;
            if (!active.classList || !active.classList.contains('sidebar-toggle')) return;
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                performSidebarToggle(active);
            }
        }, true);
    } catch (err) {
        console.warn('admin-sidebar-init attach handlers error:', err);
    }

    // Ensure aria-expanded attribute exists on buttons added later
    try {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                m.addedNodes && m.addedNodes.forEach(function(node) {
                    if (node.nodeType !== 1) return;
                    if (node.matches && node.matches('.sidebar-toggle')) {
                        if (!node.hasAttribute('aria-expanded')) node.setAttribute('aria-expanded', 'false');
                    }
                    node.querySelectorAll && node.querySelectorAll('.sidebar-toggle').forEach(function(b) {
                        if (!b.hasAttribute('aria-expanded')) b.setAttribute('aria-expanded', 'false');
                    });
                });
            });
        });

        observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
    } catch (err) {
        /* Non-fatal */
    }

})();
