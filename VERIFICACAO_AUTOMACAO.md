# Verificação da Automação - Checklist

## Status Atual

Baseado na última mensagem: "mas o github tee atualizacao depois que ajustei no sharepoint, acho que funcionou"

## ✅ Componentes Instalados

- [x] Repositório GitHub criado: `brenolima-ollie/ollie-calendar-view`
- [x] Site deployado no Vercel: [ollie-calendar-view.vercel.app](https://ollie-calendar-view.vercel.app)
- [x] GitHub Actions workflow configurado: `.github/workflows/update-from-sharepoint.yml`
- [x] Power Automate Flow criado e ativo
- [x] Secrets configurados no GitHub (SHAREPOINT_FILE_URL, PAT_TOKEN)

## 🔍 Verificação Completa

Para confirmar que tudo está funcionando end-to-end:

### 1. Teste o Fluxo Completo

**Ação:** Edite o Excel no SharePoint
- Adicione uma linha de teste ou modifique uma data
- Salve o arquivo (Ctrl+S)

**Aguarde ~3 minutos**

### 2. Verifique Cada Etapa

#### A. Power Automate (30 segundos após salvar)

URL: [make.powerautomate.com](https://make.powerautomate.com)

1. Acesse "My flows"
2. Encontre seu flow: `Calendar View - SharePoint to GitHub`
3. Clique para ver detalhes
4. Vá em "Run history"
5. Verifique a execução mais recente:
   - ✅ Status deve ser "Succeeded"
   - ✅ Todas as etapas devem estar verdes
   - ✅ Verifique se o HTTP action executou (não pulou pela condição)

**Se a condição estiver pulando o HTTP:**
- A condição com `?{Name}` pode estar vazia
- Solução: Remover a condição ou usar campo diferente do SharePoint

#### B. GitHub Actions (1 minuto após Power Automate)

URL: [github.com/brenolima-ollie/ollie-calendar-view/actions](https://github.com/brenolima-ollie/ollie-calendar-view/actions)

1. Deve aparecer um workflow "Update Calendar from SharePoint"
2. Status: ✅ Verde (completed) ou 🟡 Amarelo (running)
3. Clique no workflow para ver detalhes:
   - Download Excel: ✅ Success
   - Convert to JSON: ✅ Success
   - Commit changes: ✅ Success (ou "No changes" se dados idênticos)

**Se nenhum workflow aparecer:**
- Power Automate não está disparando o GitHub
- Verifique os logs do HTTP action no Power Automate
- Confirme que o token tem permissões `repo` e `workflow`

#### C. Vercel Deploy (2-3 minutos após commit)

URL: [vercel.com/dashboard](https://vercel.com/dashboard)

1. Acesse o projeto `ollie-calendar-view`
2. Vá em "Deployments"
3. Deve aparecer um novo deployment "Building" ou "Ready"
4. Aguarde status "Ready" (Production)

**Se não aparecer deployment:**
- Vercel não detectou o push
- Verifique se o repositório está conectado ao Vercel
- Confirme que o commit foi feito no branch `main`

#### D. Site Atualizado (3-4 minutos após salvar Excel)

URL: [ollie-calendar-view.vercel.app](https://ollie-calendar-view.vercel.app)

1. Abra o site
2. Force refresh: Ctrl+Shift+R (ou Cmd+Shift+R no Mac)
3. Verifique se suas mudanças aparecem

---

## 🐛 Troubleshooting por Etapa

### Power Automate não executa
- [ ] Verificar que o arquivo correto está sendo monitorado
- [ ] Intervalo de verificação está em 1 minuto
- [ ] Flow está ativado ("Turned On")

### Condição no Power Automate pula o HTTP
- [ ] Remover a condição `contains(triggerOutputs()?['body/{Name}'], 'lancamentos')`
- [ ] HTTP action deve executar sempre que o arquivo for modificado

### GitHub Action não dispara
- [ ] Token está correto e não expirou
- [ ] Headers do HTTP no Power Automate:
  ```
  Accept: application/vnd.github.v3+json
  Authorization: Bearer [TOKEN]
  Content-Type: application/json
  ```
- [ ] URL está correta:
  ```
  https://api.github.com/repos/brenolima-ollie/ollie-calendar-view/dispatches
  ```
- [ ] Body do HTTP:
  ```json
  {
    "event_type": "sharepoint-update"
  }
  ```

### GitHub Action executa mas não commita
- [ ] Verificar logs do GitHub Action
- [ ] Pode não ter mudanças (Excel idêntico ao JSON atual)
- [ ] URL do SharePoint pode estar errado ou expirado

### Vercel não faz deploy
- [ ] Repositório conectado no Vercel dashboard
- [ ] Branch configurado é `main`
- [ ] Vercel tem permissões de leitura do repositório

### Site não atualiza
- [ ] Limpar cache do browser (Ctrl+Shift+R)
- [ ] Verificar se commit apareceu no GitHub
- [ ] Verificar se deployment apareceu no Vercel
- [ ] Aguardar até 5 minutos (às vezes demora)

---

## 📊 Timeline Esperado

```
00:00 → Salvar Excel no SharePoint
00:30 → Power Automate detecta mudança
00:35 → HTTP dispara GitHub Action
01:00 → GitHub baixa Excel, converte, commita
01:05 → Vercel detecta push
03:00 → Site atualizado e live
```

**Tempo total:** 3-4 minutos

---

## ✅ Confirmação Final

Para confirmar que está 100% funcionando:

1. [ ] Editei o Excel
2. [ ] Power Automate executou com sucesso
3. [ ] GitHub Action apareceu e completou
4. [ ] Vercel fez deployment
5. [ ] Site mostra minhas mudanças

---

## 📝 Próximos Passos (Se Algo Falhar)

### Se Power Automate não dispara GitHub:
1. Teste manual: Execute o workflow manualmente no GitHub Actions
2. Verifique os logs do HTTP no Power Automate
3. Recrie o GitHub token se necessário

### Se GitHub Action falha:
1. Verifique o link do SharePoint (pode ter expirado)
2. Teste baixar o Excel manualmente com `curl`
3. Verifique secrets no GitHub

### Se precisar de ajuda:
- Print dos logs de cada etapa
- Mensagens de erro específicas
- Hora exata que você salvou o Excel

---

## 🎯 Alternativa Simplificada (Se Automação Falhar)

Se a automação completa não funcionar de forma confiável, você pode usar o script manual:

```powershell
cd "c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar"
.\atualizar_calendar_auto.ps1
```

Isso atualiza o site em 2 minutos sem depender do Power Automate.

---

**Última atualização:** 2026-01-18
**Status:** Aguardando confirmação do usuário se automação está funcionando
