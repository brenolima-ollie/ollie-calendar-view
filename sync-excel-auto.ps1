# Script PowerShell para sincronizar automaticamente o Excel com o GitHub
# Monitora mudanças no arquivo Excel e faz commit/push automaticamente

# Configurações
$excelPath = "c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar\calendar-view-app\lancamentos_campanhas_2026.xlsx"
$repoPath = "c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar\calendar-view-app"
$checkInterval = 60  # Verificar a cada 60 segundos

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  SINCRONIZADOR AUTOMÁTICO - Calendar View Excel → GitHub" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Monitorando: $excelPath" -ForegroundColor Yellow
Write-Host "Intervalo de verificação: $checkInterval segundos" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pressione Ctrl+C para parar o monitoramento" -ForegroundColor Gray
Write-Host ""

# Guardar o último hash do arquivo
$lastHash = ""

function Get-FileHashSafe {
    param($Path)
    try {
        if (Test-Path $Path) {
            $hash = (Get-FileHash $Path -Algorithm MD5).Hash
            return $hash
        }
    } catch {
        return $null
    }
    return $null
}

function Sync-ExcelToGitHub {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Mudanças detectadas! Sincronizando..." -ForegroundColor Green

    try {
        # Ir para o diretório do repositório
        Set-Location $repoPath

        # Verificar se há mudanças no git
        $gitStatus = git status --porcelain lancamentos_campanhas_2026.xlsx

        if ($gitStatus) {
            Write-Host "  → Adicionando arquivo ao git..." -ForegroundColor Gray
            git add lancamentos_campanhas_2026.xlsx

            Write-Host "  → Fazendo commit..." -ForegroundColor Gray
            $commitMsg = "Auto-update: Excel calendar data [$(Get-Date -Format 'yyyy-MM-dd HH:mm')]`n`nCo-Authored-By: Calendar Sync Bot <bot@ollie.com>"
            git commit -m $commitMsg

            Write-Host "  → Enviando para GitHub..." -ForegroundColor Gray
            git push

            Write-Host "  ✓ Sincronização concluída!" -ForegroundColor Green
            Write-Host "  ✓ GitHub Actions vai converter para JSON em ~15 minutos" -ForegroundColor Green
            Write-Host "  ✓ Deploy no Vercel em ~18-20 minutos total" -ForegroundColor Green
        } else {
            Write-Host "  → Arquivo já está atualizado no GitHub" -ForegroundColor Yellow
        }

        Write-Host ""

    } catch {
        Write-Host "  ✗ Erro durante sincronização: $_" -ForegroundColor Red
        Write-Host ""
    }
}

# Loop principal
while ($true) {
    # Verificar se o arquivo existe
    if (-not (Test-Path $excelPath)) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ⚠ Arquivo não encontrado. Aguardando..." -ForegroundColor Yellow
        Start-Sleep -Seconds $checkInterval
        continue
    }

    # Calcular hash do arquivo
    $currentHash = Get-FileHashSafe -Path $excelPath

    if ($null -eq $currentHash) {
        # Arquivo pode estar aberto/bloqueado
        Start-Sleep -Seconds $checkInterval
        continue
    }

    # Se é a primeira verificação, apenas guardar o hash
    if ($lastHash -eq "") {
        $lastHash = $currentHash
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Monitoramento iniciado. Hash inicial: $($currentHash.Substring(0,8))..." -ForegroundColor Cyan
    }
    # Se o hash mudou, sincronizar
    elseif ($currentHash -ne $lastHash) {
        Sync-ExcelToGitHub
        $lastHash = $currentHash
    }

    # Aguardar antes da próxima verificação
    Start-Sleep -Seconds $checkInterval
}
