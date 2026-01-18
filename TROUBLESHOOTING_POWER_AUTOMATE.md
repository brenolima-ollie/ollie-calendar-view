# Troubleshooting: Power Automate → GitHub Actions

## Problema Atual

**Sintoma:** Power Automate executa com sucesso, mas GitHub Actions nunca dispara (0 workflow runs)

**Tempo:** Power Automate demora mais de 10 minutos sem completar

---

## ✅ Verificações Rápidas

### 1. Verificar GitHub Actions manualmente

Acesse: [github.com/brenolima-ollie/ollie-calendar-view/actions](https://github.com/brenolima-ollie/ollie-calendar-view/actions)

- Se aparecer "0 workflow runs" → O HTTP do Power Automate não está funcionando
- Se aparecer workflows mas com erro → O workflow está sendo disparado mas falhando

### 2. Verificar logs do Power Automate

No Power Automate:
1. Clique no seu flow
2. Vá em "Run history"
3. Clique na execução mais recente
4. Clique no step "Enviar uma solicitação HTTP ao SharePoint" (HTTP action)
5. Expanda "Show raw outputs"

**O que procurar:**
- Status code: Deve ser `204` (sucesso) ou `200`
- Se for `401` → Token inválido ou expirado
- Se for `404` → URL incorreta
- Se for `403` → Token sem permissões

---

## 🔧 Solução 1: Corrigir URL do GitHub API

A URL do Power Automate deve ser **exatamente**:

```
https://api.github.com/repos/brenolima-ollie/ollie-calendar-view/dispatches
```

**ATENÇÃO:** Note que é `/dispatches` (sem nada depois)

❌ **Errado:**
- `https://api.github.com/repos/brenolima-ollie/ollie-calendar-view/actions/workflows/update-from-sharepoint.yml/dispatches`
- `https://github.com/brenolima-ollie/ollie-calendar-view/dispatches`

✅ **Certo:**
- `https://api.github.com/repos/brenolima-ollie/ollie-calendar-view/dispatches`

---

## 🔧 Solução 2: Verificar Headers do HTTP

Os headers devem ser **exatamente**:

```json
{
  "Accept": "application/vnd.github.v3+json",
  "Authorization": "Bearer SEU_GITHUB_TOKEN_AQUI",
  "Content-Type": "application/json"
}
```

**Pontos críticos:**
- `Bearer` (com B maiúsculo e espaço depois)
- Token começa com `ghp_` ou `github_pat_`
- Sem aspas extras ao redor do token

---

## 🔧 Solução 3: Verificar Body do HTTP

O body deve ser **exatamente**:

```json
{
  "event_type": "sharepoint-update"
}
```

**Pontos críticos:**
- `event_type` (com underscore, não hífen)
- Valor `sharepoint-update` (com hífen, não underscore)
- O nome deve corresponder ao workflow: `types: [sharepoint-update]`

---

## 🔧 Solução 4: Verificar Token do GitHub

### Criar novo token (se o atual não funcionar):

1. Acesse: [github.com/settings/tokens](https://github.com/settings/tokens)
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Nome: `Power Automate - Calendar Update`
4. Expiração: **No expiration** (ou 1 ano)
5. Permissões obrigatórias:
   - ✅ `repo` (Full control of private repositories)
     - Marque a caixa principal "repo" - todas as sub-opções serão marcadas
   - ✅ `workflow` (Update GitHub Action workflows)
6. Clique em **"Generate token"**
7. **COPIE O TOKEN** (aparece apenas uma vez!)

### Atualizar token no Power Automate:

1. Edite o flow
2. Clique no HTTP action
3. Em "Headers", atualize o valor de `Authorization`:
   ```
   Bearer SEU_NOVO_TOKEN_AQUI
   ```
4. Salve o flow

---

## 🔧 Solução 5: Simplificar o Flow (Remover Condição)

A condição pode estar causando problemas. Vamos removê-la:

### Passos:

1. Edite o flow no Power Automate
2. Clique no ícone `...` (três pontos) da **Condição**
3. Clique em **"Delete"**
4. Conecte o trigger "Quando um item é criado ou modificado" diretamente ao HTTP action
5. Salve o flow

**Resultado:** Toda vez que o arquivo for modificado, o HTTP será enviado diretamente para o GitHub

---

## 🔧 Solução 6: Adicionar Notificação de Debug

Para ver o que está acontecendo, adicione um email de notificação:

### Passos:

1. Após o HTTP action, clique em **"New step"**
2. Pesquise por **"Send an email"** (Outlook ou Gmail)
3. Configure:
   - Para: seu email
   - Assunto: `Power Automate - Debug`
   - Corpo:
     ```
     Status: @{outputs('Enviar_uma_solicitação_HTTP_ao_SharePoint')['statusCode']}

     Response:
     @{outputs('Enviar_uma_solicitação_HTTP_ao_SharePoint')['body']}
     ```
4. Salve o flow

**Resultado:** Você receberá um email toda vez que o flow executar, mostrando o status do HTTP

---

## 🔧 Solução 7: Teste Manual (Mais Confiável)

Se o Power Automate continuar não funcionando, use o método manual:

### Criar script de atualização local:

O script `atualizar_calendar_auto.ps1` já existe na pasta `site_calendar`.

### Como usar:

1. Edite o Excel no SharePoint normalmente
2. Quando quiser atualizar o site, execute:
   ```powershell
   cd "c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar"
   .\atualizar_calendar_auto.ps1
   ```
3. Aguarde ~2 minutos
4. Site atualizado!

**Vantagem:** Funciona 100% das vezes, sem depender do Power Automate

---

## 🧪 Teste de Conectividade

Para confirmar que seu token e URL estão corretos, teste manualmente:

### PowerShell (no seu computador):

```powershell
$token = "SEU_GITHUB_TOKEN_AQUI"
$headers = @{
    "Accept" = "application/vnd.github.v3+json"
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
$body = @{
    "event_type" = "sharepoint-update"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.github.com/repos/brenolima-ollie/ollie-calendar-view/dispatches" -Method Post -Headers $headers -Body $body
```

**Resultado esperado:**
- Se funcionar: Nenhuma mensagem (sucesso silencioso)
- Se falhar: Mensagem de erro mostrando o problema

Depois, verifique se o GitHub Action foi disparado:
- [github.com/brenolima-ollie/ollie-calendar-view/actions](https://github.com/brenolima-ollie/ollie-calendar-view/actions)

---

## 📊 Checklist de Debugging

Marque cada item conforme verificar:

- [ ] URL é `https://api.github.com/repos/brenolima-ollie/ollie-calendar-view/dispatches`
- [ ] Headers têm `Accept`, `Authorization`, `Content-Type`
- [ ] Authorization usa `Bearer TOKEN` (com espaço)
- [ ] Body tem `{"event_type": "sharepoint-update"}`
- [ ] Token foi criado com permissões `repo` e `workflow`
- [ ] Token não expirou
- [ ] Condição foi removida (ou HTTP está no branch correto)
- [ ] Teste manual com PowerShell funcionou
- [ ] GitHub Actions mostra pelo menos 1 workflow run

---

## 🎯 Próximo Passo Recomendado

**Se você quer resolver agora mesmo:**

Use o método manual:
```powershell
cd "c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar"
.\atualizar_calendar_auto.ps1
```

**Se você quer continuar tentando a automação:**

1. Faça o teste de conectividade com PowerShell (acima)
2. Se funcionar, copie exatamente os mesmos valores para o Power Automate
3. Remova a condição do flow
4. Adicione o email de debug
5. Teste novamente

---

## 💡 Alternativa: GitHub Actions Scheduled

Se o Power Automate continuar não funcionando, podemos configurar o GitHub Actions para rodar automaticamente a cada X minutos:

```yaml
on:
  schedule:
    - cron: '*/15 * * * *'  # A cada 15 minutos
  workflow_dispatch:
  repository_dispatch:
    types: [sharepoint-update]
```

**Vantagem:** Atualização automática sem depender do Power Automate

**Desvantagem:** Pode ter atraso de até 15 minutos (ou o intervalo que você escolher)

---

Quer que eu te ajude com alguma dessas soluções específicas?
