# Visualiza o log do sincronizador em tempo real

$logFile = Join-Path $PSScriptRoot 'sync-log.txt'

if (Test-Path $logFile) {
    Write-Host 'LOG DO SINCRONIZADOR (últimas 50 linhas):' -ForegroundColor Cyan
    Write-Host '==========================================' -ForegroundColor Cyan
    Write-Host ''

    Get-Content $logFile -Tail 50

    Write-Host ''
    Write-Host '==========================================' -ForegroundColor Cyan
    Write-Host "Arquivo completo: $logFile" -ForegroundColor Gray
} else {
    Write-Host 'Log não encontrado. O sincronizador ainda não foi iniciado.' -ForegroundColor Yellow
}
