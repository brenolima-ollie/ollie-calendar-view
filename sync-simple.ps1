# Script executado pelo Task Scheduler
# NÃO execute manualmente - é chamado automaticamente a cada 5 minutos

$excelPath = 'c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar\calendar-view-app\lancamentos_campanhas_2026.xlsx'
$repoPath = 'c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar\calendar-view-app'
$logFile = Join-Path $repoPath 'task-log.txt'

function Write-TaskLog {
    param($Message)
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    "$timestamp - $Message" | Out-File -FilePath $logFile -Append
}

try {
    Set-Location $repoPath

    # Verificar se Excel foi modificado no git
    $status = git status --porcelain lancamentos_campanhas_2026.xlsx 2>&1

    if ($status -and $status -match '^.M') {
        Write-TaskLog 'Mudanças detectadas - sincronizando'

        git add lancamentos_campanhas_2026.xlsx 2>&1 | Out-Null

        $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm'
        git commit -m "Auto-sync: Calendar [$timestamp]" 2>&1 | Out-Null

        git push 2>&1 | Out-Null

        Write-TaskLog 'Sincronização concluída'
    }

} catch {
    Write-TaskLog "ERRO: $_"
}
