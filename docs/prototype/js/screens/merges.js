/**
 * Gitbook Prototype - Tela T5: Gestão de Merge Requests
 * T5a: Lista de Merges (#/books/:id/merges)
 * T5b: Detalhe do Merge com Diff (#/merges/:id)
 * 03-especificacao-telas.md & 04-sequencia.md (Passo 6)
 */

(function () {
  window.Gitbook = window.Gitbook || {};
  window.Gitbook.screens = window.Gitbook.screens || {};

  let activeListFilter = 'all'; // 'all' | 'pending' | 'approved' | 'rejected'
  let diffMode = 'unified'; // 'unified' | 'split'

  // ==========================================================================
  // 1. T5a — Lista de Merge Requests (#/books/:id/merges)
  // ==========================================================================
  function renderList(container, params = {}) {
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
          <p class="empty-state-desc">Não foi possível carregar os Merge Requests do livro informado.</p>
          <a href="#/books" class="btn btn-secondary">Voltar ao Catálogo</a>
        </div>
      `;
      return;
    }

    const allMerges = mockData.getMergeRequests(book.id);

    // Contadores para os filtros
    const pendingCount = allMerges.filter((m) => m.status === 'pending').length;
    const approvedCount = allMerges.filter((m) => m.status === 'approved').length;
    const rejectedCount = allMerges.filter((m) => m.status === 'rejected').length;

    // Filtra lista
    const filteredMerges = allMerges.filter((m) => {
      if (activeListFilter === 'all') return true;
      return m.status === activeListFilter;
    });

    // Subnavegação em abas da obra
    const subnavHtml = window.Gitbook.screens.bookHub
      ? window.Gitbook.screens.bookHub.renderSubnavigation(book.id, 'merges', {
          pendingMerges: pendingCount
        })
      : '';

    // Botão "+ Nova Solicitação"
    const newMrBtnHtml = buttonComp ? buttonComp.createButton({
      text: '+ Nova Solicitação',
      variant: 'primary',
      size: 'sm',
      icon: 'merge',
      href: `#/books/${book.id}/editor`,
      attributes: 'title="Ir ao Editor para solicitar merge de uma branch"'
    }) : `<a href="#/books/${book.id}/editor" class="btn btn-primary btn-sm">+ Nova Solicitação</a>`;

    const icons = window.Gitbook.icons || { get: () => '' };

    container.innerHTML = `
      <div class="merges-page" id="merges-list-page">
        <!-- Subnavegação da Obra -->
        ${subnavHtml}

        <!-- Cabeçalho da Lista -->
        <header class="dashboard-header" style="border-bottom: none; padding-bottom: 0;">
          <div class="dashboard-title-area">
            <div class="dashboard-heading">
              <h1 class="dashboard-title">Solicitações de Integração (Merge Requests)</h1>
              <span class="badge badge-status-info">${allMerges.length} total</span>
            </div>
            <p class="dashboard-subtitle">
              Avalie e sincronize as ramificações dos escritores com a linha oficial protegida (<code>${book.mainBranch}</code>).
            </p>
          </div>

          <div class="dashboard-actions">
            ${newMrBtnHtml}
          </div>
        </header>

        <!-- Barra de Filtros por Status -->
        <div class="merges-filter-bar">
          <div class="filter-chips-group" role="tablist" aria-label="Filtros de status">
            <button type="button" class="filter-chip-btn ${activeListFilter === 'all' ? 'active' : ''}" data-filter="all">
              Todos (${allMerges.length})
            </button>
            <button type="button" class="filter-chip-btn ${activeListFilter === 'pending' ? 'active' : ''}" data-filter="pending">
              <span class="btn-icon">${icons.get('clock', { size: 12 })}</span> Pendentes (${pendingCount})
            </button>
            <button type="button" class="filter-chip-btn ${activeListFilter === 'approved' ? 'active' : ''}" data-filter="approved">
              <span class="btn-icon">${icons.get('check', { size: 12 })}</span> Aprovados (${approvedCount})
            </button>
            <button type="button" class="filter-chip-btn ${activeListFilter === 'rejected' ? 'active' : ''}" data-filter="rejected">
              <span class="btn-icon">${icons.get('close', { size: 12 })}</span> Rejeitados (${rejectedCount})
            </button>
          </div>

          <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
            Exibindo <strong>${filteredMerges.length}</strong> solicitações
          </div>
        </div>

        <!-- Lista de Cards de Merge -->
        <div class="merges-cards-list" id="merges-cards-container">
          ${renderMergesListCards(filteredMerges, badgeComp)}
        </div>
      </div>
    `;

    bindListEvents(container, book);
  }

  function renderMergesListCards(merges, badgeComp) {
    const icons = window.Gitbook.icons || { get: () => '' };

    if (merges.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon" style="display: flex; justify-content: center; margin-bottom: 12px;">${icons.get('merge', { size: 32 })}</div>
          <h2 class="empty-state-title">Nenhum Merge Request encontrado</h2>
          <p class="empty-state-desc">
            Não existem solicitações de integração com o filtro de status selecionado.
          </p>
        </div>
      `;
    }

    return merges.map((mr) => {
      const statusBadge = badgeComp
        ? badgeComp.createStatusBadge(mr.status)
        : `<span class="badge">${mr.status}</span>`;

      const roleBadge = badgeComp
        ? badgeComp.createRoleBadge(mr.authorRole || 'escritor', { showIcon: false })
        : `<span class="badge">${mr.authorRole}</span>`;

      return `
        <a href="#/merges/${mr.id}" class="merge-card-item" id="merge-card-${mr.id}" title="Clique para ver diff e avaliar">
          <div class="merge-item-main-info">
            <div class="merge-item-title-row">
              <span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: var(--radius-md); background: var(--color-bg-subtle); color: var(--color-primary);">
                ${icons.get('merge', { size: 15, strokeWidth: 1.8 })}
              </span>
              <h2 class="merge-item-title">${escapeHtml(mr.title)}</h2>
              ${statusBadge}
            </div>

            <div class="merge-flow-badge">
              <span style="display: inline-flex; align-items: center; gap: 4px;">
                ${icons.get('branch', { size: 13, strokeWidth: 1.8 })} ${escapeHtml(mr.sourceBranch)}
              </span>
              <span style="color: var(--color-text-muted);">➔</span>
              <span style="color: var(--color-role-gestor-text); font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
                ${icons.get('crown', { size: 13, strokeWidth: 1.8 })} ${escapeHtml(mr.targetBranch || 'main')}
              </span>
            </div>

            <div class="merge-item-meta">
              <span>Autor: <strong>${escapeHtml(mr.author)}</strong></span>
              ${roleBadge}
              <span>• Data: ${escapeHtml(mr.createdAt)}</span>
              <span>• Commits: ${mr.commitsCount || 1}</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px; flex-shrink: 0;">
            <span class="btn btn-secondary btn-sm">Ver Detalhes & Diff →</span>
          </div>
        </a>
      `;
    }).join('');
  }

  function bindListEvents(container, book) {
    const filterButtons = container.querySelectorAll('.filter-chip-btn');
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        activeListFilter = btn.getAttribute('data-filter');
        renderList(container, { id: book.id });
      });
    });
  }

  // ==========================================================================
  // 2. T5b — Detalhe do Merge Request e Diff (#/merges/:id)
  // ==========================================================================
  function renderDetail(container, params = {}) {
    const mockData = window.Gitbook.mockData;
    const buttonComp = window.Gitbook.components.button;
    const badgeComp = window.Gitbook.components.badge;

    const mergeId = params.id || '1';
    const mr = mockData ? mockData.getMergeRequestById(mergeId) : null;

    if (!mr) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${getIconSvg('alert', 32)}</div>
          <h2 class="empty-state-title">Merge Request não encontrado</h2>
          <p class="empty-state-desc">A solicitação de integração com ID "${escapeHtml(mergeId)}" não foi localizada.</p>
          <a href="#/books" class="btn btn-secondary">Voltar ao Catálogo</a>
        </div>
      `;
      return;
    }

    const book = mockData.getBookById(mr.bookId) || { id: '1', title: 'Obra', mainBranch: 'main' };
    const currentUser = mockData.getCurrentUser();
    const isGestor = currentUser.role === 'gestor';
    const isPending = mr.status === 'pending';

    const statusBadge = badgeComp
      ? badgeComp.createStatusBadge(mr.status)
      : `<span class="badge">${mr.status}</span>`;

    const roleBadge = badgeComp
      ? badgeComp.createRoleBadge(mr.authorRole || 'escritor')
      : `<span class="badge">${mr.authorRole}</span>`;

    const diffStats = mr.diff || { addedLines: 24, removedLines: 6, preview: '+ Trecho de alteração\n- Linha antiga' };
    const icons = window.Gitbook.icons || { get: () => '' };

    container.innerHTML = `
      <div class="merges-page" id="merge-detail-page">
        <!-- Navegação de Retorno -->
        <div>
          <a href="#/books/${book.id}/merges" class="merge-back-link">
            <span>←</span>
            <span>Voltar para Lista de Merges (${escapeHtml(book.title)})</span>
          </a>
        </div>

        <!-- Cabeçalho do Detalhe (T5b) -->
        <article class="merge-detail-header-card">
          <div class="merge-detail-title-row">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span class="route-code-badge">MR #${mr.id}</span>
                ${statusBadge}
              </div>
              <h1 class="merge-detail-title">${escapeHtml(mr.title)}</h1>
            </div>

            <!-- Fluxo de Ramificações -->
            <div class="merge-flow-banner">
              <span title="Branch de origem" style="display: inline-flex; align-items: center; gap: 4px;">
                ${icons.get('branch', { size: 14, strokeWidth: 1.8 })} <strong>${escapeHtml(mr.sourceBranch)}</strong>
              </span>
              <span style="color: var(--color-text-muted);">➔</span>
              <span title="Branch de destino" style="color: var(--color-role-gestor-text); display: inline-flex; align-items: center; gap: 4px;">
                ${icons.get('crown', { size: 14, strokeWidth: 1.8 })} <strong>${escapeHtml(mr.targetBranch || 'main')}</strong>
              </span>
            </div>
          </div>

          <!-- Metadados do Autor e Data -->
          <div class="merge-item-meta" style="padding-top: var(--space-2); border-top: 1px solid var(--color-border-subtle);">
            <span>Solicitado por: <strong>${escapeHtml(mr.author)}</strong></span>
            ${roleBadge}
            <span>• Enviado: ${escapeHtml(mr.createdAt)}</span>
            <span>• Obra: <a href="#/books/${book.id}"><strong>${escapeHtml(book.title)}</strong></a></span>
          </div>

          <!-- Descrição das Alterações -->
          <div class="merge-desc-box">
            <strong style="display: block; margin-bottom: 4px; font-size: var(--font-size-xs); color: var(--color-text-muted); text-transform: uppercase;">
              Justificativa / Descrição do Autor:
            </strong>
            <p>${escapeHtml(mr.description)}</p>
          </div>
        </article>

        <!-- Visualização Diff (Comparação Lado a Lado ou Unificado) -->
        <section class="diff-viewer-card" aria-label="Comparação de Modificações (Diff)">
          <div class="diff-toolbar">
            <div class="diff-file-info">
              <span style="display: inline-flex; align-items: center;">${icons.get('history', { size: 14, strokeWidth: 1.8 })}</span>
              <span>capitulo-conteudo.md</span>
            </div>

            <div style="display: flex; align-items: center; gap: 16px;">
              <div class="diff-stats-chips">
                <span class="diff-chip-add">+${diffStats.addedLines || 24}</span>
                <span class="diff-chip-remove">-${diffStats.removedLines || 6}</span>
              </div>

              <!-- Alternância de Visualização de Diff -->
              <div class="filter-chips-group">
                <button type="button" class="filter-chip-btn ${diffMode === 'unified' ? 'active' : ''}" id="btn-diff-unified">
                  Unificado
                </button>
                <button type="button" class="filter-chip-btn ${diffMode === 'split' ? 'active' : ''}" id="btn-diff-split">
                  Lado a Lado
                </button>
              </div>
            </div>
          </div>

          <!-- Linhas do Diff com Destaque em Cores -->
          <div class="diff-code-body" id="diff-code-container">
            ${renderDiffLines(diffStats.preview, diffMode)}
          </div>
        </section>

        <!-- Lista de Commits Incluídos no Merge -->
        <section class="card" aria-label="Commits Incluídos">
          <header class="card-header">
            <div>
              <h2 class="card-title" style="display: flex; align-items: center; gap: 8px;">
                ${icons.get('commit', { size: 18, strokeWidth: 1.8 })}
                <span>Commits Incluídos nesta Solicitação</span>
              </h2>
              <p class="card-subtitle">Histórico de snapshots que serão consolidados na branch <code>${book.mainBranch}</code>.</p>
            </div>
            <span class="badge badge-status-info">${mr.commitsCount || 1} commit(s)</span>
          </header>

          <div class="card-body">
            <div class="branches-card-list">
              <div class="branch-list-item">
                <div class="branch-info-left">
                  <span class="branch-type-icon">${icons.get('commit', { size: 16, strokeWidth: 1.8 })}</span>
                  <div>
                    <div class="branch-name-text">${escapeHtml(mr.title)}</div>
                    <div class="branch-author-text">Autor: <strong>${escapeHtml(mr.author)}</strong> • ${escapeHtml(mr.createdAt)}</div>
                  </div>
                </div>
                <div>
                  <code class="activity-hash">a94f1b2</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Barra de Ações / Decisão do Gestor (Critério Central de Aceite) -->
        ${renderDecisionSection(mr, isGestor, isPending, currentUser, buttonComp)}
      </div>
    `;

    bindDetailEvents(container, mr, book);
  }

  /**
   * Renderiza as linhas do diff
   */
  function renderDiffLines(previewText, mode) {
    if (!previewText) {
      previewText = '+ Nova linha consolidada\n- Linha antiga removida';
    }

    const lines = previewText.split('\n');

    if (mode === 'split') {
      return `
        <div style="display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--color-border-subtle);">
          <div style="border-right: 1px solid var(--color-border); padding: 8px 0;">
            <div style="padding: 4px 16px; font-size: 0.75rem; color: var(--color-text-muted); background: rgba(0,0,0,0.3); border-bottom: 1px solid var(--color-border-subtle);">
              ORIGEM: branch main (antes)
            </div>
            ${lines.filter((l) => l.startsWith('-') || !l.startsWith('+')).map((l, i) => `
              <div class="diff-line ${l.startsWith('-') ? 'remove' : 'ctx'}">
                <span class="diff-line-prefix">${l.startsWith('-') ? '-' : ' '}</span>
                <span class="diff-line-content">${escapeHtml(l.replace(/^[-+]/, ''))}</span>
              </div>
            `).join('')}
          </div>

          <div style="padding: 8px 0;">
            <div style="padding: 4px 16px; font-size: 0.75rem; color: var(--color-text-muted); background: rgba(0,0,0,0.3); border-bottom: 1px solid var(--color-border-subtle);">
              PROPOSTA: branch do escritor (depois)
            </div>
            ${lines.filter((l) => l.startsWith('+') || !l.startsWith('-')).map((l, i) => `
              <div class="diff-line ${l.startsWith('+') ? 'add' : 'ctx'}">
                <span class="diff-line-prefix">${l.startsWith('+') ? '+' : ' '}</span>
                <span class="diff-line-content">${escapeHtml(l.replace(/^[-+]/, ''))}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Modo Unificado (padrão)
    return lines.map((line, idx) => {
      const isAdd = line.startsWith('+');
      const isRemove = line.startsWith('-');
      const typeClass = isAdd ? 'add' : isRemove ? 'remove' : 'ctx';
      const prefix = isAdd ? '+' : isRemove ? '-' : ' ';

      return `
        <div class="diff-line ${typeClass}">
          <span class="diff-line-prefix">${prefix}</span>
          <span class="diff-line-content">${escapeHtml(line.replace(/^[-+]/, ''))}</span>
        </div>
      `;
    }).join('');
  }

  /**
   * Renderiza o painel de decisão do Gestor
   */
  function renderDecisionSection(mr, isGestor, isPending, currentUser, buttonComp) {
    const icons = window.Gitbook.icons || { get: () => '' };

    if (!isPending) {
      const isApproved = mr.status === 'approved';
      return `
        <section class="decision-card ${isApproved ? 'resolved-approved' : 'resolved-rejected'}">
          <header class="decision-header">
            <h2 class="decision-title" style="display: flex; align-items: center; gap: 8px;">
              <span>${isApproved ? icons.get('check', { size: 18, strokeWidth: 2 }) : icons.get('close', { size: 18, strokeWidth: 2 })}</span>
              <span>Solicitação de Merge ${isApproved ? 'Aprovada e Integrada' : 'Rejeitada'}</span>
            </h2>
            <span class="badge ${isApproved ? 'badge-status-approved' : 'badge-status-rejected'}">
              Status Final: ${mr.status}
            </span>
          </header>

          <p style="font-size: var(--font-size-sm); color: var(--color-text);">
            ${isApproved
              ? 'Esta ramificação foi mesclada com sucesso à branch <code>main</code>. O novo commit de integração foi registrado no histórico do livro.'
              : 'Esta solicitação foi rejeitada pelo Gestor com pedido de ajustes antes de nova tentativa.'}
          </p>

          ${mr.managerFeedback ? `
            <div style="padding: 12px 16px; background-color: var(--color-bg-subtle); border-radius: var(--radius-md); border: 1px solid var(--color-border); font-size: var(--font-size-sm);">
              <strong>Parecer do Gestor:</strong>
              <div style="color: var(--color-text-muted); margin-top: 4px;">"${escapeHtml(mr.managerFeedback)}"</div>
            </div>
          ` : ''}
        </section>
      `;
    }

    // Se pendente: exibe formulário de decisão
    const approveBtnHtml = buttonComp ? buttonComp.createButton({
      text: 'Aprovar e Integrar à Main',
      variant: 'primary',
      id: 'btn-decision-approve',
      icon: 'check',
      className: 'btn-lg'
    }) : '<button type="button" class="btn btn-primary btn-lg" id="btn-decision-approve">Aprovar e Integrar à Main</button>';

    const rejectBtnHtml = buttonComp ? buttonComp.createButton({
      text: 'Rejeitar Merge / Solicitar Ajustes',
      variant: 'danger',
      id: 'btn-decision-reject',
      icon: 'close'
    }) : '<button type="button" class="btn btn-danger" id="btn-decision-reject">Rejeitar Merge / Solicitar Ajustes</button>';

    if (!isGestor) {
      return `
        <section class="decision-card" id="manager-decision-card">
          <header class="decision-header">
            <h2 class="decision-title" style="display: flex; align-items: center; gap: 8px;">
              <span>${icons.get('crown', { size: 18, strokeWidth: 1.8 })}</span>
              <span>Avaliação Editorial do Gestor</span>
            </h2>
            <span class="badge badge-status-pending">Aguardando Avaliação</span>
          </header>

          <div style="padding: 14px 18px; background: var(--color-bg-subtle); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--font-size-sm); color: var(--color-text);">
            <div style="display: flex; align-items: center; gap: 8px; font-weight: var(--font-weight-semibold); margin-bottom: 6px; color: var(--color-text);">
              <span style="display: inline-flex; align-items: center;">${icons.get('lock', { size: 15, strokeWidth: 1.8 })}</span>
              <span>Aprovação e Integração Restritas ao Gestor Editorial</span>
            </div>
            <div style="color: var(--color-text-muted); line-height: var(--line-height-normal);">
              Você está navegando como <strong>${currentUser.name} (${currentUser.role})</strong>. Escritores e revisores têm permissão para acompanhar e auditar as propostas de merge, mas a consolidação na branch oficial (<code>${book.mainBranch}</code>) é prerrogativa exclusiva do Gestor.
            </div>
            <div style="margin-top: 10px; font-size: var(--font-size-xs); color: var(--color-primary-text);">
              ${getIconSvg('lightbulb', 14)} Para simular a aprovação deste merge, alterne para o papel de <strong>Gestor</strong> no menu superior.
            </div>
          </div>
        </section>
      `;
    }

    return `
      <section class="decision-card" id="manager-decision-card">
        <header class="decision-header">
          <h2 class="decision-title" style="display: flex; align-items: center; gap: 8px;">
            <span>${icons.get('crown', { size: 18, strokeWidth: 1.8 })}</span>
            <span>Avaliação Editorial do Gestor</span>
          </h2>
          <span class="badge badge-status-pending">Decisão Pendente</span>
        </header>

        <div class="form-group" style="margin-bottom: 0;">
          <label for="manager-feedback-comment" class="form-label">
            <span>Comentário Editorial / Justificativa (Opcional)</span>
            <span class="form-label-hint">Será visível no feed e para o autor</span>
          </label>
          <textarea
            id="manager-feedback-comment"
            class="form-textarea"
            rows="3"
            placeholder="Ex: Texto revisado e aprovado com excelente ritmo dramático. Integrado à main..."
          ></textarea>
        </div>

        <div class="decision-actions-row">
          ${rejectBtnHtml}
          ${approveBtnHtml}
        </div>
      </section>
    `;
  }

  function bindDetailEvents(container, mr, book) {
    const btnDiffUnified = container.querySelector('#btn-diff-unified');
    const btnDiffSplit = container.querySelector('#btn-diff-split');
    const btnApprove = container.querySelector('#btn-decision-approve');
    const btnReject = container.querySelector('#btn-decision-reject');
    const feedbackInput = container.querySelector('#manager-feedback-comment');

    // Alternância do diff
    if (btnDiffUnified) {
      btnDiffUnified.addEventListener('click', () => {
        diffMode = 'unified';
        renderDetail(container, { id: mr.id });
      });
    }

    if (btnDiffSplit) {
      btnDiffSplit.addEventListener('click', () => {
        diffMode = 'split';
        renderDetail(container, { id: mr.id });
      });
    }

    // Ação APROVAR (Critério Central de Aceite)
    if (btnApprove) {
      btnApprove.addEventListener('click', () => {
        const mockData = window.Gitbook.mockData;
        const comment = feedbackInput ? feedbackInput.value.trim() : '';

        // Atualiza status no mock
        mockData.updateMergeStatus(mr.id, 'approved', comment || 'Solicitação aprovada e integrada à branch oficial main.');

        // Re-renderiza detalhe atualizado
        renderDetail(container, { id: mr.id });
      });
    }

    // Ação REJEITAR (Critério Central de Aceite)
    if (btnReject) {
      btnReject.addEventListener('click', () => {
        const mockData = window.Gitbook.mockData;
        const comment = feedbackInput ? feedbackInput.value.trim() : '';

        // Atualiza status no mock
        mockData.updateMergeStatus(mr.id, 'rejected', comment || 'Ajustes necessários no capítulo antes da integração.');

        // Re-renderiza detalhe atualizado
        renderDetail(container, { id: mr.id });
      });
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

  window.Gitbook.screens.merges = {
    renderList,
    renderDetail
  };
})();
