# Para o PowerShell Job do sincronizador

Write-Host 'Parando sincronizador...' -ForegroundColor Cyan
Write-Host ''

$job = Get-Job -Name 'CalendarSync' -ErrorAction SilentlyContinue

if ($job) {
    Stop-Job -Name 'CalendarSync'
    Remove-Job -Name 'CalendarSync'
    Write-Host 'Sincronizador parado (Job ID: ' $job.Id ')' -ForegroundColor Green
} else {
    Write-Host 'Nenhum sincronizador rodando' -ForegroundColor Yellow
}

Write-Host ''
