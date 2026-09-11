/**
 * Gitbook Prototype - Tela T9: Prazos e Entregas
 */

(function () {
  window.Gitbook = window.Gitbook || {};
  window.Gitbook.screens = window.Gitbook.screens || {};

  function render(container, params = {}) {
    const mockData = window.Gitbook.mockData;
    const bookId = params.id || '1';
    const book = mockData ? mockData.getBookById(bookId) : null;

    if (!book) {
      container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">${getIconSvg('alert', 32)}</div><h2 class="empty-state-title">Obra não encontrada</h2><a href="#/books" class="btn btn-secondary">Voltar ao Catálogo</a></div>`;
      return;
    }

    const currentUser = mockData.getCurrentUser();
    const canManage = ['gestor', 'revisor'].includes(currentUser.role);
    const deadlines = mockData.getDeadlines(book.id);
    const pending = deadlines.filter((deadline) => getDisplayStatus(deadline) !== 'completed');
    const overdue = deadlines.filter((deadline) => getDisplayStatus(deadline) === 'overdue');
    const subnavHtml = window.Gitbook.screens.bookHub
      ? window.Gitbook.screens.bookHub.renderSubnavigation(book.id, 'deadlines', { pendingDeadlines: pending.length })
      : '';

    container.innerHTML = `
      <div class="deadlines-page">
        ${subnavHtml}
        <header class="deadlines-header">
          <div>
            <p class="eyebrow">${escapeHtml(book.title)}</p>
            <h1>Prazos e Entregas (Deadlines)</h1>
            <p class="deadlines-intro">Organize as próximas entregas editoriais e acompanhe o ritmo da obra.</p>
            <div class="deadlines-summary">
              <span class="badge badge-status-info">${pending.length} pendentes</span>
              <span class="badge ${overdue.length ? 'badge-status-rejected' : 'badge-status-approved'}">${overdue.length} atrasados</span>
            </div>
          </div>
          ${canManage ? `<button type="button" class="btn btn-primary" id="btn-new-deadline">${getIconSvg('calendar', 15)} + Novo Deadline</button>` : ''}
        </header>
        <div class="deadlines-filters" role="toolbar" aria-label="Filtrar deadlines">
          ${renderFilterButton('all', 'Todos')}
          ${renderFilterButton('in_progress', 'Em Andamento')}
          ${renderFilterButton('overdue', 'Atrasados')}
          ${renderFilterButton('completed', 'Concluídos')}
        </div>
        <section class="deadlines-grid" id="deadlines-list" aria-live="polite">
          ${renderCards(deadlines, currentUser, canManage)}
        </section>
      </div>
    `;

    bindEvents(container, book, currentUser, canManage);
  }

  function renderFilterButton(value, label) {
    return `<button type="button" class="deadline-filter ${value === 'all' ? 'active' : ''}" data-filter="${value}">${label}</button>`;
  }

  function renderCards(deadlines, currentUser, canManage, filter = 'all') {
    const visible = deadlines.filter((deadline) => filter === 'all' || getDisplayStatus(deadline) === filter);
    if (!visible.length) return `<div class="empty-state deadlines-empty"><div class="empty-state-icon">${getIconSvg('calendar', 32)}</div><h2 class="empty-state-title">Nenhum deadline neste filtro</h2><p class="empty-state-desc">Os prazos da obra aparecerão aqui quando forem cadastrados.</p></div>`;
    return visible.map((deadline) => renderCard(deadline, currentUser, canManage)).join('');
  }

  function renderCard(deadline, currentUser, canManage) {
    const status = getDisplayStatus(deadline);
    const assignee = deadline.assigneeId ? getUser(deadline.assigneeId) : null;
    const canToggle = canManage || (currentUser.role === 'escritor' && deadline.assigneeId === currentUser.id);
    const statusCopy = status === 'completed' ? `${getIconSvg('check', 12)} Concluído` : status === 'overdue' ? `${getIconSvg('alert', 12)} Atrasado há ${daysFromNow(deadline.dueAt)} dias` : `${getIconSvg('clock', 12)} Faltam ${daysUntil(deadline.dueAt)}`;
    const statusClass = status === 'completed' ? 'badge-status-approved' : status === 'overdue' ? 'badge-status-rejected' : 'badge-status-info';
    const assigneeHtml = assignee
      ? `<div class="deadline-assignee"><span class="deadline-avatar">${getIconSvg(assignee.avatar || assignee.role || 'user', 16)}</span><span><strong>${escapeHtml(assignee.name)}</strong>${window.Gitbook.components.badge.createRoleBadge(assignee.role)}</span></div>`
      : '<span class="deadline-unassigned">Sem responsável definido</span>';
    const actions = canManage ? `<button type="button" class="btn btn-ghost btn-sm" data-action="edit" data-id="${deadline.id}">Editar</button><button type="button" class="btn btn-ghost btn-sm deadline-delete" data-action="delete" data-id="${deadline.id}">Excluir</button>` : '';
    return `<article class="deadline-card ${status}" data-deadline-card data-status="${status}"><div class="deadline-card-top"><span class="badge ${statusClass}">${statusCopy}</span><time datetime="${deadline.dueAt}">${formatDate(deadline.dueAt)}</time></div><h2>${escapeHtml(deadline.title)}</h2><p>${escapeHtml(deadline.description || 'Sem descrição adicional.')}</p><div class="deadline-assignee-row">${assigneeHtml}</div><footer class="deadline-card-actions">${canToggle ? `<button type="button" class="btn ${status === 'completed' ? 'btn-secondary' : 'btn-primary'} btn-sm" data-action="toggle" data-id="${deadline.id}">${status === 'completed' ? 'Reabrir' : 'Marcar como Concluído'}</button>` : '<span class="deadline-readonly">Somente visualização</span>'}<span class="deadline-action-group">${actions}</span></footer></article>`;
  }

  function bindEvents(container, book, currentUser, canManage) {
    let activeFilter = 'all';
    const rerender = () => {
      const list = container.querySelector('#deadlines-list');
      list.innerHTML = renderCards(window.Gitbook.mockData.getDeadlines(book.id), currentUser, canManage, activeFilter);
    };
    const newButton = container.querySelector('#btn-new-deadline');
    if (newButton) newButton.addEventListener('click', () => openDeadlineModal(book, null, rerender));
    container.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      container.querySelectorAll('[data-filter]').forEach((item) => item.classList.toggle('active', item === button));
      rerender();
    }));
    container.addEventListener('click', (event) => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      const deadline = window.Gitbook.mockData.getDeadlines(book.id).find((item) => item.id === button.dataset.id);
      if (!deadline) return;
      if (button.dataset.action === 'toggle') {
        window.Gitbook.mockData.updateDeadlineStatus(book.id, deadline.id, deadline.status === 'completed' ? 'in_progress' : 'completed');
        rerender();
      } else if (button.dataset.action === 'delete' && window.confirm('Excluir este deadline?')) {
        window.Gitbook.mockData.deleteDeadline(book.id, deadline.id);
        rerender();
      } else if (button.dataset.action === 'edit') {
        openDeadlineModal(book, deadline, rerender);
      }
    });
  }

  function openDeadlineModal(book, deadline, rerender) {
    const collaborators = window.Gitbook.mockData.getBookCollaborators(book.id);
    const modal = window.Gitbook.components.modal;
    const value = (key) => deadline && deadline[key] ? deadline[key] : '';
    const collaboratorOptions = [`<option value="">Sem responsável</option>`].concat(collaborators.map((user) => `<option value="${user.id}" ${value('assigneeId') === user.id ? 'selected' : ''}>${escapeHtml(user.name)} — ${escapeHtml(user.roleTitle)}</option>`)).join('');
    modal.open({
      title: deadline ? 'Editar Deadline' : 'Novo Deadline',
      body: `<form id="deadline-form"><div class="form-group"><label class="form-label" for="deadline-title">Título da Meta/Entrega *</label><input class="form-input" id="deadline-title" name="title" required value="${escapeHtml(value('title'))}"></div><div class="form-group"><label class="form-label" for="deadline-description">Descrição</label><textarea class="form-textarea" id="deadline-description" name="description" rows="4">${escapeHtml(value('description'))}</textarea></div><div class="form-group"><label class="form-label" for="deadline-due-at">Data e Hora Limite *</label><input class="form-input" id="deadline-due-at" name="dueAt" type="datetime-local" required value="${toLocalInput(value('dueAt'))}"></div><div class="form-group"><label class="form-label" for="deadline-assignee">Colaborador Atribuído</label><select class="form-select" id="deadline-assignee" name="assigneeId">${collaboratorOptions}</select></div></form>`,
      footer: '<button type="button" class="btn btn-secondary" id="deadline-cancel">Cancelar</button><button type="submit" form="deadline-form" class="btn btn-primary">Salvar Deadline</button>'
    });
    document.getElementById('deadline-cancel').addEventListener('click', () => modal.close());
    document.getElementById('deadline-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.target).entries());
      if (deadline) window.Gitbook.mockData.updateDeadline(book.id, deadline.id, data);
      else window.Gitbook.mockData.addDeadline(book.id, data);
      modal.close();
      setTimeout(rerender, 220);
    });
  }

  function getDisplayStatus(deadline) {
    return deadline.status === 'completed' ? 'completed' : new Date(deadline.dueAt).getTime() < Date.now() ? 'overdue' : 'in_progress';
  }
  function getIconSvg(name, size = 14) { return window.Gitbook.icons ? window.Gitbook.icons.get(name, { size, strokeWidth: 1.8 }) : ''; }
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  }
  function getUser(id) { return window.Gitbook.mockData.getUsers().find((user) => user.id === id); }
  function formatDate(value) { return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)); }
  function daysUntil(value) { const days = Math.ceil((new Date(value).getTime() - Date.now()) / 86400000); return `${days} ${days === 1 ? 'dia' : 'dias'}`; }
  function daysFromNow(value) { const days = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 86400000)); return days; }
  function toLocalInput(value) { if (!value) return ''; const date = new Date(value); const offset = date.getTimezoneOffset() * 60000; return new Date(date.getTime() - offset).toISOString().slice(0, 16); }

  window.Gitbook.screens.deadlines = { render };
})();