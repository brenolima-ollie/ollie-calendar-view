"""
Para o sincronizador automático
"""

$pidFile = Join-Path $PSScriptRoot "sync-pid.txt"

Write-Host "Parando sincronizador automático..." -ForegroundColor Cyan
Write-Host ""

if (Test-Path $pidFile) {
    $pid = Get-Content $pidFile

    try {
        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue

        if ($process) {
            Stop-Process -Id $pid -Force
            Write-Host "✓ Sincronizador parado (PID: $pid)" -ForegroundColor Green
        } else {
            Write-Host "⚠ Processo não está rodando (PID: $pid)" -ForegroundColor Yellow
        }

        Remove-Item $pidFile

    } catch {
        Write-Host "✗ Erro ao parar processo: $_" -ForegroundColor Red
    }

} else {
    Write-Host "⚠ Nenhum sincronizador rodando" -ForegroundColor Yellow
    Write-Host "  (Arquivo sync-pid.txt não encontrado)" -ForegroundColor Gray
}

Write-Host ""
