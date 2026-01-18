# Script PowerShell para sincronizar automaticamente o Excel com o GitHub
# Monitora mudanças no arquivo Excel e faz commit/push automaticamente

# Configurações
$excelPath = 'c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar\calendar-view-app\lancamentos_campanhas_2026.xlsx'
$repoPath = 'c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar\calendar-view-app'
$checkInterval = 60  # Verificar a cada 60 segundos
$logFile = Join-Path $repoPath 'sync-log.txt'

# Função para escrever log
function Write-Log {
    param($Message)
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $logMessage = "[$timestamp] $Message"
    Add-Content -Path $logFile -Value $logMessage
    Write-Host $logMessage
}

Write-Log '=========================================='
Write-Log 'SINCRONIZADOR AUTOMÁTICO INICIADO'
Write-Log '=========================================='
Write-Log "Monitorando: $excelPath"
Write-Log "Intervalo: $checkInterval segundos"
Write-Log "Repositório: $repoPath"
Write-Log ''

# Guardar o último hash do arquivo
$lastHash = ''

function Get-FileHashSafe {
    param($Path)
    try {
        if (Test-Path $Path) {
            $hash = (Get-FileHash $Path -Algorithm MD5).Hash
            return $hash
        }
    } catch {
        Write-Log "ERRO ao calcular hash: $_"
        return $null
    }
    return $null
}

function Sync-ExcelToGitHub {
    Write-Log 'Mudanças detectadas! Sincronizando...'

    try {
        # Ir para o diretório do repositório
        Set-Location $repoPath
        Write-Log "  Diretório: $(Get-Location)"

        # Verificar se há mudanças no git
        $gitStatus = git status --porcelain lancamentos_campanhas_2026.xlsx 2>&1
        Write-Log "  Git status: $gitStatus"

        if ($gitStatus -and $gitStatus -match '^.M') {
            Write-Log '  Adicionando arquivo ao git...'
            $addResult = git add lancamentos_campanhas_2026.xlsx 2>&1
            Write-Log "  Add result: $addResult"

            Write-Log '  Fazendo commit...'
            $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm'
            $commitMsg = "Auto-update: Excel calendar data [$timestamp]

Co-Authored-By: Calendar Sync Bot <bot@ollie.com>"

            $commitResult = git commit -m $commitMsg 2>&1
            Write-Log "  Commit result: $commitResult"

            Write-Log '  Enviando para GitHub...'
            $pushResult = git push 2>&1
            Write-Log "  Push result: $pushResult"

            Write-Log 'Sincronização concluída!'
            Write-Log 'GitHub Actions vai converter para JSON em ~15 minutos'
            Write-Log ''

        } else {
            Write-Log '  Arquivo já está atualizado no GitHub'
            Write-Log ''
        }

    } catch {
        Write-Log "ERRO durante sincronização: $_"
        Write-Log ''
    }
}

# Loop principal
Write-Log 'Iniciando monitoramento...'
Write-Log ''

while ($true) {
    # Verificar se o arquivo existe
    if (-not (Test-Path $excelPath)) {
        Write-Log 'Arquivo não encontrado. Aguardando...'
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
    if ($lastHash -eq '') {
        $lastHash = $currentHash
        Write-Log "Hash inicial: $($currentHash.Substring(0,8))..."
    }
    # Se o hash mudou, sincronizar
    elseif ($currentHash -ne $lastHash) {
        Sync-ExcelToGitHub
        $lastHash = $currentHash
    }

    # Aguardar antes da próxima verificação
    Start-Sleep -Seconds $checkInterval
}
