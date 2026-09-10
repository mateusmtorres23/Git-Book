# 03 — Especificação das Telas
 
> Baseado nas diretrizes do `README.md` do projeto. Cada tela tem um ID
> curto (T1–T8) para ser referenciado nos prompts de `04-sequencia.md`
> sem precisar colar a especificação inteira toda vez.
>
> Todas as telas devem seguir os tokens, componentes e convenções
> definidos em `02-regras-design.md`.
 
---
 
## 🌐 T0 — Elementos Globais (Layout Base)
 
Elementos presentes em praticamente todas as telas autenticadas:
 
- **Header/Nav superior:**
  - Logo do Gitbook, com atalho para a Home/Dashboard (`/books`)
  - Indicador da obra ativa (só quando dentro do contexto de um livro)
  - Avatar do usuário, nome e Badge indicativa do papel ativo (Gestor,
    Escritor ou Revisor)
  - Dropdown: "Perfil", "Configurações" e "Sair (Logout)"
> Já coberto pelo componente Header global do Passo 1 (fundação) —
> não recriar nas telas seguintes, apenas reusar.
 
---
 
## 🔐 T1 — Autenticação e Cadastro (`/login`, `/register`)
 
**Objetivo:** permitir login ou cadastro na plataforma.
 
**Componentes:**
- **Login:** campo de e-mail, campo de senha, botão "Entrar", link
  "Esqueceu a senha?", link para alternar para Cadastro.
- **Cadastro:** Nome completo, E-mail, Senha, Confirmação de Senha,
  seleção de perfil desejado (Gestor / Escritor / Revisor) ou atribuição
  padrão, botão "Criar Conta".
---
 
## 📚 T2 — Dashboard / Catálogo de Livros (`/books`)
 
**Objetivo:** listar as obras cadastradas, permitir busca, filtro e
criação de novos livros.
 
**Componentes:**
- Título "Minhas Obras / Livros" + campo de busca (título ou autor) +
  botão primário "+ Novo Livro" (destaque para o papel Gestor).
- **Grid de Cards de Livro**, cada um com: capa (imagem ou placeholder),
  título, descrição sucinta, nome do Gestor responsável, badges de
  métricas rápidas (nº de branches ativas, nº de commits, status da
  `main`), botão "Acessar Livro" → navega para T3 (`/books/{id}`).
- **Modal "Criar Novo Livro"**: Título, Descrição/Sinopse, Capa, botão
  "Inicializar Livro (Criar branch main)".
---
 
## 📖 T3 — Hub da Obra / Visão Geral do Livro (`/books/{id}`)
 
**Objetivo:** centralizar informações da obra e dar acesso rápido aos
demais módulos (branches, merges, sugestões, histórico).
 
**Componentes:**
- **Subnavegação (tabs internas):** Visão Geral | Editor de Escrita |
  Branches | Merge Requests | Sugestões | Histórico.
- **Painel de informações:** título, autor/gestor, resumo da obra, tag
  indicando a versão consolidada (`main`).
- **Painel de métricas rápidas:** Total de Commits, Branches Ativas,
  Merge Requests Pendentes, Sugestões de Revisão.
- **Seção "Branches em Destaque":** lista com `main` + branches ativas
  dos escritores (ex: `writer/joao`, `writer/maria`) + botão "Criar
  Minha Branch" (visível para Escritores).
- **Feed de atividades recentes:** últimos commits e merges
  aceitos/rejeitados, em ordem cronológica.
---
 
## ✍️ T4 — Editor de Conteúdo e Versionamento (`/books/{id}/editor`)
 
**Objetivo:** ambiente do Escritor para criar/alterar conteúdo e
registrar commits na própria branch.
 
**Componentes:**
- **Barra superior do editor:** seletor da branch atual (ex:
  `writer/joao`) com indicador visual de sincronização com a `main`,
  botão "Sincronizar com main", botão de destaque "Solicitar Merge" →
  abre fluxo de T5.
- **Painel lateral esquerdo:** árvore de capítulos/seções do livro +
  botão de adicionar novo capítulo/arquivo na branch ativa.
- **Área central:** editor rich-text ou Markdown.
- **Painel lateral direito / gaveta inferior (área de commit):** campo
  "Mensagem do Commit" (ex: `feat: adiciona capítulo 2`), resumo visual
  das modificações, botão primário "Salvar Commit".
---
 
## 🔀 T5 — Gestão de Merge Requests (`/books/{id}/merges` e `/merges/{id}`)
 
**Objetivo:** permitir que o Gestor avalie solicitações de integração,
veja o diff e decida aprovar ou rejeitar.
 
**T5a — Lista (`/books/{id}/merges`):**
- Filtros de status: PENDENTES, APROVADOS, REJEITADOS.
- Tabela/cards com: título do merge, autor (Escritor), branch de
  origem → branch de destino (`main`), data de envio, status.
**T5b — Detalhe (`/merges/{id}`):**
- Cabeçalho: título da solicitação, autor, descrição das alterações.
- **Visualização diff:** lado a lado ou unificado, comparando `main`
  com a branch do escritor; realce verde (adicionado) e vermelho
  (removido/modificado).
- Lista dos commits incluídos no merge.
- **Barra de ações do Gestor:** campo de comentário/feedback, botão
  secundário "Rejeitar Merge / Solicitar Ajustes", botão primário
  "Aprovar e Integrar à Main".
---
 
## 🔎 T6 — Revisão e Sugestões Editoriais (`/books/{id}/suggestions`)
 
**Objetivo:** Revisores leem a `main`, selecionam trechos e sugerem
melhorias; Gestor avalia as sugestões.
 
**Componentes:**
- **Área de leitura da `main`:** texto da versão consolidada com
  marcadores visuais nos trechos com sugestões ativas.
- **Painel lateral de sugestões — visão do Revisor:** ação de
  selecionar trecho + "Adicionar Sugestão"; modal com Categoria
  (Correção Ortográfica, Ajuste de Enredo, Coerência), trecho sugerido
  e justificativa.
- **Painel lateral de sugestões — visão do Gestor:** card por sugestão
  pendente (nome do revisor + trecho afetado) com botões "Aceitar
  Sugestão" / "Rejeitar Sugestão".
---
 
## 📜 T7 — Histórico de Versionamento e Commits (`/books/{id}/history`)
 
**Objetivo:** rastreabilidade total da evolução do livro.
 
**Componentes:**
- **Barra de filtro:** por Branch (`main`, `writer/maria`...) ou por Autor.
- **Linha do tempo visual (commit log):** estilo grafo Git, com nós e
  ramificações.
- **Lista de commits:** avatar/nome do autor, mensagem do commit (ex:
  `fix: corrige capítulo 2`), data/hora/hash, nome da branch associada,
  botão "Visualizar versão neste commit".
---
 
## 📑 Mapeamento de Papéis × Permissões por Tela
 
| Tela | Gestor 👑 | Escritor ✍️ | Revisor 🔎 |
|---|---|---|---|
| T2 — Dashboard | Criar/Gerenciar | Visualizar/Acessar | Visualizar/Acessar |
| T4 — Editor | Leitura geral | Criar Branch / Commits / Pedir Merge | Apenas Leitura |
| T5 — Merge Requests | Aprovar / Rejeitar | Criar / Acompanhar | Visualizar |
| T6 — Sugestões | Aceitar / Rejeitar | Visualizar | Criar Sugestões |
| T7 — Histórico | Acesso Total | Visualizar | Visualizar |
 
> Use este mapeamento para decidir, em cada tela, quais botões/ações
> aparecem habilitados conforme o papel simulado em `mock-data.js`.
 
