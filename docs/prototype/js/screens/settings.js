/**
 * Gitbook Prototype - Tela T8: Configuracoes da Obra
 */

(function () {
  window.Gitbook = window.Gitbook || {};
  window.Gitbook.screens = window.Gitbook.screens || {};

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function roleLabel(role) {
    return role === 'escritor' ? 'Escritor' : 'Revisor';
  }

  function render(container, params = {}) {
    const mockData = window.Gitbook.mockData;
    const bookId = params.id || '1';
    const book = mockData.getBookById(bookId);
    const currentUser = mockData.getCurrentUser();
    if (!book || currentUser.role !== 'gestor') {
      container.innerHTML = '<div class="empty-state"><h2 class="empty-state-title">Acesso indisponível</h2></div>';
      return;
    }

    const settings = mockData.getBookSettings(bookId);
    const collaborators = mockData.getBookCollaborators(bookId);
    const subnav = window.Gitbook.screens.bookHub.renderSubnavigation(bookId, 'settings');
    const badge = window.Gitbook.components.badge;

    container.innerHTML = `
      <div class="settings-page">
        ${subnav}
        <header class="settings-header">
          <div>
            <p class="settings-eyebrow">Administração da obra</p>
            <h1 class="settings-title">Configurações de ${escapeHtml(book.title)}</h1>
            <p class="settings-subtitle">Controle quem colabora, como as alterações entram na obra e onde ela aparece.</p>
          </div>
          <a href="#/books/${bookId}" class="btn btn-secondary btn-sm">← Voltar ao Hub</a>
        </header>

        <section class="card settings-section" aria-labelledby="collaborators-title">
          <div class="settings-section-header">
            <div><h2 class="card-title" id="collaborators-title">Colaboradores e papéis</h2><p class="card-subtitle">Gerencie o acesso desta obra sem alterar o papel global da pessoa.</p></div>
            <button type="button" class="btn btn-primary btn-sm" id="btn-add-collaborator">+ Adicionar Colaborador</button>
          </div>
          <div class="settings-table-wrap">
            <table class="settings-table">
              <thead><tr><th>Colaborador</th><th>E-mail</th><th>Papel na obra</th><th>Ações</th></tr></thead>
              <tbody>
                ${collaborators.length ? collaborators.map((collaborator) => `
                  <tr>
                    <td><div class="settings-person"><span class="settings-avatar">${escapeHtml(collaborator.avatar)}</span><strong>${escapeHtml(collaborator.name)}</strong></div></td>
                    <td>${escapeHtml(collaborator.email)}</td>
                    <td>${badge.createRoleBadge(collaborator.role, { showIcon: false })}</td>
                    <td><div class="settings-actions"><select class="form-select collaborator-role-select" data-user-id="${collaborator.id}" aria-label="Papel de ${escapeHtml(collaborator.name)}"><option value="escritor" ${collaborator.role === 'escritor' ? 'selected' : ''}>Escritor</option><option value="revisor" ${collaborator.role === 'revisor' ? 'selected' : ''}>Revisor</option></select><button type="button" class="btn btn-ghost btn-sm remove-collaborator" data-user-id="${collaborator.id}">Remover</button></div></td>
                  </tr>`).join('') : '<tr><td colspan="4" class="settings-empty">Nenhum colaborador vinculado a esta obra.</td></tr>'}
              </tbody>
            </table>
          </div>
        </section>

        <section class="card settings-section" aria-labelledby="protection-title">
          <div class="settings-section-header"><div><h2 class="card-title" id="protection-title">Proteção de branches e regras de merge</h2><p class="card-subtitle">Defina os guardrails editoriais para a branch main.</p></div></div>
          <div class="settings-toggle-list">
            ${toggle('requireMergeRequest', 'Bloquear commits diretos na branch main', 'Exigir Merge Request para integrar alterações.', settings.requireMergeRequest)}
            ${toggle('requireReviewerSuggestion', 'Exigir sugestão de Revisor antes do Merge', 'A obra só poderá ser integrada após uma revisão editorial.', settings.requireReviewerSuggestion)}
            ${toggle('deleteBranchAfterMerge', 'Deletar branch do Escritor após aprovação', 'Limpa branches de trabalho depois da integração.', settings.deleteBranchAfterMerge)}
          </div>
        </section>

        <section class="card settings-section" aria-labelledby="metadata-title">
          <div class="settings-section-header"><div><h2 class="card-title" id="metadata-title">Metadados e visibilidade</h2><p class="card-subtitle">Atualize as informações exibidas no catálogo.</p></div></div>
          <form id="book-settings-form" class="settings-form">
            <div class="form-group"><label class="form-label" for="book-title">Título</label><input class="form-input" id="book-title" name="title" value="${escapeHtml(book.title)}" required></div>
            <div class="form-group"><label class="form-label" for="book-description">Sinopse</label><textarea class="form-textarea" id="book-description" name="description" rows="4" required>${escapeHtml(book.description)}</textarea></div>
            <div class="settings-form-grid"><div class="form-group"><label class="form-label" for="book-genre">Gênero Literário</label><input class="form-input" id="book-genre" name="genre" value="${escapeHtml(book.genre)}" required></div><div class="form-group"><label class="form-label" for="book-visibility">Visibilidade</label><select class="form-select" id="book-visibility" name="visibility"><option value="public" ${settings.visibility === 'public' ? 'selected' : ''}>Pública no catálogo</option><option value="private" ${settings.visibility === 'private' ? 'selected' : ''}>Privada</option></select></div></div>
            <div class="settings-form-footer"><span id="settings-save-status" class="settings-save-status" aria-live="polite"></span><button type="submit" class="btn btn-primary">Salvar Alterações</button></div>
          </form>
        </section>

        <section class="settings-danger-zone" aria-labelledby="danger-title">
          <div><p class="settings-eyebrow danger-eyebrow">Ações irreversíveis</p><h2 class="card-title" id="danger-title">Zona de Perigo</h2><p class="card-subtitle">Arquivar congela a obra. Excluir remove o estado dela deste protótipo.</p></div>
          <div class="settings-danger-actions"><button type="button" class="btn btn-secondary" id="btn-archive-book">Arquivar Obra</button><button type="button" class="btn btn-danger" id="btn-delete-book">Excluir Obra</button></div>
        </section>
      </div>
    `;

    bindEvents(container, book, settings);
  }

  function toggle(name, label, description, checked) {
    return `<label class="settings-toggle"><span><strong>${label}</strong><small>${description}</small></span><input type="checkbox" class="settings-toggle-input" data-setting="${name}" ${checked ? 'checked' : ''}><span class="settings-switch" aria-hidden="true"></span></label>`;
  }

  function bindEvents(container, book, settings) {
    const mockData = window.Gitbook.mockData;
    container.querySelector('#btn-add-collaborator').addEventListener('click', () => openAddCollaboratorModal(book.id));
    container.querySelectorAll('.collaborator-role-select').forEach((select) => select.addEventListener('change', (event) => {
      mockData.updateCollaboratorRole(book.id, event.target.dataset.userId, event.target.value);
      render(container, { id: book.id });
    }));
    container.querySelectorAll('.remove-collaborator').forEach((button) => button.addEventListener('click', () => openRemoveModal(book, button.dataset.userId)));
    container.querySelectorAll('.settings-toggle-input').forEach((input) => input.addEventListener('change', () => {
      const changes = {};
      container.querySelectorAll('.settings-toggle-input').forEach((item) => { changes[item.dataset.setting] = item.checked; });
      mockData.updateBookSettings(book.id, changes);
    }));
    container.querySelector('#book-settings-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.target);
      mockData.updateBookSettings(book.id, { title: form.get('title').trim(), description: form.get('description').trim(), genre: form.get('genre').trim(), visibility: form.get('visibility') });
      const status = container.querySelector('#settings-save-status');
      status.textContent = 'Alterações salvas agora.';
      setTimeout(() => { if (status) status.textContent = ''; }, 3000);
    });
    container.querySelector('#btn-archive-book').addEventListener('click', () => openArchiveModal(book));
    container.querySelector('#btn-delete-book').addEventListener('click', () => openDeleteModal(book));
  }

  function openAddCollaboratorModal(bookId) {
    const modal = window.Gitbook.components.modal;
    modal.open({ title: 'Adicionar colaborador', body: `<form id="add-collaborator-form"><div class="form-group"><label class="form-label" for="collaborator-email">E-mail</label><input class="form-input" id="collaborator-email" name="email" type="email" placeholder="pessoa@exemplo.com" required></div><div class="form-group"><label class="form-label" for="collaborator-role">Papel inicial</label><select class="form-select" id="collaborator-role" name="role"><option value="escritor">Escritor</option><option value="revisor">Revisor</option></select></div></form>`, footer: '<button type="button" class="btn btn-secondary" onclick="Gitbook.components.modal.close()">Cancelar</button><button type="submit" form="add-collaborator-form" class="btn btn-primary">Adicionar</button>' });
    document.getElementById('add-collaborator-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.target);
      window.Gitbook.mockData.addCollaborator(bookId, { email: form.get('email').trim(), role: form.get('role') });
      window.Gitbook.components.modal.close();
      setTimeout(() => { render(document.getElementById('app-container'), { id: bookId }); }, 250);
    });
  }

  function openRemoveModal(book, userId) {
    const user = window.Gitbook.mockData.getBookCollaborators(book.id).find((item) => item.id === userId);
    window.Gitbook.components.modal.open({ title: 'Remover acesso?', body: `<p>O acesso de <strong>${escapeHtml(user ? user.name : 'este colaborador')}</strong> à obra será removido.</p>`, footer: '<button type="button" class="btn btn-secondary" onclick="Gitbook.components.modal.close()">Cancelar</button><button type="button" class="btn btn-danger" id="confirm-remove-collaborator">Remover acesso</button>' });
    document.getElementById('confirm-remove-collaborator').addEventListener('click', () => { window.Gitbook.mockData.removeCollaborator(book.id, userId); window.Gitbook.components.modal.close(); setTimeout(() => render(document.getElementById('app-container'), { id: book.id }), 250); });
  }

  function openArchiveModal(book) {
    window.Gitbook.components.modal.open({ title: 'Arquivar obra?', body: '<p>A obra ficará congelada como somente leitura. Você poderá reverter esse estado apenas pelo mock.</p>', footer: '<button type="button" class="btn btn-secondary" onclick="Gitbook.components.modal.close()">Cancelar</button><button type="button" class="btn btn-danger" id="confirm-archive-book">Arquivar obra</button>' });
    document.getElementById('confirm-archive-book').addEventListener('click', () => { window.Gitbook.mockData.archiveBook(book.id); window.Gitbook.components.modal.close(); setTimeout(() => render(document.getElementById('app-container'), { id: book.id }), 250); });
  }

  function openDeleteModal(book) {
    window.Gitbook.components.modal.open({ title: 'Excluir obra definitivamente', body: `<p>Digite exatamente o título para confirmar:</p><p class="settings-confirm-title">${escapeHtml(book.title)}</p><input class="form-input" id="delete-book-confirmation" placeholder="Título da obra" autocomplete="off"><p id="delete-book-error" class="form-error-text"></p>`, footer: '<button type="button" class="btn btn-secondary" onclick="Gitbook.components.modal.close()">Cancelar</button><button type="button" class="btn btn-danger" id="confirm-delete-book">Excluir definitivamente</button>' });
    document.getElementById('confirm-delete-book').addEventListener('click', () => {
      const input = document.getElementById('delete-book-confirmation');
      if (input.value !== book.title) { document.getElementById('delete-book-error').textContent = 'O título digitado não corresponde.'; return; }
      window.Gitbook.mockData.deleteBook(book.id);
      window.Gitbook.components.modal.close();
      setTimeout(() => { window.location.hash = '#/books'; }, 250);
    });
  }

  window.Gitbook.screens.settings = { render };
})();
