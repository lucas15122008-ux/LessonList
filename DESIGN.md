# DESIGN.md · LessonList

> Brief de design vivo. Ordem de leitura: tokens no código (`src/app/globals.css`) → este arquivo.

## 1. Verdade do produto
- **Quem usa:** mães e pais que fazem homeschool com mais de um filho. De manhã no celular, para ver o dia; no computador, para montar a semana.
- **Para quê:** organizar a semana de cada filho, os livros e o histórico escolar num lugar só.
- **Restrições:** interface em pt-BR; manter "By Pegasus" discreto nos rodapés; o cronograma precisa imprimir bem em A4 deitado.
- **Sucesso:** landing → criar a conta da família. Painel → saber em segundos o que cada filho tem hoje.
- **Conteúdo real:** screenshots do próprio app em `public/landing/` (dados de exemplo: Clara e Theo). Sem depoimentos, logos ou números inventados.

## 2. Leitura de design e tipos de tela
Reading this as: site e app de organização para famílias homeschoolers, com linguagem de caderno/planner de papel, em Next.js 16 + Tailwind 4.

| Tela | Tipo | V | M | D |
|---|---|---|---|---|
| Landing (`/`) | persuade | 5 | 2 | 4 |
| Entrar/Cadastro | operate | 2 | 1 | 3 |
| App (painel, aluno, sugestão) | operate | 3 | 1 | 6 |
| Impressão (`/imprimir`) | read | 1 | 0 | 7 |

## 3. Direção visual e proibições
- Papel e tinta: fundo de papel neutro, tinta verde-escura, linhas tracejadas como pauta de caderno.
- Verde lousa é a única cor de ação. Amarelo marca-texto só marca "hoje".
- Títulos em serif de livro, texto em sans feita para leitura fácil.
- Screenshots reais do app, nunca mock de divs.
- Proibido: emoji como ícone, roxo/índigo, gradiente, glow, blur, cards com a mesma sombra em tudo, eyebrow acima do título.

## 4. Tokens de cor

```design-tokens
fonts: Literata, Atkinson Hyperlegible Next
colors: #f1f0ea, #fcfbf8, #1e2621, #eef3ef, #dce8df, #3f7a5f, #2c5a46, #21463a, #f2d65c, #2f6fa5, #c03a4e, #9c6b0c, #2f7a52, #b04a72, #8a5a3c, #3f7778, #6d7a2e
radii: 0, 6px, 8px, 9999px
```

| Token | Valor | Função |
|---|---|---|
| `--color-paper` | #f1f0ea | fundo da página |
| `--color-surface` | #fcfbf8 | cards e faixas |
| `--color-ink` | #1e2621 | texto |
| `--color-brand-600` | #2c5a46 | botão principal, aba ativa, foco |
| `--color-brand-700` | #21463a | hover e links |
| `--color-brand-50/100` | #eef3ef / #dce8df | fundo de seleção e anel de foco |
| `--color-marker` | #f2d65c | marca-texto do dia de hoje, só isso |
| Cores dos filhos/matérias | `COLORS` em `src/lib/labels.ts` | dados do usuário; todas com contraste ≥ 4.5:1 com texto branco |

Texto secundário usa a escala `stone` do Tailwind (stone-500 ou mais escuro).

## 5. Tipografia
- Títulos: Literata 600, `font-display`. Livro, leitura, escola.
- Texto e UI: Atkinson Hyperlegible Next, `font-sans`. Feita para leitura fácil (bom para crianças lendo a folha impressa também).
- Horários e números: `tabular-nums`.
- Escala: 12 / 14 / 16 / 18 / 24 / 30 / 36 / 48. Títulos com `text-balance`, parágrafos com `text-pretty`.

## 6. Espaço e layout
- Escala do Tailwind (4px). Conteúdo do app em `max-w-5xl`, landing em `max-w-6xl`.
- Landing alterna ritmos: hero em 2 colunas, faixa clara com lista em linhas, imagem + texto, faixa verde de fechamento.

## 7. Componentes
- Raio por função: controles e botões 6px (`rounded-md`), cards 8px (`rounded-lg`), chips e pontos `rounded-full`.
- Sem sombra. Separação por borda fina e fundo `surface`.
- `.btn` = ação principal (verde cheio). `.btn-ghost` = secundária. Ações destrutivas em texto vermelho, ou cinza que fica vermelho no hover quando se repetem muito (cronograma).
- Listas de atividades usam pauta tracejada (`divide-dashed`), sem faixa colorida lateral. A cor da matéria vira um ponto.

## 8. Movimento
Só `transition-colors` em hover. Nada anima sozinho.

## 9. Imagens e conteúdo
- Screenshots reais em `public/landing/`. Para regerar: rodar o app com dados de exemplo e capturar a semana (3 dias) a 1040px e a tela Hoje a 390px, 2x.
- Voz: direta, de mãe para mãe, sem jargão de startup.

## 10. Registro de decisões
- **2026-10-27 · Novo visual "caderno".** Trocamos índigo + Nunito + cards com emoji por papel/tinta verde, Literata + Atkinson Hyperlegible e screenshots reais. Motivo: o visual anterior era o template genérico de SaaS e não dizia nada sobre homeschool. Revisão feita com a skill antiwebslop.
