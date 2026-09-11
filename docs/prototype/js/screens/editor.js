/**
 * Gitbook Prototype - Tela T4: Editor de Conteúdo e Versionamento
 * 03-especificacao-telas.md & 04-sequencia.md (Passo 5)
 */

(function () {
  window.Gitbook = window.Gitbook || {};
  window.Gitbook.screens = window.Gitbook.screens || {};

  // Estado local do editor
  let activeBookId = null;
  let activeBranch = 'main';
  let activeChapterId = 'chapter1';
  let hasUnsavedChanges = false;

  function getIconSvg(nameOrKey, size = 14) {
    if (window.Gitbook && window.Gitbook.icons) {
      return window.Gitbook.icons.get(nameOrKey, { size, strokeWidth: 1.8 });
    }
    return '';
  }

  // Capítulos em memória por livro
  const bookChapters = {
    '1': [
      {
        id: 'chapter1',
        title: 'Capítulo 1 — O Primeiro Snapshot',
        text: 'No ano de 2088, acordar sem carregar a árvore genealógica de memórias da noite anterior era considerado uma anomalia severa. Arthur olhou pela janela da torre de vidro fosco, observando as luzes estroboscópicas dos drones de inspeção. Ele sabia que o commit feito às 03:40 continha uma divergência crítica no registro.'
      },
      {
        id: 'chapter2',
        title: 'Capítulo 2 — A Ramificação Esquecida',
        text: 'Quando Laura abriu o console de dados no subsolo da Biblioteca Central, o terminal piscou em fósforo âmbar. Havia uma branch aberta há trinta anos com o nome de sua mãe: writer/clara-origin. O hash apontava para um bloco não integrado à linha principal.'
      },
      {
        id: 'chapter3',
        title: 'Capítulo 3 — O Conflito na Matriz',
        text: 'A câmara de sincronização pulsava em intervalos regulares. Três autores tentavam simultaneamente fazer o push de suas visões sobre o destino da colônia de Nova Esperança. O algoritmo de merge automático pausou: "Conflito irresolúvel detectado no parágrafo 42".'
      }
    ],
    '2': [
      {
        id: 'chapter1',
        title: 'Introdução — O Relógio Relacional',
        text: 'A mensuração do tempo nunca foi neutra. Da clepsidra babilônica aos ciclos de clock dos microprocessadores de silício, medimos aquilo que desejamos controlar.'
      },
      {
        id: 'chapter2',
        title: 'Ensaio I — A Ilusão da Continuidade',
        text: 'O presente não é um ponto contínuo no espaço; é uma sucessão discreta de estados que nossa consciência consolida retroativamente.'
      }
    ],
    '3': [
      {
        id: 'chapter1',
        title: 'Prólogo — O Beco Sem Saída às 00:00',
        text: 'A calçada de paralelepípedos úmidos terminava abruptamente em uma parede cega durante o dia. Mas ao 12º badalo do sino da catedral, a argamassa se desfazia em bruma fria.'
      }
    ]
  };

  /**
   * Renderiza a tela do Editor de Conteúdo (T4)
   * @param {HTMLElement} container - Elemento onde a tela será montada
   * @param {object} params - Parâmetros da rota ({ id: "1" })
   */
  function render(container, params = {}) {
    const mockData = window.Gitbook.mockData;
    const buttonComp = window.Gitbook.components.button;
    const badgeComp = window.Gitbook.components.badge;

    const bookId = params.id || '1';
    activeBookId = bookId;

    const book = mockData ? mockData.getBookById(bookId) : null;
    if (!book) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${getIconSvg('alert', 32)}</div>
          <h2 class="empty-state-title">Obra não encontrada</h2>
          <p class="empty-state-desc">O livro informado não foi localizado para edição.</p>
          <a href="#/books" class="btn btn-secondary">Voltar ao Catálogo</a>
        </div>
      `;
      return;
    }

    const currentUser = mockData.getCurrentUser();
    const branches = mockData.getBranches(book.id);

    // Define branch inicial padrão
    if (!branches.some((b) => b.name === activeBranch)) {
      const writerBranch = branches.find((b) => b.name.startsWith('writer/'));
      activeBranch = writerBranch ? writerBranch.name : (branches[0] ? branches[0].name : 'main');
    }

    // Inicializa capítulos do livro se ainda não existirem
    if (!bookChapters[bookId]) {
      bookChapters[bookId] = [
        {
          id: 'chapter1',
          title: 'Capítulo 1 — Início da Obra',
          text: 'Comece a redigir o manuscrito aqui...'
        }
      ];
    }

    const currentChapters = bookChapters[bookId];
    let currentChapter = currentChapters.find((c) => c.id === activeChapterId);
    if (!currentChapter) {
      currentChapter = currentChapters[0];
      activeChapterId = currentChapter.id;
    }

    const isMainBranch = activeBranch === 'main';

    // Subnavegação em abas (reuso do Hub)
    const subnavHtml = window.Gitbook.screens.bookHub
      ? window.Gitbook.screens.bookHub.renderSubnavigation(book.id, 'editor')
      : '';

    // Botão "Sincronizar com main"
    const syncBtnHtml = buttonComp ? buttonComp.createButton({
      text: 'Sincronizar com main',
      variant: 'secondary',
      size: 'sm',
      icon: 'refresh',
      id: 'btn-sync-main',
      attributes: isMainBranch ? 'disabled title="Você já está na branch main"' : 'title="Trazer alterações da branch main"'
    }) : '<button type="button" class="btn btn-secondary btn-sm" id="btn-sync-main">Sincronizar com main</button>';

    // Botão de destaque "Solicitar Merge"
    const mergeBtnHtml = buttonComp ? buttonComp.createButton({
      text: 'Solicitar Merge',
      variant: 'primary',
      size: 'sm',
      icon: 'merge',
      id: 'btn-request-merge',
      attributes: isMainBranch ? 'disabled title="A branch main é a linha de destino, não solicita merge para si mesma"' : 'title="Enviar solicitações de merge para o Gestor"'
    }) : '<button type="button" class="btn btn-primary btn-sm" id="btn-request-merge">Solicitar Merge</button>';

    // Botão "+ Novo Capítulo"
    const addChapterBtnHtml = buttonComp ? buttonComp.createButton({
      text: '+ Capítulo',
      variant: 'secondary',
      size: 'sm',
      id: 'btn-add-chapter'
    }) : '<button type="button" class="btn btn-secondary btn-sm" id="btn-add-chapter">+ Capítulo</button>';

    // Botão primário "Salvar Commit"
    const saveCommitBtnHtml = buttonComp ? buttonComp.createButton({
      text: 'Salvar Commit',
      variant: 'primary',
      id: 'btn-save-commit',
      icon: 'save',
      attributes: 'style="width: 100%; justify-content: center;"'
    }) : '<button type="button" class="btn btn-primary" id="btn-save-commit" style="width: 100%;">Salvar Commit</button>';

    // Status de sincronização
    const syncBadgeHtml = isMainBranch
      ? (badgeComp ? badgeComp.createStatusBadge('approved', { label: 'Linha Oficial (main)' }) : '<span class="badge">main</span>')
      : (hasUnsavedChanges
          ? (badgeComp ? badgeComp.createStatusBadge('pending', { label: '● Modificações não salvas' }) : '<span class="badge">Modificado</span>')
          : (badgeComp ? badgeComp.createStatusBadge('info', { label: 'Em dia com a main' }) : '<span class="badge">Sincronizado</span>'));

    container.innerHTML = `
      <div class="editor-container" id="editor-screen-wrapper">
        <!-- Subnavegação da Obra -->
        ${subnavHtml}

        <!-- Barra Superior do Editor -->
        <header class="editor-topbar">
          <div class="editor-topbar-left">
            <span style="font-size: var(--font-size-sm); color: var(--color-text-muted);">Branch Atual:</span>

            <div class="branch-selector-group">
              <span class="branch-selector-icon">${getIconSvg('branch', 14)}</span>
              <select id="editor-branch-select" class="branch-select-input" aria-label="Seletor de branch para edição">
                ${branches.map((b) => `
                  <option value="${escapeHtml(b.name)}" ${b.name === activeBranch ? 'selected' : ''}>
                    ${escapeHtml(b.name)} ${b.name === 'main' ? '(oficial)' : `(${escapeHtml(b.author || 'Autor')})`}
                  </option>
                `).join('')}
              </select>
            </div>

            <div id="editor-sync-indicator">
              ${syncBadgeHtml}
            </div>
          </div>

          <div class="editor-topbar-right">
            ${syncBtnHtml}
            ${mergeBtnHtml}
          </div>
        </header>

        <!-- Espaço de Trabalho do Editor (Grid em 3 Colunas) -->
        <div class="editor-workspace-grid">
          <!-- Coluna 1: Árvore de Capítulos/Arquivos -->
          <aside class="editor-tree-col" aria-label="Árvore de Capítulos">
            <div class="tree-header">
              <span class="tree-title">Capítulos & Seções</span>
              ${addChapterBtnHtml}
            </div>

            <ul class="tree-chapter-list" id="tree-chapter-list">
              ${currentChapters.map((ch, idx) => `
                <li class="tree-chapter-item ${ch.id === activeChapterId ? 'active' : ''}" data-chapter-id="${ch.id}">
                  <span class="tree-item-icon">${getIconSvg('file', 14)}</span>
                  <span class="tree-item-title">${escapeHtml(ch.title || `Capítulo ${idx + 1}`)}</span>
                </li>
              `).join('')}
            </ul>

            <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); padding-top: var(--space-2); border-top: 1px solid var(--color-border-subtle);">
              Branch: <code style="color: var(--color-primary-text);">${escapeHtml(activeBranch)}</code>
            </div>
          </aside>

          <!-- Coluna 2: Área Central de Edição de Texto -->
          <main class="editor-main-col" aria-label="Área de Edição">
            <div class="editor-header-bar">
              <input
                type="text"
                id="chapter-title-input"
                class="chapter-title-input"
                value="${escapeHtml(currentChapter.title)}"
                placeholder="Título do Capítulo..."
                aria-label="Título do capítulo"
              >
              <span id="editor-save-state-badge" class="badge badge-status-info" style="font-size: 0.7rem;">
                ${hasUnsavedChanges ? `${getIconSvg('clock', 11)} Modificações não salvas` : `${getIconSvg('check', 11)} Salvo em snapshot`}
              </span>
            </div>

            <!-- Barra de Ferramentas Simples -->
            <div class="editor-toolbar" role="toolbar" aria-label="Ferramentas de formatação">
              <button type="button" class="tool-btn" data-tag="b" title="Negrito"><strong>B</strong></button>
              <button type="button" class="tool-btn" data-tag="i" title="Itálico"><em>I</em></button>
              <button type="button" class="tool-btn" data-tag="h2" title="Subtítulo">H2</button>
              <button type="button" class="tool-btn" data-tag="quote" title="Citação">“”</button>
              <button type="button" class="tool-btn" data-tag="code" title="Código / Hash">&lt;&gt;</button>
            </div>

            <!-- Área de Texto do Capítulo -->
            <div class="editor-textarea-wrapper">
              <textarea
                id="chapter-text-editor"
                class="editor-textarea"
                placeholder="Escreva sua narrativa, ensaio ou capítulo aqui..."
                aria-label="Conteúdo do capítulo"
              >${escapeHtml(currentChapter.text)}</textarea>
            </div>

            <!-- Rodapé de Status do Editor -->
            <footer class="editor-footer-status">
              <span id="editor-word-count">0 palavras · 0 caracteres</span>
              <span>Modo Markdown / Prosa Literária</span>
            </footer>
          </main>

          <!-- Coluna 3: Painel Lateral de Commit e Versionamento -->
          <aside class="editor-commit-col" aria-label="Painel de Commit">
            <h2 class="commit-panel-title">
              <span class="commit-panel-icon">${getIconSvg('commit', 16)}</span> Registrar Commit
            </h2>

            <!-- Resumo Visual das Modificações -->
            <div class="commit-diff-preview">
              <div class="commit-diff-row">
                <span style="color: var(--color-text-muted);">Branch Destino:</span>
                <code style="color: var(--color-primary-text); font-size: 0.75rem;">${escapeHtml(activeBranch)}</code>
              </div>
              <div class="commit-diff-row">
                <span style="color: var(--color-text-muted);">Autor:</span>
                <span style="font-weight: 500;">${escapeHtml(currentUser.name)}</span>
              </div>
              <div class="commit-diff-row">
                <span style="color: var(--color-text-muted);">Arquivo:</span>
                <span><code>${activeChapterId}.md</code></span>
              </div>
              <div class="commit-diff-row">
                <span style="color: var(--color-text-muted);">Status:</span>
                <span style="color: ${hasUnsavedChanges ? 'var(--color-status-pending-text)' : 'var(--color-status-approved-text)'};">
                  ${hasUnsavedChanges ? '1 arquivo modificado' : 'Pronto para commit'}
                </span>
              </div>
            </div>

            <!-- Formulário de Mensagem de Commit -->
            <div class="form-group" style="margin-bottom: 0;">
              <label for="commit-message-input" class="form-label">
                <span>Mensagem do Commit *</span>
                <span class="form-label-hint">Padrão: feat, fix, docs</span>
              </label>
              <textarea
                id="commit-message-input"
                class="commit-message-input"
                placeholder="Ex: feat: reescreve diálogo final do capítulo 2"
              ></textarea>
            </div>

            <!-- Botão Salvar Commit -->
            <div>
              ${saveCommitBtnHtml}
            </div>

            <!-- Área de Toast / Notificação de Sucesso -->
            <div id="commit-feedback-container"></div>

            <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); line-height: 1.4; padding-top: var(--space-2); border-top: 1px solid var(--color-border-subtle);">
              ${getIconSvg('lightbulb', 14)} <strong>Dica de Versionamento:</strong> Cada commit adiciona um bloco imutável ao histórico da sua branch. O Gestor poderá visualizar esse histórico ao avaliar seu futuro Merge Request.
            </div>
          </aside>
        </div>
      </div>
    `;

    bindEvents(container, book);
    updateWordCount(container);
  }

  function bindEvents(container, book) {
    const branchSelect = container.querySelector('#editor-branch-select');
    const chapterItems = container.querySelectorAll('.tree-chapter-item');
    const btnAddChapter = container.querySelector('#btn-add-chapter');
    const titleInput = container.querySelector('#chapter-title-input');
    const textEditor = container.querySelector('#chapter-text-editor');
    const btnSaveCommit = container.querySelector('#btn-save-commit');
    const commitInput = container.querySelector('#commit-message-input');
    const btnSyncMain = container.querySelector('#btn-sync-main');
    const btnRequestMerge = container.querySelector('#btn-request-merge');
    const toolbarButtons = container.querySelectorAll('.tool-btn');

    // Troca de branch
    if (branchSelect) {
      branchSelect.addEventListener('change', (e) => {
        activeBranch = e.target.value;
        hasUnsavedChanges = false;
        render(container, { id: book.id });
      });
    }

    // Troca de capítulo ativo
    chapterItems.forEach((item) => {
      item.addEventListener('click', () => {
        const chId = item.getAttribute('data-chapter-id');
        if (chId !== activeChapterId) {
          activeChapterId = chId;
          hasUnsavedChanges = false;
          render(container, { id: book.id });
        }
      });
    });

    // Edição de título
    if (titleInput) {
      titleInput.addEventListener('input', (e) => {
        hasUnsavedChanges = true;
        const currentChapters = bookChapters[book.id];
        const chapter = currentChapters.find((c) => c.id === activeChapterId);
        if (chapter) chapter.title = e.target.value;

        // Atualiza título na árvore lateral
        const treeItem = container.querySelector(`.tree-chapter-item[data-chapter-id="${activeChapterId}"] .tree-item-title`);
        if (treeItem) treeItem.textContent = e.target.value || 'Sem título';

        updateSaveBadge(container);
      });
    }

    // Edição de texto
    if (textEditor) {
      textEditor.addEventListener('input', (e) => {
        hasUnsavedChanges = true;
        const currentChapters = bookChapters[book.id];
        const chapter = currentChapters.find((c) => c.id === activeChapterId);
        if (chapter) chapter.text = e.target.value;

        updateWordCount(container);
        updateSaveBadge(container);
      });
    }

    // Botões de formatação da toolbar
    toolbarButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tag = btn.getAttribute('data-tag');
        applyFormatting(textEditor, tag);
        hasUnsavedChanges = true;
        updateWordCount(container);
        updateSaveBadge(container);
      });
    });

    // Adicionar Novo Capítulo
    if (btnAddChapter) {
      btnAddChapter.addEventListener('click', () => {
        const currentChapters = bookChapters[book.id];
        const newIndex = currentChapters.length + 1;
        const newId = `chapter${Date.now()}`;
        const newChapter = {
          id: newId,
          title: `Capítulo ${newIndex} — Novo Trecho`,
          text: 'Escreva o novo capítulo aqui...'
        };
        currentChapters.push(newChapter);
        activeChapterId = newId;
        hasUnsavedChanges = true;
        render(container, { id: book.id });
      });
    }

    // Ação: SALVAR COMMIT (Critério central do Passo 5)
    if (btnSaveCommit) {
      btnSaveCommit.addEventListener('click', () => {
        const mockData = window.Gitbook.mockData;
        const message = (commitInput.value || '').trim();

        const feedbackContainer = container.querySelector('#commit-feedback-container');

        if (!message) {
          commitInput.focus();
          commitInput.style.borderColor = 'var(--color-status-rejected)';
          if (feedbackContainer) {
            feedbackContainer.innerHTML = `
              <div style="color: var(--color-status-rejected-text); font-size: var(--font-size-xs); margin-top: 4px;">
                ${getIconSvg('alert', 14)} Por favor, digite uma mensagem descritiva para o commit antes de salvar.
              </div>
            `;
          }
          return;
        }

        // Executa o commit de fato no mock em memória
        const newCommit = mockData.addCommit(book.id, activeBranch, message);

        hasUnsavedChanges = false;
        commitInput.value = '';
        commitInput.style.borderColor = 'var(--color-border)';

        // Feedback visual imediato com o hash do commit
        if (feedbackContainer) {
          feedbackContainer.innerHTML = `
            <div class="commit-success-toast">
              <span>${getIconSvg('check', 16)}</span>
              <div>
                <strong>Commit registrado!</strong>
                <div>Hash: <code>${newCommit.hash}</code> na branch <code>${activeBranch}</code></div>
              </div>
            </div>
          `;
          setTimeout(() => {
            if (feedbackContainer) feedbackContainer.innerHTML = '';
          }, 6000);
        }

        updateSaveBadge(container);
      });
    }

    // Sincronizar com main
    if (btnSyncMain && !btnSyncMain.disabled) {
      btnSyncMain.addEventListener('click', () => {
        const modal = window.Gitbook.components.modal;
        if (modal) {
          modal.open({
            title: 'Sincronizar com a Branch Main',
            body: `
              <p style="color: var(--color-text); font-size: var(--font-size-sm); margin-bottom: 16px;">
                Deseja fazer o rebase/merge da versão consolidada mais recente da <code>main</code> para a sua branch <code>${escapeHtml(activeBranch)}</code>?
              </p>
              <div style="padding: 12px; background: var(--color-bg-subtle); border-radius: var(--radius-md); border: 1px solid var(--color-border); font-size: var(--font-size-xs); color: var(--color-text-muted); display: flex; align-items: center; gap: 8px;">
                ${getIconSvg('check', 14)} <span>Nenhuma alteração local será perdida. Sua branch será atualizada com os commits aprovados pelo Gestor.</span>
              </div>
            `,
            footer: `
              <button type="button" class="btn btn-secondary" onclick="Gitbook.components.modal.close()">Cancelar</button>
              <button type="button" class="btn btn-primary" id="btn-confirm-sync">Confirmar Sincronização</button>
            `
          });

          const confirmBtn = document.getElementById('btn-confirm-sync');
          if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
              modal.close();
              const syncIndicator = container.querySelector('#editor-sync-indicator');
              if (syncIndicator && window.Gitbook.components.badge) {
                syncIndicator.innerHTML = window.Gitbook.components.badge.createStatusBadge('approved', { label: 'Sincronizado com main' });
              }
            });
          }
        }
      });
    }

    // Solicitar Merge (abre modal de confirmação do Passo 5)
    if (btnRequestMerge && !btnRequestMerge.disabled) {
      btnRequestMerge.addEventListener('click', () => {
        const modal = window.Gitbook.components.modal;
        const mockData = window.Gitbook.mockData;
        const currentUser = mockData.getCurrentUser();

        if (modal) {
          modal.open({
            title: 'Solicitar Merge Request',
            body: `
              <form id="form-quick-merge-request" novalidate>
                <div class="form-group">
                  <label class="form-label">Origem e Destino</label>
                  <div style="display: flex; align-items: center; gap: 8px; font-family: var(--font-family-mono); font-size: var(--font-size-sm); padding: 8px 12px; background: var(--color-bg-subtle); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                    <code style="color: var(--color-primary-text);">${escapeHtml(activeBranch)}</code>
                    <span>➔</span>
                    <code style="color: var(--color-role-gestor-text);">main (oficial)</code>
                  </div>
                </div>

                <div class="form-group">
                  <label for="merge-req-title" class="form-label">Título da Solicitação *</label>
                  <input type="text" id="merge-req-title" class="form-input" value="Integrar revisões do ${escapeHtml(titleInput ? titleInput.value : 'Capítulo')}" required>
                </div>

                <div class="form-group">
                  <label for="merge-req-desc" class="form-label">Descrição das Alterações</label>
                  <textarea id="merge-req-desc" class="form-textarea" rows="3" placeholder="Explique ao Gestor o que foi adicionado ou corrigido..."></textarea>
                </div>

                <div style="padding: 10px; background: var(--color-bg-subtle); border-radius: var(--radius-md); font-size: var(--font-size-xs); color: var(--color-text-muted);">
                  ${getIconSvg('info', 14)} Sua solicitação será enviada para avaliação do Gestor (<strong>${book.managerName}</strong>). O diff completo será analisado no Passo 6 (T5).
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px;">
                  <button type="button" class="btn btn-secondary" onclick="Gitbook.components.modal.close()">Cancelar</button>
                  <button type="submit" class="btn btn-primary" id="btn-submit-quick-merge">Enviar Solicitação</button>
                </div>
              </form>
            `,
            maxWidth: '560px'
          });

          const form = document.getElementById('form-quick-merge-request');
          if (form) {
            form.addEventListener('submit', (e) => {
              e.preventDefault();
              const mrTitle = document.getElementById('merge-req-title').value.trim() || 'Nova proposta de capítulo';
              const mrDesc = document.getElementById('merge-req-desc').value.trim() || 'Alterações no conteúdo pelo autor.';

              // Adiciona o merge request ao mock através do método oficial
              mockData.addMergeRequest({
                bookId: book.id,
                title: mrTitle,
                description: mrDesc,
                author: currentUser.name,
                authorRole: currentUser.role,
                sourceBranch: activeBranch,
                targetBranch: 'main',
                diff: {
                  addedLines: 24,
                  removedLines: 6,
                  preview: `+ ${textEditor ? textEditor.value.slice(0, 140) : 'Novas linhas adicionadas...'}\n- Versão anterior da cena.`
                }
              });

              modal.close();

              // Navega para a lista de Merges (T5a)
              window.location.hash = `#/books/${book.id}/merges`;
            });
          }
        }
      });
    }
  }

  function updateSaveBadge(container) {
    const badgeEl = container.querySelector('#editor-save-state-badge');
    if (!badgeEl) return;
    if (hasUnsavedChanges) {
      badgeEl.className = 'badge badge-status-pending';
      badgeEl.innerHTML = `${getIconSvg('clock', 11)} Modificações não salvas`;
    } else {
      badgeEl.className = 'badge badge-status-info';
      badgeEl.innerHTML = `${getIconSvg('check', 11)} Salvo em snapshot`;
    }
  }

  function updateWordCount(container) {
    const textEditor = container.querySelector('#chapter-text-editor');
    const counterEl = container.querySelector('#editor-word-count');
    if (!textEditor || !counterEl) return;

    const text = (textEditor.value || '').trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = text.length;

    counterEl.textContent = `${words} palavras · ${chars} caracteres`;
  }

  function applyFormatting(textarea, tag) {
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || 'texto';
    let replacement = selectedText;

    switch (tag) {
      case 'b':
        replacement = `**${selectedText}**`;
        break;
      case 'i':
        replacement = `*${selectedText}*`;
        break;
      case 'h2':
        replacement = `\n\n## ${selectedText}\n\n`;
        break;
      case 'quote':
        replacement = `\n\n> ${selectedText}\n\n`;
        break;
      case 'code':
        replacement = `\`${selectedText}\``;
        break;
    }

    textarea.setRangeText(replacement, start, end, 'select');
    textarea.focus();
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

  window.Gitbook.screens.editor = {
    render
  };
})();
