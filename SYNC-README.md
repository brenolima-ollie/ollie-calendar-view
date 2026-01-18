# Sincronização Automática do Calendar View

## Como Funciona

O sistema de sincronização automática monitora mudanças no arquivo Excel e publica automaticamente no site, sem nenhuma etapa manual.

**Fluxo completo:**
1. Você edita o Excel: `lancamentos_campanhas_2026.xlsx`
2. Sincronizador detecta mudanças (verifica a cada 60 segundos)
3. Faz commit e push para GitHub automaticamente
4. GitHub Actions converte para JSON (roda a cada 15 minutos)
5. Vercel detecta mudanças e faz deploy (~2-3 minutos)

**Tempo total:** ~15-20 minutos do momento que você salva o Excel até estar no ar

## Comandos

### Iniciar Sincronização Automática
```powershell
.\start-sync.ps1
```

O sincronizador roda em background (janela oculta) e continua monitorando mesmo se você fechar o PowerShell.

### Ver Status
```powershell
.\status-sync.ps1
```

Mostra se o sincronizador está rodando, quanto tempo está ativo, uso de memória, etc.

### Parar Sincronização
```powershell
.\stop-sync.ps1
```

Para o sincronizador em background.

## Uso Recomendado

1. **Iniciar uma vez** quando ligar o computador:
   ```powershell
   cd "c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar\calendar-view-app"
   .\start-sync.ps1
   ```

2. **Editar o Excel normalmente** durante o dia

3. **Parar antes de desligar** o computador (opcional):
   ```powershell
   .\stop-sync.ps1
   ```

## O que o Sincronizador Faz

- Monitora o arquivo Excel a cada 60 segundos
- Calcula hash MD5 do arquivo para detectar mudanças
- Quando detecta mudança:
  - Adiciona o arquivo ao git (`git add`)
  - Cria commit com timestamp (`git commit`)
  - Envia para GitHub (`git push`)
- Não interfere se você estiver editando o Excel (detecta arquivo bloqueado)

## Solução de Problemas

### "Processo não está rodando"
Execute novamente: `.\start-sync.ps1`

### "Mudanças não aparecem no site"
1. Verifique status: `.\status-sync.ps1`
2. Veja última execução do GitHub Actions: https://github.com/brenolima-ollie/ollie-calendar-view/actions
3. Veja status do Vercel: https://vercel.com/brenolima-ollies-projects/ollie-calendar-view

### "Excel está aberto mas não sincronizou"
- Normal! O sincronizador aguarda você fechar o Excel
- Ou aguarda 60 segundos após salvar para verificar novamente

## Arquivos

- `sync-excel-auto.ps1` - Script principal de monitoramento
- `start-sync.ps1` - Inicia em background
- `stop-sync.ps1` - Para o background
- `status-sync.ps1` - Verifica status
- `sync-pid.txt` - Arquivo temporário com Process ID (não fazer commit)

## Site ao Vivo

https://ollie-calendar-view.vercel.app
