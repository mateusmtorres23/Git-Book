/**
 * Gitbook Prototype - Card Reutilizável
 * 02-regras-design.md
 */

(function () {
  window.Gitbook = window.Gitbook || {};
  window.Gitbook.components = window.Gitbook.components || {};

  /**
   * Retorna o HTML de um Card padronizado
   * @param {object} params
   * @param {string} [params.title=''] - Título do card
   * @param {string} [params.subtitle=''] - Subtítulo do card
   * @param {string} [params.headerAction=''] - Ação ou badge no cabeçalho
   * @param {string} params.body - Conteúdo principal do card (HTML)
   * @param {string} [params.footer=''] - Conteúdo do rodapé do card (HTML)
   * @param {string} [params.className=''] - Classes adicionais
   * @param {boolean} [params.interactive=false] - Se tem efeito hover de elevação
   * @param {string} [params.id=''] - ID do card
   * @param {string} [params.attributes=''] - Atributos HTML adicionais
   */
  function createCard({
    title = '',
    subtitle = '',
    headerAction = '',
    body = '',
    footer = '',
    className = '',
    interactive = false,
    id = '',
    attributes = ''
  } = {}) {
    const classes = [
      'card',
      interactive ? 'card-interactive' : '',
      className
    ].filter(Boolean).join(' ');

    const hasHeader = title || subtitle || headerAction;
    let headerHtml = '';

    if (hasHeader) {
      const titlesHtml = `
        <div class="card-titles">
          ${title ? `<h3 class="card-title">${title}</h3>` : ''}
          ${subtitle ? `<p class="card-subtitle">${subtitle}</p>` : ''}
        </div>
      `;
      headerHtml = `
        <header class="card-header">
          ${titlesHtml}
          ${headerAction ? `<div class="card-header-action">${headerAction}</div>` : ''}
        </header>
      `;
    }

    const bodyHtml = `<div class="card-body">${body}</div>`;
    const footerHtml = footer ? `<footer class="card-footer">${footer}</footer>` : '';
    const idAttr = id ? `id="${id}"` : '';

    return `
      <article class="${classes}" ${idAttr} ${attributes}>
        ${headerHtml}
        ${bodyHtml}
        ${footerHtml}
      </article>
    `;
  }

  window.Gitbook.components.card = {
    createCard
  };
})();
