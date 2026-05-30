# Mesada em Pontos 🌟

Sistema de pontuação para mesada dos filhos — hospedado no GitHub Pages com banco de dados no Supabase.

---

## ⚡ Passo a passo completo

### ETAPA 1 — Criar o banco de dados no Supabase

1. Acesse **https://supabase.com** e clique em **Start for free**
2. Crie uma conta (pode usar o Google)
3. Clique em **New project**
   - Dê um nome: `mesada-pontos`
   - Crie uma senha forte (guarde em algum lugar)
   - Escolha a região: **South America (São Paulo)**
   - Clique em **Create new project** e aguarde ~2 minutos
4. No menu lateral, clique em **SQL Editor**
5. Clique em **New query**
6. Abra o arquivo `supabase-schema.sql` deste projeto, copie todo o conteúdo e cole no editor
7. Clique em **Run** (ou Ctrl+Enter) — deve aparecer "Success"

### ETAPA 2 — Pegar as credenciais do Supabase

1. No menu lateral, clique em **Project Settings** (ícone de engrenagem)
2. Clique em **API**
3. Copie os dois valores:
   - **Project URL** → algo como `https://xyzxyz.supabase.co`
   - **anon public** (em Project API keys) → chave longa começando com `eyJ...`

### ETAPA 3 — Configurar o projeto

1. Abra o arquivo `js/config.js`
2. Substitua os placeholders:
   ```js
   const SUPABASE_URL = 'COLE_SUA_URL_AQUI';   // → cole o Project URL
   const SUPABASE_KEY = 'COLE_SUA_ANON_KEY_AQUI'; // → cole a anon key
   ```
3. Salve o arquivo

### ETAPA 4 — Publicar no GitHub Pages

1. Acesse **https://github.com** e faça login
2. Clique em **New repository** (botão verde ou ícone +)
   - Nome: `mesada-pontos`
   - Marque **Public**
   - Clique em **Create repository**
3. Na página do repositório vazio, clique em **uploading an existing file**
4. Arraste todos os arquivos do projeto (incluindo as pastas `css/` e `js/`)
5. Clique em **Commit changes**
6. Vá em **Settings** (aba do repositório) → **Pages** (menu lateral)
7. Em **Source**, selecione **Deploy from a branch**
8. Em **Branch**, selecione **main** e a pasta **/ (root)**
9. Clique em **Save**
10. Aguarde ~2 minutos e acesse: `https://SEU_USUARIO.github.io/mesada-pontos`

---

## 🔐 PINs padrão

| Quem | PIN padrão |
|------|-----------|
| Pais | `1234` |
| Filha | `1111` |
| Filho | `2222` |

> Altere os PINs diretamente pelo painel dos pais após o primeiro acesso.

---

## 📱 Usar no celular

Acesse o site pelo celular e adicione à tela inicial:
- **iPhone**: Safari → compartilhar → "Adicionar à Tela de Início"
- **Android**: Chrome → menu ⋮ → "Adicionar à tela inicial"

Vai aparecer como um app, sem barra do navegador.

---

## 🛠 Dúvidas comuns

**O site carrega mas dá erro ao salvar eventos**
→ Verifique se copiou corretamente a URL e a anon key em `js/config.js`
→ Verifique se rodou o SQL no Supabase com sucesso

**Esqueci o PIN dos pais**
→ Acesse o Supabase → Table Editor → tabela `config` → edite o valor da linha `pins`

**Como resetar os pontos no início do mês?**
→ Os pontos são separados por mês automaticamente. No início de cada mês, tudo começa em zero sozinho.

**Como ver meses anteriores?**
→ No momento, o sistema mostra apenas o mês atual. Os dados históricos ficam salvos no banco para consulta futura via Supabase.
