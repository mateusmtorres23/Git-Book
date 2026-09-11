/**
 * Gitbook Prototype - Header Global (T0)
 * 02-regras-design.md & 03-especificacao-telas.md
 */

(function () {
  window.Gitbook = window.Gitbook || {};
  window.Gitbook.components = window.Gitbook.components || {};

  /**
   * Renderiza o Header Global no container especificado
   * @param {HTMLElement|string} target - Elemento ou seletor do container
   * @param {object} context - { activeBookId: string|null }
   */
  function render(target = '#header-container', context = {}) {
    const container = typeof target === 'string' ? document.querySelector(target) : target;
    if (!container) return;

    const mockData = window.Gitbook.mockData;
    const badgeComponent = window.Gitbook.components.badge;

    const currentUser = mockData ? mockData.getCurrentUser() : {
      name: 'Lucas Mendes',
      email: 'lucas.gestor@gitbook.com',
      role: 'gestor',
      avatar: '👑'
    };

    // Obter livro ativo se estiver no contexto de um livro (ex: #/books/:id...)
    let activeBook = null;
    if (context.activeBookId && mockData) {
      activeBook = mockData.getBookById(context.activeBookId);
    }

    const roleBadgeHtml = badgeComponent
      ? badgeComponent.createRoleBadge(currentUser.role)
      : `<span class="badge badge-role-${currentUser.role}">${currentUser.role}</span>`;

    const icons = window.Gitbook.icons || { get: () => '' };

    container.innerHTML = `
      <header class="app-header" id="global-header">
        <div class="header-inner">
          <!-- Lado Esquerdo: Logo + Contexto da Obra -->
          <div class="header-left">
            <a href="#/books" class="header-brand" title="Ir para o Dashboard de Livros">
              <span class="header-brand-icon">${icons.get('book', { size: 18, strokeWidth: 2 })}</span>
              <span class="header-brand-title">
                <span class="brand-git">Git</span><span class="brand-book">book</span>
              </span>
            </a>

            ${activeBook ? `
              <span class="header-context-divider">/</span>
              <a href="#/books/${activeBook.id}" class="header-book-context" title="${activeBook.title}">
                <span class="header-book-icon">${icons.get('book', { size: 14, strokeWidth: 1.8 })}</span>
                <span class="header-book-name">${activeBook.title}</span>
              </a>
            ` : ''}
          </div>

          <!-- Centro: Simulador de Papel (Facilidade de Teste Conforme 01-contexto.md) -->
          <div class="header-role-switch" title="Simular perspectiva de visualização e permissão">
            <span class="header-role-label">Simular Papel:</span>
            <select class="header-role-select" id="role-simulator-select" aria-label="Simular papel de usuário">
              ${currentUser.role === 'colaborador' ? `<option value="colaborador" selected>Colaborador Neutro (${currentUser.name})</option>` : ''}
              <option value="gestor" ${currentUser.role === 'gestor' ? 'selected' : ''}>Gestor (Lucas Mendes)</option>
              <option value="escritor" ${currentUser.role === 'escritor' ? 'selected' : ''}>Escritor (João Silva)</option>
              <option value="revisor" ${currentUser.role === 'revisor' ? 'selected' : ''}>Revisor (Beatriz Costa)</option>
            </select>
          </div>

          <!-- Lado Direito: Perfil do Usuário & Dropdown -->
          <div class="header-right">
            <div class="header-user-menu" id="user-menu-wrapper">
              <button type="button" class="user-trigger-btn" id="user-menu-trigger" aria-haspopup="true" aria-expanded="false" title="Abrir menu do usuário">
                <div class="user-avatar">${icons.get('user', { size: 16, strokeWidth: 1.8 })}</div>
                <span class="user-name">${currentUser.name}</span>
                ${roleBadgeHtml}
                <span class="user-dropdown-arrow">▼</span>
              </button>

              <div class="user-dropdown" id="user-dropdown-menu" role="menu">
                <div class="dropdown-header">
                  <div class="dropdown-user-name">${currentUser.name}</div>
                  <div class="dropdown-user-email">${currentUser.email}</div>
                  <div style="margin-top: 6px;">${roleBadgeHtml}</div>
                </div>
                <ul class="dropdown-menu-list">
                  <li>
                    <a href="#/books" class="dropdown-item" role="menuitem">
                      ${icons.get('book', { size: 15 })} <span>Minhas Obras</span>
                    </a>
                  </li>
                  <li>
                    <button type="button" class="dropdown-item" id="btn-user-profile" role="menuitem" style="width: 100%; border: none; background: none; text-align: left; font-family: inherit;">
                      ${icons.get('user', { size: 15 })} <span>Meu Perfil</span>
                    </button>
                  </li>
                  <li>
                    <button type="button" class="dropdown-item" id="btn-user-settings" role="menuitem" style="width: 100%; border: none; background: none; text-align: left; font-family: inherit;">
                      ${icons.get('settings', { size: 15 })} <span>Configurações</span>
                    </button>
                  </li>
                  <li class="dropdown-divider"></li>
                  <li>
                    <a href="#/login" class="dropdown-item danger" role="menuitem">
                      ${icons.get('logout', { size: 15 })} <span>Sair (Logout)</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
    `;

    bindEvents(container);
  }

  function bindEvents(container) {
    const trigger = container.querySelector('#user-menu-trigger');
    const menuWrapper = container.querySelector('#user-menu-wrapper');
    const roleSelect = container.querySelector('#role-simulator-select');
    const btnProfile = container.querySelector('#btn-user-profile');
    const btnSettings = container.querySelector('#btn-user-settings');

    // Toggle Dropdown
    if (trigger && menuWrapper) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menuWrapper.classList.toggle('open');
        trigger.setAttribute('aria-expanded', String(isOpen));
      });

      // Fecha dropdown ao clicar fora
      document.addEventListener('click', (e) => {
        if (!menuWrapper.contains(e.target)) {
          menuWrapper.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Simulador de Papel
    if (roleSelect && window.Gitbook.mockData) {
      roleSelect.addEventListener('change', (e) => {
        const newRole = e.target.value;
        window.Gitbook.mockData.setCurrentRole(newRole);
      });
    }

    // Ações de Perfil e Configurações (exibe Modal genérico demonstrando o componente Modal)
    if (btnProfile) {
      btnProfile.addEventListener('click', () => {
        if (menuWrapper) menuWrapper.classList.remove('open');
        const modal = window.Gitbook.components.modal;
        const user = window.Gitbook.mockData.getCurrentUser();
        if (modal) {
          modal.open({
            title: 'Perfil do Usuário',
            body: `
              <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 20px;">
                <div style="width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; background: var(--color-surface-hover); border-radius: var(--radius-full); border: 1px solid var(--color-border); color: var(--color-text);">
                  ${icons.get(user.role || 'user', { size: 28, strokeWidth: 1.8 })}
                </div>
                <div>
                  <h3 style="font-size: var(--font-size-lg);">${user.name}</h3>
                  <p style="color: var(--color-text-muted); font-size: var(--font-size-sm);">${user.email}</p>
                  <div style="margin-top: 6px;">
                    ${window.Gitbook.components.badge.createRoleBadge(user.role)}
                  </div>
                </div>
              </div>
              <p style="font-size: var(--font-size-sm); color: var(--color-text-muted);">
                Papel Ativo no Sistema: <strong>${user.roleTitle || user.role}</strong>. As permissões de acesso às funcionalidades de edição, merge e revisão são controladas por este perfil.
              </p>
            `,
            footer: `<button type="button" class="btn btn-primary" onclick="Gitbook.components.modal.close()">Entendido</button>`
          });
        }
      });
    }

    if (btnSettings) {
      btnSettings.addEventListener('click', () => {
        if (menuWrapper) menuWrapper.classList.remove('open');
        const modal = window.Gitbook.components.modal;
        if (modal) {
          modal.open({
            title: 'Configurações da Plataforma',
            body: `
              <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: 12px;">
                Configurações de ambiente do protótipo Gitbook.
              </p>
              <div style="padding: 12px; background: var(--color-bg-subtle); border-radius: var(--radius-md); border: 1px solid var(--color-border); font-size: var(--font-size-sm);">
                <div><strong>Modo:</strong> Protótipo SPA (Vanilla JS + CSS Tokens)</div>
                <div style="margin-top: 4px;"><strong>Versão dos Tokens:</strong> v1.0.0 (02-regras-design.md)</div>
              </div>
            `,
            footer: `<button type="button" class="btn btn-secondary" onclick="Gitbook.components.modal.close()">Fechar</button>`
          });
        }
      });
    }
  }

  // Inicializa e escuta atualizações de usuário no mockData
  function init() {
    if (window.Gitbook.mockData) {
      window.Gitbook.mockData.subscribe((event) => {
        if (event === 'user_changed') {
          // Re-renderiza o header mantendo o contexto atual do router se houver
          const currentBookId = window.Gitbook.router ? window.Gitbook.router.getCurrentBookId() : null;
          render('#header-container', { activeBookId: currentBookId });
        }
      });
    }
  }

  window.Gitbook.components.header = {
    render,
    init
  };
})();
