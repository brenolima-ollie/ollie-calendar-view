# Passos para Deploy - Execute no PowerShell

## Passo 1: Converter dados do Excel (Opcional)

Se quiser usar os dados reais do Excel:

```powershell
cd "c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar"
python converter_para_json.py
```

Se não funcionar, pule este passo (os dados de exemplo já estão no projeto).

---

## Passo 2: Inicializar Git

```powershell
cd "c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar\calendar-view-app"
git init
```

---

## Passo 3: Adicionar arquivos ao Git

```powershell
git add .
```

---

## Passo 4: Fazer primeiro commit

```powershell
git commit -m "Initial commit: Ollie Calendar View app"
```

Se pedir configuração de email/nome:

```powershell
git config user.email "breno.lima@ollie.com.br"
git config user.name "Breno Lima"
```

Depois repita o commit:

```powershell
git commit -m "Initial commit: Ollie Calendar View app"
```

---

## Passo 5: Criar repositório no GitHub

1. Abra [github.com/new](https://github.com/new)
2. Nome do repositório: `ollie-calendar-view`
3. Descrição: `Sistema de visualização de calendário - Ollie Growth & Tech`
4. **Privado** ou **Público** (escolha conforme preferência)
5. **NÃO** marque "Add README" (já temos)
6. Clique em **"Create repository"**

Após criar, copie a URL que aparece (algo como: `https://github.com/seu-usuario/ollie-calendar-view.git`)

---

## Passo 6: Conectar repositório local ao GitHub

Substitua `SEU-USUARIO` pela sua conta GitHub:

```powershell
git remote add origin https://github.com/SEU-USUARIO/ollie-calendar-view.git
git branch -M main
```

---

## Passo 7: Fazer push para GitHub

```powershell
git push -u origin main
```

Se pedir autenticação, use seu token do GitHub (não senha).

---

## Passo 8: Deploy no Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Clique em **"Import Git Repository"**
3. Se não aparecer seu repositório, clique em **"Adjust GitHub App Permissions"** e autorize
4. Selecione `ollie-calendar-view`
5. Configure:
   - **Project Name:** `ollie-calendar-view`
   - **Framework Preset:** Next.js (detectado automaticamente)
   - **Root Directory:** `./` (deixe em branco)
   - **Build Command:** `npm run build` (já preenchido)
   - **Output Directory:** `out` (já preenchido)
6. Clique em **"Deploy"**

Aguarde ~2 minutos. Quando terminar, você receberá a URL:

`https://ollie-calendar-view.vercel.app`

---

## Passo 9: Configurar domínio customizado (Opcional)

Se quiser usar um domínio próprio:

1. No dashboard do Vercel, vá em **Settings > Domains**
2. Adicione: `calendar.ollie.com.br` (ou outro)
3. Configure DNS conforme instruções

---

## Atualizar dados no futuro

Sempre que atualizar o Excel:

```powershell
# 1. Converter Excel
cd "c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar"
python converter_para_json.py

# 2. Commit e push
cd calendar-view-app
git add app/data.json
git commit -m "Update: novos lançamentos"
git push

# 3. Vercel faz deploy automático em ~2 minutos
```

---

## Troubleshooting

### Erro: "fatal: not a git repository"
Execute o Passo 2 primeiro.

### Erro: "Author identity unknown"
Configure email e nome (ver Passo 4).

### Erro: "Permission denied (publickey)"
Use HTTPS ao invés de SSH, ou configure SSH keys no GitHub.

### Erro: "Build failed" no Vercel
1. Verifique os logs no dashboard do Vercel
2. Teste o build localmente: `npm install` e `npm run build`

---

## Pronto!

Seu calendário está online em:
`https://ollie-calendar-view.vercel.app`

Todo push para `main` atualiza automaticamente o site.
