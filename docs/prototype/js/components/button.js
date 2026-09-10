/**
 * Gitbook Prototype - Botões Reutilizáveis
 * 02-regras-design.md
 */

(function () {
  window.Gitbook = window.Gitbook || {};
  window.Gitbook.components = window.Gitbook.components || {};

  /**
   * Retorna o HTML de um Botão padronizado
   * @param {object} params
   * @param {string} params.text - Texto do botão
   * @param {string} [params.variant='primary'] - 'primary' | 'secondary' | 'danger' | 'ghost'
   * @param {string} [params.size='md'] - 'sm' | 'md' | 'lg'
   * @param {string} [params.icon=''] - Ícone ou emoji
   * @param {string} [params.id=''] - ID do elemento
   * @param {string} [params.className=''] - Classes adicionais
   * @param {string} [params.href=''] - Se fornecido, renderiza como <a>
   * @param {boolean} [params.disabled=false] - Se desabilitado
   * @param {string} [params.type='button'] - Tipo do botão
   * @param {string} [params.attributes=''] - Atributos HTML extras (data-*, onclick, etc.)
   */
  function createButton({
    text = '',
    variant = 'primary',
    size = 'md',
    icon = '',
    id = '',
    className = '',
    href = '',
    disabled = false,
    type = 'button',
    attributes = ''
  } = {}) {
    const variantClass = `btn-${variant}`;
    const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
    const classes = ['btn', variantClass, sizeClass, className].filter(Boolean).join(' ');

    const iconHtml = icon ? `<span class="btn-icon">${icon}</span>` : '';
    const content = `${iconHtml}<span class="btn-text">${text}</span>`;
    const idAttr = id ? `id="${id}"` : '';
    const disabledAttr = disabled ? 'disabled' : '';

    if (href) {
      return `<a href="${href}" class="${classes}" ${idAttr} ${attributes}>${content}</a>`;
    }

    return `<button type="${type}" class="${classes}" ${idAttr} ${disabledAttr} ${attributes}>${content}</button>`;
  }

  window.Gitbook.components.button = {
    createButton
  };
})();
