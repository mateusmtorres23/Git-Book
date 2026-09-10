# 05 — Checklist de Revisão

> Baseado nos critérios de avaliação do Checkpoint 1 (Proposta + Protótipo).
> Use este arquivo como gate final no Passo 9 de `04-sequencia.md`, e
> também como autocheck rápido depois de cada passo individual.
>
> Escala usada na correção: **0 = ausente/não · 1 = parcial/vago · 2 = sim/claro**

---

## Critério 1 — Escopo do projeto está definido

- [ ] O problema que o Gitbook resolve está claro em algum lugar visível
      do protótipo (ex: descrição na tela de login/cadastro, ou num
      texto introdutório)
- [ ] O usuário-alvo (Gestor / Escritor / Revisor) está identificável —
      não só na doc, mas refletido na interface (badges de papel visíveis)
- [ ] As funcionalidades principais (branches, commits, merge, sugestões,
      histórico) estão todas representadas em pelo menos uma tela

**Nota esperada: 2** — já que o escopo vem do README e da especificação
de telas, este critério deve estar resolvido antes mesmo de codar.

---

## Critério 2 — Protótipo cobre todas as telas essenciais

- [ ] T1 Autenticação (Login + Cadastro) implementada
- [ ] T2 Dashboard/Catálogo implementada
- [ ] T3 Hub da Obra implementada
- [ ] T4 Editor de Conteúdo implementada
- [ ] T5a Lista de Merge Requests implementada
- [ ] T5b Detalhe de Merge Request (com diff) implementada
- [ ] T6 Sugestões implementada (visão Revisor **e** visão Gestor)
- [ ] T7 Histórico implementada

Marque **parcial** se alguma tela existe só como placeholder vazio.
Marque **sim** só quando todas as 8 acima estão com conteúdo real do mock.

---

## Critério 3 — Protótipo é navegável (fluxo entre telas faz sentido)

- [ ] Login → navega para Dashboard (T2)
- [ ] Dashboard → "Acessar Livro" navega para o Hub (T3) do livro certo
- [ ] Hub → cada tab da subnavegação leva à tela correspondente (T4/T5/T6/T7)
- [ ] Editor → "Solicitar Merge" leva ao fluxo de Merge Request (T5)
- [ ] Lista de Merges → clicar num item abre o Detalhe (T5b) certo
- [ ] Aprovar/Rejeitar merge reflete de volta na lista e no feed do Hub
- [ ] Nenhuma tela é um "beco sem saída" (toda tela tem como voltar via
      Header ou subnavegação)
- [ ] Não existem telas soltas/inacessíveis por clique (só por URL manual)

Marque **parcial** se a navegação existe mas alguns retornos/atualizações
de estado (ex: aprovar merge não reflete na lista) não funcionam.

---

## Critério 4 — Consistência de componentes/padrão visual

- [ ] Header idêntico (mesmo componente) em todas as telas autenticadas
- [ ] Todos os botões primários usam a mesma classe/estilo (`.btn-primary`)
- [ ] Todos os botões secundários usam a mesma classe/estilo (`.btn-secondary`)
- [ ] Badges de papel usam sempre a mesma cor por papel em qualquer tela
      onde aparecem
- [ ] Badges de status (pendente/aprovado/rejeitado) usam sempre a mesma
      cor por status em qualquer tela onde aparecem
- [ ] Cards seguem o mesmo padrão de sombra/raio/padding em toda a aplicação
- [ ] Espaçamento entre elementos segue a escala de `--space-*`, sem
      valores "soltos" perceptíveis
- [ ] Nenhuma tela tem paleta de cor própria fora dos tokens definidos
      em `02-regras-design.md`

Marque **parcial** se a maioria das telas segue o padrão mas 1-2 destoam
visivelmente (ex: um botão com cor diferente, um card com sombra distinta).

---

## Passo a passo de uso

1. Depois de cada Passo de `04-sequencia.md`, rode a seção correspondente
   deste checklist (ex: depois do Passo 3, cheque os itens de T2 nos
   Critérios 2 e 3).
2. No Passo 9 (revisão final), rode o checklist **inteiro**, do início ao fim.
3. Qualquer item marcado como não concluído vira um prompt de correção
   pontual antes de considerar o protótipo pronto para entrega.

```
Prompt de correção-tipo:
"Revise [tela/componente específico] contra o item '[item do checklist]'
de 05-checklist-revisao.md. Corrija a inconsistência encontrada."
```
