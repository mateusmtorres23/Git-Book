/**
 * Gitbook Prototype - Badges Reutilizáveis (Papel e Status)
 * 02-regras-design.md
 */

(function () {
  window.Gitbook = window.Gitbook || {};
  window.Gitbook.components = window.Gitbook.components || {};

  function getIconSvg(nameOrKey, size = 12) {
    if (window.Gitbook && window.Gitbook.icons) {
      return window.Gitbook.icons.get(nameOrKey, { size, strokeWidth: 2 });
    }
    return '';
  }

  /**
   * Retorna o HTML de um Badge de Papel (Role Badge)
   * @param {string} role - 'gestor' | 'escritor' | 'revisor' | 'colaborador'
   * @param {object} options - { showIcon: true, customClass: '' }
   */
  function createRoleBadge(role, options = {}) {
    const r = (role || '').toLowerCase();
    const showIcon = options.showIcon !== false;
    const customClass = options.customClass ? ` ${options.customClass}` : '';

    let label = 'Desconhecido';
    let iconSvg = '';
    let roleClass = '';

    switch (r) {
      case 'gestor':
        label = 'Gestor';
        iconSvg = getIconSvg('gestor', 12);
        roleClass = 'badge-role-gestor';
        break;
      case 'escritor':
        label = 'Escritor';
        iconSvg = getIconSvg('escritor', 12);
        roleClass = 'badge-role-escritor';
        break;
      case 'revisor':
        label = 'Revisor';
        iconSvg = getIconSvg('revisor', 12);
        roleClass = 'badge-role-revisor';
        break;
      case 'colaborador':
        label = 'Colaborador';
        iconSvg = getIconSvg('colaborador', 12);
        roleClass = 'badge-status-info';
        break;
      default:
        label = role || 'Papel';
        iconSvg = getIconSvg('user', 12);
        roleClass = 'badge-status-info';
    }

    const iconHtml = showIcon && iconSvg ? `<span class="badge-icon">${iconSvg}</span>` : '';
    return `<span class="badge ${roleClass}${customClass}">${iconHtml}<span class="badge-text">${label}</span></span>`;
  }

  /**
   * Retorna o HTML de um Badge de Status (Status Badge)
   * @param {string} status - 'approved' | 'rejected' | 'pending' | 'info'
   * @param {object} options - { label: '', customClass: '', showIcon: true }
   */
  function createStatusBadge(status, options = {}) {
    const s = (status || '').toLowerCase();
    const customClass = options.customClass ? ` ${options.customClass}` : '';
    const showIcon = options.showIcon !== false;

    let label = options.label;
    let statusClass = '';
    let iconSvg = '';

    switch (s) {
      case 'approved':
      case 'aprovado':
      case 'merged':
        label = label || 'Aprovado';
        statusClass = 'badge-status-approved';
        iconSvg = getIconSvg('approved', 12);
        break;
      case 'rejected':
      case 'rejeitado':
      case 'closed':
        label = label || 'Rejeitado';
        statusClass = 'badge-status-rejected';
        iconSvg = getIconSvg('rejected', 12);
        break;
      case 'pending':
      case 'pendente':
      case 'open':
        label = label || 'Pendente';
        statusClass = 'badge-status-pending';
        iconSvg = getIconSvg('pending', 12);
        break;
      default:
        label = label || status || 'Informativo';
        statusClass = 'badge-status-info';
        iconSvg = getIconSvg('info', 12);
    }

    const iconHtml = showIcon && iconSvg ? `<span class="badge-icon">${iconSvg}</span>` : '';
    return `<span class="badge ${statusClass}${customClass}">${iconHtml}<span class="badge-text">${label}</span></span>`;
  }

  window.Gitbook.components.badge = {
    createRoleBadge,
    createStatusBadge
  };
})();
