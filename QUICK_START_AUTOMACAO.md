# Quick Start - Automação Completa (30 minutos)

## ⚡ Setup Rápido

### 1️⃣ GitHub Token (5 min)

```
github.com/settings/tokens → Generate new token
├─ Nome: "Power Automate Calendar"
├─ Permissões: ✅ repo, ✅ workflow
└─ Copiar token: ghp_xxxxx...
```

### 2️⃣ Link do SharePoint (2 min)

```
Abrir Excel no SharePoint
├─ Clicar em "Compartilhar"
├─ Copiar link público
└─ Exemplo: https://ollie.sharepoint.com/:x:/s/...
```

### 3️⃣ GitHub Secrets (3 min)

```
github.com/brenolima-ollie/ollie-calendar-view/settings/secrets/actions
├─ New secret: SHAREPOINT_FILE_URL = (link do SharePoint)
└─ New secret: PAT_TOKEN = (GitHub token)
```

### 4️⃣ Power Automate Flow (15 min)

**A. Criar Flow**
```
make.powerautomate.com → Create → Automated cloud flow
└─ Trigger: "When a file is modified" (SharePoint)
```

**B. Configurar Trigger**
```
Site: [Seu SharePoint Ollie]
Library: Documents
File: lancamentos_campanhas_2026.xlsx
```

**C. Adicionar HTTP Action**
```
Method: POST
URI: https://api.github.com/repos/brenolima-ollie/ollie-calendar-view/dispatches

Headers:
{
  "Accept": "application/vnd.github.v3+json",
  "Authorization": "Bearer [SEU_GITHUB_TOKEN]",
  "Content-Type": "application/json"
}

Body:
{
  "event_type": "sharepoint-update"
}
```

**D. Salvar e Testar**
```
Save → Editar Excel → Aguardar 1 minuto → Verificar:
├─ Power Automate: Succeeded
├─ GitHub Actions: Workflow running
└─ Vercel: Deploying
```

---

## ✅ Como Testar

1. **Edite o Excel no SharePoint**
   - Adicione uma linha de teste
   - Salve (Ctrl+S)

2. **Aguarde 1 minuto**
   - Power Automate detecta mudança

3. **Verifique GitHub Action**
   - [github.com/brenolima-ollie/ollie-calendar-view/actions](https://github.com/brenolima-ollie/ollie-calendar-view/actions)
   - Deve aparecer workflow "Update Calendar from SharePoint"

4. **Aguarde 2 minutos**
   - Vercel faz deploy automático

5. **Acesse o site**
   - [ollie-calendar-view.vercel.app](https://ollie-calendar-view.vercel.app)
   - Veja a atualização

---

## 🔍 Monitoramento

| Ferramenta | URL | O que ver |
|------------|-----|-----------|
| **Power Automate** | [make.powerautomate.com](https://make.powerautomate.com) | Run history do flow |
| **GitHub Actions** | [github.com/.../actions](https://github.com/brenolima-ollie/ollie-calendar-view/actions) | Workflow executions |
| **Vercel** | [vercel.com/dashboard](https://vercel.com/dashboard) | Deployments |

---

## 🐛 Problemas Comuns

### Flow não dispara
- ✅ Verificar se arquivo está no caminho correto
- ✅ Verificar permissões do SharePoint
- ✅ Testar com intervalo de 1 minuto (não 30s)

### GitHub Action falha
- ✅ Token com permissões corretas
- ✅ Headers do HTTP corretos
- ✅ URL do repositório sem erros de digitação

### Site não atualiza
- ✅ Verificar se commit apareceu no GitHub
- ✅ Verificar se Vercel está conectado
- ✅ Limpar cache do navegador

---

## 📊 Fluxo Completo

```
Excel modificado (00:00)
    ↓
Power Automate detecta (00:30)
    ↓
Dispara GitHub Action (00:35)
    ↓
Download + Conversão + Commit (01:00)
    ↓
Vercel detecta push (01:05)
    ↓
Build + Deploy (02:30)
    ↓
Site atualizado (03:00)
```

**Tempo total:** ~3 minutos automáticos

---

## 🎯 Checklist Final

- [ ] GitHub Token criado
- [ ] Link SharePoint copiado
- [ ] Secrets adicionados no GitHub
- [ ] Power Automate Flow criado
- [ ] Trigger configurado (SharePoint file)
- [ ] HTTP action configurada (GitHub API)
- [ ] Flow salvo e ativado
- [ ] Teste realizado com sucesso
- [ ] Site atualizado automaticamente

---

## 🚀 Resultado Final

**Antes:**
1. Editar Excel
2. Rodar script Python manualmente
3. Fazer commit manual
4. Fazer push manual
5. Aguardar deploy

**Depois:**
1. Editar Excel no SharePoint
2. ✨ *Mágica acontece automaticamente*
3. Site atualizado em ~3 minutos

---

Dúvidas? Consulte [SETUP_POWER_AUTOMATE.md](SETUP_POWER_AUTOMATE.md) para guia detalhado.
