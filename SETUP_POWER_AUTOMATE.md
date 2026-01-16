# Setup Power Automate - Guia Completo

## Visão Geral

Sistema de atualização automática:
```
Excel no SharePoint modificado
        ↓
Power Automate detecta mudança (30s)
        ↓
Dispara GitHub Action via webhook
        ↓
GitHub baixa Excel, converte para JSON, faz commit
        ↓
Vercel detecta push e faz deploy (~2 min)
        ↓
Site atualizado automaticamente
```

**Tempo total:** ~3 minutos desde salvar o Excel até site atualizado

---

## Parte 1: Configurar GitHub (15 minutos)

### Passo 1: Criar GitHub Personal Access Token

1. Acesse [github.com/settings/tokens](https://github.com/settings/tokens)
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Nome: `Power Automate - Calendar Update`
4. Expiração: **No expiration** (ou 1 ano)
5. Selecione permissões:
   - ✅ `repo` (todas as opções)
   - ✅ `workflow`
6. Clique em **"Generate token"**
7. **COPIE O TOKEN** (aparece apenas uma vez!)
   - Exemplo: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Passo 2: Obter link público do Excel no SharePoint

1. Abra o Excel no SharePoint
2. Clique em **Compartilhar** (canto superior direito)
3. Clique em **"Copiar link"**
4. Escolha **"Qualquer pessoa com o link pode editar"** (ou visualizar)
5. **COPIE O LINK**
   - Exemplo: `https://ollie.sharepoint.com/:x:/s/team/...`

**Importante:** O link precisa ser acessível sem autenticação, OU você precisará usar Microsoft Graph API (mais complexo).

### Passo 3: Adicionar Secrets no GitHub

1. Acesse seu repositório: `github.com/brenolima-ollie/ollie-calendar-view`
2. Vá em **Settings > Secrets and variables > Actions**
3. Clique em **"New repository secret"**
4. Adicione dois secrets:

**Secret 1:**
- Name: `SHAREPOINT_FILE_URL`
- Value: (cole o link do SharePoint)

**Secret 2:**
- Name: `PAT_TOKEN`
- Value: (cole o Personal Access Token do Passo 1)

### Passo 4: Fazer commit do workflow

```powershell
cd "c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar\calendar-view-app"
git add .github/workflows/update-from-sharepoint.yml
git commit -m "Add GitHub Action for SharePoint auto-update"
git push
```

---

## Parte 2: Configurar Power Automate (20 minutos)

### Passo 1: Criar novo Flow

1. Acesse [make.powerautomate.com](https://make.powerautomate.com)
2. Clique em **"Create"** → **"Automated cloud flow"**
3. Nome do flow: `Calendar View - SharePoint to GitHub`
4. Trigger: Pesquise **"When a file is modified"** (SharePoint)
5. Clique em **"Create"**

### Passo 2: Configurar Trigger (SharePoint)

1. **Site Address:** Selecione seu site SharePoint da Ollie
2. **Library Name:** Documents (ou onde está o Excel)
3. **File Identifier:** Use o navegador de arquivos para selecionar `lancamentos_campanhas_2026.xlsx`
4. **Intervalo de verificação:** 1 minute (ou conforme preferência)

Clique em **"New step"**

### Passo 3: Adicionar Ação HTTP (GitHub API)

1. Pesquise por **"HTTP"** e selecione a ação **"HTTP"**
2. Configure os campos:

**Method:** `POST`

**URI:**
```
https://api.github.com/repos/brenolima-ollie/ollie-calendar-view/dispatches
```

**Headers:**
```json
{
  "Accept": "application/vnd.github.v3+json",
  "Authorization": "Bearer SEU_GITHUB_TOKEN_AQUI",
  "Content-Type": "application/json"
}
```
*(Substitua `SEU_GITHUB_TOKEN_AQUI` pelo token do Passo 1)*

**Body:**
```json
{
  "event_type": "sharepoint-update",
  "client_payload": {
    "file_name": "lancamentos_campanhas_2026.xlsx",
    "modified_by": "@{triggerOutputs()?['body/{Identifier}']}"
  }
}
```

### Passo 4: Adicionar Notificação (Opcional)

Adicione **"Send an email"** ou **"Post message in Teams"** para notificar quando o site for atualizado.

Exemplo Teams:
```
📅 Calendar View Atualizado

O site foi atualizado automaticamente com as últimas mudanças do Excel.

🔗 URL: https://ollie-calendar-view.vercel.app
⏱️ O deploy estará completo em ~2 minutos.
```

### Passo 5: Salvar e Testar

1. Clique em **"Save"** no canto superior direito
2. Teste editando o Excel no SharePoint
3. Aguarde ~30 segundos (intervalo do trigger)
4. Verifique se o GitHub Action foi disparado:
   - `github.com/brenolima-ollie/ollie-calendar-view/actions`
5. Aguarde ~2 minutos para deploy no Vercel

---

## Parte 3: Alternativa Simplificada (Se o link público não funcionar)

Se o SharePoint não permitir link público, use **Microsoft Graph API**:

### Adicionar ação antes do HTTP:

1. **Get file content** (SharePoint)
   - Site: Seu SharePoint
   - File: lancamentos_campanhas_2026.xlsx

2. **Create file** (OneDrive/Temp)
   - Salvar conteúdo temporariamente

3. **HTTP - Upload to GitHub**
   - Upload do arquivo via GitHub API
   - Endpoint: `/repos/.../contents/lancamentos_campanhas_2026.xlsx`

---

## Troubleshooting

### GitHub Action não dispara

**Verificar:**
1. Token tem permissões `repo` e `workflow`
2. URL do repositório está correta
3. Headers estão corretos (principalmente Authorization)

**Testar manualmente:**
```powershell
curl -X POST `
  -H "Accept: application/vnd.github.v3+json" `
  -H "Authorization: Bearer SEU_TOKEN" `
  -H "Content-Type: application/json" `
  https://api.github.com/repos/brenolima-ollie/ollie-calendar-view/dispatches `
  -d '{"event_type":"sharepoint-update"}'
```

### Excel não baixa do SharePoint

**Opções:**
1. Usar link de compartilhamento público
2. Usar Microsoft Graph API com autenticação
3. Adicionar step no Power Automate para fazer upload do arquivo para GitHub

### Deploy não acontece

**Verificar:**
1. GitHub Action executou com sucesso
2. Commit foi feito no branch `main`
3. Vercel está conectado ao repositório

---

## Monitoramento

### Ver execuções do Power Automate:
- [make.powerautomate.com](https://make.powerautomate.com) > My flows > Calendar View > Run history

### Ver execuções do GitHub Action:
- [github.com/brenolima-ollie/ollie-calendar-view/actions](https://github.com/brenolima-ollie/ollie-calendar-view/actions)

### Ver deploys do Vercel:
- [vercel.com/dashboard](https://vercel.com/dashboard) > ollie-calendar-view > Deployments

---

## Custos

- **Power Automate:** Grátis (até 5,000 execuções/mês no plano gratuito)
- **GitHub Actions:** Grátis (2,000 minutos/mês em repositórios públicos; 500 minutos em privados)
- **Vercel:** Grátis (100 GB bandwidth/mês)

**Total:** $0/mês para uso normal

---

## Próximos Passos

1. ✅ Criar GitHub Token
2. ✅ Obter link do SharePoint
3. ✅ Adicionar secrets no GitHub
4. ✅ Commit do workflow
5. ⬜ Criar Power Automate Flow
6. ⬜ Testar com edição no Excel
7. ⬜ Configurar notificações (opcional)

---

## Desabilitar Temporariamente

Para pausar a automação sem deletar:

**Power Automate:**
- My flows > Calendar View > Turn off

**GitHub Actions:**
- Mova o arquivo `.yml` para fora da pasta `workflows/`

---

Precisa de ajuda em algum passo específico?
