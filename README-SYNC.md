# Sincronização Automática do Calendar (SEM ADMIN)

Sem acesso de administrador, a solução mais prática é usar **GitHub Desktop** com auto-commit.

## Opção 1: GitHub Desktop (RECOMENDADO - Mais Simples)

### Instalar GitHub Desktop
1. Baixe: https://desktop.github.com/
2. Instale (não precisa admin)
3. Faça login com sua conta GitHub
4. Abra o repositório: `File > Add Local Repository`
5. Selecione: `c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar\calendar-view-app`

### Configurar Auto-Commit
1. No GitHub Desktop, vá em: `File > Options > Git`
2. Configure seu nome e email
3. Sempre que editar o Excel:
   - GitHub Desktop detecta automaticamente
   - Você vê as mudanças
   - Clica em "Commit to main" (1 clique)
   - Clica em "Push origin" (1 clique)
   - **Total: 2 cliques = ~5 segundos**

### Fluxo do Time
1. Alguém edita Excel e salva
2. Abre GitHub Desktop (já aberto na barra)
3. Commit (1 clique)
4. Push (1 clique)
5. Aguarda ~15-20 min para aparecer no site

## Opção 2: VSCode com Auto-Commit Extension

1. Instale VSCode: https://code.visualstudio.com/
2. Abra a pasta do projeto
3. Instale extensão: "Git Auto Commit"
4. Configure para commit automático a cada mudança

## Opção 3: Script Manual (Mais Rápido)

Execute quando quiser publicar (5 segundos):

```powershell
cd "c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar\calendar-view-app"
git add lancamentos_campanhas_2026.xlsx
git commit -m "Update calendar"
git push
```

Ou use o atalho: `.\publicar.ps1` (já existe)

## Como Funciona o Fluxo Completo

```
Excel editado → GitHub → GitHub Actions (15min) → Vercel deploy (2min) → Site atualizado
```

**Tempo total: ~17-20 minutos**

## Monitorar Deploy

- GitHub Actions: https://github.com/brenolima-ollie/ollie-calendar-view/actions
- Site: https://ollie-calendar-view.vercel.app

## Solução Ideal (Requer Permissão)

Se conseguir permissão de admin, execute:
```powershell
.\install-task.ps1
```

Isso instala uma tarefa que roda automaticamente a cada 5 minutos (100% automático, sem intervenção).
