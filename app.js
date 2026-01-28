(() => {
  const grid = document.getElementById('turtle-grid');
  const searchInput = document.getElementById('search');
  const habitatFilter = document.getElementById('filter-habitat');
  const statusFilter = document.getElementById('filter-status');
  const regionFilter = document.getElementById('filter-region');
  const statsEl = document.getElementById('stats');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');

  const habitatLabel = { sea: '바다', freshwater: '민물', land: '육지' };
  const statusLabel = {
    CR: '위급 (CR)', EN: '위기 (EN)', VU: '취약 (VU)',
    NT: '준위협 (NT)', LC: '관심대상 (LC)', DD: '정보부족 (DD)', EW: '야생절멸 (EW)'
  };

  function matchRegion(turtleRegion, filterValue) {
    if (filterValue === 'all') return true;
    if (filterValue === '전 세계 열대·온대 해역') return turtleRegion.includes('전 세계');
    return turtleRegion.includes(filterValue);
  }

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    const habitat = habitatFilter.value;
    const status = statusFilter.value;
    const region = regionFilter.value;

    const filtered = TURTLES.filter(t => {
      if (query && !(
        t.name.toLowerCase().includes(query) ||
        t.english.toLowerCase().includes(query) ||
        t.scientific.toLowerCase().includes(query)
      )) return false;
      if (habitat !== 'all' && t.habitat !== habitat) return false;
      if (status !== 'all' && t.status !== status) return false;
      if (!matchRegion(t.region, region)) return false;
      return true;
    });

    statsEl.textContent = `총 ${TURTLES.length}종 중 ${filtered.length}종 표시`;

    grid.innerHTML = filtered.map((t, i) => `
      <div class="card" data-index="${TURTLES.indexOf(t)}">
        <div class="card-img"><img src="${t.image}" alt="${t.name}" loading="lazy" onerror="this.style.display='none'"></div>
        <div class="card-body">
          <h3>${t.name}</h3>
          <div class="scientific">${t.scientific}</div>
          <div class="card-tags">
            <span class="tag tag-habitat">${habitatLabel[t.habitat]}</span>
            <span class="tag tag-status-${t.status}">${statusLabel[t.status]}</span>
          </div>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', () => openModal(Number(card.dataset.index)));
    });
  }

  function openModal(index) {
    const t = TURTLES[index];
    modalBody.innerHTML = `
      <div class="modal-img"><img src="${t.image}" alt="${t.name}" onerror="this.style.display='none'"></div>
      <h2>${t.name}</h2>
      <div class="modal-scientific">${t.scientific}</div>
      <div class="modal-tags">
        <span class="tag tag-habitat">${habitatLabel[t.habitat]}</span>
        <span class="tag tag-status-${t.status}">${statusLabel[t.status]}</span>
      </div>
      <table class="info-table">
        <tr><td>영문명</td><td>${t.english}</td></tr>
        <tr><td>학명</td><td><i>${t.scientific}</i></td></tr>
        <tr><td>과</td><td>${t.family}</td></tr>
        <tr><td>서식지</td><td>${t.region}</td></tr>
        <tr><td>크기</td><td>${t.size}</td></tr>
        <tr><td>무게</td><td>${t.weight}</td></tr>
        <tr><td>수명</td><td>${t.lifespan}</td></tr>
        <tr><td>먹이</td><td>${t.diet}</td></tr>
        <tr><td>보전 상태</td><td><span class="tag tag-status-${t.status}">${statusLabel[t.status]}</span></td></tr>
      </table>
      <div class="modal-desc">${t.description}</div>
    `;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  searchInput.addEventListener('input', render);
  habitatFilter.addEventListener('change', render);
  statusFilter.addEventListener('change', render);
  regionFilter.addEventListener('change', render);

  render();
})();
