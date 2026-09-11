/**
 * Gitbook Prototype - SVG Icons Library
 * Ícones funcionais stroke-based (estilo outline, tamanho uniforme e consistente)
 */

(function () {
  window.Gitbook = window.Gitbook || {};
  window.Gitbook.icons = window.Gitbook.icons || {};

  const iconPaths = {
    // 👑 Gestor / Coroa
    crown: '<path d="M2 19h20M3 15l3-8 6 5 6-5 3 8H3z"/>',
    gestor: '<path d="M2 19h20M3 15l3-8 6 5 6-5 3 8H3z"/>',

    // ✍️ Escritor / Caneta
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
    escritor: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',

    // 🔎 Revisor / Lupa / Curadoria
    search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16" y2="16"/>',
    revisor: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16" y2="16"/>',
    inspect: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16" y2="16"/>',

    // 🌿 Branch / Ramificação Git
    branch: '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',

    // 🔀 Merge / Git Pull Request
    merge: '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/>',

    // 📦 Commit / Snapshot
    commit: '<circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/>',

    // ✓ Aprovado / Sucesso
    check: '<polyline points="20 6 9 17 4 12"/>',
    approved: '<polyline points="20 6 9 17 4 12"/>',

    // ✕ Rejeitado / Fechar
    close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    rejected: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',

    // ⏳ Pendente / Relógio
    pending: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',

    // 📚 / 📖 Livro / Obra
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',

    // 👤 Usuário / Colaborador
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    colaborador: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',

    // 📜 Histórico / Documento
    history: '<path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/>',

    // ℹ️ Informativo
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',

    // ⚠️ Alerta
    alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',

    // + Adicionar / Plus
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',

    // ⚙️ Configurações
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',

    // 🚪 Logout
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',

    // 🚫 Bloqueado / Restrito
    block: '<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>',

    // 🔒 Cadeado / Protegido
    lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
  };

  // Mapeamento automático de emojis funcionais comuns para nomes de ícones
  const emojiMap = {
    '👑': 'crown',
    '✍️': 'pen',
    '✍': 'pen',
    '🔎': 'inspect',
    '🔍': 'inspect',
    '🌿': 'branch',
    '🔀': 'merge',
    '📦': 'commit',
    '✓': 'check',
    '✔': 'check',
    '✕': 'close',
    '✖': 'close',
    '❌': 'close',
    '⏳': 'pending',
    '📚': 'book',
    '📖': 'book',
    '👤': 'user',
    '📜': 'history',
    'ℹ️': 'info',
    'ℹ': 'info',
    '⚠️': 'alert',
    '🚫': 'block',
    '🔒': 'lock',
    '⚙️': 'settings',
    '⚙': 'settings',
    '🚪': 'logout',
    '+': 'plus'
  };

  /**
   * Retorna um ícone SVG stroke-based estilizado
   * @param {string} nameOrKey - Nome do ícone ou emoji
   * @param {object} options - { size, strokeWidth, className, attributes }
   */
  function get(nameOrKey, { size = 15, strokeWidth = 1.8, className = '', attributes = '' } = {}) {
    if (!nameOrKey) return '';

    // Se já for uma tag SVG válida, retorna
    if (typeof nameOrKey === 'string' && nameOrKey.trim().startsWith('<svg')) {
      return nameOrKey;
    }

    const key = (nameOrKey || '').trim().toLowerCase();
    const resolvedName = emojiMap[nameOrKey] || emojiMap[key] || key;
    const pathContent = iconPaths[resolvedName];

    if (!pathContent) {
      // Se não encontrou SVG correspondente, retorna o texto original com segurança
      return nameOrKey;
    }

    const cls = ['gitbook-icon', `icon-${resolvedName}`, className].filter(Boolean).join(' ');

    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="${cls}" aria-hidden="true" ${attributes}>${pathContent}</svg>`;
  }

  /**
   * Converte strings contendo emojis funcionais em SVG
   */
  function render(nameOrEmoji, options = {}) {
    return get(nameOrEmoji, options);
  }

  window.Gitbook.icons = {
    get,
    render,
    paths: iconPaths,
    emojiMap
  };
})();
