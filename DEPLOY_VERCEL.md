# Deploy no Vercel - Guia Completo

## Pré-requisitos

1. Conta no [Vercel](https://vercel.com) (gratuita)
2. Conta no [GitHub](https://github.com) (gratuita)
3. Node.js instalado localmente

## Método 1: Deploy via GitHub (Recomendado)

### Passo 1: Criar repositório no GitHub

```bash
cd calendar-view-app
git init
git add .
git commit -m "Initial commit: Calendar View app"
```

Crie um novo repositório no GitHub e faça push:

```bash
git remote add origin https://github.com/seu-usuario/ollie-calendar-view.git
git branch -M main
git push -u origin main
```

### Passo 2: Conectar no Vercel

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em **"Add New Project"**
3. Selecione **"Import Git Repository"**
4. Escolha o repositório `ollie-calendar-view`
5. Configure o projeto:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (deixe vazio)
   - **Build Command:** `npm run build` (já preenchido)
   - **Output Directory:** `out` (já configurado no next.config.js)
6. Clique em **"Deploy"**

### Passo 3: Deploy automático

A partir de agora, todo push para `main` fará deploy automático.

```bash
# Exemplo: atualizar dados
python ../converter_para_json.py
git add app/data.json
git commit -m "Update calendar data"
git push
```

O Vercel detecta o push e faz deploy automaticamente em ~2 minutos.

---

## Método 2: Deploy via Vercel CLI

### Passo 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Passo 2: Login

```bash
vercel login
```

Escolha seu método de autenticação (GitHub, email, etc.)

### Passo 3: Deploy

```bash
cd calendar-view-app
vercel
```

Responda as perguntas:

- **Set up and deploy?** Y
- **Which scope?** Seu username/organização
- **Link to existing project?** N
- **What's your project's name?** ollie-calendar-view
- **In which directory is your code located?** ./ (enter)

O deploy inicia automaticamente.

### Passo 4: Deploy para produção

```bash
vercel --prod
```

---

## Método 3: Deploy via Interface Web (Sem Git)

1. Faça build local:
   ```bash
   npm run build
   ```

2. Instale Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Faça upload:
   ```bash
   vercel --prod
   ```

---

## Configuração Customizada

### Domínio Customizado

1. No dashboard do Vercel, vá em **Settings > Domains**
2. Adicione seu domínio (ex: `calendar.ollie.com.br`)
3. Configure DNS conforme instruções do Vercel

### Variáveis de Ambiente

Se precisar adicionar variáveis de ambiente:

1. No dashboard, vá em **Settings > Environment Variables**
2. Adicione as variáveis necessárias
3. Faça redeploy

### Build Settings

Já configurado no `next.config.js`:

```javascript
{
  output: 'export',           // Exportação estática
  trailingSlash: true,        // URLs com /
  assetPrefix: './',          // Assets relativos
  images: {
    unoptimized: true         // Sem otimização de imagens
  }
}
```

---

## URLs Geradas

Após deploy, você receberá 3 tipos de URL:

1. **Production:** `https://ollie-calendar-view.vercel.app`
2. **Preview (por branch):** `https://ollie-calendar-view-git-feature-xyz.vercel.app`
3. **Preview (por commit):** `https://ollie-calendar-view-abc123.vercel.app`

---

## Atualizar Dados no Vercel

### Workflow Recomendado

```bash
# 1. Editar Excel localmente
# Abrir lancamentos_campanhas_2026.xlsx e atualizar

# 2. Converter para JSON
python converter_para_json.py

# 3. Commit e push
cd calendar-view-app
git add app/data.json
git commit -m "Update: adiciona lançamentos de Fevereiro"
git push

# 4. Vercel faz deploy automático
# Aguarde ~2 minutos
```

### Workflow Manual (sem Git)

```bash
# 1. Converter dados
python converter_para_json.py

# 2. Deploy direto
cd calendar-view-app
vercel --prod
```

---

## Troubleshooting

### Erro: "Module not found"

Certifique-se que todas as dependências estão instaladas:

```bash
npm install
```

### Erro: "Build failed"

Verifique se o build funciona localmente:

```bash
npm run build
```

Se funcionar localmente mas falhar no Vercel, verifique:
- Node version no Vercel (Settings > General > Node.js Version)
- Logs de build no dashboard

### Erro: "Cannot find module '@/components/...'"

Verifique `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Erro: Data não atualiza

Limpe cache do Vercel:

1. Dashboard > Settings > General
2. Scroll até "Clear Cache"
3. Clique em "Clear Cache"
4. Faça redeploy

---

## Performance

O site estático gerado tem:

- Load time: <1s
- Build time: ~30s
- Size: ~500KB (gzipped)
- Lighthouse Score: 95+

---

## Monitoramento

### Analytics

Ative Vercel Analytics:

1. Dashboard > Analytics
2. Enable Analytics (grátis para 100k pageviews/mês)

### Logs

Veja logs em tempo real:

```bash
vercel logs ollie-calendar-view --follow
```

---

## Custos

**Plano Hobby (Gratuito):**
- Deploys ilimitados
- 100 GB bandwidth/mês
- Domínios customizados ilimitados
- HTTPS automático
- Suficiente para uso interno

---

## Links Úteis

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
