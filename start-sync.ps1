# Inicia o sincronizador automático em background (janela oculta)

$scriptPath = Join-Path $PSScriptRoot "sync-excel-auto.ps1"

Write-Host "Iniciando sincronizador automático em background..." -ForegroundColor Cyan
Write-Host ""

# Iniciar em processo separado (janela oculta)
$process = Start-Process powershell -ArgumentList @("-NoProfile", "-ExecutionPolicy", "Bypass", "-WindowStyle", "Hidden", "-File", $scriptPath) -PassThru

if ($process) {
    Write-Host "✓ Sincronizador iniciado com sucesso!" -ForegroundColor Green
    Write-Host "  Process ID: $($process.Id)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "O sincronizador está rodando em background e vai:" -ForegroundColor Yellow
    Write-Host "  1. Monitorar mudanças no Excel a cada 60 segundos" -ForegroundColor Yellow
    Write-Host "  2. Fazer commit e push automático quando detectar alterações" -ForegroundColor Yellow
    Write-Host "  3. GitHub Actions vai converter para JSON automaticamente" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para parar o sincronizador, execute: stop-sync.ps1" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "✗ Erro ao iniciar sincronizador" -ForegroundColor Red
}

# Salvar o PID em arquivo para poder parar depois
$process.Id | Out-File (Join-Path $PSScriptRoot "sync-pid.txt")
