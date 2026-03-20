/* ============================================
   PORTFOLIO PAGE — JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initPortfolioFilter();
});

/* ===== Project Filter ===== */
function initPortfolioFilter() {
    const btns = document.querySelectorAll('.pf-filter-btn');
    const cards = document.querySelectorAll('.pf-card');
    if (!btns.length || !cards.length) return;

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}