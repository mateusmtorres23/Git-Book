/**
 * Gitbook Prototype - Tela T1: Autenticação (Login e Cadastro)
 * 03-especificacao-telas.md & 04-sequencia.md (Passo 2)
 */

(function () {
  window.Gitbook = window.Gitbook || {};
  window.Gitbook.screens = window.Gitbook.screens || {};

  /**
   * Renderiza a tela de Autenticação (Login ou Cadastro)
   * @param {HTMLElement} container - Elemento onde a tela será montada
   * @param {string} initialMode - 'login' ou 'register'
   */
  function render(container, initialMode = 'login') {
    const buttonComp = window.Gitbook.components.button;
    const badgeComp = window.Gitbook.components.badge;
    const isLogin = initialMode === 'login';

    const loginButtonHtml = buttonComp ? buttonComp.createButton({
      text: 'Entrar na Plataforma',
      variant: 'primary',
      id: 'btn-submit-login',
      className: 'btn-lg',
      attributes: 'style="width: 100%; justify-content: center;"'
    }) : '<button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">Entrar</button>';

    const registerButtonHtml = buttonComp ? buttonComp.createButton({
      text: 'Criar Conta e Acessar',
      variant: 'primary',
      id: 'btn-submit-register',
      className: 'btn-lg',
      attributes: 'style="width: 100%; justify-content: center;"'
    }) : '<button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">Criar Conta</button>';

    container.innerHTML = `
      <div class="auth-wrapper">
        <div class="auth-container">
          <!-- Coluna Esquerda: Proposta de Valor e Contexto do Gitbook (Checklist Critério 1) -->
          <div class="auth-intro-pane">
            <div class="auth-intro-badge">
              <span>🚀</span>
              <span>Versão 1.0 — Protótipo SPA</span>
            </div>

            <h1 class="auth-intro-title">
              Escrita Colaborativa com o Poder do <span class="gradient-text">Versionamento Git</span>
            </h1>

            <p class="auth-intro-desc">
              O <strong>Gitbook</strong> resolve os conflitos da criação literária coletiva. Autores trabalham em branches individuais, revisores sugerem ajustes na linha oficial e o gestor consolida a obra definitiva.
            </p>

            <div class="auth-features-list">
              <div class="auth-feature-item">
                <div class="auth-feature-icon">👑</div>
                <div class="auth-feature-text">
                  <strong>Gestão Editorial & Aprovação de Merges</strong>
                  <span>O Gestor é o guardião da branch principal (<code>main</code>), avaliando solicitações e aprovando cada integração.</span>
                </div>
              </div>

              <div class="auth-feature-item">
                <div class="auth-feature-icon">✍️</div>
                <div class="auth-feature-text">
                  <strong>Branches de Escritores sem Conflito</strong>
                  <span>Cada escritor escreve em sua própria ramificação (<code>writer/nome</code>), registrando capítulos em commits auditáveis.</span>
                </div>
              </div>

              <div class="auth-feature-item">
                <div class="auth-feature-icon">🔎</div>
                <div class="auth-feature-text">
                  <strong>Curadoria & Sugestões Editoriais</strong>
                  <span>Revisores analisam a versão consolidada e propõem melhorias pontuais sem alterar diretamente o texto principal.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Coluna Direita: Card de Autenticação (Login / Cadastro) -->
          <div class="auth-card" id="auth-main-card">
            <!-- Alternância de Abas sem Reload -->
            <nav class="auth-tabs-nav" aria-label="Abas de autenticação">
              <button type="button" class="auth-tab-btn ${isLogin ? 'active' : ''}" id="tab-login-btn">
                Entrar
              </button>
              <button type="button" class="auth-tab-btn ${!isLogin ? 'active' : ''}" id="tab-register-btn">
                Cadastre-se
              </button>
            </nav>

            <!-- ================= FORMULÁRIO DE LOGIN ================= -->
            <form id="form-login" style="${isLogin ? 'display: block;' : 'display: none;'}" novalidate>
              <div class="auth-form-header">
                <h2 class="auth-form-title">Acesse sua conta</h2>
                <p class="auth-form-subtitle">Digite suas credenciais ou use o login rápido de teste abaixo.</p>
              </div>

              <div id="login-error-msg" style="display: none; margin-bottom: 12px; padding: 10px; background: var(--color-status-rejected-bg); border: 1px solid var(--color-status-rejected-border); border-radius: var(--radius-md); font-size: var(--font-size-xs); color: var(--color-status-rejected-text);"></div>

              <div class="form-group">
                <label for="login-email" class="form-label">E-mail</label>
                <input type="email" id="login-email" class="form-input" placeholder="seu.email@gitbook.com" value="lucas.gestor@gitbook.com" required>
              </div>

              <div class="form-group">
                <label for="login-password" class="form-label">
                  <span>Senha</span>
                  <a href="javascript:void(0)" id="link-forgot-password" class="form-label-hint" style="color: var(--color-primary);">Esqueceu a senha?</a>
                </label>
                <input type="password" id="login-password" class="form-input" placeholder="••••••••" value="senha123" required>
              </div>

              <div style="margin-top: var(--space-5);">
                ${loginButtonHtml}
              </div>

              <!-- Atalhos de Login Rápido por Papel para Avaliação Ágil -->
              <div class="auth-quick-login">
                <div class="auth-quick-title">
                  <span>Login Rápido para Avaliação:</span>
                  <span style="font-size: 0.65rem; color: var(--color-primary-text);">1 Clique</span>
                </div>
                <div class="auth-quick-buttons">
                  <button type="button" class="auth-quick-btn" data-role="gestor" data-email="lucas.gestor@gitbook.com" title="Entrar como Gestor">
                    <span>👑 Lucas</span>
                    <span style="color: var(--color-role-gestor-text); font-weight: 600;">Gestor</span>
                  </button>
                  <button type="button" class="auth-quick-btn" data-role="escritor" data-email="joao.autor@gitbook.com" title="Entrar como Escritor">
                    <span>✍️ João</span>
                    <span style="color: var(--color-role-escritor-text); font-weight: 600;">Escritor</span>
                  </button>
                  <button type="button" class="auth-quick-btn" data-role="revisor" data-email="beatriz.revisora@gitbook.com" title="Entrar como Revisora">
                    <span>🔎 Beatriz</span>
                    <span style="color: var(--color-role-revisor-text); font-weight: 600;">Revisora</span>
                  </button>
                </div>
              </div>
            </form>

            <!-- ================= FORMULÁRIO DE CADASTRO ================= -->
            <form id="form-register" style="${!isLogin ? 'display: block;' : 'display: none;'}" novalidate>
              <div class="auth-form-header">
                <h2 class="auth-form-title">Crie sua conta</h2>
                <p class="auth-form-subtitle">Preencha os dados e escolha seu papel na plataforma.</p>
              </div>

              <div id="register-error-msg" style="display: none; margin-bottom: 12px; padding: 10px; background: var(--color-status-rejected-bg); border: 1px solid var(--color-status-rejected-border); border-radius: var(--radius-md); font-size: var(--font-size-xs); color: var(--color-status-rejected-text);"></div>

              <!-- 4 Campos Obrigatórios Conforme Passo 2 -->
              <div class="form-group">
                <label for="reg-name" class="form-label">Nome Completo</label>
                <input type="text" id="reg-name" class="form-input" placeholder="Ex: Clara Ribeiro" value="Clara Ribeiro" required>
              </div>

              <div class="form-group">
                <label for="reg-email" class="form-label">E-mail</label>
                <input type="email" id="reg-email" class="form-input" placeholder="clara@gitbook.com" value="clara.autora@gitbook.com" required>
              </div>

              <div class="form-group">
                <label for="reg-password" class="form-label">Senha</label>
                <input type="password" id="reg-password" class="form-input" placeholder="Mínimo 6 caracteres" value="senha123" required>
              </div>

              <div class="form-group">
                <label for="reg-password-confirm" class="form-label">Confirmação de Senha</label>
                <input type="password" id="reg-password-confirm" class="form-input" placeholder="Repita sua senha" value="senha123" required>
              </div>

              <!-- Seleção de Perfil Desejado (Gestor / Escritor / Revisor) -->
              <div class="form-group">
                <label class="form-label">
                  <span>Papel Desejado</span>
                  <span class="form-label-hint">Define suas permissões</span>
                </label>
                <div class="role-options-grid">
                  <label class="role-option-card selected" id="card-role-escritor">
                    <input type="radio" name="reg-role" value="escritor" class="role-option-radio" checked>
                    <span class="role-option-icon">✍️</span>
                    <span class="role-option-title">Escritor</span>
                    <span class="role-option-desc">Cria branches e capítulos</span>
                  </label>

                  <label class="role-option-card" id="card-role-gestor">
                    <input type="radio" name="reg-role" value="gestor" class="role-option-radio">
                    <span class="role-option-icon">👑</span>
                    <span class="role-option-title">Gestor</span>
                    <span class="role-option-desc">Aprova merges e gere obras</span>
                  </label>

                  <label class="role-option-card" id="card-role-revisor">
                    <input type="radio" name="reg-role" value="revisor" class="role-option-radio">
                    <span class="role-option-icon">🔎</span>
                    <span class="role-option-title">Revisor</span>
                    <span class="role-option-desc">Propõe melhorias de texto</span>
                  </label>
                </div>
              </div>

              <div style="margin-top: var(--space-5);">
                ${registerButtonHtml}
              </div>

              <div style="text-align: center; margin-top: var(--space-4); font-size: var(--font-size-xs); color: var(--color-text-muted);">
                Já tem uma conta?
                <a href="#/login" id="link-switch-to-login" style="color: var(--color-primary); font-weight: 500;">Faça login aqui</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    bindEvents(container);
  }

  function bindEvents(container) {
    const tabLoginBtn = container.querySelector('#tab-login-btn');
    const tabRegisterBtn = container.querySelector('#tab-register-btn');
    const formLogin = container.querySelector('#form-login');
    const formRegister = container.querySelector('#form-register');
    const linkSwitchToLogin = container.querySelector('#link-switch-to-login');
    const linkForgotPassword = container.querySelector('#link-forgot-password');
    const quickLoginBtns = container.querySelectorAll('.auth-quick-btn');
    const roleCards = container.querySelectorAll('.role-option-card');

    function switchToMode(mode) {
      if (mode === 'login') {
        tabLoginBtn.classList.add('active');
        tabRegisterBtn.classList.remove('active');
        formLogin.style.display = 'block';
        formRegister.style.display = 'none';
        if (window.location.hash !== '#/login') {
          history.replaceState(null, '', '#/login');
        }
      } else {
        tabRegisterBtn.classList.add('active');
        tabLoginBtn.classList.remove('active');
        formRegister.style.display = 'block';
        formLogin.style.display = 'none';
        if (window.location.hash !== '#/register') {
          history.replaceState(null, '', '#/register');
        }
      }
    }

    if (tabLoginBtn) tabLoginBtn.addEventListener('click', () => switchToMode('login'));
    if (tabRegisterBtn) tabRegisterBtn.addEventListener('click', () => switchToMode('register'));
    if (linkSwitchToLogin) {
      linkSwitchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchToMode('login');
      });
    }

    // Seleção visual dos cards de papel no cadastro
    roleCards.forEach((card) => {
      card.addEventListener('click', () => {
        roleCards.forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    // Login rápido com 1 clique (Lucas, João ou Beatriz)
    quickLoginBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const role = btn.getAttribute('data-role');
        const email = btn.getAttribute('data-email');
        const emailInput = container.querySelector('#login-email');
        if (emailInput) emailInput.value = email;

        if (window.Gitbook.mockData) {
          window.Gitbook.mockData.setCurrentRole(role);
        }
        window.location.hash = '#/books';
      });
    });

    // Submissão do Login
    if (formLogin) {
      formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = container.querySelector('#login-email');
        const passInput = container.querySelector('#login-password');
        const errorEl = container.querySelector('#login-error-msg');
        const email = (emailInput.value || '').trim();
        const password = (passInput.value || '').trim();

        if (!email || !password) {
          if (errorEl) {
            errorEl.textContent = '⚠️ Por favor, informe seu e-mail e senha para acessar.';
            errorEl.style.display = 'block';
          }
          if (!email) emailInput.focus();
          else passInput.focus();
          return;
        }

        if (errorEl) errorEl.style.display = 'none';

        // Identifica papel pelo e-mail ou mantém o atual
        if (window.Gitbook.mockData) {
          const users = window.Gitbook.mockData.getUsers();
          const matchedUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
          if (matchedUser) {
            window.Gitbook.mockData.setCurrentUser(matchedUser.id);
          }
        }

        // Navega para /books conforme critério de aceite
        window.location.hash = '#/books';
      });
    }

    // Submissão do Cadastro
    if (formRegister) {
      formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = container.querySelector('#reg-name');
        const emailInput = container.querySelector('#reg-email');
        const passInput = container.querySelector('#reg-password');
        const errorEl = container.querySelector('#register-error-msg');

        const name = (nameInput.value || '').trim();
        const email = (emailInput.value || '').trim();
        const password = (passInput.value || '').trim();
        const selectedRadio = container.querySelector('input[name="reg-role"]:checked');
        const role = selectedRadio ? selectedRadio.value : 'escritor';

        if (!name || !email || !password) {
          if (errorEl) {
            errorEl.textContent = '⚠️ Por favor, preencha todos os campos obrigatórios (nome, e-mail e senha).';
            errorEl.style.display = 'block';
          }
          if (!name) nameInput.focus();
          else if (!email) emailInput.focus();
          else passInput.focus();
          return;
        }

        if (errorEl) errorEl.style.display = 'none';

        if (window.Gitbook.mockData) {
          window.Gitbook.mockData.setCurrentRole(role);
          const currentUser = window.Gitbook.mockData.getCurrentUser();
          currentUser.name = name;
          currentUser.email = email;
        }

        // Navega para /books conforme critério de aceite
        window.location.hash = '#/books';
      });
    }

    // "Esqueceu a senha?" utilizando o componente Modal global
    if (linkForgotPassword) {
      linkForgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = window.Gitbook.components.modal;
        if (modal) {
          modal.open({
            title: 'Recuperação de Acesso',
            body: `
              <p style="color: var(--color-text-muted); font-size: var(--font-size-sm); margin-bottom: 16px;">
                Em um ambiente de produção, um token de redefinição seria enviado ao seu e-mail cadastrado.
              </p>
              <div style="background: var(--color-bg-subtle); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 12px; font-size: var(--font-size-sm);">
                <strong>Dica do Protótipo:</strong> Para explorar o protótipo, utilize os botões de <em>Login Rápido</em> (Gestor, Escritor ou Revisor) ou qualquer senha desejada.
              </div>
            `,
            footer: `<button type="button" class="btn btn-primary" onclick="Gitbook.components.modal.close()">Entendido</button>`
          });
        }
      });
    }
  }

  window.Gitbook.screens.auth = {
    render
  };
})();
