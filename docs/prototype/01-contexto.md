# 01 — Contexto do Projeto: Gitbook
 
> Este documento é a referência rápida de "o quê e por quê" do projeto.
> Não repita o README inteiro nos prompts — use este resumo.
 
## O que é
 
**Gitbook** é uma plataforma de escrita colaborativa que aplica conceitos do
**Git** (branches, commits, merge, histórico) ao processo de criação de livros.
 
Cada escritor trabalha em uma **branch independente**. Alterações viram
**commits**. Quando pronto, o escritor solicita um **merge** para a `main`,
que o **Gestor** aprova ou rejeita. **Revisores** leem a versão oficial
(`main`) e propõem sugestões de melhoria, que o Gestor também avalia.
 
## Problema que resolve
 
Em escrita colaborativa tradicional, vários autores mexendo no mesmo
documento geram: conflitos de edição, perda de versões antigas, falta de
rastreabilidade de quem mudou o quê, e revisão/aprovação manual e bagunçada.
 
## Papéis do sistema
 
| Papel | Responsabilidade central | Pode fazer |
|---|---|---|
| 👑 **Gestor** | Dono da versão final da obra | Criar/gerenciar livros · Aprovar ou rejeitar merges · Aceitar/rejeitar sugestões · Acompanhar histórico completo |
| ✍️ **Escritor** | Desenvolve uma versão própria da obra | Criar sua branch · Editar conteúdo · Criar commits · Solicitar merge |
| 🔎 **Revisor** | Analisa e sugere melhorias | Ler a versão `main` · Selecionar trechos e sugerir correções/ajustes |
 
**Regra geral de permissão a manter em mente em toda tela:** Escritor e
Revisor têm acesso amplo de *leitura*, mas ação de *escrita/decisão* é quase
sempre exclusiva de cada papel em seu próprio domínio (Escritor só edita a
própria branch; Revisor só sugere, não aceita; Gestor decide).
 
## Fluxo de trabalho (ponta a ponta)
 
```
1. Gestor cria o Livro           → gera a branch "main"
2. Escritores criam suas branches → writer/joao, writer/maria...
3. Escritores fazem commits       → alterações registradas na própria branch
4. Revisores leem a "main"        → e propõem sugestões
5. Escritor solicita Merge Request → branch → main
6. Gestor avalia                  → aprova (integra à main) ou rejeita (pede ajustes)
7. main sempre representa a versão consolidada e oficial da obra
```
 
## Entidades principais do domínio
 
`User` → `Role` (Gestor / Escritor / Revisor) · `Book` · `Branch` · `Commit` ·
`MergeRequest` · `Review` / `Suggestion` · `BookVersion` (a `main`)
 
Cada `Book` tem uma branch `main` e N branches de escritores
(`writer/<nome>`). Cada branch tem N `Commit`s. Merges e sugestões sempre
se referem a um `Book` específico.
 
## Escopo deste protótipo
 
- **Somente front-end**, visual e interativo (HTML/CSS/JS puro).
- **Sem backend real** — dados mockados simulando usuários, livros, branches,
  commits, merges e sugestões em estados variados (pendente/aprovado/rejeitado).
- Objetivo: demonstrar a **navegação completa** entre as 8 telas do sistema
  e a **experiência diferenciada por papel** (o que cada papel vê/pode clicar),
  sem precisar de autenticação ou persistência reais.
- Troca de papel para teste: simular via um objeto de "sessão atual" no
  mock, alternável manualmente, para validar as 3 perspectivas (Gestor,
  Escritor, Revisor) sem precisar de login de verdade.
## As 8 telas (referência — detalhe completo em `03-especificacao-telas.md`)
 
1. Autenticação (`/login`, `/register`)
2. Dashboard / Catálogo de Livros (`/books`)
3. Visão Geral do Livro / Hub da Obra (`/books/{id}`)
4. Editor de Conteúdo e Versionamento (`/books/{id}/editor`)
5. Gestão de Merge Requests — lista (`/books/{id}/merges`)
6. Gestão de Merge Requests — detalhe/diff (`/merges/{id}`)
7. Painel de Revisão e Sugestões (`/books/{id}/suggestions`)
8. Histórico de Versionamento e Commits (`/books/{id}/history`)
 
