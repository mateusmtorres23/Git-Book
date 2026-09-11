/**
 * Gitbook Prototype - Tela T3: Hub da Obra / Visão Geral do Livro
 * 03-especificacao-telas.md & 04-sequencia.md (Passo 4)
 */

(function () {
  window.Gitbook = window.Gitbook || {};
  window.Gitbook.screens = window.Gitbook.screens || {};

  /**
   * Renderiza a Visão Geral / Hub da Obra (T3)
   * @param {HTMLElement} container - Elemento onde a tela será montada
   * @param {object} params - Parâmetros da rota (ex: { id: "1" })
   */
  function render(container, params = {}) {
    const mockData = window.Gitbook.mockData;
    const buttonComp = window.Gitbook.components.button;
    const badgeComp = window.Gitbook.components.badge;

    const bookId = params.id || '1';
    const book = mockData ? mockData.getBookById(bookId) : null;

    if (!book) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <h2 class="empty-state-title">Obra não encontrada</h2>
          <p class="empty-state-desc">O livro com identificador "${escapeHtml(bookId)}" não foi localizado no catálogo.</p>
          <a href="#/books" class="btn btn-secondary">Voltar ao Catálogo</a>
        </div>
      `;
      return;
    }

    const currentUser = mockData.getCurrentUser();
    const isWriter = currentUser.role === 'escritor';
    const isGestor = currentUser.role === 'gestor';
    const isRevisor = currentUser.role === 'revisor';

    // Obter dados associados à obra
    const branches = mockData.getBranches(book.id);
    const commits = mockData.getCommits(book.id);
    const mergeRequests = mockData.getMergeRequests(book.id);
    const suggestions = mockData.getSuggestions(book.id);

    const pendingMergesCount = mergeRequests.filter((m) => m.status === 'pending').length;
    const pendingSuggestionsCount = suggestions.filter((s) => s.status === 'pending').length;

    // Métricas atualizadas
    const totalBranches = branches.length;
    const totalCommits = commits.length;

    // Subnavegação em Abas (Critério de Aceite: todas as tabs levam às rotas reais)
    const subnavHtml = renderSubnavigation(book.id, 'overview', {
      pendingMerges: pendingMergesCount,
      pendingSuggestions: pendingSuggestionsCount
    });

    // Botão de Ação no Hero (Editor para Gestor/Escritor; Sugestões para Revisor)
    let heroActionBtnHtml = '';
    if (isRevisor) {
      heroActionBtnHtml = buttonComp ? buttonComp.createButton({
        text: 'Painel de Sugestões',
        variant: 'primary',
        icon: '🔎',
        href: `#/books/${book.id}/suggestions`,
        id: 'btn-hub-open-suggestions'
      }) : `<a href="#/books/${book.id}/suggestions" class="btn btn-primary">Painel de Sugestões</a>`;
    } else {
      heroActionBtnHtml = buttonComp ? buttonComp.createButton({
        text: 'Abrir no Editor',
        variant: 'primary',
        icon: '✍️',
        href: `#/books/${book.id}/editor`,
        id: 'btn-hub-open-editor'
      }) : `<a href="#/books/${book.id}/editor" class="btn btn-primary">Abrir no Editor</a>`;
    }

    // Botão "Criar Minha Branch" (visível apenas para Escritor e Gestor)
    const createBranchBtnHtml = !isRevisor ? (buttonComp ? buttonComp.createButton({
      text: '+ Criar Minha Branch',
      variant: isWriter ? 'primary' : 'secondary',
      size: 'sm',
      icon: '🌿',
      id: 'btn-open-create-branch',
      attributes: isWriter ? 'title="Criar nova branch de escritor"' : 'title="Recomendado para o papel Escritor"'
    }) : '<button type="button" class="btn btn-secondary btn-sm" id="btn-open-create-branch">+ Criar Minha Branch</button>') : '';

    const icons = window.Gitbook.icons || { render: (x) => x, get: (x) => x };

    // Renderização do Painel de Métricas Avançadas (Apenas Gestor) ou Visão Operacional (Escritor / Revisor)
    let metricsOrOperationalHtml = '';

    if (isGestor) {
      metricsOrOperationalHtml = `
        <!-- Painel de Gestão Editorial Centralizada (Exclusivo Gestor) -->
        <div style="margin-bottom: var(--space-5); padding: 12px 18px; background-color: var(--color-role-gestor-bg); border: 1px solid var(--color-role-gestor-border); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: var(--radius-md); background: rgba(88, 11, 18, 0.12); color: var(--color-primary);">
              ${icons.get('crown', { size: 18, strokeWidth: 2 })}
            </span>
            <div>
              <div style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-role-gestor-text);">
                Painel de Controle Editorial do Gestor
              </div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
                Acesso integral: aprovação de merge requests na branch main, decisões de revisão e métricas completas da obra.
              </div>
            </div>
          </div>
          <span class="badge badge-role-gestor">Gestão Ativa</span>
        </div>

        <!-- Painel de Métricas Rápidas (KPIs Avançados) -->
        <section class="kpi-grid" aria-label="Métricas Rápidas da Obra">
          <div class="kpi-card">
            <div class="kpi-icon-box">${icons.get('commit', { size: 18, strokeWidth: 1.8 })}</div>
            <div class="kpi-data">
              <span class="kpi-value">${totalCommits}</span>
              <span class="kpi-label">Total de Commits</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-box">${icons.get('branch', { size: 18, strokeWidth: 1.8 })}</div>
            <div class="kpi-data">
              <span class="kpi-value">${totalBranches}</span>
              <span class="kpi-label">Branches Ativas</span>
            </div>
          </div>

          <div class="kpi-card" style="${pendingMergesCount > 0 ? 'border-color: var(--color-status-pending-border);' : ''}">
            <div class="kpi-icon-box" style="${pendingMergesCount > 0 ? 'background-color: var(--color-status-pending-bg); color: var(--color-status-pending-text);' : ''}">${icons.get('merge', { size: 18, strokeWidth: 1.8 })}</div>
            <div class="kpi-data">
              <span class="kpi-value" style="${pendingMergesCount > 0 ? 'color: var(--color-status-pending-text);' : ''}">${pendingMergesCount}</span>
              <span class="kpi-label">Merges Pendentes</span>
            </div>
          </div>

          <div class="kpi-card" style="${pendingSuggestionsCount > 0 ? 'border-color: var(--color-role-revisor-border);' : ''}">
            <div class="kpi-icon-box" style="${pendingSuggestionsCount > 0 ? 'background-color: var(--color-role-revisor-bg); color: var(--color-role-revisor-text);' : ''}">${icons.get('inspect', { size: 18, strokeWidth: 1.8 })}</div>
            <div class="kpi-data">
              <span class="kpi-value" style="${pendingSuggestionsCount > 0 ? 'color: var(--color-role-revisor-text);' : ''}">${pendingSuggestionsCount}</span>
              <span class="kpi-label">Sugestões de Revisão</span>
            </div>
          </div>
        </section>
      `;
    } else if (isWriter) {
      metricsOrOperationalHtml = `
        <!-- Visão Operacional Simplificada: Escritor -->
        <section class="operational-panel" aria-label="Visão Operacional do Escritor">
          <div class="operational-panel-info">
            <div class="operational-panel-icon writer">${icons.get('pen', { size: 20, strokeWidth: 1.8 })}</div>
            <div>
              <div class="operational-panel-title">Ambiente de Trabalho do Escritor</div>
              <div class="operational-panel-desc">
                Crie novos capítulos ou continue sua redação em branch dedicada. Suas alterações ficam salvas com segurança no histórico e podem ser submetidas para avaliação via Merge Request.
              </div>
              <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px; font-size: var(--font-size-xs);">
                <span class="badge badge-role-escritor">Escritor Ativo</span>
                <span style="color: var(--color-text-muted);">Sua branch sugerida: <code>writer/${currentUser.name.toLowerCase().replace(/\s+/g, '-')}</code></span>
              </div>
            </div>
          </div>
          <div class="operational-panel-actions">
            <a href="#/books/${book.id}/editor" class="btn btn-primary btn-sm">
              <span class="btn-icon">${icons.get('pen', { size: 14, strokeWidth: 2 })}</span>
              <span>Continuar no Editor</span>
            </a>
          </div>
        </section>
      `;
    } else if (isRevisor) {
      metricsOrOperationalHtml = `
        <!-- Visão Operacional Simplificada: Revisor -->
        <section class="operational-panel" aria-label="Visão Operacional do Revisor">
          <div class="operational-panel-info">
            <div class="operational-panel-icon reviewer">${icons.get('inspect', { size: 20, strokeWidth: 1.8 })}</div>
            <div>
              <div class="operational-panel-title">Painel de Curadoria e Revisão Textual</div>
              <div class="operational-panel-desc">
                Seu foco como Revisor é avaliar a consistência da linha consolidada (<code>${book.mainBranch}</code>). Proponha melhorias ortográficas, ajustes de enredo ou coerência diretamente pelo Painel de Sugestões.
              </div>
              <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px; font-size: var(--font-size-xs);">
                <span class="badge badge-role-revisor">Revisor Ativo</span>
                <span style="color: var(--color-text-muted);">
                  ${pendingSuggestionsCount > 0 ? `<strong>${pendingSuggestionsCount}</strong> sugestão(ões) ativa(s) na obra` : 'Nenhuma sugestão pendente no momento'}
                </span>
              </div>
            </div>
          </div>
          <div class="operational-panel-actions">
            <a href="#/books/${book.id}/suggestions" class="btn btn-primary btn-sm">
              <span class="btn-icon">${icons.get('inspect', { size: 14, strokeWidth: 2 })}</span>
              <span>Abrir Painel de Sugestões</span>
            </a>
          </div>
        </section>
      `;
    } else {
      metricsOrOperationalHtml = `
        <!-- Visão Operacional: Colaborador Geral -->
        <section class="operational-panel" aria-label="Visão Geral do Colaborador">
          <div class="operational-panel-info">
            <div class="operational-panel-icon neutral">${icons.get('user', { size: 20, strokeWidth: 1.8 })}</div>
            <div>
              <div class="operational-panel-title">Visão do Colaborador</div>
              <div class="operational-panel-desc">
                Acompanhe o desenvolvimento desta obra literária colaborativa. Utilize o seletor <em>Simular Papel</em> no menu superior para experimentar a perspectiva de Gestor, Escritor ou Revisor.
              </div>
            </div>
          </div>
        </section>
      `;
    }

    container.innerHTML = `
      <div class="book-hub" id="book-hub-container">
        <!-- Subnavegação interna em abas -->
        ${subnavHtml}

        <!-- Hero / Painel de Informações da Obra -->
        <article class="book-hub-hero">
          <div class="book-hub-hero-banner" style="background: ${book.coverGradient || 'linear-gradient(135deg, #1e3a8a, #4338ca)'};"></div>

          <div class="book-hub-hero-content">
            <div class="book-hub-title-block">
              <div class="book-hub-badges-row">
                <span class="badge badge-status-info">${escapeHtml(book.genre || 'Literatura')}</span>
                ${badgeComp ? badgeComp.createStatusBadge('approved', { label: `Linha Oficial (${book.mainBranch})` }) : ''}
                <span class="badge badge-status-info" style="font-family: var(--font-family-mono); font-size: var(--font-size-xs);">
                  ${escapeHtml(book.version || 'v1.0')}
                </span>
              </div>

              <h1 class="book-hub-title">${escapeHtml(book.title)}</h1>
              <p class="book-hub-desc">${escapeHtml(book.description)}</p>

              <div class="book-hub-meta-row">
                <div>
                  <span style="display: inline-flex; align-items: center; gap: 4px;">${icons ? icons.get('gestor', 13) : ''} Gestor Responsável:</span>
                  <strong>${escapeHtml(book.managerName || 'Lucas Mendes')}</strong>
                </div>
                <div>•</div>
                <div>
                  <span>Data de Criação:</span>
                  <strong>${escapeHtml(book.createdAt || '2026-09-01')}</strong>
                </div>
                <div>•</div>
                <div>
                  <span>Branch Padrão:</span>
                  <code style="color: var(--color-primary-text);">${book.mainBranch}</code>
                </div>
              </div>
            </div>

            <div class="book-hub-hero-actions">
              ${heroActionBtnHtml}
            </div>
          </div>
        </article>

        <!-- Métricas Avançadas (Gestor) OU Visão Operacional (Escritor / Revisor) -->
        ${metricsOrOperationalHtml}

        <!-- Layout em 2 Colunas: Branches em Destaque & Feed de Atividades Recentes -->
        <div class="hub-columns-layout">
          <!-- Coluna 1: Seção "Branches em Destaque" -->
          <section class="card" aria-label="Branches em Destaque">
            <header class="card-header">
              <div>
                <h2 class="card-title" style="display: flex; align-items: center; gap: 8px;">${icons ? icons.get('branch', 16) : ''} Branches em Destaque</h2>
                <p class="card-subtitle">Linha principal consolidada e ramificações ativas dos escritores.</p>
              </div>
              <div>
                ${createBranchBtnHtml}
              </div>
            </header>

            <div class="card-body">
              <div class="branches-card-list">
                ${branches.map((b) => renderBranchItem(b, book.id, isRevisor)).join('')}
              </div>
            </div>
          </section>

          <!-- Coluna 2: Feed de Atividades Recentes -->
          <section class="card" aria-label="Feed de Atividades Recentes">
            <header class="card-header">
              <div>
                <h2 class="card-title" style="display: flex; align-items: center; gap: 8px;">${icons ? icons.get('history', 16) : ''} Atividades Recentes</h2>
                <p class="card-subtitle">Últimos commits e solicitações de merge na obra.</p>
              </div>
            </header>

            <div class="card-body">
              <div class="activity-feed-list">
                ${renderActivityFeed(commits, mergeRequests)}
              </div>
            </div>

            <footer class="card-footer">
              <span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">Histórico completo rastreável</span>
              <a href="#/books/${book.id}/history" class="btn btn-ghost btn-sm">Ver Todo o Histórico →</a>
            </footer>
          </section>
        </div>
      </div>
    `;

    bindEvents(container, book);
  }

  /**
   * Renderiza a barra de subnavegação em abas
   * Restringe abas de escrita para o papel Revisor
   */
  function renderSubnavigation(bookId, activeTab = 'overview', badges = {}) {
    const mockData = window.Gitbook.mockData;
    const currentUser = mockData ? mockData.getCurrentUser() : { role: 'gestor' };
    const isRevisor = currentUser && currentUser.role === 'revisor';

    let tabs = [
      { id: 'overview', label: 'Visão Geral', icon: '📖', href: `#/books/${bookId}`, badge: null },
      { id: 'editor', label: 'Editor de Escrita', icon: '✍️', href: `#/books/${bookId}/editor`, badge: null },
      { id: 'merges', label: 'Merge Requests', icon: '🔀', href: `#/books/${bookId}/merges`, badge: badges.pendingMerges },
      { id: 'suggestions', label: 'Sugestões', icon: '🔎', href: `#/books/${bookId}/suggestions`, badge: badges.pendingSuggestions },
      { id: 'history', label: 'Histórico', icon: '📜', href: `#/books/${bookId}/history`, badge: null }
    ];

    // Revisor não deve ter acesso ao Editor de Escrita nem visualizar sua aba
    if (isRevisor) {
      tabs = tabs.filter((t) => t.id !== 'editor');
    }

    const icons = window.Gitbook.icons;

    const tabsHtml = tabs.map((tab) => {
      const isActive = tab.id === activeTab;
      const badgeHtml = tab.badge > 0
        ? `<span class="subnav-tab-badge">${tab.badge}</span>`
        : '';
      const iconHtml = icons ? icons.render(tab.icon, { size: 15, strokeWidth: 1.8 }) : tab.icon;

      return `
        <li class="subnav-tab-item">
          <a href="${tab.href}" class="subnav-tab-link ${isActive ? 'active' : ''}">
            <span class="subnav-tab-icon">${iconHtml}</span>
            <span>${tab.label}</span>
            ${badgeHtml}
          </a>
        </li>
      `;
    }).join('');

    return `
      <nav class="subnav-tabs-wrapper" aria-label="Navegação da Obra">
        <ul class="subnav-tabs">
          ${tabsHtml}
        </ul>
      </nav>
    `;
  }

  /**
   * Renderiza uma linha de branch
   */
  function renderBranchItem(branch, bookId, isRevisor = false) {
    const isMain = branch.name === 'main' || branch.isDefault;
    const badgeComponent = window.Gitbook.components.badge;
    const icons = window.Gitbook.icons || { get: () => '' };

    const badgeHtml = isMain
      ? (badgeComponent ? badgeComponent.createStatusBadge('approved', { label: 'Protegida (main)' }) : '<span class="badge badge-status-approved">main</span>')
      : '<span class="badge badge-status-info">Escritor</span>';

    const branchIcon = isMain
      ? icons.get('crown', { size: 15, strokeWidth: 1.8 })
      : icons.get('branch', { size: 15, strokeWidth: 1.8 });

    return `
      <div class="branch-list-item">
        <div class="branch-info-left">
          <span class="branch-type-icon">${branchIcon}</span>
          <div>
            <div class="branch-name-text">${escapeHtml(branch.name)}</div>
            <div class="branch-author-text">Autor: <strong>${escapeHtml(branch.author || 'Autor')}</strong></div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          ${badgeHtml}
          ${!isRevisor ? `
            <a href="#/books/${bookId}/editor" class="btn btn-secondary btn-sm" title="Editar nesta branch">
              Editar
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Renderiza a lista de atividades recentes combinando commits e merges
   */
  function renderActivityFeed(commits, merges) {
    const icons = window.Gitbook.icons || { get: () => '' };
    const items = [];

    (commits || []).slice(0, 4).forEach((c) => {
      items.push({
        type: 'commit',
        icon: icons.get('commit', { size: 14, strokeWidth: 1.8 }),
        title: c.message,
        author: c.author,
        authorRole: c.authorRole || 'escritor',
        date: c.date || 'Recente',
        hash: c.hash,
        timestamp: c.timestamp || 0
      });
    });

    (merges || []).slice(0, 3).forEach((m) => {
      items.push({
        type: 'merge',
        icon: icons.get('merge', { size: 14, strokeWidth: 1.8 }),
        title: `Merge Request: ${m.title}`,
        author: m.author,
        authorRole: m.authorRole || 'escritor',
        date: m.createdAt || 'Recente',
        status: m.status,
        timestamp: Date.now() - 10000
      });
    });

    if (items.length === 0) {
      return '<p style="color: var(--color-text-muted); font-size: var(--font-size-sm); padding: 12px 0;">Nenhuma atividade recente registrada nesta obra.</p>';
    }

    // Ordena mais recentes primeiro
    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    const badgeComp = window.Gitbook.components.badge;

    return items.map((item) => {
      const roleBadge = badgeComp
        ? badgeComp.createRoleBadge(item.authorRole, { showIcon: false })
        : `<span class="badge">${item.authorRole}</span>`;

      const statusBadge = item.status && badgeComp
        ? badgeComp.createStatusBadge(item.status)
        : '';

      return `
        <div class="activity-feed-item">
          <div class="activity-icon">${item.icon}</div>
          <div class="activity-details">
            <div class="activity-title">
              <strong>${escapeHtml(item.title)}</strong>
            </div>
            <div class="activity-meta">
              <span>${escapeHtml(item.author)}</span>
              ${roleBadge}
              ${item.hash ? `<span class="activity-hash">${item.hash}</span>` : ''}
              ${statusBadge}
              <span>• ${escapeHtml(item.date)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Abre o modal "Criar Minha Branch"
   */
  function openCreateBranchModal(book) {
    const modal = window.Gitbook.components.modal;
    const mockData = window.Gitbook.mockData;
    const buttonComp = window.Gitbook.components.button;
    if (!modal) return;

    const currentUser = mockData.getCurrentUser();
    const defaultBranchSlug = `writer/${(currentUser.name || 'autor').toLowerCase().replace(/\s+/g, '-')}-capitulo-novo`;

    const submitBtnHtml = buttonComp ? buttonComp.createButton({
      text: 'Criar Branch e Iniciar Escrita',
      variant: 'primary',
      id: 'btn-modal-submit-branch',
      type: 'submit'
    }) : '<button type="submit" class="btn btn-primary">Criar Branch</button>';

    const modalBody = `
      <form id="form-create-branch" novalidate>
        <div class="form-group">
          <label for="branch-new-name" class="form-label">
            <span>Nome da Branch</span>
            <span class="form-label-hint">Padrão: writer/nome-tarefa</span>
          </label>
          <input type="text" id="branch-new-name" class="form-input" style="font-family: var(--font-family-mono);" value="${defaultBranchSlug}" required>
        </div>

        <div class="form-group">
          <label class="form-label">Origem da Ramificação</label>
          <input type="text" class="form-input" value="${book.mainBranch} (versão oficial)" disabled style="opacity: 0.7;">
        </div>

        <div style="padding: 12px; background-color: var(--color-bg-subtle); border-radius: var(--radius-md); border: 1px solid var(--color-border); font-size: var(--font-size-xs); color: var(--color-text-muted); display: flex; align-items: center; gap: 8px;">
          ${icons ? icons.get('branch', 14) : ''} <span>Sua nova branch será criada a partir da <code>${book.mainBranch}</code> consolidada. Suas edições ficarão isoladas até que você solicite um Merge Request ao Gestor (<strong>${book.managerName}</strong>).</span>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
          <button type="button" class="btn btn-secondary" onclick="Gitbook.components.modal.close()">Cancelar</button>
          ${submitBtnHtml}
        </div>
      </form>
    `;

    modal.open({
      title: 'Criar Minha Branch de Escrita',
      body: modalBody,
      maxWidth: '540px'
    });

    const form = document.getElementById('form-create-branch');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('branch-new-name');
        const branchName = (input.value || '').trim();
        if (!branchName) return;

        // Adiciona a branch ao mock em memória
        const branches = mockData.getBranches(book.id);
        branches.push({
          id: `b-${Date.now()}`,
          bookId: String(book.id),
          name: branchName,
          author: currentUser.name,
          isProtected: false,
          isDefault: false
        });

        // Registra commit de inicialização da branch
        mockData.addCommit(book.id, branchName, `feat: inicializa ramificação ${branchName}`);

        modal.close();

        // Re-renderiza a tela do Hub com a nova branch
        const appContainer = document.getElementById('app-container');
        if (appContainer) {
          render(appContainer, { id: book.id });
        }
      });
    }
  }

  function bindEvents(container, book) {
    const btnCreateBranch = container.querySelector('#btn-open-create-branch');
    if (btnCreateBranch) {
      btnCreateBranch.addEventListener('click', () => openCreateBranchModal(book));
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

  window.Gitbook.screens.bookHub = {
    render,
    renderSubnavigation
  };
})();
