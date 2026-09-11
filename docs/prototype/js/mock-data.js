/**
 * Gitbook Prototype - Mock Data & State Management
 * 01-contexto.md & 03-especificacao-telas.md
 */

(function () {
  window.Gitbook = window.Gitbook || {};

  // ==========================================================================
  // 1. Usuários Mockados (Gestor, Escritores, Revisores)
  // ==========================================================================
  const users = [
    {
      id: 'usr-1',
      name: 'Lucas Mendes',
      email: 'lucas.gestor@gitbook.com',
      role: 'gestor',
      roleTitle: 'Gestor Editorial',
      avatar: 'crown'
    },
    {
      id: 'usr-2',
      name: 'João Silva',
      email: 'joao.autor@gitbook.com',
      role: 'escritor',
      roleTitle: 'Escritor Colaborador',
      avatar: 'pen'
    },
    {
      id: 'usr-4',
      name: 'Beatriz Costa',
      email: 'beatriz.revisora@gitbook.com',
      role: 'revisor',
      roleTitle: 'Revisora de Texto',
      avatar: 'inspect'
    },
    {
      id: 'usr-5',
      name: 'Pedro Alcântara',
      email: 'pedro.revisor@gitbook.com',
      role: 'revisor',
      roleTitle: 'Revisor de Estilo',
      avatar: 'inspect'
    }
  ];

  // Sessão atual simulada (padrão: Gestor)
  let currentUser = { ...users[0] };

  // ==========================================================================
  // 2. Obras / Livros Mockados
  // ==========================================================================
  const books = [
    {
      id: '1',
      title: 'Crônicas do Amanhã: A Revolução Sintética',
      description: 'Uma narrativa distópica sobre uma sociedade onde as memórias humanas são versionadas em redes neurais públicas.',
      genre: 'Ficção Científica',
      managerId: 'usr-1',
      managerName: 'Lucas Mendes',
      coverGradient: 'linear-gradient(135deg, #1e3a8a, #4338ca)',
      mainBranch: 'main',
      createdAt: '2026-08-15',
      version: 'v1.4-consolidated',
      stats: {
        branchesCount: 4,
        commitsCount: 38,
        pendingMerges: 2,
        pendingSuggestions: 2
      },
      content: {
        chapter1: {
          title: 'Capítulo 1 — O Primeiro Snapshot',
          text: 'No ano de 2088, acordar sem carregar a árvore genealógica de memórias da noite anterior era considerado uma anomalia severa. Arthur olhou pela janela da torre de vidro fosco, observando as luzes estroboscópicas dos drones de inspeção. Ele sabia que o commit feito às 03:40 continha uma divergência crítica no registro.'
        },
        chapter2: {
          title: 'Capítulo 2 — A Ramificação Esquecida',
          text: 'Quando Laura abriu o console de dados no subsolo da Biblioteca Central, o terminal piscou em tons ambarinos. Havia uma branch aberta há trinta anos com o nome de sua mãe: writer/clara-origin. O hash apontava para um bloco não integrado à linha principal.'
        }
      }
    },
    {
      id: '2',
      title: 'O Algoritmo do Tempo',
      description: 'Tratado de não-ficção e ensaios filosóficos sobre a percepção humana da passagem dos séculos através da tecnologia.',
      genre: 'Ensaio Filosófico',
      managerId: 'usr-1',
      managerName: 'Lucas Mendes',
      coverGradient: 'linear-gradient(135deg, #064e3b, #0f766e)',
      mainBranch: 'main',
      createdAt: '2026-08-20',
      version: 'v0.9-draft',
      stats: {
        branchesCount: 2,
        commitsCount: 19,
        pendingMerges: 1,
        pendingSuggestions: 1
      },
      content: {
        chapter1: {
          title: 'Introdução — O Relógio Relacional',
          text: 'A mensuração do tempo nunca foi neutra. Da clepsidra babilônica aos ciclos de clock dos microprocessadores de silício, medimos aquilo que desejamos controlar.'
        }
      }
    },
    {
      id: '3',
      title: 'Arquitetura de Sombras e Neblina',
      description: 'Romance de fantasia gótica urbana acompanhando uma ordem de cartógrafos que mapeia distritos que só existem à meia-noite.',
      genre: 'Fantasia Urbana',
      managerId: 'usr-1',
      managerName: 'Lucas Mendes',
      coverGradient: 'linear-gradient(135deg, #4c1d95, #831843)',
      mainBranch: 'main',
      createdAt: '2026-09-01',
      version: 'v2.0-release',
      stats: {
        branchesCount: 3,
        commitsCount: 52,
        pendingMerges: 0,
        pendingSuggestions: 4
      },
      content: {
        chapter1: {
          title: 'Prólogo — O Beco Sem Saída às 00:00',
          text: 'A calçada de paralelepípedos úmidos terminava abruptamente em uma parede cega durante o dia. Mas ao 12º badalo do sino da catedral, a argamassa se desfazia em bruma fria.'
        }
      }
    }
  ];

  const bookCollaborators = {
    '1': [
      { userId: 'usr-2', role: 'escritor' },
      { userId: 'usr-3', role: 'escritor' },
      { userId: 'usr-4', role: 'revisor' },
      { userId: 'usr-5', role: 'revisor' }
    ],
    '2': [
      { userId: 'usr-2', role: 'escritor' },
      { userId: 'usr-4', role: 'revisor' }
    ],
    '3': [
      { userId: 'usr-3', role: 'escritor' },
      { userId: 'usr-5', role: 'revisor' }
    ]
  };

  const bookSettings = {
    '1': { requireMergeRequest: true, requireReviewerSuggestion: false, deleteBranchAfterMerge: true, visibility: 'private' },
    '2': { requireMergeRequest: true, requireReviewerSuggestion: true, deleteBranchAfterMerge: true, visibility: 'private' },
    '3': { requireMergeRequest: true, requireReviewerSuggestion: false, deleteBranchAfterMerge: false, visibility: 'public' }
  };

  const now = Date.now();
  const deadlines = [
    {
      id: 'deadline-1',
      bookId: '1',
      title: 'Entregável do Capítulo 3 — Cenas do Subsolo',
      description: 'Finalizar a revisão da sequência da câmara central e preparar a entrega para a branch principal.',
      dueAt: new Date(now + (3 * 24 * 60 * 60 * 1000) + (4 * 60 * 60 * 1000)).toISOString(),
      assigneeId: 'usr-2',
      status: 'in_progress',
      createdAt: new Date(now).toISOString()
    },
    {
      id: 'deadline-2',
      bookId: '1',
      title: 'Conferência de continuidade — Capítulos 1 e 2',
      description: 'Validar nomes, referências à memória versionada e a cronologia entre os dois capítulos iniciais.',
      dueAt: new Date(now - (2 * 24 * 60 * 60 * 1000)).toISOString(),
      assigneeId: 'usr-4',
      status: 'in_progress',
      createdAt: new Date(now).toISOString()
    },
    {
      id: 'deadline-3',
      bookId: '1',
      title: 'Sinopse da versão consolidada',
      description: 'Revisar e aprovar a sinopse curta usada no catálogo público da obra.',
      dueAt: new Date(now - (1 * 24 * 60 * 60 * 1000)).toISOString(),
      assigneeId: null,
      status: 'completed',
      completedAt: new Date(now - (12 * 60 * 60 * 1000)).toISOString(),
      createdAt: new Date(now).toISOString()
    }
  ];

  // ==========================================================================
  // 3. Branches Mockadas
  // ==========================================================================
  const branches = [
    { id: 'b-1', bookId: '1', name: 'main', author: 'Lucas Mendes', isProtected: true, isDefault: true },
    { id: 'b-2', bookId: '1', name: 'writer/joao-cap2-ajustes', author: 'João Silva', isProtected: false, isDefault: false },
    { id: 'b-3', bookId: '1', name: 'writer/maria-cenas-finais', author: 'Maria Fernandes', isProtected: false, isDefault: false },
    { id: 'b-4', bookId: '1', name: 'writer/joao-personagem-novo', author: 'João Silva', isProtected: false, isDefault: false },
    { id: 'b-5', bookId: '2', name: 'main', author: 'Lucas Mendes', isProtected: true, isDefault: true },
    { id: 'b-6', bookId: '2', name: 'writer/joao-ensaio-3', author: 'João Silva', isProtected: false, isDefault: false },
    { id: 'b-7', bookId: '3', name: 'main', author: 'Lucas Mendes', isProtected: true, isDefault: true },
    { id: 'b-8', bookId: '3', name: 'writer/maria-revisao-cenario', author: 'Maria Fernandes', isProtected: false, isDefault: false }
  ];

  // ==========================================================================
  // 4. Commits Mockados
  // ==========================================================================
  const commits = [
    {
      hash: 'a7f39c1',
      bookId: '1',
      branch: 'main',
      author: 'Lucas Mendes',
      authorRole: 'gestor',
      message: 'chore: merge da branch writer/maria-cap1-revisado',
      date: '2026-09-08 16:40',
      timestamp: 1789048800000
    },
    {
      hash: '9b2c8e4',
      bookId: '1',
      branch: 'writer/joao-cap2-ajustes',
      author: 'João Silva',
      authorRole: 'escritor',
      message: 'feat: reescreve diálogo de Arthur e Laura no subsolo',
      date: '2026-09-09 11:25',
      timestamp: 1789116300000
    },
    {
      hash: '4e11d0a',
      bookId: '1',
      branch: 'writer/maria-cenas-finais',
      author: 'Maria Fernandes',
      authorRole: 'escritor',
      message: 'feat: adiciona capítulo 3 com clímax na câmara central',
      date: '2026-09-10 14:10',
      timestamp: 1789212600000
    },
    {
      hash: '2d8b5c9',
      bookId: '1',
      branch: 'main',
      author: 'Lucas Mendes',
      authorRole: 'gestor',
      message: 'docs: atualiza sinopse oficial e notas de rodapé',
      date: '2026-09-07 10:00',
      timestamp: 1788938400000
    },
    {
      hash: 'c81f012',
      bookId: '2',
      branch: 'main',
      author: 'Lucas Mendes',
      authorRole: 'gestor',
      message: 'feat: consolida introdução e ensaio sobre ciclos de tempo',
      date: '2026-09-05 14:20',
      timestamp: 1788778800000
    },
    {
      hash: 'b45d911',
      bookId: '2',
      branch: 'writer/joao-ensaio-3',
      author: 'João Silva',
      authorRole: 'escritor',
      message: 'feat: adiciona capítulo 3 sobre computação quântica e temporalidade',
      date: '2026-09-08 09:15',
      timestamp: 1789022100000
    },
    {
      hash: 'f93c004',
      bookId: '3',
      branch: 'main',
      author: 'Lucas Mendes',
      authorRole: 'gestor',
      message: 'release: versão v2.0-release aprovada e congelada',
      date: '2026-09-09 20:30',
      timestamp: 1789149000000
    },
    {
      hash: '1a72e89',
      bookId: '3',
      branch: 'writer/maria-revisao-cenario',
      author: 'Maria Fernandes',
      authorRole: 'escritor',
      message: 'refactor: ajusta ambientação do distrito da meia-noite',
      date: '2026-09-06 16:00',
      timestamp: 1788873600000
    }
  ];

  // ==========================================================================
  // 5. Merge Requests Mockados
  // ==========================================================================
  const mergeRequests = [
    {
      id: '1',
      bookId: '1',
      title: 'Integrar clímax do Capítulo 3 (Câmara Central)',
      description: 'Finalização do terceiro ato com revelação do mistério da branch ancestral. Testado e alinhado com a linha temporal principal.',
      author: 'Maria Fernandes',
      authorRole: 'escritor',
      sourceBranch: 'writer/maria-cenas-finais',
      targetBranch: 'main',
      status: 'pending', // 'pending' | 'approved' | 'rejected'
      createdAt: '2026-09-10 14:30',
      commitsCount: 3,
      diff: {
        addedLines: 84,
        removedLines: 12,
        preview: `+ No centro da câmara, o terminal emitiu um pulso de luz azul-cobalto.
+ "Ela nunca foi apagada", sussurrou Laura, tocando a interface holográfica.
- O recinto permanecia completamente silencioso e desprovido de dados.
+ O arquivo intacto carregava o carimbo de autorização da matriz original.`
      }
    },
    {
      id: '2',
      bookId: '1',
      title: 'Ajuste de ritmo nos diálogos do Capítulo 2',
      description: 'Refatoração da conversa entre Arthur e o inspetor para aumentar a tensão dramática.',
      author: 'João Silva',
      authorRole: 'escritor',
      sourceBranch: 'writer/joao-cap2-ajustes',
      targetBranch: 'main',
      status: 'pending',
      createdAt: '2026-09-09 18:00',
      commitsCount: 2,
      diff: {
        addedLines: 32,
        removedLines: 28,
        preview: `- "Não sei do que está falando", disse Arthur hesitante.
+ "Se você der mais um passo, o snapshot de segurança será disparado", alertou o inspetor.`
      }
    },
    {
      id: '3',
      bookId: '1',
      title: 'Revisão ortográfica e terminológica do Capítulo 1',
      description: 'Correções gramaticais e padronização dos termos tecnológicos sugeridos pela revisão.',
      author: 'João Silva',
      authorRole: 'escritor',
      sourceBranch: 'writer/joao-cap1-revisao',
      targetBranch: 'main',
      status: 'approved',
      createdAt: '2026-09-08 15:00',
      commitsCount: 1,
      diff: {
        addedLines: 15,
        removedLines: 15,
        preview: `- memorias sem sincronizacao
+ memórias não-sincronizadas`
      }
    }
  ];

  // ==========================================================================
  // 6. Sugestões Editoriais Mockadas (T6)
  // ==========================================================================
  const suggestions = [
    {
      id: '1',
      bookId: '1',
      chapter: 'Capítulo 1',
      revisorName: 'Beatriz Costa',
      revisorRole: 'revisor',
      category: 'Correção Ortográfica',
      targetSnippet: 'árvore genealógica de memórias da noite anterior era considerado uma anomalia',
      suggestedText: 'árvore genealógica de memórias da noite anterior era considerada uma anomalia',
      justification: 'Concordância de gênero com a palavra "árvore", que é substantivo feminino.',
      status: 'pending', // 'pending' | 'approved' | 'rejected'
      createdAt: '2026-09-10 10:15'
    },
    {
      id: '2',
      bookId: '1',
      chapter: 'Capítulo 1',
      revisorName: 'Pedro Alcântara',
      revisorRole: 'revisor',
      category: 'Coerência',
      targetSnippet: 'Ele sabia que o commit feito às 03:40 continha uma divergência crítica',
      suggestedText: 'Ele sabia que o commit registrado às 03:40 UTC continha uma divergência crítica',
      justification: 'Como a narrativa se passa em rede global com múltiplos fusos horários, explicitar o fuso UTC reforça a atmosfera hard sci-fi.',
      status: 'pending',
      createdAt: '2026-09-10 11:30'
    },
    {
      id: '3',
      bookId: '1',
      chapter: 'Capítulo 2',
      revisorName: 'Beatriz Costa',
      revisorRole: 'revisor',
      category: 'Ajuste de Enredo',
      targetSnippet: 'O terminal piscou em tons ambarinos',
      suggestedText: 'O terminal analógico piscou em fósforo âmbar',
      justification: 'Acentua o contraste entre a tecnologia obsoleta do subsolo e os sistemas quânticos da superfície.',
      status: 'approved',
      createdAt: '2026-09-09 17:20'
    }
  ];

  // ==========================================================================
  // 7. Eventos & Listeners para Atualizações Reativas no Mock
  // ==========================================================================
  const listeners = [];

  function subscribe(fn) {
    listeners.push(fn);
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }

  function notify(eventType, data) {
    listeners.forEach((fn) => {
      try {
        fn(eventType, data);
      } catch (err) {
        console.error('Erro no listener do mock:', err);
      }
    });
  }

  // ==========================================================================
  // 8. API Pública do Mock Data
  // ==========================================================================
  window.Gitbook.mockData = {
    // Acesso aos dados
    getUsers: () => [...users],
    getCurrentUser: () => ({ ...currentUser }),
    getBooks: () => [...books],
    getBookById: (id) => books.find((b) => String(b.id) === String(id)) || null,
    getBranches: (bookId) => branches.filter((b) => !bookId || String(b.bookId) === String(bookId)),
    getCommits: (bookId) => commits.filter((c) => !bookId || String(c.bookId) === String(bookId)),
    getMergeRequests: (bookId) => mergeRequests.filter((m) => !bookId || String(m.bookId) === String(bookId)),
    getMergeRequestById: (id) => mergeRequests.find((m) => String(m.id) === String(id)) || null,
    getSuggestions: (bookId) => suggestions.filter((s) => !bookId || String(s.bookId) === String(bookId)),
    getSuggestionById: (id) => suggestions.find((s) => String(s.id) === String(id)) || null,
    getDeadlines: (bookId) => deadlines.filter((d) => !bookId || String(d.bookId) === String(bookId)),
    getBookCollaborators: (bookId) => (bookCollaborators[String(bookId)] || []).map((collaborator) => {
      const user = users.find((item) => item.id === collaborator.userId);
      return user ? { ...user, role: collaborator.role, roleTitle: collaborator.role === 'escritor' ? 'Escritor Colaborador' : 'Revisor de Texto' } : null;
    }).filter(Boolean),
    getBookSettings: (bookId) => ({
      requireMergeRequest: true,
      requireReviewerSuggestion: false,
      deleteBranchAfterMerge: true,
      visibility: 'private',
      ...(bookSettings[String(bookId)] || {})
    }),

    // Alteração de Papel / Usuário Simulado (Exigência central de 01-contexto.md)
    setCurrentUser: (userId) => {
      const found = users.find((u) => u.id === userId);
      if (found) {
        currentUser = { ...found };
        notify('user_changed', currentUser);
      }
    },
    setCurrentRole: (role) => {
      const found = users.find((u) => u.role.toLowerCase() === role.toLowerCase());
      if (found) {
        currentUser = { ...found };
        notify('user_changed', currentUser);
      } else {
        currentUser.role = role.toLowerCase();
        currentUser.roleTitle = role.charAt(0).toUpperCase() + role.slice(1);
        notify('user_changed', currentUser);
      }
    },
    registerUser: (userData) => {
      const newUser = {
        id: `usr-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: 'colaborador',
        roleTitle: 'Colaborador Global',
        avatar: 'user'
      };
      users.push(newUser);
      currentUser = { ...newUser };
      notify('user_changed', currentUser);
      return newUser;
    },

    addCollaborator: (bookId, userData) => {
      const key = String(bookId);
      bookCollaborators[key] = bookCollaborators[key] || [];
      const existingUser = users.find((user) => user.email.toLowerCase() === String(userData.email).toLowerCase());
      const user = existingUser || {
        id: `usr-${Date.now()}`,
        name: userData.name || userData.email.split('@')[0],
        email: userData.email,
        role: userData.role,
        roleTitle: userData.role === 'escritor' ? 'Escritor Colaborador' : 'Revisor de Texto',
        avatar: userData.role === 'escritor' ? 'pen' : 'inspect'
      };
      if (!existingUser) users.push(user);
      if (!bookCollaborators[key].some((item) => item.userId === user.id)) {
        bookCollaborators[key].push({ userId: user.id, role: userData.role });
      }
      notify('collaborators_updated', bookId);
      return { ...user, role: userData.role };
    },

    updateCollaboratorRole: (bookId, userId, newRole) => {
      const collaborator = (bookCollaborators[String(bookId)] || []).find((item) => item.userId === userId);
      if (!collaborator) return null;
      collaborator.role = newRole;
      notify('collaborators_updated', bookId);
      return collaborator;
    },

    removeCollaborator: (bookId, userId) => {
      const key = String(bookId);
      const collaborators = bookCollaborators[key] || [];
      const index = collaborators.findIndex((item) => item.userId === userId);
      if (index === -1) return false;
      collaborators.splice(index, 1);
      notify('collaborators_updated', bookId);
      return true;
    },

    updateBookSettings: (bookId, settingsData) => {
      const key = String(bookId);
      bookSettings[key] = { ...(bookSettings[key] || {}), ...settingsData };
      const book = books.find((item) => String(item.id) === key);
      if (book) {
        if (settingsData.title) book.title = settingsData.title;
        if (settingsData.description) book.description = settingsData.description;
        if (settingsData.genre) book.genre = settingsData.genre;
      }
      notify('book_settings_updated', bookId);
      return { ...bookSettings[key] };
    },

    archiveBook: (bookId) => {
      const book = books.find((item) => String(item.id) === String(bookId));
      if (!book) return null;
      book.archived = true;
      notify('book_settings_updated', bookId);
      return book;
    },

    deleteBook: (bookId) => {
      const index = books.findIndex((item) => String(item.id) === String(bookId));
      if (index === -1) return false;
      books.splice(index, 1);
      delete bookCollaborators[String(bookId)];
      delete bookSettings[String(bookId)];
      notify('book_deleted', bookId);
      return true;
    },

    // Ações de Mock (usadas nos passos seguintes)
    addBook: (newBookData) => {
      const id = String(books.length + 1);
      const newBook = {
        id,
        title: newBookData.title,
        description: newBookData.description,
        genre: newBookData.genre || 'Geral',
        managerId: currentUser.id,
        managerName: currentUser.name,
        coverGradient: 'linear-gradient(135deg, #1f2937, #374151)',
        mainBranch: 'main',
        createdAt: new Date().toISOString().split('T')[0],
        version: 'v0.1-init',
        stats: {
          branchesCount: 1,
          commitsCount: 1,
          pendingMerges: 0,
          pendingSuggestions: 0
        },
        content: {
          chapter1: {
            title: 'Capítulo 1 — Início',
            text: 'Conteúdo inicial da obra.'
          }
        }
      };
      books.unshift(newBook);
      branches.push({ id: `b-${Date.now()}`, bookId: id, name: 'main', author: currentUser.name, isProtected: true, isDefault: true });
      commits.unshift({
        hash: Math.random().toString(16).substring(2, 9),
        bookId: id,
        branch: 'main',
        author: currentUser.name,
        authorRole: currentUser.role,
        message: 'chore: inicialização da obra e branch main',
        date: 'Agora',
        timestamp: Date.now()
      });
      notify('book_added', newBook);
      return newBook;
    },

    addCommit: (bookId, branch, message) => {
      const newCommit = {
        hash: Math.random().toString(16).substring(2, 9),
        bookId: String(bookId),
        branch,
        author: currentUser.name,
        authorRole: currentUser.role,
        message,
        date: 'Agora',
        timestamp: Date.now()
      };
      commits.unshift(newCommit);
      const book = books.find((b) => String(b.id) === String(bookId));
      if (book) book.stats.commitsCount += 1;
      notify('commit_added', newCommit);
      return newCommit;
    },

    addDeadline: (bookId, deadlineData) => {
      const newDeadline = {
        id: `deadline-${Date.now()}`,
        bookId: String(bookId),
        title: deadlineData.title,
        description: deadlineData.description || '',
        dueAt: deadlineData.dueAt,
        assigneeId: deadlineData.assigneeId || null,
        status: 'in_progress',
        createdAt: new Date().toISOString()
      };
      deadlines.unshift(newDeadline);
      notify('deadline_added', newDeadline);
      return newDeadline;
    },

    updateDeadlineStatus: (bookId, deadlineId, newStatus) => {
      const deadline = deadlines.find((item) => String(item.bookId) === String(bookId) && String(item.id) === String(deadlineId));
      if (!deadline) return null;
      deadline.status = newStatus;
      deadline.completedAt = newStatus === 'completed' ? new Date().toISOString() : null;
      notify('deadline_updated', deadline);
      return deadline;
    },

    updateDeadline: (bookId, deadlineId, updatedData) => {
      const deadline = deadlines.find((item) => String(item.bookId) === String(bookId) && String(item.id) === String(deadlineId));
      if (!deadline) return null;
      Object.assign(deadline, {
        title: updatedData.title,
        description: updatedData.description || '',
        dueAt: updatedData.dueAt,
        assigneeId: updatedData.assigneeId || null
      });
      notify('deadline_updated', deadline);
      return deadline;
    },

    deleteDeadline: (bookId, deadlineId) => {
      const index = deadlines.findIndex((item) => String(item.bookId) === String(bookId) && String(item.id) === String(deadlineId));
      if (index === -1) return false;
      const [removedDeadline] = deadlines.splice(index, 1);
      notify('deadline_deleted', removedDeadline);
      return true;
    },

    addMergeRequest: (mrData) => {
      const id = String(mergeRequests.length + 1);
      const newMr = {
        id,
        bookId: String(mrData.bookId),
        title: mrData.title,
        description: mrData.description || 'Alterações no conteúdo pelo autor.',
        author: mrData.author || currentUser.name,
        authorRole: mrData.authorRole || currentUser.role,
        sourceBranch: mrData.sourceBranch,
        targetBranch: mrData.targetBranch || 'main',
        status: 'pending',
        createdAt: 'Agora',
        commitsCount: mrData.commitsCount || 1,
        diff: mrData.diff || {
          addedLines: 28,
          removedLines: 5,
          preview: `+ ${mrData.title}\n+ Novos trechos de texto propostos na branch ${mrData.sourceBranch}.\n- Versão anterior da cena.`
        },
        commits: mrData.commits || [
          {
            hash: Math.random().toString(16).substring(2, 9),
            author: mrData.author || currentUser.name,
            authorRole: mrData.authorRole || currentUser.role,
            message: mrData.title,
            date: 'Agora'
          }
        ]
      };
      mergeRequests.unshift(newMr);
      const book = books.find((b) => String(b.id) === String(mrData.bookId));
      if (book) {
        book.stats.pendingMerges = (book.stats.pendingMerges || 0) + 1;
      }
      notify('merge_added', newMr);
      return newMr;
    },

    updateMergeStatus: (mergeId, newStatus, feedbackComment = '') => {
      const mr = mergeRequests.find((m) => String(m.id) === String(mergeId));
      if (mr) {
        const previousStatus = mr.status;
        mr.status = newStatus;
        if (feedbackComment) {
          mr.managerFeedback = feedbackComment;
        }

        const book = books.find((b) => String(b.id) === String(mr.bookId));
        if (book) {
          if (previousStatus === 'pending' && (newStatus === 'approved' || newStatus === 'rejected')) {
            book.stats.pendingMerges = Math.max(0, (book.stats.pendingMerges || 1) - 1);
          }
          if (newStatus === 'approved') {
            commits.unshift({
              hash: Math.random().toString(16).substring(2, 9),
              bookId: mr.bookId,
              branch: 'main',
              author: currentUser.name,
              authorRole: currentUser.role,
              message: `merge: aprova solicitação "${mr.title}" de ${mr.sourceBranch}`,
              date: 'Agora',
              timestamp: Date.now()
            });
            book.stats.commitsCount += 1;
          }
        }
        notify('merge_updated', mr);
        return mr;
      }
      return null;
    },

    addSuggestion: (sugData) => {
      const id = String(suggestions.length + 1);
      const newSug = {
        id,
        bookId: String(sugData.bookId),
        chapter: sugData.chapter || 'Capítulo 1',
        revisorName: sugData.revisorName || currentUser.name,
        revisorRole: 'revisor',
        category: sugData.category || 'Correção Ortográfica',
        targetSnippet: sugData.targetSnippet,
        suggestedText: sugData.suggestedText,
        justification: sugData.justification || 'Sugestão editorial para aprimoramento do texto.',
        status: 'pending',
        createdAt: 'Agora'
      };
      suggestions.unshift(newSug);
      const book = books.find((b) => String(b.id) === String(sugData.bookId));
      if (book) {
        book.stats.pendingSuggestions = suggestions.filter((s) => String(s.bookId) === String(sugData.bookId) && s.status === 'pending').length;
      }
      notify('suggestion_added', newSug);
      return newSug;
    },

    updateSuggestionStatus: (suggestionId, newStatus) => {
      const sug = suggestions.find((s) => String(s.id) === String(suggestionId));
      if (sug) {
        sug.status = newStatus;

        const book = books.find((b) => String(b.id) === String(sug.bookId));
        if (book) {
          book.stats.pendingSuggestions = suggestions.filter((s) => String(s.bookId) === String(sug.bookId) && s.status === 'pending').length;

          // Se aprovada pelo Gestor, aplica a redação no texto oficial da main e registra commit de revisão
          if (newStatus === 'approved') {
            if (book.content && book.content.chapter1 && book.content.chapter1.text.includes(sug.targetSnippet)) {
              book.content.chapter1.text = book.content.chapter1.text.replace(sug.targetSnippet, sug.suggestedText);
              sug.targetSnippet = sug.suggestedText;
            }
            commits.unshift({
              hash: Math.random().toString(16).substring(2, 9),
              bookId: sug.bookId,
              branch: 'main',
              author: currentUser.name,
              authorRole: currentUser.role,
              message: `docs: aceita revisão "${sug.category}" por ${sug.revisorName}`,
              date: 'Agora',
              timestamp: Date.now()
            });
            book.stats.commitsCount += 1;
          }
        }

        notify('suggestion_updated', sug);
        return sug;
      }
      return null;
    },

    subscribe
  };
})();
