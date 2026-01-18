# Power Automate - Upload Direto para GitHub (Solucao Completa)

## Visao Geral

Em vez de fazer o GitHub Action baixar o Excel do SharePoint, o Power Automate vai:
1. Ler o conteudo do Excel do SharePoint
2. Converter para Base64
3. Fazer upload direto para o GitHub via API
4. Disparar o workflow para converter e fazer deploy

**Vantagem:** Funciona com SharePoint corporativo sem precisar de link publico!

---

## Passo 1: Deletar o Flow Antigo (Opcional)

Se quiser comecar do zero:
1. Acesse [make.powerautomate.com](https://make.powerautomate.com)
2. My flows > Seu flow antigo > Delete

Ou edite o flow existente (recomendado).

---

## Passo 2: Criar Novo Flow (ou Editar Existente)

### Trigger: Quando um arquivo e modificado

1. Acesse [make.powerautomate.com](https://make.powerautomate.com)
2. Edite seu flow existente ou crie novo: **Create > Automated cloud flow**
3. Nome: `Calendar View - Upload Direto para GitHub`
4. Trigger: **"When a file is modified"** (SharePoint)

**Configuracao do Trigger:**
- Site Address: https://olliemeu.sharepoint.com/sites/timeollie
- Library Name: Documentos Compartilhados
- File: Use o navegador para selecionar `lancamentos_campanhas_2026.xlsx`
- Intervalo: 1 minuto

---

## Passo 3: Adicionar Acao - Obter Conteudo do Arquivo

1. Clique em **"New step"**
2. Pesquise: **"Get file content"** (SharePoint)
3. Selecione: **"Get file content"**

**Configuracao:**
- Site Address: https://olliemeu.sharepoint.com/sites/timeollie
- File Identifier: Clique no campo e selecione **"Identifier"** do conteudo dinamico (do trigger)

---

## Passo 4: Adicionar Acao - Converter para Base64

1. Clique em **"New step"**
2. Pesquise: **"Compose"** (Data Operations)
3. Selecione: **"Compose"**

**Configuracao:**
- Inputs: Digite esta expressao (clique em "fx" para modo expressao):
  ```
  base64(body('Get_file_content'))
  ```

Renomeie esta acao para: `Converter para Base64`

---

## Passo 5: Adicionar Acao - Upload para GitHub

1. Clique em **"New step"**
2. Pesquise: **"HTTP"**
3. Selecione: **"HTTP"**

**Configuracao:**

**Method:** `PUT`

**URI:**
```
https://api.github.com/repos/brenolima-ollie/ollie-calendar-view/contents/lancamentos_campanhas_2026.xlsx
```

**Headers:** (clique em "Switch to input entire array")
```json
{
  "Accept": "application/vnd.github.v3+json",
  "Authorization": "Bearer SEU_GITHUB_TOKEN_AQUI",
  "Content-Type": "application/json"
}
```

**Body:**
Clique em "Switch to input entire array" e cole:
```json
{
  "message": "Auto-update: Excel from SharePoint",
  "content": "@{outputs('Converter_para_Base64')}",
  "branch": "main"
}
```

**IMPORTANTE:** No campo `"content"`, clique dentro das aspas e selecione **"Outputs"** da acao `Converter para Base64` no conteudo dinamico.

---

## Passo 6: Adicionar Acao - Disparar Workflow

1. Clique em **"New step"**
2. Pesquise: **"HTTP"**
3. Selecione: **"HTTP"**

**Configuracao:**

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

**Body:**
```json
{
  "event_type": "sharepoint-update"
}
```

---

## Passo 7: Adicionar Notificacao (Opcional)

1. Clique em **"New step"**
2. Pesquise: **"Send an email"** ou **"Post message in Teams"**

**Exemplo de mensagem:**
```
Calendar View Atualizado!

O Excel foi enviado para o GitHub e o site sera atualizado em ~3 minutos.

URL: https://ollie-calendar-view.vercel.app
```

---

## Passo 8: Salvar e Testar

1. Clique em **"Save"**
2. Edite o Excel no SharePoint (faca uma mudanca pequena)
3. Salve (Ctrl+S)
4. Aguarde ~1 minuto

**Verificar:**
1. Power Automate: Run history deve mostrar "Succeeded"
2. GitHub: [github.com/brenolima-ollie/ollie-calendar-view](https://github.com/brenolima-ollie/ollie-calendar-view)
   - Deve aparecer commit "Auto-update: Excel from SharePoint"
3. GitHub Actions: [/actions](https://github.com/brenolima-ollie/ollie-calendar-view/actions)
   - Workflow "Update Calendar from SharePoint" deve executar
4. Site: [ollie-calendar-view.vercel.app](https://ollie-calendar-view.vercel.app)
   - Atualizacao aparece em ~3 minutos

---

## Troubleshooting

### Erro: "Resource not found" no upload do GitHub

**Causa:** O arquivo ainda nao existe no repositorio.

**Solucao:** Fazer o primeiro upload manualmente:

```powershell
cd "c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar"
Copy-Item "lancamentos_campanhas_2026.xlsx" "calendar-view-app\lancamentos_campanhas_2026.xlsx"
cd calendar-view-app
git add lancamentos_campanhas_2026.xlsx
git commit -m "Add Excel file to repository"
git push
```

Depois disso, o Power Automate podera atualizar o arquivo.

### Erro: "sha is required" no upload do GitHub

**Causa:** Para atualizar um arquivo existente, o GitHub precisa do SHA do arquivo atual.

**Solucao:** Modificar o Body do HTTP para incluir o SHA:

1. Adicionar acao antes do upload: **"HTTP GET"**
   - URI: `https://api.github.com/repos/brenolima-ollie/ollie-calendar-view/contents/lancamentos_campanhas_2026.xlsx`
   - Headers: Mesmos do upload
2. Na acao de upload, modificar o Body:
   ```json
   {
     "message": "Auto-update: Excel from SharePoint",
     "content": "@{outputs('Converter_para_Base64')}",
     "sha": "@{body('Get_file_info')?['sha']}",
     "branch": "main"
   }
   ```

### Erro: "File content too large"

**Causa:** GitHub API tem limite de 1MB para arquivos via API.

**Solucao:** Se o Excel for maior que 1MB, use a alternativa:
- Power Automate faz upload para OneDrive/Temp
- GitHub Action baixa do OneDrive
- Requer autenticacao Microsoft Graph API (mais complexo)

---

## Fluxo Visual

```
Excel modificado no SharePoint
        |
        v
Power Automate detecta mudanca
        |
        v
Le conteudo do Excel
        |
        v
Converte para Base64
        |
        v
Upload para GitHub (PUT /contents/)
        |
        v
Dispara workflow (POST /dispatches)
        |
        v
GitHub Action converte Excel -> JSON
        |
        v
Vercel faz deploy
        |
        v
Site atualizado!
```

**Tempo total:** ~3 minutos

---

## Comparacao com Metodo Anterior

| Aspecto | Metodo Anterior | Metodo Novo |
|---------|-----------------|-------------|
| Download do Excel | GitHub Action baixa do SharePoint | Power Automate envia para GitHub |
| Link publico | Necessario | NAO necessario |
| Autenticacao | Problema com SharePoint corporativo | Power Automate ja esta autenticado |
| Complexidade | Media | Media |
| Confiabilidade | Baixa (link expira) | Alta (autenticacao OAuth) |

---

## Proximos Passos

1. Edite o flow no Power Automate
2. Adicione as acoes conforme este guia
3. Teste com uma mudanca no Excel
4. Verifique se o commit aparece no GitHub
5. Confirme se o site atualiza

Precisa de ajuda em algum passo especifico? Me avise!
