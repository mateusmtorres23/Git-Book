/**
 * Gitbook Prototype - Badges Reutilizáveis (Papel e Status)
 * 02-regras-design.md
 */

(function () {
  window.Gitbook = window.Gitbook || {};
  window.Gitbook.components = window.Gitbook.components || {};

  /**
   * Retorna o HTML de um Badge de Papel (Role Badge)
   * @param {string} role - 'gestor' | 'escritor' | 'revisor'
   * @param {object} options - { showIcon: true, customClass: '' }
   */
  function createRoleBadge(role, options = {}) {
    const r = (role || '').toLowerCase();
    const showIcon = options.showIcon !== false;
    const customClass = options.customClass ? ` ${options.customClass}` : '';

    let label = 'Desconhecido';
    let icon = '';
    let roleClass = '';

    switch (r) {
      case 'gestor':
        label = 'Gestor';
        icon = '👑';
        roleClass = 'badge-role-gestor';
        break;
      case 'escritor':
        label = 'Escritor';
        icon = '✍️';
        roleClass = 'badge-role-escritor';
        break;
      case 'revisor':
        label = 'Revisor';
        icon = '🔎';
        roleClass = 'badge-role-revisor';
        break;
      default:
        label = role || 'Papel';
        roleClass = 'badge-status-info';
    }

    const iconHtml = showIcon && icon ? `<span class="badge-icon">${icon}</span>` : '';
    return `<span class="badge ${roleClass}${customClass}">${iconHtml}<span class="badge-text">${label}</span></span>`;
  }

  /**
   * Retorna o HTML de um Badge de Status (Status Badge)
   * @param {string} status - 'approved' | 'rejected' | 'pending' | 'info' ou termos em PT ('aprovado', 'rejeitado', 'pendente')
   * @param {object} options - { label: '', customClass: '' }
   */
  function createStatusBadge(status, options = {}) {
    const s = (status || '').toLowerCase();
    const customClass = options.customClass ? ` ${options.customClass}` : '';

    let label = options.label;
    let statusClass = '';
    let icon = '';

    switch (s) {
      case 'approved':
      case 'aprovado':
      case 'merged':
        label = label || 'Aprovado';
        statusClass = 'badge-status-approved';
        icon = '✓';
        break;
      case 'rejected':
      case 'rejeitado':
      case 'closed':
        label = label || 'Rejeitado';
        statusClass = 'badge-status-rejected';
        icon = '✕';
        break;
      case 'pending':
      case 'pendente':
      case 'open':
        label = label || 'Pendente';
        statusClass = 'badge-status-pending';
        icon = '⏳';
        break;
      default:
        label = label || status || 'Informativo';
        statusClass = 'badge-status-info';
        icon = 'ℹ';
    }

    return `<span class="badge ${statusClass}${customClass}"><span class="badge-icon">${icon}</span><span class="badge-text">${label}</span></span>`;
  }

  window.Gitbook.components.badge = {
    createRoleBadge,
    createStatusBadge
  };
})();
