# Verifica o status do sincronizador automático

$pidFile = Join-Path $PSScriptRoot "sync-pid.txt"

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  STATUS DO SINCRONIZADOR" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path $pidFile) {
    $pid = Get-Content $pidFile

    try {
        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue

        if ($process) {
            Write-Host "Status: RODANDO ✓" -ForegroundColor Green
            Write-Host ""
            Write-Host "  Process ID: $pid" -ForegroundColor Gray
            Write-Host "  CPU Time: $($process.CPU)" -ForegroundColor Gray
            Write-Host "  Memory: $([math]::Round($process.WorkingSet64 / 1MB, 2)) MB" -ForegroundColor Gray
            Write-Host "  Start Time: $($process.StartTime)" -ForegroundColor Gray
            Write-Host ""
            Write-Host "O sincronizador está monitorando mudanças no Excel." -ForegroundColor Yellow
            Write-Host ""
        } else {
            Write-Host "Status: PARADO ✗" -ForegroundColor Red
            Write-Host ""
            Write-Host "  O processo (PID: $pid) não está mais rodando." -ForegroundColor Gray
            Write-Host "  Execute start-sync.ps1 para iniciar novamente." -ForegroundColor Yellow
            Write-Host ""

            # Limpar arquivo PID inválido
            Remove-Item $pidFile
        }

    } catch {
        Write-Host "Status: ERRO ✗" -ForegroundColor Red
        Write-Host ""
        Write-Host "  Erro ao verificar processo: $_" -ForegroundColor Gray
        Write-Host ""
    }

} else {
    Write-Host "Status: NÃO INICIADO" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  O sincronizador não foi iniciado ainda." -ForegroundColor Gray
    Write-Host "  Execute start-sync.ps1 para iniciar." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Comandos disponíveis:" -ForegroundColor Cyan
Write-Host "  .\start-sync.ps1  - Iniciar sincronizador" -ForegroundColor Gray
Write-Host "  .\stop-sync.ps1   - Parar sincronizador" -ForegroundColor Gray
Write-Host "  .\status-sync.ps1 - Ver status (este comando)" -ForegroundColor Gray
Write-Host ""
