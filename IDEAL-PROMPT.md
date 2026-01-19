# Prompt Ideal para Desenvolvimento do Sistema de Calendário Automático

## Contexto

Este documento apresenta o **prompt ideal** que deveria ter sido usado no início do projeto para alcançar a solução final de forma mais direta, evitando as tentativas que falharam.

---

## O Prompt Ideal

```
Preciso criar um sistema 100% automático para sincronizar dados de um calendário editorial
para um site Next.js na Vercel. O calendário rastreia ~60 lançamentos e campanhas através
de 7 operações diferentes (Ollie BR/MX/CO/CL/EU, Noma BR, Joomi BR).

REQUISITOS CRÍTICOS:
- Zero intervenção manual no dia a dia (time só edita dados)
- Múltiplos editores simultâneos sem conflitos de arquivo
- Não tenho privilégios de administrador no Windows
- Mudanças devem aparecer no site em 5-10 minutos
- Trabalho em ambiente corporativo com restrições de segurança

CONTEXTO TÉCNICO:
- Site atual: Next.js 16 com App Router, hospedado na Vercel
- Time: 5-7 pessoas que precisam editar o calendário
- Ambiente: Windows corporate com OneDrive, sem acesso admin
- Conta Google corporativa com políticas de segurança

DADOS:
Estrutura de dados inclui:
- Data (YYYY-MM-DD)
- Nome (texto)
- Geografia (dropdown: Ollie BR, Ollie MX, Noma BR, etc.)
- Tipo (dropdown: Lançamento, Campanha, Nova Operação)
- Esforço (dropdown: P, M, G)
- Status (dropdown com emojis: 🟢 Live, 🟡 Em Dev, 🔴 Crítico, etc.)
- Notas (texto livre)

FLUXO DESEJADO:
1. Time edita planilha colaborativa
2. Sistema detecta mudanças automaticamente
3. Deploy automático para site
4. Tempo total: < 10 minutos

PERGUNTAS IMPORTANTES:

1. Qual a melhor fonte de dados colaborativa considerando:
   - Restrições corporativas
   - Múltiplos editores simultâneos
   - Sem necessidade de instalação local
   - Fácil de usar para não-técnicos

2. Como garantir sincronização automática SEM:
   - Privilégios de administrador no Windows
   - Processos locais rodando na minha máquina
   - Intervenção manual (commits, uploads, etc.)

3. Qual a arquitetura ideal considerando:
   - GitHub para versionamento (já existe)
   - Vercel para hosting (já configurado)
   - Necessidade de automação total
   - Restrições de segurança corporativa

4. Quais soluções EVITAR e por quê?

Por favor, sugira a arquitetura completa considerando todos esses requisitos e restrições.
Explique o fluxo de dados, ferramentas necessárias, e possíveis problemas que posso encontrar.
```

---

## Por Que Este Prompt Seria Ideal?

### 1. **Declara Restrições Críticas Logo no Início**

❌ **O que aconteceu:**
Começamos tentando soluções locais (Task Scheduler, PowerShell) sem mencionar falta de acesso admin.

✅ **O que o prompt ideal faz:**
Deixa claro desde o início: "Não tenho privilégios de administrador no Windows"

**Resultado:** Claude não sugeriria Task Scheduler ou outras soluções que requerem admin.

---

### 2. **Enfatiza "Zero Intervenção Manual"**

❌ **O que aconteceu:**
Muitas iterações sugeriram scripts que precisavam ser executados manualmente (publicar.ps1, GitHub Desktop com 2 cliques).

✅ **O que o prompt ideal faz:**
"Zero intervenção manual no dia a dia (time só edita dados)"

**Resultado:** Claude focaria em soluções serverless/cloud desde o início.

---

### 3. **Menciona Ambiente Corporativo com Restrições**

❌ **O que aconteceu:**
Tentamos Google Apps Script, que foi bloqueado pela conta corporativa.

✅ **O que o prompt ideal faz:**
"Trabalho em ambiente corporativo com restrições de segurança"
"Conta Google corporativa com políticas de segurança"

**Resultado:** Claude alertaria sobre Apps Script e sugeriria alternativas mais simples (CSV export público).

---

### 4. **Especifica Múltiplos Editores Simultâneos**

❌ **O que aconteceu:**
Começamos com Excel local no OneDrive, que causa conflitos.

✅ **O que o prompt ideal faz:**
"Múltiplos editores simultâneos sem conflitos de arquivo"

**Resultado:** Claude descartaria Excel local e sugeriria Google Sheets imediatamente.

---

### 5. **Inclui Contexto Técnico Existente**

❌ **O que aconteceu:**
Não mencionamos que Vercel já estava configurado e faz auto-deploy.

✅ **O que o prompt ideal faz:**
"Site atual: Next.js 16 com App Router, hospedado na Vercel"

**Resultado:** Claude aproveitaria a infraestrutura existente (Vercel auto-deploy do GitHub).

---

### 6. **Faz Perguntas Estratégicas**

❌ **O que aconteceu:**
Pedimos "como fazer sincronização automática" sem questionar qual fonte de dados usar.

✅ **O que o prompt ideal faz:**
Pergunta 1: "Qual a melhor fonte de dados colaborativa considerando restrições corporativas?"
Pergunta 4: "Quais soluções EVITAR e por quê?"

**Resultado:** Claude pensaria criticamente sobre trade-offs antes de sugerir implementação.

---

## Resposta Esperada do Claude (com o Prompt Ideal)

Com esse prompt ideal, a resposta esperada seria algo como:

```
Analisando seus requisitos e restrições, a melhor arquitetura é:

FONTE DE DADOS: Google Sheets
- ✅ Colaboração simultânea nativa
- ✅ Sem instalação local
- ✅ Familiar para não-técnicos
- ✅ Export CSV público (sem autenticação)
- ⚠️ Apps Script pode ser bloqueado, mas CSV export funciona

ORQUESTRAÇÃO: GitHub Actions
- ✅ Roda no servidor (não depende da sua máquina)
- ✅ Não requer admin ou instalação local
- ✅ Integração nativa com GitHub/Vercel
- ✅ Cron schedule para polling automático

ARQUITETURA:
Google Sheets (público, view-only)
    ↓
GitHub Actions (cron a cada 5 min)
    ↓
Python script baixa CSV
    ↓
Converte para JSON
    ↓
Commit automático se houver mudanças
    ↓
Vercel auto-deploy
    ↓
Site atualizado

SOLUÇÕES A EVITAR:

❌ Excel Local + Task Scheduler
   - Requer admin (você não tem)
   - Conflitos com múltiplos editores

❌ PowerShell em Background
   - Precisa rodar na sua máquina (não é robusto)
   - Problemas de permissões

❌ Google Apps Script
   - Pode ser bloqueado por contas corporativas
   - Complexidade desnecessária

❌ Webhook direto do Google Sheets
   - Requer Apps Script (bloqueado)
   - CSV export é mais simples

IMPLEMENTAÇÃO:

1. Configurar Google Sheets:
   - Compartilhar como "Anyone with link" = Viewer
   - Time tem acesso Editor via email

2. Criar script Python (fetch-from-sheets.py):
   - Extrair Sheet ID e GID da URL
   - Baixar CSV de: /d/{SHEET_ID}/export?format=csv&gid={GID}
   - Converter para JSON

3. Criar GitHub Actions workflow:
   - Cron: */5 * * * * (a cada 5 minutos)
   - Checkout → Run Python → Check diff → Commit se mudou

4. Configurar secrets no GitHub:
   - GOOGLE_SHEETS_URL (URL completa)
   - PAT_TOKEN (para push)

POSSÍVEIS PROBLEMAS:

⚠️ Se dados estiverem em aba não-padrão:
   - Extrair gid da URL (não usar gid=0 padrão)

⚠️ Git push rejeitado:
   - Usar checkout com ref: main (sempre pega versão atual)
   - Evitar git pull complexo

⚠️ Scheduled workflows podem ter delay:
   - GitHub não garante execução exata no horário
   - Delay de 1-3 minutos é normal

Tempo total: 5-7 minutos da edição até o site.
Custo: $0 (dentro dos limites gratuitos).
Intervenção manual: 0 (totalmente automático).
```

---

## Comparação: Realidade vs. Prompt Ideal

| Aspecto | O Que Aconteceu (Real) | Com Prompt Ideal |
|---------|------------------------|------------------|
| **Tempo de desenvolvimento** | ~4 horas | ~1-2 horas |
| **Tentativas falhadas** | 3 (Excel local, Apps Script, PowerShell) | 0 |
| **Commits de iteração** | ~15 commits | ~5 commits |
| **Scripts criados e descartados** | 12 PowerShell scripts | 0 |
| **Documentações obsoletas** | 10 arquivos .md | 0 |
| **Problemas de git push** | 3 tentativas até resolver | 1 (direto) |
| **Arquivos finais** | 36 → 14 (após limpeza) | 14 desde o início |

---

## Lições para Futuros Prompts

### 1. **Sempre Declarar Restrições Primeiro**

```
✅ BOM:
"Não tenho acesso admin"
"Ambiente corporativo com restrições"
"Múltiplos editores simultâneos"

❌ RUIM:
"Como faço sincronização automática?"
```

### 2. **Definir "Automático" Claramente**

```
✅ BOM:
"Zero intervenção manual no dia a dia"
"Sem processos rodando na minha máquina"

❌ RUIM:
"Quero algo automático"
```

### 3. **Incluir Contexto de Infraestrutura Existente**

```
✅ BOM:
"Vercel já configurado com auto-deploy do GitHub"
"Next.js 16 com App Router"

❌ RUIM:
"Tenho um site Next.js"
```

### 4. **Perguntar Sobre Trade-offs**

```
✅ BOM:
"Quais soluções EVITAR e por quê?"
"Quais problemas posso encontrar?"

❌ RUIM:
"Me dê a solução"
```

### 5. **Especificar Usuários e Skills**

```
✅ BOM:
"Time de 5-7 pessoas, não-técnicos"
"Precisam apenas editar planilha"

❌ RUIM:
"É para um time"
```

---

## Template Genérico para Projetos Similares

```markdown
# Contexto
[Descrição breve do projeto em 1-2 frases]

# Requisitos Críticos
- [Requisito 1 com ênfase no que NÃO pode acontecer]
- [Requisito 2 com restrições técnicas]
- [Requisito 3 com ambiente/contexto]

# Contexto Técnico
- Stack atual: [tecnologias já em uso]
- Infraestrutura: [serviços já configurados]
- Time: [quem vai usar, skills]
- Ambiente: [restrições de sistema/rede/segurança]

# Dados
[Estrutura de dados com tipos e validações]

# Fluxo Desejado
[Passo a passo do resultado final esperado]

# Perguntas Importantes
1. Qual a melhor [escolha técnica] considerando [restrições]?
2. Como garantir [requisito] SEM [restrições]?
3. Qual arquitetura ideal considerando [contexto]?
4. Quais soluções EVITAR e por quê?

# Pedido Final
Por favor, sugira a arquitetura completa considerando todos esses
requisitos e restrições. Explique o fluxo, ferramentas, e possíveis
problemas que posso encontrar.
```

---

## Conclusão

O prompt ideal teria nos economizado:

- ⏱️ **50% do tempo** de desenvolvimento
- 🗑️ **22 arquivos** que foram criados e depois deletados
- 🐛 **3 tentativas** de soluções que não funcionaram
- 💭 **Frustração** de descobrir restrições após implementar

**A diferença principal:** Declarar todas as restrições e contexto **antes** de pedir a solução,
e fazer perguntas estratégicas sobre trade-offs em vez de pedir diretamente uma implementação.

---

**Criado em:** 2026-01-19
**Baseado em:** DEVELOPMENT-LOG.md
**Propósito:** Referência para futuros projetos similares
