# 04 — Sequência de Construção
 
> Ordem em que o protótipo deve ser construído. Cada passo é um prompt
> separado ao Antigravity. **Não avance para o próximo passo sem
> revisão/aprovação explícita** — mesmo que todo o contexto já tenha
> sido lido de uma vez via `01`–`03`.
>
> Cada passo referencia os IDs de tela definidos em
> `03-especificacao-telas.md` (T0–T7) e deve obedecer
> `02-regras-design.md` integralmente.
 
---
 
### Passo 1 — Fundação
**Entrega:** `tokens.css`, `components.css`, componentes globais
(Header, Badge de papel, Badge de status, Card, Modal, Botões),
`mock-data.js`, `router.js` com as rotas mapeadas (ainda vazias) e T0
(Header global) funcionando em todas as rotas.
 
**Critério de aceite:** navegar manualmente pela URL (hash routing)
entre todas as rotas já mostra o Header consistente; nenhuma tela de
conteúdo implementada ainda.
 
---
 
### Passo 2 — T1: Autenticação
**Entrega:** telas de Login e Cadastro, com alternância entre as duas
sem reload de página.
 
**Critério de aceite:** "Entrar" (mesmo sem validação real) navega para
`/books`; formulário de cadastro tem os 4 campos + seleção de papel.
 
---
 
### Passo 3 — T2: Dashboard / Catálogo
**Entrega:** grid de cards de livros a partir de `mock-data.js`, busca
funcional (filtro no client-side), modal "Criar Novo Livro" funcional
(adiciona ao mock em memória, sem persistência real).
 
**Critério de aceite:** "Acessar Livro" navega para `/books/{id}` com o
ID correto do card clicado.
 
---
 
### Passo 4 — T3: Hub da Obra
**Entrega:** subnavegação (tabs), painel de informações do livro,
métricas rápidas, seção de branches em destaque, feed de atividades.
 
**Critério de aceite:** cada tab da subnavegação leva à rota
correspondente (Editor → T4, Merge Requests → T5a, Sugestões → T6,
Histórico → T7); dados exibidos batem com o livro/ID da URL.
 
---
 
### Passo 5 — T4: Editor de Conteúdo
**Entrega:** seletor de branch, árvore de capítulos, área de edição de
texto, área de commit (mensagem + botão "Salvar Commit" que adiciona ao
mock em memória), botão "Solicitar Merge".
 
**Critério de aceite:** "Salvar Commit" reflete no histórico de commits
do mock (visível depois em T7); "Solicitar Merge" navega/abre o fluxo
de T5.
 
---
 
### Passo 6 — T5: Merge Requests (lista + detalhe)
**Entrega:** T5a (lista com filtros de status) e T5b (detalhe com diff,
lista de commits, ações do Gestor).
 
**Critério de aceite:** clicar num item da lista navega para
`/merges/{id}` com os dados corretos; "Aprovar" e "Rejeitar" atualizam
o status no mock e refletem de volta na lista (T5a) e no feed de
atividades (T3).
 
---
 
### Passo 7 — T6: Sugestões
**Entrega:** área de leitura da `main` com marcadores de trechos
sugeridos, painel de sugestão (visão Revisor: criar sugestão; visão
Gestor: aceitar/rejeitar), alternância de visão conforme o papel
simulado no mock.
 
**Critério de aceite:** trocar o papel simulado em `mock-data.js` muda
visivelmente quais ações aparecem habilitadas nesta tela (mapeamento de
`03-especificacao-telas.md`).
 
---
 
### Passo 8 — T7: Histórico
**Entrega:** filtro por branch/autor, linha do tempo visual (grafo
simplificado, não precisa ser um grafo Git matematicamente preciso —
só transmitir a ideia visualmente), lista de commits.
 
**Critério de aceite:** commits criados no Passo 5 aparecem aqui;
filtro por branch/autor funciona no client-side.
 
---
 
### Passo 9 — Revisão final
**Entrega:** nenhuma tela nova — apenas correções.
 
**Ação:** aplicar o checklist de `05-checklist-revisao.md` em todas as
telas. Corrigir qualquer link quebrado, componente duplicado/inconsistente,
ou estado vazio/erro não tratado.
 
**Critério de aceite:** protótipo navegável ponta a ponta (Login →
Dashboard → Hub → Editor/Merges/Sugestões/Histórico e volta) sem telas
soltas, com visual consistente em todas elas.
 
---
 
## Como usar este arquivo no prompt
 
```
Leia, nesta ordem: 01-contexto.md, 02-regras-design.md,
03-especificacao-telas.md, 04-sequencia.md.
 
Implemente apenas o Passo [N] descrito em 04-sequencia.md.
Pare ao final do passo e aguarde minha revisão antes de continuar.
```
 
