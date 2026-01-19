# Log de Desenvolvimento - Sistema de Calendário Automático

## Objetivo do Projeto

Criar um sistema 100% automático para sincronizar dados de um calendário editorial (lançamentos e campanhas) de uma planilha colaborativa para um site Next.js hospedado na Vercel, sem necessidade de intervenção manual no dia a dia.

## Requisitos Iniciais

1. **Zero etapas manuais** - time deve apenas editar planilha
2. **Colaboração simultânea** - múltiplos editores sem conflitos
3. **Sem privilégios de administrador** - solução deve funcionar sem acesso admin ao Windows
4. **Visibilidade rápida** - mudanças devem aparecer no site em poucos minutos
5. **Rastreamento de ~60 lançamentos/campanhas** - através de 7 operações (Ollie BR/MX/CO/CL/EU, Noma BR, Joomi BR)

## Evolução das Soluções Tentadas

### 1. Excel Local + Sincronização Automática (ABANDONADO)

**Tentativa:** Usar Windows Task Scheduler ou PowerShell em background para detectar mudanças no Excel local e fazer commit automático.

**Problemas encontrados:**
- Requer privilégios de administrador para Task Scheduler
- PowerShell em background não tinha permissões corretas para git
- Processos em background travavam ou não iniciavam corretamente
- Múltiplos editores causariam conflitos de arquivo (OneDrive sync)

**Scripts criados (não utilizados):**
- `install-task.ps1` - Instalação de tarefa agendada (requer admin)
- `uninstall-task.ps1` - Remoção de tarefa agendada
- `sync-excel-auto.ps1` - Monitoramento em background
- `start-sync.ps1` / `stop-sync.ps1` - Controle de sync
- `sync-watch.ps1` - Monitoramento em janela aberta (manual)
- `publicar.ps1` - Script manual de publicação

**Aprendizado:** Soluções locais com Excel são inadequadas para colaboração e automação sem privilégios administrativos.

---

### 2. Google Apps Script como API (ABANDONADO)

**Tentativa:** Usar Google Apps Script para criar endpoint público que o GitHub Actions pudesse consultar.

**Problema encontrado:**
```
Erro: "This app is blocked"
Mensagem: "This app is blocked by your organization's security settings"
```

Contas corporativas do Google Workspace bloqueiam execução de Apps Script de terceiros por questões de segurança.

**Aprendizado:** Apps Script não é confiável para contas corporativas com políticas de segurança restritas.

---

### 3. Google Sheets + GitHub Actions (SOLUÇÃO FINAL ✅)

**Arquitetura escolhida:**

```
Google Sheets (público, view-only)
         ↓
    CSV Export (público)
         ↓
GitHub Actions (cron a cada 5 min)
         ↓
Python script (pandas)
         ↓
JSON gerado (app/data.json)
         ↓
Git commit + push
         ↓
Vercel auto-deploy
         ↓
Site atualizado (https://ollie-calendar-view.vercel.app)
```

**Tempo total:** 5-7 minutos da edição até o site

---

## Implementação Detalhada

### Arquivos Criados

1. **fetch-from-sheets.py** - Script Python para baixar e converter dados
2. **.github/workflows/update-from-sheets.yml** - Workflow do GitHub Actions
3. **GOOGLE-SHEETS-SETUP.md** - Documentação de setup do Google Sheets
4. **README-SYNC.md** - Alternativas de sincronização (backup)

### Componentes Técnicos

#### 1. Script Python (fetch-from-sheets.py)

```python
# Extrai SHEET_ID e GID da URL completa do Google Sheets
# Suporta tanto URL completa quanto apenas ID
# Baixa CSV público
# Remove linhas vazias e coluna Owner
# Gera IDs automáticos baseados na data
# Salva como JSON para o Next.js consumir
```

**Features:**
- Extração de Sheet ID e GID via regex
- Limpeza de dados (dropna, fillna)
- Geração automática de IDs únicos por data
- Conversão de datetime para string (evita serialização JSON)
- Remoção da coluna "Owner" (privacidade)
- Validação de coluna "Esforço"

#### 2. GitHub Actions Workflow

```yaml
# Triggers:
# - Cron: */5 * * * * (a cada 5 minutos)
# - workflow_dispatch (manual via UI)

# Steps:
# 1. Checkout do repositório
# 2. Setup Python 3.10
# 3. Instalar pandas
# 4. Executar fetch-from-sheets.py
# 5. Verificar se há mudanças (git diff)
# 6. Commit e push (apenas se houver mudanças)
```

**Configuração de secrets necessária:**
- `GOOGLE_SHEETS_URL` - URL completa do Google Sheets
- `PAT_TOKEN` - Personal Access Token do GitHub (para push)

---

## Problemas Encontrados e Soluções

### Problema 1: HTTP 400 - Bad Request do Google Sheets

**Erro:**
```
HTTP Error 400: Bad Request
```

**Causa:**
Os dados estavam em uma aba específica do Google Sheets (gid=842080294), não na primeira aba (gid=0 padrão).

**Solução:**
Modificar o script para extrair o `gid` da URL completa usando regex:

```python
if 'docs.google.com' in SHEETS_URL:
    sheet_match = re.search(r'/d/([a-zA-Z0-9-_]+)', SHEETS_URL)
    gid_match = re.search(r'gid=([0-9]+)', SHEETS_URL)
    SHEET_ID = sheet_match.group(1) if sheet_match else ''
    GID = gid_match.group(1) if gid_match else '0'
```

**URL correta:**
```
https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=GID
```

---

### Problema 2: Git Push Rejected (remote ahead of local)

**Erro:**
```
! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/...'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
```

**Causa:**
GitHub Actions tentava fazer push sem ter as últimas mudanças do repositório remoto.

**Tentativa 1 (FALHOU):**
```yaml
- name: Commit and push
  run: |
    git pull --rebase
    git add app/data.json
    git commit -m "..."
    git push
```

**Erro resultante:**
```
error: cannot pull with rebase: You have unstaged changes.
error: Please commit or stash them.
```

**Tentativa 2 (FALHOU):**
```yaml
- name: Pull latest changes
  run: git pull --rebase origin main

# ... depois no commit:
- name: Commit and push
  run: |
    git add app/data.json
    git commit -m "..."
    git pull --rebase origin main
    git push
```

**Erro resultante:**
```
error: cannot pull with rebase: You have unstaged changes.
error: Please commit or stash them.
```

**Solução Final (FUNCIONA):**
```yaml
- name: Checkout repository
  uses: actions/checkout@v3
  with:
    token: ${{ secrets.PAT_TOKEN }}
    ref: main  # Sempre pega última versão

# ... depois no commit:
- name: Commit and push
  run: |
    git add app/data.json
    git commit -m "Auto-update: Calendar from Sheets [$(date +'%Y-%m-%d %H:%M')]"
    git push origin main  # Push direto, sem pull
```

**Por que funciona:**
- `actions/checkout@v3` com `ref: main` já pega a versão mais recente
- Como o workflow roda sozinho (não há commits concorrentes), não há risco de conflito
- Se houver conflito raro (dois workflows rodando simultaneamente), o segundo falhará e tentará novamente em 5 minutos

---

### Problema 3: Execuções Agendadas Falhando (scheduled runs)

**Sintoma:**
- Execuções manuais: ✅ Sucesso
- Execuções agendadas (cron): ❌ Falha

**Causa:**
Os `git pull --rebase` adicionados para resolver o Problema 2 estavam causando conflitos nas execuções automáticas.

**Solução:**
Remover todos os `git pull` e confiar no checkout com `ref: main` para ter sempre a versão atualizada.

---

## Configuração do Google Sheets

### Permissões Necessárias

1. **Compartilhamento público:**
   - "Anyone with the link" = **Viewer**
   - Isso permite que o GitHub Actions baixe o CSV sem autenticação

2. **Editores do time:**
   - Adicionar membros do time com permissão **Editor**
   - Todos podem editar simultaneamente
   - Google Sheets gerencia conflitos automaticamente

### Estrutura de Dados

**Colunas obrigatórias:**
- `Data` (YYYY-MM-DD) - Data do lançamento/campanha
- `Nome` - Nome do produto/campanha
- `Geografia` - Operação (Ollie BR, Ollie MX, Noma BR, etc.)
- `Tipo` - Lançamento, Campanha ou Nova Operação
- `Esforço` - P (pequeno), M (médio), G (grande)
- `Status` - 🟢 Live, 🟡 Em Dev, 🟡 Criativo, 🔴 Crítico, etc.
- `Notas` - Observações adicionais

**Coluna removida automaticamente:**
- `Owner` - Removida pelo script (privacidade)

**Coluna gerada automaticamente:**
- `ID` - Gerado como YYYYMMDD-NNN (ex: 20260115-001)

### Dropdowns Configurados

**Geografia:**
```
Ollie BR, Ollie MX, Ollie CO, Ollie EU, Ollie CL, Noma BR, Joomi BR, Ollie CB
```

**Tipo:**
```
Lançamento, Campanha, Nova Operação
```

**Esforço:**
```
P, M, G
```

**Status:**
```
🟢 Live, 🟡 Em Dev, 🟡 Criativo, 🔴 Crítico, 🔴 Atrasado, ⚪ Pausado, ⚪ Cancelado, ⏳ Backlog
```

---

## GitHub Actions: Boas Práticas Aprendidas

### 1. Uso de Tokens

**Problema:** Token padrão `GITHUB_TOKEN` tem permissões limitadas.

**Solução:** Criar Personal Access Token (PAT) com permissões de `repo`:
- Settings > Developer settings > Personal access tokens
- Adicionar como secret: `PAT_TOKEN`

### 2. Cron Schedule

**Escolha:** `*/5 * * * *` (a cada 5 minutos)

**Alternativas consideradas:**
- `*/15 * * * *` - A cada 15 minutos (muito lento)
- `* * * * *` - A cada 1 minuto (uso excessivo)

**Custo estimado:**
- 12 execuções/hora × 24 horas = 288 execuções/dia
- ~20 segundos por execução
- **~96 minutos/mês** (bem dentro dos 2.000 min gratuitos)

### 3. Conditional Steps

```yaml
- name: Check for changes
  id: check_changes
  run: |
    if git diff --quiet app/data.json; then
      echo "has_changes=false" >> $GITHUB_OUTPUT
    else
      echo "has_changes=true" >> $GITHUB_OUTPUT
    fi

- name: Commit and push
  if: steps.check_changes.outputs.has_changes == 'true'
  run: |
    # Só executa se houver mudanças
```

**Benefício:** Evita commits vazios e deploys desnecessários.

---

## Integração com Vercel

### Auto-Deploy

Vercel detecta automaticamente pushes para `main` e faz deploy:

1. GitHub Actions faz push → `main`
2. Vercel detecta mudança (~10 segundos)
3. Build Next.js (~1 minuto)
4. Deploy para produção (~30 segundos)

**Tempo total:** ~2 minutos do commit até o site atualizado

### Arquivo Atualizado

```
app/data.json
```

Next.js lê esse arquivo em build-time (Static Site Generation):

```typescript
// app/page.tsx ou similar
const data = await import('./data.json')
```

---

## Limitações Conhecidas

### 1. Delay de 5 minutos

**Causa:** Cron do GitHub Actions roda a cada 5 minutos.

**Alternativas não implementadas:**
- Webhook do Google Sheets (requer Apps Script - bloqueado)
- Cron de 1 minuto (uso excessivo)

**Impacto:** Aceitável para calendário editorial (não é tempo real crítico)

### 2. GitHub Actions pode ter delays

GitHub Actions **não garante** execução exata no cron schedule. Pode haver delays de 1-3 minutos durante alta carga do GitHub.

**Tempo real observado:** 5-10 minutos da edição até o site

### 3. Limite de 1000 linhas no Google Sheets

Script atual não pagina resultados. Se houver mais de 1000 eventos, será necessário implementar paginação.

**Limite atual:** ~60 eventos (bem dentro do limite)

---

## Testes Realizados

### Teste 1: Execução Manual ✅

```bash
# Via GitHub UI: Actions > Run workflow
Status: Sucesso
Tempo: ~21 segundos
Resultado: Commit criado, site atualizado
```

### Teste 2: Execução Agendada (após correções) ✅

```
Trigger: Cron (*/5 * * * *)
Status: Sucesso
Tempo: ~20 segundos
Resultado: Commit criado automaticamente
```

### Teste 3: Edição no Google Sheets ✅

```
Ação: Adicionada linha 34 (Lançamento Glow Facial - Ollie MX)
Aguardado: ~5 minutos
Resultado: Apareceu no site automaticamente
```

### Teste 4: Sem Mudanças ✅

```
Execução: Cron rodou sem mudanças no Sheets
Status: Sucesso (sem commit)
Log: "Sem mudanças" (skipped commit/push)
```

---

## Documentação de Referência Criada

1. **GOOGLE-SHEETS-SETUP.md**
   - Setup inicial do Google Sheets
   - Configuração de permissões
   - Extração de Sheet ID e GID
   - Configuração de secrets no GitHub
   - Instruções para dropdowns

2. **README-SYNC.md**
   - Alternativas de sincronização (não automáticas)
   - GitHub Desktop como fallback
   - Script manual de publicação

3. **DEVELOPMENT-LOG.md** (este arquivo)
   - Histórico completo do desenvolvimento
   - Problemas encontrados e soluções
   - Decisões de arquitetura

---

## Próximos Passos (Futuro)

### Melhorias Possíveis

1. **Notificações**
   - Slack notification quando deploy acontece
   - Email para responsáveis de eventos próximos

2. **Validação de Dados**
   - Verificar formato de datas
   - Validar valores de dropdowns
   - Alertar sobre campos obrigatórios vazios

3. **Histórico de Mudanças**
   - Log de quem editou o que (via Google Sheets API)
   - Diff visual no site

4. **Filtros e Busca**
   - Filtro por Geografia no site
   - Busca por nome de campanha
   - Visualização por mês/trimestre

5. **Webhook (se possível)**
   - Google Sheets → Apps Script → GitHub API
   - Deploy instantâneo (dependente de políticas corporativas)

---

## Comandos Úteis

### Testar Script Localmente

```bash
cd site_calendar/calendar-view-app
export SHEETS_URL="https://docs.google.com/spreadsheets/d/SHEET_ID/edit?gid=GID"
python fetch-from-sheets.py
cat app/data.json
```

### Forçar Execução Manual

```bash
# Via GitHub UI:
# https://github.com/brenolima-ollie/ollie-calendar-view/actions
# > Update Calendar from Google Sheets > Run workflow
```

### Ver Logs do GitHub Actions

```bash
# Via GitHub UI:
# https://github.com/brenolima-ollie/ollie-calendar-view/actions
# > Clicar na execução > Ver steps
```

### Verificar Últimos Commits

```bash
git log --oneline -10 | grep "Auto-update"
```

---

## Conclusões

### O Que Funcionou

✅ Google Sheets como fonte de dados colaborativa
✅ GitHub Actions como orquestrador automático
✅ CSV export público (sem autenticação)
✅ Cron a cada 5 minutos (balanço entre velocidade e custo)
✅ Checkout direto do main (sem pull complexo)
✅ Conditional commits (evita commits vazios)

### O Que Não Funcionou

❌ Excel local com sincronização automática
❌ Windows Task Scheduler (requer admin)
❌ PowerShell em background (permissões)
❌ Google Apps Script (bloqueado por corporativo)
❌ Git pull com rebase em workflows automáticos

### Principais Aprendizados

1. **Simplicidade vence complexidade** - Solução final é mais simples que as tentativas iniciais
2. **Git pull nem sempre é necessário** - Checkout com ref: main já garante versão atualizada
3. **Corporate policies importam** - Apps Script e admin access bloqueados mudaram o rumo
4. **Colaboração > Controle local** - Google Sheets resolve conflitos melhor que Excel local
5. **GitHub Actions é confiável** - Mesmo com delays ocasionais, é mais confiável que soluções locais

### Métricas Finais

- **Tempo de desenvolvimento:** ~4 horas (incluindo debugging)
- **Arquivos criados:** 4 scripts Python, 1 workflow YAML, 3 documentações
- **Commits:** ~15 commits de iteração
- **Tempo de sincronização:** 5-7 minutos (objetivo alcançado)
- **Custo mensal:** $0 (dentro dos limites gratuitos)
- **Intervenção manual necessária:** 0 (objetivo alcançado ✅)

---

## Contato e Manutenção

**Repositório:** https://github.com/brenolima-ollie/ollie-calendar-view
**Site:** https://ollie-calendar-view.vercel.app
**Google Sheets:** [Link interno - ver GOOGLE_SHEETS_URL secret]

**Manutenção necessária:**
- Nenhuma (sistema autônomo)
- Monitorar execuções falhadas ocasionalmente
- Atualizar dependências (pandas) anualmente

**Troubleshooting:**
1. Se workflow parar de rodar: verificar se está desabilitado no GitHub
2. Se site não atualizar: verificar logs do GitHub Actions
3. Se Google Sheets não carregar: verificar permissões públicas

---

**Documento criado em:** 2026-01-18
**Última atualização:** 2026-01-18
**Versão:** 1.0
