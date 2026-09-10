/**
 * Gitbook Prototype - Modal Reutilizável
 * 02-regras-design.md
 */

(function () {
  window.Gitbook = window.Gitbook || {};
  window.Gitbook.components = window.Gitbook.components || {};

  let currentOnCloseCallback = null;

  /**
   * Garante que o container de modal exista no DOM
   */
  function getOrCreateContainer() {
    let container = document.getElementById('modal-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-container';
      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * Abre um modal genérico
   * @param {object} params
   * @param {string} params.title - Título do modal
   * @param {string} params.body - Conteúdo HTML do corpo
   * @param {string} [params.footer=''] - Ações/botões no rodapé (HTML)
   * @param {string} [params.maxWidth='560px'] - Largura máxima personalizada
   * @param {function} [params.onClose] - Callback ao fechar
   */
  function open({
    title = '',
    body = '',
    footer = '',
    maxWidth = '560px',
    onClose = null
  } = {}) {
    const container = getOrCreateContainer();
    currentOnCloseCallback = onClose;

    container.innerHTML = `
      <div class="modal-overlay" id="global-modal-overlay">
        <div class="modal-dialog" style="max-width: ${maxWidth};" role="dialog" aria-modal="true" aria-labelledby="modal-title-text">
          <header class="modal-header">
            <h2 class="modal-title" id="modal-title-text">${title}</h2>
            <button type="button" class="modal-close" id="modal-close-btn" aria-label="Fechar modal">&times;</button>
          </header>
          <div class="modal-body">
            ${body}
          </div>
          ${footer ? `<footer class="modal-footer">${footer}</footer>` : ''}
        </div>
      </div>
    `;

    const overlay = document.getElementById('global-modal-overlay');
    const closeBtn = document.getElementById('modal-close-btn');

    // Força reflow para animação fluida
    requestAnimationFrame(() => {
      overlay.classList.add('active');
    });

    // Fecha ao clicar no botão X
    closeBtn.addEventListener('click', () => {
      close();
    });

    // Fecha ao clicar fora (no overlay)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        close();
      }
    });

    // Fecha com a tecla ESC
    document.addEventListener('keydown', handleEscKey);
  }

  function handleEscKey(e) {
    if (e.key === 'Escape') {
      close();
    }
  }

  /**
   * Fecha o modal ativo com animação
   */
  function close() {
    const overlay = document.getElementById('global-modal-overlay');
    if (!overlay) return;

    overlay.classList.remove('active');
    document.removeEventListener('keydown', handleEscKey);

    setTimeout(() => {
      const container = document.getElementById('modal-container');
      if (container) {
        container.innerHTML = '';
      }
      if (typeof currentOnCloseCallback === 'function') {
        currentOnCloseCallback();
        currentOnCloseCallback = null;
      }
    }, 200);
  }

  window.Gitbook.components.modal = {
    open,
    close
  };
})();
