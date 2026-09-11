/**
 * Gitbook Prototype - Tela T6: Revisão e Sugestões Editoriais
 * 03-especificacao-telas.md & 04-sequencia.md (Passo 7)
 */

(function () {
  window.Gitbook = window.Gitbook || {};
  window.Gitbook.screens = window.Gitbook.screens || {};

  let currentSelectedSnippet = '';

  function getIconSvg(nameOrKey, size = 14) {
    if (window.Gitbook && window.Gitbook.icons) {
      return window.Gitbook.icons.get(nameOrKey, { size, strokeWidth: 1.8 });
    }
    return '';
  }

  /**
   * Renderiza a tela de Revisão e Sugestões (T6)
   * @param {HTMLElement} container - Elemento onde a tela será montada
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
          <p class="empty-state-desc">Não foi possível carregar as sugestões editoriais desta obra.</p>
          <a href="#/books" class="btn btn-secondary">Voltar ao Catálogo</a>
        </div>
      `;
      return;
    }

    const currentUser = mockData.getCurrentUser();
    const role = (currentUser.role || 'revisor').toLowerCase();
    const isRevisor = role === 'revisor';
    const isGestor = role === 'gestor';
    const isEscritor = role === 'escritor';

    const suggestions = mockData.getSuggestions(book.id);
    const pendingSuggestions = suggestions.filter((s) => s.status === 'pending');

    // Subnavegação em abas da obra
    const subnavHtml = window.Gitbook.screens.bookHub
      ? window.Gitbook.screens.bookHub.renderSubnavigation(book.id, 'suggestions', {
          pendingSuggestions: pendingSuggestions.length
        })
      : '';

    // Texto da branch main do livro
    const chapter1 = book.content && book.content.chapter1
      ? book.content.chapter1
      : { title: 'Capítulo 1 — Versão Oficial', text: 'Texto padrão da obra.' };

    // Botão de adicionar sugestão (visão do Revisor)
    const addSuggestionBtnHtml = buttonComp ? buttonComp.createButton({
      text: '+ Adicionar Sugestão',
      variant: 'primary',
      size: 'sm',
      icon: '🔎',
      id: 'btn-open-add-suggestion',
      attributes: 'title="Criar nova sugestão no trecho selecionado"'
    }) : '<button type="button" class="btn btn-primary btn-sm" id="btn-open-add-suggestion">+ Adicionar Sugestão</button>';

    // Renderiza o texto com marcações de sugestões ativas
    const highlightedProseHtml = buildHighlightedProse(chapter1.text, suggestions);

    container.innerHTML = `
      <div class="suggestions-page" id="suggestions-screen-wrapper">
        <!-- Subnavegação da Obra -->
        ${subnavHtml}

        <!-- Banner de Perspectiva do Papel Ativo (Critério Central de Aceite do Passo 7) -->
        <aside class="role-perspective-banner" aria-label="Perspectiva de Papel">
          <div class="perspective-info">
            <span style="font-size: 1.3rem; display: inline-flex; align-items: center;">
              ${isGestor ? getIconSvg('gestor', 22) : isRevisor ? getIconSvg('revisor', 22) : getIconSvg('escritor', 22)}
            </span>
            <div>
              <strong>Perspectiva Ativa: ${badgeComp ? badgeComp.createRoleBadge(currentUser.role) : currentUser.role} (${currentUser.name})</strong>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
                ${isGestor
                  ? 'Modo de Decisão: O Gestor avalia cada proposta dos revisores, podendo aceitá-las ou rejeitá-las.'
                  : isRevisor
                    ? 'Modo de Curadoria: O Revisor lê a versão consolidada, seleciona trechos e propõe melhorias pontuais.'
                    : 'Modo de Acompanhamento: Escritores possuem acesso de leitura para acompanhar as revisões da obra.'}
              </div>
            </div>
          </div>

          <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); background: var(--color-bg-subtle); padding: 4px 10px; border-radius: var(--radius-sm); border: 1px solid var(--color-border-subtle);">
            💡 Alterne o papel no menu do topo para validar as diferentes visões.
          </div>
        </aside>

        <!-- Layout em 2 Colunas: Leitura da Main à Esquerda | Painel de Sugestões à Direita -->
        <div class="suggestions-columns-grid">
          <!-- Coluna 1: Área de Leitura da branch main -->
          <section class="reader-card" aria-label="Leitura da Branch Oficial">
            <header class="reader-header">
              <div>
                <h2 style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold);">${escapeHtml(chapter1.title)}</h2>
                <span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
                  Obra: <a href="#/books/${book.id}"><strong>${escapeHtml(book.title)}</strong></a>
                </span>
              </div>

              <div class="reader-badge-branch">
                <span>${getIconSvg('branch', 14)}</span>
                <span>Branch Oficial: <code>${book.mainBranch}</code></span>
              </div>
            </header>

            <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); padding: 6px 12px; background: var(--color-bg-subtle); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle); display: flex; align-items: center; gap: 8px;">
              ${getIconSvg('info', 14)} <span><strong>Dica de Interação:</strong> Passe o mouse ou clique nos trechos com marcação âmbar (<mark class="suggestion-highlight" style="padding: 1px 4px; font-size: 0.75rem;">exemplo ${getIconSvg('inspect', 11)}</mark>) para localizar a sugestão correspondente no painel. Selecione qualquer trecho com o mouse para propor uma nova sugestão.</span>
            </div>

            <!-- Corpo de Leitura Formatado -->
            <div class="reader-prose" id="reader-prose-container">
              <p>${highlightedProseHtml}</p>
            </div>
          </section>

          <!-- Coluna 2: Painel Lateral de Sugestões (Visão diferenciada por papel) -->
          <aside class="suggestions-sidebar-card" id="suggestions-sidebar-panel" aria-label="Painel de Sugestões">
            <div class="sidebar-header">
              <div class="sidebar-title">
                <span>${getIconSvg('inspect', 15)}</span>
                <span>Sugestões Editoriais</span>
                <span class="badge badge-status-info" style="font-size: 0.7rem;">${pendingSuggestions.length} pendentes</span>
              </div>

              ${isRevisor ? `<div>${addSuggestionBtnHtml}</div>` : ''}
            </div>

            <!-- Lista de Cards de Sugestão Conforme o Papel Ativo -->
            <div class="suggestions-list" id="suggestions-cards-list">
              ${renderSuggestionsCards(suggestions, role, badgeComp)}
            </div>
          </aside>
        </div>
      </div>
    `;

    bindEvents(container, book, role);
  }

  /**
   * Constrói o HTML com marcações visuais nos trechos com sugestões
   */
  function buildHighlightedProse(fullText, suggestions) {
    let result = escapeHtml(fullText);

    suggestions.forEach((sug) => {
      if (!sug.targetSnippet) return;
      const snippetEscaped = escapeHtml(sug.targetSnippet);
      const isPending = sug.status === 'pending';
      const markerClass = isPending ? 'suggestion-highlight' : 'suggestion-highlight resolved';
      const statusIcon = sug.status === 'approved'
        ? getIconSvg('check', 11)
        : sug.status === 'rejected'
          ? getIconSvg('close', 11)
          : getIconSvg('inspect', 11);

      if (result.includes(snippetEscaped)) {
        const replacement = `<mark class="${markerClass}" data-sug-id="${sug.id}" title="${escapeHtml(sug.category)}: ${escapeHtml(sug.justification)}">${snippetEscaped}<span class="suggestion-marker-icon">${statusIcon}</span></mark>`;
        result = result.replace(snippetEscaped, replacement);
      }
    });

    return result;
  }

  /**
   * Renderiza os cards laterais de sugestões baseados no papel ativo
   */
  function renderSuggestionsCards(suggestions, role, badgeComp) {
    if (suggestions.length === 0) {
      return `
        <div class="empty-state" style="padding: 24px 12px;">
          <div class="empty-state-icon" style="display: flex; justify-content: center; margin-bottom: 12px;">${getIconSvg('inspect', 32)}</div>
          <h3 class="empty-state-title" style="font-size: var(--font-size-base);">Nenhuma sugestão registrada</h3>
          <p class="empty-state-desc" style="font-size: var(--font-size-xs);">
            ${role === 'revisor'
              ? 'Selecione um trecho no texto à esquerda e clique em "+ Adicionar Sugestão".'
              : 'Nenhuma proposta editorial pendente para esta obra.'}
          </p>
        </div>
      `;
    }

    return suggestions.map((sug) => {
      const isPending = sug.status === 'pending';
      const isApproved = sug.status === 'approved';
      const isGestor = role === 'gestor';

      const statusBadge = badgeComp
        ? badgeComp.createStatusBadge(sug.status)
        : `<span class="badge">${sug.status}</span>`;

      return `
        <article class="suggestion-card-item ${isPending ? 'pending' : 'resolved'}" id="sug-card-${sug.id}">
          <header class="suggestion-card-header">
            <span class="suggestion-category-badge">${escapeHtml(sug.category || 'Geral')}</span>
            ${statusBadge}
          </header>

          <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
            Proposto por: <strong>${escapeHtml(sug.revisorName || 'Revisor')}</strong> • ${escapeHtml(sug.createdAt)}
          </div>

          <!-- Comparação Antes e Depois -->
          <div class="suggestion-snippet-comparison">
            <div>
              <strong style="color: var(--color-text-muted); font-size: 0.7rem; text-transform: uppercase;">Trecho Original Afetado:</strong>
              <div class="snippet-original">"${escapeHtml(sug.targetSnippet)}"</div>
            </div>
            <div>
              <strong style="color: var(--color-text-muted); font-size: 0.7rem; text-transform: uppercase;">Redação Sugerida:</strong>
              <div class="snippet-suggested">"${escapeHtml(sug.suggestedText)}"</div>
            </div>
          </div>

          <!-- Justificativa -->
          <div class="suggestion-justification">
            "${escapeHtml(sug.justification)}"
          </div>

          <!-- Ações Conforme o Papel -->
          ${isGestor && isPending ? `
            <div class="suggestion-card-actions">
              <button type="button" class="btn btn-secondary btn-sm btn-reject-sug" data-sug-id="${sug.id}" title="Recusar alteração">
                <span class="btn-icon">${getIconSvg('close', 12)}</span> Rejeitar
              </button>
              <button type="button" class="btn btn-primary btn-sm btn-accept-sug" data-sug-id="${sug.id}" title="Aceitar e aplicar redação">
                <span class="btn-icon">${getIconSvg('check', 12)}</span> Aceitar Sugestão
              </button>
            </div>
          ` : ''}

          ${!isGestor && isPending ? `
            <div style="font-size: 0.7rem; color: var(--color-text-muted); padding-top: 4px; border-top: 1px solid var(--color-border-subtle); text-align: right; display: flex; align-items: center; justify-content: flex-end; gap: 4px;">
              ${getIconSvg('clock', 12)} <span>Aguardando decisão do Gestor</span>
            </div>
          ` : ''}
        </article>
      `;
    }).join('');
  }

  /**
   * Abre o Modal "Adicionar Sugestão" (Visão do Revisor)
   */
  function openAddSuggestionModal(book, preselectedSnippet = '') {
    const modal = window.Gitbook.components.modal;
    const mockData = window.Gitbook.mockData;
    const buttonComp = window.Gitbook.components.button;
    if (!modal) return;

    const currentUser = mockData.getCurrentUser();

    const submitBtnHtml = buttonComp ? buttonComp.createButton({
      text: 'Enviar Sugestão ao Gestor',
      variant: 'primary',
      id: 'btn-modal-submit-sug',
      type: 'submit'
    }) : '<button type="submit" class="btn btn-primary">Enviar Sugestão</button>';

    const modalBody = `
      <form id="form-add-suggestion" novalidate>
        <div id="sug-error-msg" style="display: none; margin-bottom: 12px; padding: 10px; background: var(--color-status-rejected-bg); border: 1px solid var(--color-status-rejected-border); border-radius: var(--radius-md); font-size: var(--font-size-xs); color: var(--color-status-rejected-text);"></div>

        <div class="form-group">
          <label for="sug-category" class="form-label">Categoria da Sugestão</label>
          <select id="sug-category" class="form-select">
            <option value="Correção Ortográfica">Correção Ortográfica / Gramatical</option>
            <option value="Ajuste de Enredo">Ajuste de Enredo / Ritmo Narrativo</option>
            <option value="Coerência">Coerência & Consistência Temporal</option>
            <option value="Estilo e Vocabulário">Estilo, Tom & Vocabulário</option>
          </select>
        </div>

        <div class="form-group">
          <label for="sug-target-snippet" class="form-label">
            <span>Trecho Selecionado da Versão Main *</span>
            <span class="form-label-hint">Texto a ser aprimorado</span>
          </label>
          <textarea
            id="sug-target-snippet"
            class="form-textarea"
            rows="2"
            placeholder="Selecione o trecho ou digite aqui as palavras exatas..."
            required
          >${escapeHtml(preselectedSnippet)}</textarea>
        </div>

        <div class="form-group">
          <label for="sug-suggested-text" class="form-label">
            <span>Nova Redação Sugerida *</span>
            <span class="form-label-hint">Como deve ficar o texto</span>
          </label>
          <textarea
            id="sug-suggested-text"
            class="form-textarea"
            rows="3"
            placeholder="Digite a proposta de redação corrigida..."
            required
          >${escapeHtml(preselectedSnippet)}</textarea>
        </div>

        <div class="form-group">
          <label for="sug-justification" class="form-label">
            <span>Justificativa Editorial *</span>
            <span class="form-label-hint">Explique ao Gestor o motivo da sugestão</span>
          </label>
          <textarea
            id="sug-justification"
            class="form-textarea"
            rows="2"
            placeholder="Ex: A concordância com o substantivo requer ajuste para garantir fluidez..."
            required
          ></textarea>
        </div>

        <div style="padding: 10px 14px; background: var(--color-bg-subtle); border-radius: var(--radius-md); border: 1px solid var(--color-border); font-size: var(--font-size-xs); color: var(--color-text-muted); display: flex; align-items: center; gap: 8px;">
          ${getIconSvg('inspect', 14)} <span>Enviada em nome de: <strong>${currentUser.name} (Revisor)</strong>. O Gestor (<strong>${book.managerName}</strong>) receberá uma notificação para aceitar ou rejeitar.</span>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
          <button type="button" class="btn btn-secondary" onclick="Gitbook.components.modal.close()">Cancelar</button>
          ${submitBtnHtml}
        </div>
      </form>
    `;

    modal.open({
      title: 'Adicionar Sugestão Editorial',
      body: modalBody,
      maxWidth: '580px'
    });

    const form = document.getElementById('form-add-suggestion');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = document.getElementById('sug-category').value;
        const targetSnippet = document.getElementById('sug-target-snippet').value.trim();
        const suggestedText = document.getElementById('sug-suggested-text').value.trim();
        const justification = document.getElementById('sug-justification').value.trim();
        const errorEl = document.getElementById('sug-error-msg');

        if (!targetSnippet || !suggestedText) {
          if (errorEl) {
            errorEl.textContent = '⚠️ Por favor, informe o trecho original e a nova redação sugerida.';
            errorEl.style.display = 'block';
          }
          if (!targetSnippet) document.getElementById('sug-target-snippet').focus();
          else document.getElementById('sug-suggested-text').focus();
          return;
        }

        if (errorEl) errorEl.style.display = 'none';

        // Adiciona ao mock data
        mockData.addSuggestion({
          bookId: book.id,
          category,
          targetSnippet,
          suggestedText,
          justification: justification || 'Revisão ortográfica e sintática.',
          revisorName: currentUser.name
        });

        modal.close();

        // Re-renderiza a tela com o novo marcador e card
        const appContainer = document.getElementById('app-container');
        if (appContainer) {
          render(appContainer, { id: book.id });
        }
      });
    }
  }

  function bindEvents(container, book, role) {
    const btnOpenAdd = container.querySelector('#btn-open-add-suggestion');
    const marks = container.querySelectorAll('.suggestion-highlight');
    const acceptBtns = container.querySelectorAll('.btn-accept-sug');
    const rejectBtns = container.querySelectorAll('.btn-reject-sug');
    const proseContainer = container.querySelector('#reader-prose-container');

    // Captura seleção de texto com o cursor
    if (proseContainer) {
      proseContainer.addEventListener('mouseup', () => {
        const selection = window.getSelection();
        const text = selection ? selection.toString().trim() : '';
        if (text && text.length > 3) {
          currentSelectedSnippet = text;
        }
      });
    }

    // Botão Adicionar Sugestão (Revisor)
    if (btnOpenAdd) {
      btnOpenAdd.addEventListener('click', () => {
        openAddSuggestionModal(book, currentSelectedSnippet);
      });
    }

    // Clique no marcador visual do texto leva ao card
    marks.forEach((m) => {
      m.addEventListener('click', () => {
        const sugId = m.getAttribute('data-sug-id');
        const card = container.querySelector(`#sug-card-${sugId}`);
        if (card) {
          container.querySelectorAll('.suggestion-card-item').forEach((c) => c.classList.remove('focused'));
          card.classList.add('focused');
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    // Decisão do Gestor: Aceitar Sugestão (Critério Central de Aceite)
    acceptBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const sugId = btn.getAttribute('data-sug-id');
        const mockData = window.Gitbook.mockData;
        mockData.updateSuggestionStatus(sugId, 'approved');

        // Re-renderiza a tela para refletir status e atualizar contador
        render(container, { id: book.id });
      });
    });

    // Decisão do Gestor: Rejeitar Sugestão (Critério Central de Aceite)
    rejectBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const sugId = btn.getAttribute('data-sug-id');
        const mockData = window.Gitbook.mockData;
        mockData.updateSuggestionStatus(sugId, 'rejected');

        // Re-renderiza a tela para refletir status e atualizar contador
        render(container, { id: book.id });
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

  window.Gitbook.screens.suggestions = {
    render
  };
})();
