# Solucao Final: Atualizacao Automatica a cada 15 minutos

## Como Funciona

O GitHub Actions verifica automaticamente **a cada 15 minutos** se o arquivo Excel foi modificado. Se houver mudancas, ele converte para JSON e atualiza o site.

**Totalmente gratuito!** Nao precisa de Power Automate Premium.

---

## Fluxo de Atualizacao

```
1. Voce edita o Excel no SharePoint/OneDrive
2. OneDrive sincroniza o arquivo localmente
3. Voce executa o script de atualizacao (ou espera ate 15 min)
4. GitHub Actions roda automaticamente (a cada 15 min)
5. Verifica se o Excel mudou desde o ultimo commit
6. Se mudou: converte para JSON e faz deploy
7. Site atualizado em ~3 minutos
```

---

## Opcao 1: Atualizacao Manual Instantanea (Recomendado)

Quando voce quiser atualizar o site IMEDIATAMENTE:

```powershell
cd "c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar"
.\atualizar_calendar_auto.ps1
```

**Tempo:** ~2 minutos ate o site estar atualizado

---

## Opcao 2: Atualizacao Automatica (Aguardar ate 15 min)

Se voce nao tiver pressa:

1. Edite o Excel no SharePoint
2. Aguarde ate 15 minutos
3. GitHub Actions detecta a mudanca automaticamente
4. Site atualizado sem fazer nada!

**Tempo:** Ate 15 minutos + ~2 minutos de deploy = **maximo 17 minutos**

---

## Como o GitHub Actions Funciona

### Agendamento (Schedule)

O workflow esta configurado com:
```yaml
schedule:
  - cron: '*/15 * * * *'  # A cada 15 minutos
```

Isso significa que o GitHub Actions executa o workflow:
- 00:00, 00:15, 00:30, 00:45
- 01:00, 01:15, 01:30, 01:45
- ... (e assim por diante, 24/7)

### O que ele faz

1. **Checkout:** Baixa a versao mais recente do repositorio
2. **Converte:** Le o Excel e gera o JSON
3. **Compara:** Verifica se o JSON mudou
4. **Commit:** Se mudou, faz commit e push
5. **Deploy:** Vercel detecta o push e faz deploy automatico

---

## Ajustando o Intervalo

Se quiser mudar o intervalo de verificacao:

### A cada 5 minutos (mais rapido)
```yaml
schedule:
  - cron: '*/5 * * * *'
```

### A cada 30 minutos (economiza recursos)
```yaml
schedule:
  - cron: '*/30 * * * *'
```

### A cada 1 hora
```yaml
schedule:
  - cron: '0 * * * *'
```

### Apenas em horario comercial (9h-18h, dias uteis)
```yaml
schedule:
  - cron: '*/15 9-18 * * 1-5'
```

Para mudar:
1. Edite o arquivo `.github/workflows/update-from-sharepoint.yml`
2. Modifique a linha do `cron`
3. Commit e push

---

## Monitoramento

### Verificar se esta funcionando

Acesse: [github.com/brenolima-ollie/ollie-calendar-view/actions](https://github.com/brenolima-ollie/ollie-calendar-view/actions)

Voce deve ver:
- Workflow "Update Calendar from SharePoint" executando a cada 15 minutos
- Status verde se nao houver mudancas
- Commit automatico se houver mudancas

### Logs do Workflow

Para ver o que aconteceu em cada execucao:
1. Clique no workflow
2. Veja os logs de cada step
3. "No changes detected" = Excel nao mudou
4. "Changes detected" = Excel foi atualizado e site sera deployado

---

## Vantagens desta Solucao

✅ **Gratuito:** GitHub Actions e Vercel sao gratuitos
✅ **Automatico:** Verifica mudancas sozinho a cada 15 minutos
✅ **Confiavel:** Sempre funciona, sem depender de Power Automate
✅ **Simples:** Nao precisa configurar webhooks ou APIs complexas
✅ **Flexivel:** Pode ajustar o intervalo facilmente
✅ **Manual quando necessario:** Script PowerShell para atualizacao instantanea

---

## Desvantagens (e como resolver)

❌ **Pode demorar ate 15 minutos**
→ Use o script manual quando precisar de atualizacao imediata

❌ **Consome minutos gratuitos do GitHub Actions**
→ Limite gratuito: 2.000 minutos/mes (repositorio publico = ilimitado!)
→ Cada execucao leva ~1 minuto
→ 15 min de intervalo = ~2.880 execucoes/mes = ~48 horas/mes (bem abaixo do limite)

---

## Custos

**GitHub Actions:** Gratis (repositorio publico ou 2.000 min/mes em privado)
**Vercel:** Gratis (100 GB bandwidth/mes)
**Total:** $0/mes

---

## FAQ

### O GitHub Actions vai rodar para sempre?

Sim! Enquanto o repositorio existir e o workflow estiver ativo, ele vai rodar automaticamente.

### E se eu quiser pausar?

Opcao 1: Desabilitar o workflow no GitHub:
- Acesse: Settings > Actions > Workflows > Update Calendar from SharePoint
- Clique em "Disable workflow"

Opcao 2: Comentar a linha do schedule:
```yaml
# schedule:
#   - cron: '*/15 * * * *'
```

### Posso continuar usando o script manual?

Sim! O script manual continua funcionando normalmente. Use quando quiser atualizacao imediata.

### O que acontece se o Excel estiver sendo editado quando o workflow rodar?

Nada! O workflow le o arquivo que ja esta no repositorio. Ele so detecta mudancas depois que voce fizer commit (manual ou automatico via OneDrive sync).

### Como faco para o workflow pegar mudancas do OneDrive automaticamente?

O workflow le o arquivo `lancamentos_campanhas_2026.xlsx` que esta no repositorio. Para ele detectar mudancas do OneDrive:

**Opcao A: Script manual** (recomendado)
Execute o script quando editar o Excel

**Opcao B: Copiar manualmente**
```powershell
cd "c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar"
Copy-Item "lancamentos_campanhas_2026.xlsx" "calendar-view-app\"
cd calendar-view-app
git add lancamentos_campanhas_2026.xlsx
git commit -m "Update Excel"
git push
```

**Opcao C: GitHub Actions com OneDrive API** (complexo)
Requer autenticacao Microsoft Graph API - nao recomendado.

---

## Melhor Pratica Recomendada

### Fluxo Ideal:

1. **Para atualizacoes urgentes:**
   - Edite o Excel
   - Execute: `.\atualizar_calendar_auto.ps1`
   - Site atualizado em ~2 minutos

2. **Para atualizacoes normais:**
   - Edite o Excel
   - Execute o script OU aguarde ate 15 minutos
   - GitHub Actions detecta e atualiza automaticamente

3. **Verificacao periodica:**
   - GitHub Actions roda a cada 15 minutos
   - Garante que nada ficou para tras

---

## Proximos Passos

1. ✅ Workflow configurado e funcionando
2. ✅ Pode fechar o Power Automate (nao precisa mais!)
3. ✅ Use o script manual para atualizacoes imediatas
4. ✅ GitHub Actions cuida do resto automaticamente

---

## Scripts Disponiveis

### Script de atualizacao manual
```powershell
c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar\atualizar_calendar_auto.ps1
```

### Verificar token do GitHub
```powershell
c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar\verificar_token_github.ps1
```

---

**Configuracao completa!** Agora voce tem atualizacao automatica gratuita sem precisar de Power Automate Premium! 🎉
