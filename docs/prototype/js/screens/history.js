/**
 * Gitbook Prototype - Tela T7: Histórico de Versionamento e Commits
 * 03-especificacao-telas.md & 04-sequencia.md (Passo 8)
 */

(function () {
  window.Gitbook = window.Gitbook || {};
  window.Gitbook.screens = window.Gitbook.screens || {};

  // Estado local dos filtros da tela
  let currentFilters = {
    branch: 'all',
    author: 'all',
    search: ''
  };

  function getIconSvg(nameOrKey, size = 14) {
    if (window.Gitbook && window.Gitbook.icons) {
      return window.Gitbook.icons.get(nameOrKey, { size, strokeWidth: 1.8 });
    }
    return '';
  }

  /**
   * Renderiza a tela de Histórico de Versionamento e Commits (T7)
   * @param {HTMLElement} container - Container onde a tela será montada
   * @param {object} params - Parâmetros da rota ({ id: "1" })
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
          <div class="empty-state-icon">${getIconSvg('alert', 32)}</div>
          <h2 class="empty-state-title">Obra não encontrada</h2>
          <p class="empty-state-desc">Não foi possível carregar o histórico desta obra.</p>
          <a href="#/books" class="btn btn-secondary">Voltar ao Catálogo</a>
        </div>
      `;
      return;
    }

    const branches = mockData.getBranches(book.id);
    const rawCommits = mockData.getCommits(book.id);
    const mergeRequests = mockData.getMergeRequests(book.id);
    const suggestions = mockData.getSuggestions(book.id);

    const pendingMergesCount = mergeRequests.filter((m) => m.status === 'pending').length;
    const pendingSuggestionsCount = suggestions.filter((s) => s.status === 'pending').length;

    // Subnavegação em abas da obra (Critério do Hub: todas as abas levam a rotas reais)
    const subnavHtml = window.Gitbook.screens.bookHub
      ? window.Gitbook.screens.bookHub.renderSubnavigation(book.id, 'history', {
          pendingMerges: pendingMergesCount,
          pendingSuggestions: pendingSuggestionsCount
        })
      : '';

    // Ordenação cronológica garantida (mais recentes primeiro)
    const sortedCommits = [...rawCommits].sort((a, b) => {
      const timeA = a.timestamp || (a.date === 'Agora' ? Date.now() : 0);
      const timeB = b.timestamp || (b.date === 'Agora' ? Date.now() : 0);
      return timeB - timeA;
    });

    // Lista única de autores para o seletor de filtro
    const authorSet = new Set();
    sortedCommits.forEach((c) => {
      if (c.author) authorSet.add(c.author);
    });
    const authorsList = Array.from(authorSet);

    // Aplicação dos filtros ativos
    const filteredCommits = sortedCommits.filter((commit) => {
      if (currentFilters.branch !== 'all' && commit.branch !== currentFilters.branch) {
        return false;
      }
      if (currentFilters.author !== 'all' && commit.author !== currentFilters.author) {
        return false;
      }
      if (currentFilters.search) {
        const q = currentFilters.search.toLowerCase();
        const matchMsg = (commit.message || '').toLowerCase().includes(q);
        const matchHash = (commit.hash || '').toLowerCase().includes(q);
        const matchAuthor = (commit.author || '').toLowerCase().includes(q);
        if (!matchMsg && !matchHash && !matchAuthor) return false;
      }
      return true;
    });

    // Métricas de versionamento da obra
    const totalCommitsCount = sortedCommits.length;
    const mainCommitsCount = sortedCommits.filter((c) => c.branch === 'main').length;
    const branchesCommitsCount = totalCommitsCount - mainCommitsCount;

    container.innerHTML = `
      <div class="history-page" id="history-screen-wrapper">
        <!-- Subnavegação da Obra -->
        ${subnavHtml}

        <!-- Cabeçalho / Hero da Tela T7 -->
        <section class="card history-hero-card" aria-label="Histórico de Versionamento">
          <div class="history-hero-top">
            <div class="history-hero-title-group">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="history-icon-badge">${getIconSvg('history', 18)}</span>
                <h1 class="history-hero-title">Histórico de Versionamento e Commits</h1>
              </div>
              <p class="history-hero-subtitle">
                Rastreabilidade completa da evolução editorial de <a href="#/books/${book.id}"><strong>${escapeHtml(book.title)}</strong></a>. Visualize ramificações, merges, revisões e snapshots históricos de cada commit.
              </p>
            </div>

            <!-- Botão de Voltar ao Editor -->
            <div>
              <a href="#/books/${book.id}/editor" class="btn btn-secondary btn-sm" title="Escrever novo commit no editor">
                <span class="btn-icon">${getIconSvg('pen', 13)}</span> Ir ao Editor
              </a>
            </div>
          </div>

          <!-- Métricas Rápidas do Versionamento -->
          <div class="history-kpi-row">
            <div class="history-kpi-item">
              <span class="history-kpi-value">${totalCommitsCount}</span>
              <span class="history-kpi-label">Commits Registrados</span>
            </div>
            <div class="history-kpi-divider"></div>
            <div class="history-kpi-item">
              <span class="history-kpi-value" style="color: var(--color-primary);">${mainCommitsCount}</span>
              <span class="history-kpi-label">Na Branch Oficial (main)</span>
            </div>
            <div class="history-kpi-divider"></div>
            <div class="history-kpi-item">
              <span class="history-kpi-value" style="color: var(--color-role-escritor);">${branchesCommitsCount}</span>
              <span class="history-kpi-label">Em Branches de Escritores</span>
            </div>
            <div class="history-kpi-divider"></div>
            <div class="history-kpi-item">
              <span class="history-kpi-value" style="color: var(--color-role-gestor);">${branches.length}</span>
              <span class="history-kpi-label">Branches Mapeadas</span>
            </div>
          </div>
        </section>

        <!-- Barra de Filtros Reativa (Branch, Autor e Busca) -->
        <section class="history-filters-bar" aria-label="Filtros do Histórico">
          <div class="filters-left-group">
            <!-- Filtro por Branch -->
            <div class="filter-field">
              <label for="filter-branch-select" class="filter-label">
                <span style="display: inline-flex; vertical-align: middle; margin-right: 4px;">${getIconSvg('branch', 14)}</span>
                Filtrar por Branch:
              </label>
              <select id="filter-branch-select" class="form-select filter-select">
                <option value="all" ${currentFilters.branch === 'all' ? 'selected' : ''}>Todas as Branches (${totalCommitsCount})</option>
                ${branches.map((b) => {
                  const count = sortedCommits.filter((c) => c.branch === b.name).length;
                  return `
                    <option value="${escapeHtml(b.name)}" ${currentFilters.branch === b.name ? 'selected' : ''}>
                      ${b.name === 'main' ? '★ main (Oficial)' : b.name} (${count})
                    </option>
                  `;
                }).join('')}
              </select>
            </div>

            <!-- Filtro por Autor -->
            <div class="filter-field">
              <label for="filter-author-select" class="filter-label">${getIconSvg('user', 14)} Filtrar por Autor:</label>
              <select id="filter-author-select" class="form-select filter-select">
                <option value="all" ${currentFilters.author === 'all' ? 'selected' : ''}>Todos os Autores (${authorsList.length})</option>
                ${authorsList.map((authorName) => {
                  const count = sortedCommits.filter((c) => c.author === authorName).length;
                  return `
                    <option value="${escapeHtml(authorName)}" ${currentFilters.author === authorName ? 'selected' : ''}>
                      ${escapeHtml(authorName)} (${count})
                    </option>
                  `;
                }).join('')}
              </select>
            </div>

            <!-- Busca Textual por Mensagem ou Hash -->
            <div class="filter-field search-field">
              <label for="filter-search-input" class="filter-label">🔍 Busca Rápida:</label>
              <div class="search-input-wrapper">
                <input
                  type="text"
                  id="filter-search-input"
                  class="form-input"
                  placeholder="Buscar por mensagem, hash ou termo..."
                  value="${escapeHtml(currentFilters.search)}"
                />
                ${currentFilters.search ? `<button type="button" class="btn-clear-search" id="btn-clear-search" title="Limpar busca">&times;</button>` : ''}
              </div>
            </div>
          </div>

          <!-- Resumo de Itens e Limpar Filtros -->
          <div class="filters-right-group">
            <div class="filter-results-counter">
              <span>Exibindo <strong>${filteredCommits.length}</strong> de <strong>${totalCommitsCount}</strong> commits</span>
            </div>
            ${(currentFilters.branch !== 'all' || currentFilters.author !== 'all' || currentFilters.search) ? `
              <button type="button" class="btn btn-ghost btn-sm" id="btn-reset-filters">
                <span class="btn-icon">${getIconSvg('close', 12)}</span> Limpar Filtros
              </button>
            ` : ''}
          </div>
        </section>

        <!-- Linha do Tempo Estilo Grafo Git e Lista de Commits -->
        <section class="card history-timeline-card" aria-label="Linha do Tempo Visual">
          <header class="timeline-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span>${getIconSvg('branch', 18)}</span>
              <h2 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); color: var(--color-text);">
                Grafo de Commits & Linha do Tempo
              </h2>
            </div>

            <div class="timeline-legend">
              <span class="legend-item"><span class="legend-dot dot-main"></span> Linha Principal (main)</span>
              <span class="legend-item"><span class="legend-dot dot-branch"></span> Branch de Autor</span>
              <span class="legend-item"><span class="legend-dot dot-merge"></span> Merge / Integração</span>
              <span class="legend-item"><span class="legend-dot dot-review"></span> Revisão Editorial</span>
            </div>
          </header>

          <!-- Lista de Linhas com Grafo e Card -->
          <div class="git-timeline-list" id="git-timeline-list">
            ${renderTimelineRows(filteredCommits, book, badgeComp)}
          </div>
        </section>
      </div>
    `;

    bindEvents(container, book, sortedCommits);
  }

  /**
   * Constrói as linhas da timeline com visual de grafo Git
   */
  function renderTimelineRows(commitsList, book, badgeComp) {
    if (commitsList.length === 0) {
      return `
        <div class="empty-state" style="padding: 48px 16px;">
          <div class="empty-state-icon">🔍</div>
          <h3 class="empty-state-title">Nenhum commit encontrado</h3>
          <p class="empty-state-desc">Nenhum registro coincide com os filtros selecionados (branch, autor ou busca).</p>
          <button type="button" class="btn btn-secondary btn-sm" id="btn-empty-reset-filters">Limpar Filtros</button>
        </div>
      `;
    }

    return commitsList.map((commit, index) => {
      const isFirst = index === 0;
      const isLast = index === commitsList.length - 1;
      const isMain = commit.branch === 'main';

      // Detecta tipo de commit
      const msg = commit.message || '';
      const isMerge = msg.startsWith('merge:') || msg.toLowerCase().includes('merge da branch') || msg.toLowerCase().includes('aprova solicitação');
      const isReview = msg.startsWith('docs: aceita revisão') || msg.toLowerCase().includes('revisão');
      const isFeat = msg.startsWith('feat:');
      const isFix = msg.startsWith('fix:');
      const isChore = msg.startsWith('chore:');
      const isRelease = msg.startsWith('release:');

      // Determina classe do nó e linha do grafo
      let nodeClass = 'node-main';
      let nodeIcon = '●';
      let nodeTitle = 'Commit na branch main';

      if (isMerge) {
        nodeClass = 'node-merge';
        nodeIcon = getIconSvg('merge', 12);
        nodeTitle = 'Merge Commit (Integração de Branch à Main)';
      } else if (isReview) {
        nodeClass = 'node-review';
        nodeIcon = getIconSvg('inspect', 12);
        nodeTitle = 'Commit de Revisão Editorial Aprovada';
      } else if (!isMain) {
        nodeClass = 'node-branch';
        nodeIcon = '●';
        nodeTitle = `Commit na branch ${commit.branch}`;
      } else if (isRelease) {
        nodeClass = 'node-main';
        nodeIcon = getIconSvg('check', 12);
        nodeTitle = 'Tag de Versão / Release';
      }

      // Badge de papel do autor
      const authorRole = commit.authorRole || (commit.author === 'Lucas Mendes' ? 'gestor' : 'escritor');
      const roleBadgeHtml = badgeComp ? badgeComp.createRoleBadge(authorRole) : authorRole;

      // Badge do prefixo do Conventional Commit
      const commitTypeTag = getCommitTypeTag(msg);

      return `
        <article class="commit-timeline-row" id="commit-row-${commit.hash}">
          <!-- Coluna 1: Lane Visual do Grafo Git -->
          <div class="git-graph-lane" aria-hidden="true">
            <!-- Linha vertical contínua -->
            ${!isFirst ? `<div class="git-line-top ${isMain ? 'line-main' : 'line-branch'}"></div>` : ''}
            
            <!-- Nó do Commit -->
            <div class="git-node-marker ${nodeClass}" title="${escapeHtml(nodeTitle)}">
              <span>${nodeIcon}</span>
            </div>

            <!-- Conexão inferior com o próximo nó -->
            ${!isLast ? `<div class="git-line-bottom ${isMain ? 'line-main' : 'line-branch'}"></div>` : ''}

            <!-- Conector curvo de ramificação para branches paralelas -->
            ${!isMain ? `<div class="git-branch-curve" title="Ramificação de escritor"></div>` : ''}
          </div>

          <!-- Coluna 2: Card do Commit -->
          <div class="commit-card">
            <header class="commit-card-header">
              <div class="commit-author-box">
                <span class="commit-author-avatar">${getAvatarForAuthor(commit.author)}</span>
                <div>
                  <strong class="commit-author-name">${escapeHtml(commit.author || 'Autor')}</strong>
                  <span style="margin-left: 6px;">${roleBadgeHtml}</span>
                </div>
              </div>

              <div class="commit-header-right">
                <span class="commit-branch-tag ${isMain ? 'branch-main' : 'branch-feature'}">
                  ${getIconSvg('branch', 12)} <code>${escapeHtml(commit.branch)}</code>
                </span>
                <time class="commit-date-badge" datetime="${commit.date}">
                  ${getIconSvg('clock', 11)} ${escapeHtml(commit.date)}
                </time>
              </div>
            </header>

            <!-- Mensagem do Commit com Destaque -->
            <div class="commit-card-msg">
              ${commitTypeTag}
              <span class="commit-msg-text">${escapeHtml(commit.message)}</span>
            </div>

            <!-- Rodapé com Hash e Ação "Visualizar versão neste commit" -->
            <footer class="commit-card-footer">
              <div class="commit-hash-group">
                <span class="commit-hash-label">Hash:</span>
                <button
                  type="button"
                  class="commit-hash-pill btn-copy-hash"
                  data-hash="${escapeHtml(commit.hash)}"
                  title="Clique para copiar hash do commit"
                >
                  <code>${escapeHtml(commit.hash)}</code>
                  <span class="copy-icon">${getIconSvg('clipboard', 14)}</span>
                </button>
              </div>

              <div class="commit-card-actions">
                <button
                  type="button"
                  class="btn btn-secondary btn-sm btn-view-version"
                  data-hash="${escapeHtml(commit.hash)}"
                  title="Examinar o snapshot e conteúdo registrado neste commit"
                >
                  <span>${getIconSvg('eye', 14)}</span> Visualizar Versão
                </button>
              </div>
            </footer>
          </div>
        </article>
      `;
    }).join('');
  }

  /**
   * Identifica e formata o prefixo do commit convencional
   */
  function getCommitTypeTag(message) {
    if (!message) return '';
    const parts = message.split(':');
    if (parts.length < 2) return '';
    const prefix = parts[0].trim().toLowerCase();

    let badgeClass = 'type-generic';
    let label = prefix;

    if (prefix.includes('merge')) {
      badgeClass = 'type-merge';
      label = 'merge';
    } else if (prefix === 'feat') {
      badgeClass = 'type-feat';
      label = 'feat';
    } else if (prefix === 'fix') {
      badgeClass = 'type-fix';
      label = 'fix';
    } else if (prefix === 'docs') {
      badgeClass = 'type-docs';
      label = 'docs';
    } else if (prefix === 'chore') {
      badgeClass = 'type-chore';
      label = 'chore';
    } else if (prefix === 'refactor') {
      badgeClass = 'type-refactor';
      label = 'refactor';
    } else if (prefix === 'release') {
      badgeClass = 'type-release';
      label = 'release';
    }

    return `<span class="commit-type-badge ${badgeClass}">${escapeHtml(label)}</span>`;
  }

  /**
   * Retorna um avatar amigável para o autor
   */
  function getAvatarForAuthor(author) {
    if (!author) return getIconSvg('user', 14);
    if (author.includes('Lucas')) return getIconSvg('gestor', 14);
    if (author.includes('Beatriz') || author.includes('Pedro')) return getIconSvg('revisor', 14);
    if (author.includes('João') || author.includes('Maria')) return getIconSvg('escritor', 14);
    return getIconSvg('user', 14);
  }

  /**
   * Abre o Modal "Visualizar Versão Neste Commit" (Critério central do Passo 8)
   */
  function openVersionSnapshotModal(commit, book) {
    const modal = window.Gitbook.components.modal;
    const badgeComp = window.Gitbook.components.badge;
    if (!modal) return;

    const isMain = commit.branch === 'main';
    const isMerge = (commit.message || '').startsWith('merge:') || (commit.message || '').includes('aprova');
    const isReview = (commit.message || '').includes('revisão');

    // Snapshot do conteúdo no momento do commit
    const chapter1 = (book.content && book.content.chapter1)
      ? book.content.chapter1
      : { title: 'Capítulo 1', text: 'Texto registrado na obra.' };

    const modalBody = `
      <div class="version-snapshot-container">
        <!-- Metadados do Commit -->
        <div class="version-meta-box">
          <div class="meta-row">
            <div>
              <span class="meta-label">Hash do Commit:</span>
              <code class="meta-hash">${escapeHtml(commit.hash)}</code>
            </div>
            <div>
              <span class="meta-label">Branch de Origem:</span>
              <span class="badge ${isMain ? 'badge-status-approved' : 'badge-status-info'}">
                ${getIconSvg('branch', 12)} ${escapeHtml(commit.branch)}
              </span>
            </div>
          </div>

          <div class="meta-row" style="margin-top: 10px;">
            <div>
              <span class="meta-label">Autor do Registro:</span>
              <strong>${escapeHtml(commit.author)}</strong>
              <span style="margin-left: 6px;">
                ${badgeComp ? badgeComp.createRoleBadge(commit.authorRole || 'escritor') : ''}
              </span>
            </div>
            <div>
              <span class="meta-label">Data e Hora:</span>
              <span>${getIconSvg('clock', 12)} ${escapeHtml(commit.date)}</span>
            </div>
          </div>

          <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--color-border-subtle);">
            <span class="meta-label">Mensagem Registrada:</span>
            <div style="font-weight: var(--font-weight-semibold); color: var(--color-text); margin-top: 4px;">
              ${escapeHtml(commit.message)}
            </div>
          </div>
        </div>

        <!-- Explicação do Estado do Snapshot -->
        <div class="snapshot-context-banner">
          <span>${getIconSvg('commit', 16)}</span>
          <span>
            ${isMerge
              ? 'Este commit representa a integração validada pelo Gestor, unindo a branch do escritor à linha consolidada.'
              : isReview
                ? 'Este commit reflete a aplicação de uma sugestão editorial aprovada pela curadoria do livro.'
                : 'Snapshot do capítulo com as alterações registradas pelo autor nesta revisão.'}
          </span>
        </div>

        <!-- Visualizador do Texto da Obra no Commit -->
        <div class="snapshot-text-card">
          <div class="snapshot-text-header">
            <span style="font-size: 0.8rem; font-weight: bold; text-transform: uppercase; color: var(--color-text-muted);">
              ${getIconSvg('book', 14)} Conteúdo no Commit: ${escapeHtml(chapter1.title)}
            </span>
            <span class="badge badge-status-approved" style="font-size: 0.7rem;">Versão Rastreada</span>
          </div>

          <div class="snapshot-text-body">
            <p>${escapeHtml(chapter1.text)}</p>
          </div>
        </div>
      </div>
    `;

    const modalFooter = `
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
          Identificador imutável: <code>${commit.hash}</code>
        </span>
        <button type="button" class="btn btn-primary btn-sm" onclick="Gitbook.components.modal.close()">
          Fechar Visualização
        </button>
      </div>
    `;

    modal.open({
      title: `Snapshot do Commit [${commit.hash}]`,
      body: modalBody,
      footer: modalFooter,
      maxWidth: '680px'
    });
  }

  /**
   * Vincula eventos interativos aos elementos da tela
   */
  function bindEvents(container, book, allCommits) {
    const branchSelect = container.querySelector('#filter-branch-select');
    const authorSelect = container.querySelector('#filter-author-select');
    const searchInput = container.querySelector('#filter-search-input');
    const btnReset = container.querySelector('#btn-reset-filters');
    const btnEmptyReset = container.querySelector('#btn-empty-reset-filters');
    const btnClearSearch = container.querySelector('#btn-clear-search');
    const copyBtns = container.querySelectorAll('.btn-copy-hash');
    const viewBtns = container.querySelectorAll('.btn-view-version');

    // Filtro por Branch
    if (branchSelect) {
      branchSelect.addEventListener('change', (e) => {
        currentFilters.branch = e.target.value;
        render(container, { id: book.id });
      });
    }

    // Filtro por Autor
    if (authorSelect) {
      authorSelect.addEventListener('change', (e) => {
        currentFilters.author = e.target.value;
        render(container, { id: book.id });
      });
    }

    // Busca Textual
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value.trim();
        render(container, { id: book.id });
        // Mantém foco no input após re-render
        const reInput = container.querySelector('#filter-search-input');
        if (reInput) {
          reInput.focus();
          reInput.setSelectionRange(reInput.value.length, reInput.value.length);
        }
      });
    }

    // Botão Limpar Filtros
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        currentFilters = { branch: 'all', author: 'all', search: '' };
        render(container, { id: book.id });
      });
    }

    if (btnEmptyReset) {
      btnEmptyReset.addEventListener('click', () => {
        currentFilters = { branch: 'all', author: 'all', search: '' };
        render(container, { id: book.id });
      });
    }

    if (btnClearSearch) {
      btnClearSearch.addEventListener('click', () => {
        currentFilters.search = '';
        render(container, { id: book.id });
      });
    }

    // Copiar Hash com Feedback
    copyBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const hash = btn.getAttribute('data-hash');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(hash).catch(() => {});
        }
        const copyIcon = btn.querySelector('.copy-icon');
        if (copyIcon) {
          copyIcon.innerHTML = getIconSvg('check', 12);
          setTimeout(() => {
            copyIcon.innerHTML = getIconSvg('commit', 12);
          }, 1500);
        }
      });
    });

    // Abrir Modal de Visualização da Versão no Commit
    viewBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const hash = btn.getAttribute('data-hash');
        const commit = allCommits.find((c) => c.hash === hash);
        if (commit) {
          openVersionSnapshotModal(commit, book);
        }
      });
    });
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

  window.Gitbook.screens.history = {
    render
  };
})();
