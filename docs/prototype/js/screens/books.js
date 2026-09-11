/**
 * Gitbook Prototype - Tela T2: Dashboard / Catálogo de Livros
 * 03-especificacao-telas.md & 04-sequencia.md (Passo 3)
 */

(function () {
  window.Gitbook = window.Gitbook || {};
  window.Gitbook.screens = window.Gitbook.screens || {};

  let currentSearchQuery = '';

  /**
   * Renderiza o Catálogo de Livros / Dashboard (T2)
   * @param {HTMLElement} container - Elemento onde a tela será montada
   */
  function render(container) {
    const mockData = window.Gitbook.mockData;
    const buttonComp = window.Gitbook.components.button;
    const badgeComp = window.Gitbook.components.badge;

    if (!mockData) {
      container.innerHTML = '<p style="color: var(--color-status-rejected-text);">Erro: mock-data não carregado.</p>';
      return;
    }

    const currentUser = mockData.getCurrentUser();
    const isGestor = currentUser.role === 'gestor';
    const allBooks = mockData.getBooks();

    // Filtro no client-side
    const filteredBooks = allBooks.filter((book) => {
      if (!currentSearchQuery) return true;
      const q = currentSearchQuery.toLowerCase();
      const titleMatch = (book.title || '').toLowerCase().includes(q);
      const descMatch = (book.description || '').toLowerCase().includes(q);
      const managerMatch = (book.managerName || '').toLowerCase().includes(q);
      const genreMatch = (book.genre || '').toLowerCase().includes(q);
      return titleMatch || descMatch || managerMatch || genreMatch;
    });

    // Botão "+ Novo Livro" com destaque para o papel Gestor
    const newBookBtnHtml = buttonComp ? buttonComp.createButton({
      text: '+ Novo Livro',
      variant: 'primary',
      id: 'btn-open-create-book',
      icon: 'sparkles',
      className: isGestor ? '' : 'btn-secondary',
      attributes: isGestor ? 'title="Criar nova obra (Papel Gestor)"' : 'title="Requer papel de Gestor para criar obras"'
    }) : '<button type="button" class="btn btn-primary" id="btn-open-create-book">+ Novo Livro</button>';

    container.innerHTML = `
      <section class="books-dashboard" id="books-dashboard-section">
        <!-- Cabeçalho do Catálogo -->
        <header class="dashboard-header">
          <div class="dashboard-title-area">
            <div class="dashboard-heading">
              <h1 class="dashboard-title">Minhas Obras / Livros</h1>
              <span class="badge badge-status-info">${allBooks.length} obras</span>
            </div>
            <p class="dashboard-subtitle">
              Selecione uma obra para acessar o hub de escrita, branches ativas, merges e histórico de versionamento.
            </p>
          </div>

          <div class="dashboard-actions">
            ${newBookBtnHtml}
          </div>
        </header>

        <!-- Barra de Ferramentas: Busca no client-side -->
        <div class="dashboard-toolbar">
          <div class="search-box-wrapper">
            <span class="search-icon">${(window.Gitbook.icons || { get: () => '' }).get('search', { size: 15 })}</span>
            <input
              type="search"
              id="books-search-input"
              class="form-input search-input"
              placeholder="Buscar por título, autor, gênero ou sinopse..."
              value="${escapeHtml(currentSearchQuery)}"
              aria-label="Buscar livros"
            >
          </div>

          <div class="search-results-count">
            Exibindo <strong>${filteredBooks.length}</strong> de <strong>${allBooks.length}</strong> obras
          </div>
        </div>

        <!-- Grid de Cards de Livros ou Estado Vazio -->
        <div id="books-grid-container">
          ${renderBooksGrid(filteredBooks, allBooks.length, isGestor)}
        </div>
      </section>
    `;

    bindEvents(container);
  }

  /**
   * Renderiza os cards do grid ou o empty state
   */
  function renderBooksGrid(books, totalBooksCount, isGestor) {
    const buttonComp = window.Gitbook.components.button;
    const badgeComp = window.Gitbook.components.badge;
    const icons = window.Gitbook.icons || { get: () => '' };

    if (totalBooksCount === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">${icons.get('book', { size: 40 })}</div>
          <h2 class="empty-state-title">Nenhuma obra cadastrada ainda</h2>
          <p class="empty-state-desc">
            Comece criando o primeiro livro versionado da plataforma para gerar a branch <code>main</code> e convidar autores.
          </p>
          <button type="button" class="btn btn-primary" id="btn-empty-create-book">+ Criar Primeiro Livro</button>
        </div>
      `;
    }

    if (books.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">${icons.get('search', { size: 40 })}</div>
          <h2 class="empty-state-title">Nenhuma obra encontrada</h2>
          <p class="empty-state-desc">
            Nenhum resultado corresponde aos termos da sua busca. Tente palavras-chave diferentes ou limpe o filtro.
          </p>
          <button type="button" class="btn btn-secondary" id="btn-clear-search">Limpar Busca</button>
        </div>
      `;
    }

    return `
      <div class="books-grid">
        ${books.map((book) => renderSingleBookCard(book, buttonComp, badgeComp)).join('')}
      </div>
    `;
  }

  /**
   * Renderiza um card individual de livro reutilizando o padrão visual
   */
  function renderSingleBookCard(book, buttonComp, badgeComp) {
    const icons = window.Gitbook.icons || { get: () => '' };
    const coverGradient = book.coverGradient || 'linear-gradient(135deg, #1e3a8a, #4338ca)';
    const stats = book.stats || { branchesCount: 1, commitsCount: 1, pendingMerges: 0, pendingSuggestions: 0 };
    const versionLabel = book.version || 'main';

    const accessBtnHtml = buttonComp ? buttonComp.createButton({
      text: 'Acessar Livro',
      variant: 'primary',
      size: 'sm',
      icon: 'book',
      href: `#/books/${book.id}`,
      className: 'btn-access-book',
      attributes: `data-book-id="${book.id}"`
    }) : `<a href="#/books/${book.id}" class="btn btn-primary btn-sm" data-book-id="${book.id}">Acessar Livro</a>`;

    const statusBadgeHtml = badgeComp
      ? badgeComp.createStatusBadge('approved', { label: versionLabel })
      : `<span class="badge badge-status-approved">${versionLabel}</span>`;

    return `
      <article class="book-card" id="book-card-${book.id}">
        <!-- Capa Visual com Gradiente e Badge de Gênero -->
        <div class="book-card-cover" style="background: ${coverGradient};">
          <span class="badge badge-status-info book-cover-badge">${escapeHtml(book.genre || 'Literatura')}</span>
          <span class="book-cover-icon">${icons.get('book', { size: 28, strokeWidth: 1.5 })}</span>
        </div>

        <!-- Conteúdo do Card -->
        <div class="book-card-content">
          <h2 class="book-card-title">${escapeHtml(book.title)}</h2>
          <p class="book-card-desc">${escapeHtml(book.description)}</p>

          <!-- Gestor Responsável -->
          <div class="book-card-manager">
            <span style="display: inline-flex; align-items: center; gap: 4px;">${icons.get('crown', { size: 13 })} Gestor:</span>
            <strong>${escapeHtml(book.managerName || 'Lucas Mendes')}</strong>
          </div>

          <!-- Métricas Rápidas (Branches, Commits e Status da Main) -->
          <div class="book-metrics-row">
            <span class="metric-chip" title="Branches ativas">
              ${icons.get('branch', { size: 13 })}
              <strong>${stats.branchesCount}</strong> branches
            </span>

            <span class="metric-chip" title="Total de commits registrados">
              ${icons.get('commit', { size: 13 })}
              <strong>${stats.commitsCount}</strong> commits
            </span>

            ${stats.pendingMerges > 0 ? `
              <span class="metric-chip" style="border-color: var(--color-status-pending-border); color: var(--color-status-pending-text);" title="Merge Requests pendentes de aprovação">
                ${icons.get('merge', { size: 13 })}
                <strong>${stats.pendingMerges}</strong> merges
              </span>
            ` : ''}
          </div>
        </div>

        <!-- Rodapé do Card com Status da Main e Ação "Acessar Livro" -->
        <footer class="book-card-footer">
          <div title="Status da versão consolidada">
            ${statusBadgeHtml}
          </div>
          <div>
            ${accessBtnHtml}
          </div>
        </footer>
      </article>
    `;
  }

  /**
   * Abre o Modal "Criar Novo Livro"
   */
  function openCreateBookModal() {
    const modal = window.Gitbook.components.modal;
    const mockData = window.Gitbook.mockData;
    const buttonComp = window.Gitbook.components.button;
    if (!modal) return;

    const currentUser = mockData.getCurrentUser();
    const isGestor = currentUser.role === 'gestor';

    const submitBtnHtml = buttonComp ? buttonComp.createButton({
      text: 'Inicializar Livro (Criar branch main)',
      variant: 'primary',
      id: 'btn-modal-submit-book',
      type: 'submit'
    }) : '<button type="submit" class="btn btn-primary">Inicializar Livro (Criar branch main)</button>';

    const cancelBtnHtml = buttonComp ? buttonComp.createButton({
      text: 'Cancelar',
      variant: 'secondary',
      id: 'btn-modal-cancel-book',
      type: 'button',
      attributes: 'onclick="Gitbook.components.modal.close()"'
    }) : '<button type="button" class="btn btn-secondary" onclick="Gitbook.components.modal.close()">Cancelar</button>';

    const modalBody = `
      <form id="form-create-new-book" novalidate>
        <div id="create-book-error" style="display: none; margin-bottom: 12px; padding: 10px; background: var(--color-status-rejected-bg); border: 1px solid var(--color-status-rejected-border); border-radius: var(--radius-md); font-size: var(--font-size-xs); color: var(--color-status-rejected-text);"></div>

        ${!isGestor ? `
          <div style="margin-bottom: 16px; padding: 12px; background: var(--color-status-pending-bg); border: 1px solid var(--color-status-pending-border); border-radius: var(--radius-md); font-size: var(--font-size-xs); color: var(--color-status-pending-text); display: flex; align-items: flex-start; gap: 8px;">
            <span style="flex-shrink: 0; margin-top: 1px;">${window.Gitbook.icons ? window.Gitbook.icons.get('alert', { size: 14 }) : ''}</span>
            <div>
              <strong>Atenção:</strong> Você está visualizando como <strong>${currentUser.name} (${currentUser.role})</strong>. No Gitbook, a criação de novas obras é uma atribuição do Gestor (${window.Gitbook.icons ? window.Gitbook.icons.get('gestor', 12) : ''} <strong>Gestor</strong>). Ao prosseguir neste protótipo, a obra será criada com sucesso para fins de teste.
            </div>
          </div>
        ` : ''}

        <div class="form-group">
          <label for="book-new-title" class="form-label">Título da Obra *</label>
          <input type="text" id="book-new-title" class="form-input" placeholder="Ex: O Último Manuscrito de Praga" required>
        </div>

        <div class="form-group">
          <label for="book-new-genre" class="form-label">Gênero Literário</label>
          <select id="book-new-genre" class="form-select">
            <option value="Ficção Científica">Ficção Científica</option>
            <option value="Fantasia Urbana">Fantasia Urbana</option>
            <option value="Ensaio Filosófico">Ensaio Filosófico</option>
            <option value="Romance Histórico">Romance Histórico</option>
            <option value="Suspense e Mistério">Suspense e Mistério</option>
            <option value="Poesia Contemporânea">Poesia Contemporânea</option>
          </select>
        </div>

        <div class="form-group">
          <label for="book-new-description" class="form-label">Sinopse / Descrição Sucinta *</label>
          <textarea id="book-new-description" class="form-textarea" rows="3" placeholder="Descreva brevemente o enredo, tema e proposta da obra..." required></textarea>
        </div>

        <div style="padding: 12px; background-color: var(--color-bg-subtle); border-radius: var(--radius-md); border: 1px solid var(--color-border); font-size: var(--font-size-xs); color: var(--color-text-muted);">
          ${window.Gitbook.icons ? window.Gitbook.icons.get('info', { size: 14 }) : ''} Ao inicializar a obra, o sistema gerará automaticamente a branch protegida <code>main</code> e criará o snapshot inicial do repositório em seu nome (<strong>${currentUser.name}</strong>).
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
          ${cancelBtnHtml}
          ${submitBtnHtml}
        </div>
      </form>
    `;

    modal.open({
      title: 'Criar Novo Livro',
      body: modalBody,
      maxWidth: '600px'
    });

    const form = document.getElementById('form-create-new-book');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('book-new-title');
        const genreInput = document.getElementById('book-new-genre');
        const descInput = document.getElementById('book-new-description');

        const title = (titleInput.value || '').trim();
        const genre = genreInput.value;
        const description = (descInput.value || '').trim();

        const errorEl = document.getElementById('create-book-error');

        if (!title) {
          titleInput.focus();
          titleInput.style.borderColor = 'var(--color-status-rejected)';
          if (errorEl) {
            errorEl.innerHTML = `${window.Gitbook.icons ? window.Gitbook.icons.get('alert', { size: 14 }) : ''} O título da obra é obrigatório para inicializar o repositório.`;
            errorEl.style.display = 'block';
          }
          return;
        }

        if (errorEl) errorEl.style.display = 'none';

        // Adiciona ao mock data
        mockData.addBook({
          title,
          genre,
          description: description || 'Sinopse a ser definida pelos autores.'
        });

        modal.close();

        // Limpa busca e re-renderiza catálogo
        currentSearchQuery = '';
        const appContainer = document.getElementById('app-container');
        if (appContainer) {
          render(appContainer);
        }
      });
    }
  }

  function bindEvents(container) {
    const searchInput = container.querySelector('#books-search-input');
    const btnOpenCreate = container.querySelector('#btn-open-create-book');
    const btnEmptyCreate = container.querySelector('#btn-empty-create-book');
    const btnClearSearch = container.querySelector('#btn-clear-search');

    // Filtro no client-side em tempo real
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        const gridContainer = container.querySelector('#books-grid-container');
        const resultsCountEl = container.querySelector('.search-results-count');
        const mockData = window.Gitbook.mockData;

        if (gridContainer && mockData) {
          const allBooks = mockData.getBooks();
          const isGestor = mockData.getCurrentUser().role === 'gestor';
          const q = currentSearchQuery.toLowerCase();
          const filtered = allBooks.filter((b) => {
            if (!q) return true;
            return (
              (b.title || '').toLowerCase().includes(q) ||
              (b.description || '').toLowerCase().includes(q) ||
              (b.managerName || '').toLowerCase().includes(q) ||
              (b.genre || '').toLowerCase().includes(q)
            );
          });

          gridContainer.innerHTML = renderBooksGrid(filtered, allBooks.length, isGestor);
          if (resultsCountEl) {
            resultsCountEl.innerHTML = `Exibindo <strong>${filtered.length}</strong> de <strong>${allBooks.length}</strong> obras`;
          }

          bindDynamicEvents(container);
        }
      });
    }

    if (btnOpenCreate) {
      btnOpenCreate.addEventListener('click', () => openCreateBookModal());
    }

    bindDynamicEvents(container);
  }

  function bindDynamicEvents(container) {
    const btnClearSearch = container.querySelector('#btn-clear-search');
    const btnEmptyCreate = container.querySelector('#btn-empty-create-book');

    if (btnClearSearch) {
      btnClearSearch.addEventListener('click', () => {
        currentSearchQuery = '';
        render(container);
      });
    }

    if (btnEmptyCreate) {
      btnEmptyCreate.addEventListener('click', () => openCreateBookModal());
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  window.Gitbook.screens.books = {
    render
  };
})();
