/**
 * Gitbook Prototype - Router (Hash Routing SPA)
 * 02-regras-design.md, 03-especificacao-telas.md & 04-sequencia.md
 */

(function () {
  window.Gitbook = window.Gitbook || {};

  // ==========================================================================
  // 1. Mapeamento das 8 Telas / Rotas Especificadas (T1 - T7 + T0 Global)
  // ==========================================================================
  const routes = [
    {
      path: '/login',
      screenId: 'T1',
      title: 'Autenticação — Login',
      description: 'Permitir login na plataforma com seleção de perfil simulado.',
      stepTarget: 'Passo 2',
      showHeader: true,
      permissions: { gestor: 'Acesso', escritor: 'Acesso', revisor: 'Acesso' }
    },
    {
      path: '/register',
      screenId: 'T1',
      title: 'Autenticação — Cadastro',
      description: 'Formulário de cadastro com nome, e-mail, senha e seleção do papel desejado.',
      stepTarget: 'Passo 2',
      showHeader: true,
      permissions: { gestor: 'Acesso', escritor: 'Acesso', revisor: 'Acesso' }
    },
    {
      path: '/books',
      screenId: 'T2',
      title: 'Dashboard / Catálogo de Livros',
      description: 'Listagem de obras cadastradas, busca/filtro e criação de novos livros.',
      stepTarget: 'Passo 3',
      showHeader: true,
      permissions: { gestor: 'Criar / Gerenciar', escritor: 'Visualizar / Acessar', revisor: 'Visualizar / Acessar' }
    },
    {
      path: '/books/:id',
      screenId: 'T3',
      title: 'Hub da Obra / Visão Geral do Livro',
      description: 'Centralização de informações da obra, métricas rápidas, branches em destaque e feed de atividades.',
      stepTarget: 'Passo 4',
      showHeader: true,
      permissions: { gestor: 'Acesso Total', escritor: 'Visualizar / Criar Branch', revisor: 'Visualizar' }
    },
    {
      path: '/books/:id/settings',
      screenId: 'T8',
      title: 'Configurações da Obra',
      description: 'Gestão de colaboradores, proteção da branch, metadados e zona de perigo.',
      stepTarget: 'T8',
      showHeader: true,
      permissions: { gestor: 'Acesso Total', escritor: 'Acesso Negado', revisor: 'Acesso Negado' }
    },
    {
      path: '/books/:id/editor',
      screenId: 'T4',
      title: 'Editor de Conteúdo e Versionamento',
      description: 'Ambiente de escrita do Escritor, árvore de capítulos, editor de texto, commits e solicitação de Merge.',
      stepTarget: 'Passo 5',
      showHeader: true,
      permissions: { gestor: 'Leitura Geral', escritor: 'Criar Branch / Commits / Pedir Merge', revisor: 'Apenas Leitura' }
    },
    {
      path: '/books/:id/merges',
      screenId: 'T5a',
      title: 'Gestão de Merge Requests — Lista',
      description: 'Listagem de solicitações de merge com filtros por status (Pendentes, Aprovados, Rejeitados).',
      stepTarget: 'Passo 6',
      showHeader: true,
      permissions: { gestor: 'Aprovar / Rejeitar', escritor: 'Criar / Acompanhar', revisor: 'Visualizar' }
    },
    {
      path: '/merges/:id',
      screenId: 'T5b',
      title: 'Gestão de Merge Requests — Detalhe e Diff',
      description: 'Visualização comparativa de diff, lista de commits incluídos e barra de decisão do Gestor.',
      stepTarget: 'Passo 6',
      showHeader: true,
      permissions: { gestor: 'Aprovar / Rejeitar', escritor: 'Acompanhar / Comentar', revisor: 'Visualizar' }
    },
    {
      path: '/books/:id/suggestions',
      screenId: 'T6',
      title: 'Painel de Revisão e Sugestões Editoriais',
      description: 'Área de leitura da versão main com sugestões pontuais (visão Revisor: propor; visão Gestor: decidir).',
      stepTarget: 'Passo 7',
      showHeader: true,
      permissions: { gestor: 'Aceitar / Rejeitar', escritor: 'Visualizar', revisor: 'Criar Sugestões' }
    },
    {
      path: '/books/:id/history',
      screenId: 'T7',
      title: 'Histórico de Versionamento e Commits',
      description: 'Linha do tempo visual em grafo simplificado e lista completa de commits com filtros.',
      stepTarget: 'Passo 8',
      showHeader: true,
      permissions: { gestor: 'Acesso Total', escritor: 'Visualizar', revisor: 'Visualizar' }
    }
  ];

  let currentRoute = null;
  let currentParams = {};

  // ==========================================================================
  // 2. Parser de Rotas e Parâmetros
  // ==========================================================================
  function parseHash(hash) {
    const cleanHash = hash.replace(/^#/, '').trim() || '/books';
    const [pathPart] = cleanHash.split('?');

    for (const route of routes) {
      const routeSegments = route.path.split('/').filter(Boolean);
      const urlSegments = pathPart.split('/').filter(Boolean);

      if (routeSegments.length !== urlSegments.length) continue;

      const params = {};
      let match = true;

      for (let i = 0; i < routeSegments.length; i++) {
        if (routeSegments[i].startsWith(':')) {
          const paramName = routeSegments[i].slice(1);
          params[paramName] = urlSegments[i];
        } else if (routeSegments[i] !== urlSegments[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        return { route, params, rawPath: pathPart };
      }
    }

    // Fallback: redireciona para /books
    return {
      route: routes.find((r) => r.path === '/books'),
      params: {},
      rawPath: '/books'
    };
  }

  function getCurrentBookId() {
    if (currentParams && currentParams.id && currentRoute && currentRoute.path.startsWith('/books/:id')) {
      return currentParams.id;
    }
    // Se estiver em /merges/:id, descobre o livro do merge
    if (currentParams && currentParams.id && currentRoute && currentRoute.path === '/merges/:id') {
      const mr = window.Gitbook.mockData ? window.Gitbook.mockData.getMergeRequestById(currentParams.id) : null;
      return mr ? mr.bookId : null;
    }
    return null;
  }

  // ==========================================================================
  // 3. Renderização de Rota (Fundação do Passo 1)
  // ==========================================================================
  function handleRouteChange() {
    const hash = window.location.hash;
    const { route, params, rawPath } = parseHash(hash);

    currentRoute = route;
    currentParams = params;

    const appContainer = document.getElementById('app-container');
    const headerContainer = document.getElementById('header-container');

    // 1. Renderiza o Header Global (T0) conforme critério do Passo 1
    if (route.showHeader && window.Gitbook.components.header) {
      headerContainer.style.display = 'block';
      window.Gitbook.components.header.render('#header-container', {
        activeBookId: getCurrentBookId()
      });
    } else {
      headerContainer.style.display = 'none';
    }

    // 2. Renderização condicional da tela
    if (route.screenId === 'T1' && window.Gitbook.screens && window.Gitbook.screens.auth) {
      const initialMode = route.path === '/register' ? 'register' : 'login';
      window.Gitbook.screens.auth.render(appContainer, initialMode);
    } else if (route.screenId === 'T2' && window.Gitbook.screens && window.Gitbook.screens.books) {
      window.Gitbook.screens.books.render(appContainer);
    } else if (route.screenId === 'T3' && window.Gitbook.screens && window.Gitbook.screens.bookHub) {
      window.Gitbook.screens.bookHub.render(appContainer, params);
    } else if (route.screenId === 'T8' && window.Gitbook.screens && window.Gitbook.screens.settings) {
      const currentUser = window.Gitbook.mockData ? window.Gitbook.mockData.getCurrentUser() : { role: 'gestor' };
      if (!currentUser || currentUser.role !== 'gestor') {
        renderAccessDeniedScreen(appContainer, params, 'Configurações da Obra', 'Somente o papel de Gestor pode administrar colaboradores, regras e metadados desta obra.');
      } else {
        window.Gitbook.screens.settings.render(appContainer, params);
      }
    } else if (route.screenId === 'T4' && window.Gitbook.screens && window.Gitbook.screens.editor) {
      const mockData = window.Gitbook.mockData;
      const currentUser = mockData ? mockData.getCurrentUser() : { role: 'gestor' };
      if (currentUser && currentUser.role === 'revisor') {
        renderAccessDeniedScreen(appContainer, params);
      } else {
        window.Gitbook.screens.editor.render(appContainer, params);
      }
    } else if (route.screenId === 'T5a' && window.Gitbook.screens && window.Gitbook.screens.merges) {
      window.Gitbook.screens.merges.renderList(appContainer, params);
    } else if (route.screenId === 'T5b' && window.Gitbook.screens && window.Gitbook.screens.merges) {
      window.Gitbook.screens.merges.renderDetail(appContainer, params);
    } else if (route.screenId === 'T6' && window.Gitbook.screens && window.Gitbook.screens.suggestions) {
      window.Gitbook.screens.suggestions.render(appContainer, params);
    } else if (route.screenId === 'T7' && window.Gitbook.screens && window.Gitbook.screens.history) {
      window.Gitbook.screens.history.render(appContainer, params);
    } else {
      // Casca da rota para telas ainda não implementadas nos próximos passos
      renderPlaceholderScreen(appContainer, route, params, rawPath);
    }
  }

  /**
   * Renderiza a casca padronizada de fundação (Passo 1),
   * demonstrando o Header global e facilitando a navegação de teste entre todas as rotas.
   */
  function renderPlaceholderScreen(container, route, params, rawPath) {
    const mockData = window.Gitbook.mockData;
    const currentUser = mockData ? mockData.getCurrentUser() : { role: 'gestor' };
    const badgeComponent = window.Gitbook.components.badge;

    // Lista de rotas para navegação rápida de teste
    const allRoutesNav = [
      { label: 'T1: Login', hash: '#/login' },
      { label: 'T1: Cadastro', hash: '#/register' },
      { label: 'T2: Catálogo', hash: '#/books' },
      { label: 'T3: Hub da Obra', hash: '#/books/1' },
      { label: 'T4: Editor', hash: '#/books/1/editor' },
      { label: 'T5a: Merges (Lista)', hash: '#/books/1/merges' },
      { label: 'T5b: Merges (Diff)', hash: '#/merges/1' },
      { label: 'T6: Sugestões', hash: '#/books/1/suggestions' },
      { label: 'T7: Histórico', hash: '#/books/1/history' }
    ];

    const navChipsHtml = allRoutesNav.map((item) => {
      const isActive = window.location.hash === item.hash;
      return `<a href="${item.hash}" class="route-chip ${isActive ? 'active' : ''}">${item.label}</a>`;
    }).join('');

    const paramEntries = Object.entries(params);
    const paramsHtml = paramEntries.length > 0
      ? paramEntries.map(([k, v]) => `<code>${k}: "${v}"</code>`).join(', ')
      : '<span style="color: var(--color-text-muted);">Nenhum</span>';

    const currentRolePermission = route.permissions[currentUser.role] || 'Visualizar';
    const roleBadge = badgeComponent
      ? badgeComponent.createRoleBadge(currentUser.role)
      : currentUser.role;

    container.innerHTML = `
      <div class="route-placeholder-container">
        <div class="route-placeholder-card">
          <div class="route-meta-header">
            <div>
              <span class="route-code-badge">${route.screenId}</span>
              <span style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-left: 8px;">
                Entrega: <strong>${route.stepTarget}</strong>
              </span>
            </div>
            <div>
              ${badgeComponent ? badgeComponent.createStatusBadge('info', { label: 'Fundação Ativa' }) : ''}
            </div>
          </div>

          <h1 style="font-size: var(--font-size-2xl); margin-bottom: 8px; color: var(--color-text);">
            ${route.title}
          </h1>
          <p style="color: var(--color-text-muted); font-size: var(--font-size-base); margin-bottom: 20px;">
            ${route.description}
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
            <div style="background: var(--color-bg-subtle); padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
              <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); text-transform: uppercase;">Rota Atual (Hash)</div>
              <div style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); margin-top: 4px; color: var(--color-primary-text);">
                #${rawPath}
              </div>
            </div>

            <div style="background: var(--color-bg-subtle); padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
              <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); text-transform: uppercase;">Parâmetros Extraídos</div>
              <div style="font-size: var(--font-size-sm); margin-top: 4px;">
                ${paramsHtml}
              </div>
            </div>

            <div style="background: var(--color-bg-subtle); padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
              <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); text-transform: uppercase;">Permissão Papel Atual</div>
              <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                ${roleBadge}
                <span style="font-size: var(--font-size-xs); font-weight: var(--font-weight-medium);">${currentRolePermission}</span>
              </div>
            </div>
          </div>

          <div style="padding: 16px; border-radius: var(--radius-md); background: rgba(59, 130, 246, 0.08); border: 1px solid var(--color-primary-border); font-size: var(--font-size-sm); color: var(--color-text);">
            <strong>Passo 1 (Fundação Concluída):</strong> O Header global (T0), tokens de cor por papel/status, sistema de componentes (Badges, Card, Modal, Botões), mock-data reativo e mapeamento de rotas estão ativos e funcionando de forma consistente. O conteúdo específico desta tela será implementado no <strong>${route.stepTarget}</strong>.
          </div>

          <!-- Barra de Teste de Navegação Rápida entre Todas as Rotas Mapeadas -->
          <div class="route-nav-bar">
            <div class="route-nav-title">Navegar Manualmente Entre Todas as Rotas (Critério de Aceite Passo 1):</div>
            <div class="route-nav-chips">
              ${navChipsHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza a tela de bloqueio de acesso ao Editor para o papel Revisor
   */
  function renderAccessDeniedScreen(container, params, title = 'Acesso Restrito ao Editor', description = '') {
    const bookId = params.id || '1';
    const mockData = window.Gitbook.mockData;
    const book = mockData ? mockData.getBookById(bookId) : null;
    const bookTitle = book ? book.title : 'Obra';
    const isSettingsDenied = Boolean(description);
    const subnavHtml = window.Gitbook.screens && window.Gitbook.screens.bookHub
      ? window.Gitbook.screens.bookHub.renderSubnavigation(bookId, 'editor')
      : '';

    container.innerHTML = `
      <div class="book-hub" id="access-denied-view">
        ${subnavHtml}

        <div class="access-restricted-container">
          <div class="access-restricted-card">
            <div class="access-restricted-icon-box">🚫</div>
            <h1 class="access-restricted-title">${title}</h1>
            <p class="access-restricted-desc">
              ${description || 'O papel atual não possui permissão para acessar este ambiente.'}
            </p>

            <div class="access-restricted-info">
              <div>💡 <strong>Como colaborar nesta obra (${escapeHtml(bookTitle)}):</strong></div>
              <ul style="margin-top: 6px; padding-left: 20px; line-height: 1.6;">
                <li>${isSettingsDenied ? 'Volte ao Hub da Obra para continuar navegando pelos módulos disponíveis para o seu papel.' : `Acesse o <strong>Painel de Sugestões</strong> para propor correções no texto oficial (${book ? book.mainBranch : 'main'}).`}</li>
                <li>Alterne o papel simulado no menu superior para testar a visão de Gestor.</li>
              </ul>
            </div>

            <div class="access-restricted-actions">
              <a href="${isSettingsDenied ? `#/books/${bookId}` : `#/books/${bookId}/suggestions`}" class="btn btn-primary">
                <span class="btn-icon">${window.Gitbook && window.Gitbook.icons ? window.Gitbook.icons.get('inspect', { size: 14 }) : ''}</span>
                <span>${isSettingsDenied ? 'Voltar ao Hub da Obra' : 'Ir para Painel de Sugestões'}</span>
              </a>
              <a href="#/books/${bookId}" class="btn btn-secondary">
                <span>←</span>
                <span>Voltar ao Hub da Obra</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
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

  // ==========================================================================
  // 4. Inicialização do Router
  // ==========================================================================
  function init() {
    window.addEventListener('hashchange', handleRouteChange);

    // Se abrir sem hash, direciona para #/books
    if (!window.location.hash || window.location.hash === '#/') {
      window.location.hash = '#/books';
    } else {
      handleRouteChange();
    }

    // Atualiza quando o mock avisar mudança de usuário
    if (window.Gitbook.mockData) {
      window.Gitbook.mockData.subscribe((event) => {
        if (event === 'user_changed') {
          handleRouteChange();
        }
      });
    }
  }

  function navigate(path) {
    window.location.hash = path.startsWith('#') ? path : `#${path}`;
  }

  window.Gitbook.router = {
    init,
    navigate,
    getCurrentRoute: () => currentRoute,
    getCurrentParams: () => currentParams,
    getCurrentBookId
  };
})();
