# Remove a tarefa agendada de sincronização

$taskName = 'OllieCalendarSync'

$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host 'ERRO: Execute como Administrador' -ForegroundColor Red
    pause
    exit
}

Write-Host ''
Write-Host 'Removendo sincronização automática...' -ForegroundColor Yellow
Write-Host ''

$task = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue

if ($task) {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    Write-Host 'Tarefa removida com sucesso!' -ForegroundColor Green
} else {
    Write-Host 'Tarefa não encontrada' -ForegroundColor Yellow
}

Write-Host ''
