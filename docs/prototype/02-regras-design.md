# 02 — Regras de Design e Componentes
 
> Este documento define o sistema visual do protótipo. Toda tela criada
> DEVE reutilizar o que está aqui — nunca redefinir cor, espaçamento ou
> componente do zero. Isso é o que garante o critério de consistência
> da avaliação.
 
## Stack
 
HTML + CSS + JavaScript puro (vanilla). Sem frameworks, sem build tools,
sem dependências externas além de fontes/ícones via CDN se necessário.
 
## Estrutura de arquivos (fixa — não alterar)
 
```
/index.html              ← shell único (SPA)
/css/tokens.css           ← variáveis de design (cores, tipografia, espaçamento)
/css/components.css       ← estilos dos componentes reutilizáveis
/js/mock-data.js          ← dados fake
/js/router.js             ← hash routing (#/books, #/books/:id, ...)
/js/components/           ← 1 arquivo JS por componente reutilizável
/js/screens/              ← 1 arquivo JS por tela
```
 
## Tokens de design (`tokens.css`)
 
### Cores
 
- **Cor de marca / neutra**: usada em elementos estruturais (header, fundo,
  texto padrão, bordas). Definir uma escala de cinzas (`--color-bg`,
  `--color-surface`, `--color-border`, `--color-text`, `--color-text-muted`).
- **Cor por papel** (usada em badges, avatares, destaques de ação
  correspondentes a cada papel):
  - 👑 Gestor → tom de roxo/azul-escuro (autoridade)
  - ✍️ Escritor → tom de verde (criação/produção)
  - 🔎 Revisor → tom de âmbar/laranja (atenção/revisão)
- **Cores de estado** (usadas em badges de status, diffs, feedback):
  - Sucesso / aprovado / adicionado → verde
  - Erro / rejeitado / removido → vermelho
  - Pendente / aguardando → amarelo/âmbar
  - Neutro / informativo → azul
> Defina cada uma como variável CSS (`--color-role-gestor`,
> `--color-status-approved`, etc.) em vez de hex direto no HTML/CSS das telas.
 
### Tipografia
 
- Uma família de fonte para títulos, uma (ou a mesma) para corpo de texto.
- Escala de tamanho fixa: `--font-size-xs/sm/base/lg/xl/2xl` — não usar
  valores soltos em px nas telas.
### Espaçamento
 
- Escala de espaçamento em variável (`--space-1` a `--space-8`, por
  exemplo múltiplos de 4px) — usada em padding, margin e gap de todos
  os componentes.
### Outros tokens
 
- Raio de borda padrão (`--radius-sm/md/lg`)
- Sombra padrão para cards/modais (`--shadow-sm/md`)
## Componentes globais (`/js/components/` + `components.css`)
 
Estes são criados **uma vez** na Etapa/Passo 1 e reutilizados em todas as telas:
 
| Componente | Onde aparece | Regra |
|---|---|---|
| **Header/Nav superior** | Todas as telas autenticadas | Logo (link para `/books`) · indicador do livro ativo (só quando dentro de um livro) · avatar + nome + Badge de papel · dropdown (Perfil / Configurações / Sair) |
| **Badge de papel** | Header, cards de sugestão, listas de merge | Cor fixa por papel (ver tokens acima); mesmo componente em qualquer tela |
| **Badge de status** | Merge requests, sugestões | Cor por estado (pendente/aprovado/rejeitado); mesmo componente em qualquer tela |
| **Card genérico** | Dashboard, métricas, sugestões | Mesma sombra, raio de borda e padding em toda a aplicação |
| **Modal genérico** | Criar livro, formulário de sugestão, etc. | Mesmo overlay, animação de entrada, botão de fechar |
| **Botão primário** | Ação principal de cada tela (Salvar Commit, Aprovar, Criar Conta...) | Sempre mesma cor/estilo — só o texto muda |
| **Botão secundário** | Ação alternativa (Cancelar, Rejeitar, Esqueceu senha) | Sempre mesmo estilo — visualmente menos destacado que o primário |
 
**Regra de ouro:** se uma tela precisa de um botão, badge, card ou modal,
ela **importa/reusa** o componente existente. Só cria um componente novo
se genuinamente não existir equivalente ainda — e, nesse caso, ele deve
ser adicionado em `/js/components/` para as próximas telas também poderem usá-lo.
 
## Convenção de nomes de classe CSS
 
- Prefixo por tipo: `.btn`, `.btn-primary`, `.btn-secondary`, `.card`,
  `.badge`, `.badge-role-gestor`, `.badge-status-pending`, `.modal`.
- Evitar classes soltas por tela (ex: `.dashboard-button-azul`) — sempre
  compor a partir das classes de componente + modificador.
## Estados a sempre considerar em cada tela
 
- **Vazio** (ex: nenhum livro cadastrado, nenhuma sugestão pendente)
- **Carregando** (pode ser um placeholder simples, já que é mock)
- **Erro simples de formulário** (campo obrigatório vazio, senha não confere)
## Checklist de consistência (usar antes de aprovar qualquer tela)
 
- [ ] Usa o Header global sem recriar HTML/CSS próprio
- [ ] Cores vêm de `tokens.css`, nenhum hex direto no HTML/CSS da tela
- [ ] Botões usam `.btn-primary` / `.btn-secondary`, não estilo inline
- [ ] Badges de papel e status usam os componentes definidos aqui
- [ ] Espaçamento segue a escala de `--space-*`, sem valores soltos
- [ ] Todo link/botão de navegação leva a uma rota real do `router.js`
 
