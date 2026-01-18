# Versão simplificada usando PowerShell Job (mais confiável)

$scriptPath = Join-Path $PSScriptRoot 'sync-excel-auto.ps1'
$logPath = Join-Path $PSScriptRoot 'sync-log.txt'

Write-Host 'Iniciando sincronizador como PowerShell Job...' -ForegroundColor Cyan
Write-Host ''

# Parar jobs anteriores
Get-Job -Name 'CalendarSync' -ErrorAction SilentlyContinue | Stop-Job
Get-Job -Name 'CalendarSync' -ErrorAction SilentlyContinue | Remove-Job

# Iniciar novo job
$job = Start-Job -Name 'CalendarSync' -FilePath $scriptPath

if ($job) {
    Write-Host 'Sincronizador iniciado com sucesso!' -ForegroundColor Green
    Write-Host "  Job ID: $($job.Id)" -ForegroundColor Gray
    Write-Host "  Job Name: $($job.Name)" -ForegroundColor Gray
    Write-Host ''
    Write-Host 'O sincronizador está rodando em background e vai:' -ForegroundColor Yellow
    Write-Host '  1. Monitorar mudanças no Excel a cada 60 segundos' -ForegroundColor Yellow
    Write-Host '  2. Fazer commit e push automático quando detectar alterações' -ForegroundColor Yellow
    Write-Host '  3. GitHub Actions vai converter para JSON automaticamente' -ForegroundColor Yellow
    Write-Host ''
    Write-Host 'Para ver o log: .\view-log.ps1' -ForegroundColor Cyan
    Write-Host 'Para parar: .\stop-sync-v2.ps1' -ForegroundColor Cyan
    Write-Host "Arquivo de log: $logPath" -ForegroundColor Gray
    Write-Host ''
} else {
    Write-Host 'Erro ao iniciar sincronizador' -ForegroundColor Red
}
