# LessonList

Plataforma web para famílias homeschoolers organizarem os estudos de cada filho.

**MVP (fase 1):**

- Conta da família com um perfil por aluno
- Painel "Hoje" com o que cada filho tem no dia
- Cronograma semanal editável (adicionar, editar e remover atividades), com cópia do cronograma de um filho para outro como modelo
- Impressão do cronograma semanal em A4 deitado, de um filho ou de todos
- Matérias e livros (lendo, quero ler, lido)
- Histórico escolar: notas, projetos, trabalhos e horas de voluntariado
- Botão "Enviar sugestão" para coletar feedback dentro do app

Feito com Next.js 16, Tailwind CSS 4 e Supabase (login e banco Postgres com Row Level Security: cada família só enxerga os próprios dados).

## Colocar no ar

### 1. Supabase (banco e login)

1. Crie uma conta em [supabase.com](https://supabase.com) e um projeto novo (plano grátis, região São Paulo).
2. No projeto, abra **SQL Editor**, cole o conteúdo de `supabase/migrations/20261019000000_mvp.sql` e clique em **Run**.
3. Em **Authentication > URL Configuration**, coloque o endereço do site (ex.: `https://lessonlist.vercel.app`) em **Site URL** e adicione `https://lessonlist.vercel.app/auth/confirm` em **Redirect URLs**.
4. Em **Project Settings > API**, copie a **Project URL** e a **Publishable key**.

> **E-mail de confirmação:** o servidor de e-mail grátis do Supabase só envia para os e-mails da equipe do projeto e no máximo 2 por hora. Com **Confirm email** ligado, o cadastro de qualquer outra pessoa falha com "Não conseguimos enviar o e-mail de confirmação". Enquanto o app estiver em teste, desligue **Confirm email** em **Authentication > Sign In / Providers > Email**. Para abrir a outras famílias, configure um SMTP próprio (ex.: Resend) em **Authentication > Emails > SMTP Settings** e ligue de novo.
>
> Os erros de login e cadastro aparecem nos logs da Vercel (**Logs**, filtrando por `auth:`).

### 2. Vercel (hospedagem)

1. Crie uma conta em [vercel.com](https://vercel.com) entrando com o GitHub.
2. **Add New > Project**, escolha o repositório `LessonList`.
3. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL do Supabase
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = Publishable key do Supabase
4. Clique em **Deploy**.

### Ler as sugestões

As sugestões enviadas pelo app ficam na tabela `feedback` do Supabase (**Table Editor > feedback**).

## Rodar no computador

Precisa de Node.js 20+ e, para o banco local, Docker.

```bash
npm install
npx supabase start          # sobe o Supabase local e aplica as migrações
cp .env.example .env.local  # preencha com a URL e a PUBLISHABLE_KEY que o comando acima mostrou
npm run dev                 # http://localhost:3000
```

## Estrutura

- `src/app/(auth)` — entrar e criar conta
- `src/app/(app)/painel` — painel "Hoje"
- `src/app/(app)/alunos/[id]` — cronograma, matérias e livros, histórico e perfil de cada aluno
- `src/app/actions` — Server Actions que gravam no Supabase
- `src/proxy.ts` — renova a sessão e protege as páginas da área logada
- `supabase/migrations` — tabelas e regras de acesso (RLS)
