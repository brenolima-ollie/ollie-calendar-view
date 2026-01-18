# Instala tarefa agendada do Windows para sincronização automática
# Executa uma vez e esquece - vai rodar automaticamente para sempre

$taskName = 'OllieCalendarSync'
$scriptPath = Join-Path $PSScriptRoot 'sync-simple.ps1'
$repoPath = $PSScriptRoot

# Verificar se está executando como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host 'ERRO: Execute como Administrador' -ForegroundColor Red
    Write-Host 'Clique com botão direito e escolha "Executar como Administrador"' -ForegroundColor Yellow
    Write-Host ''
    pause
    exit
}

Write-Host ''
Write-Host '============================================' -ForegroundColor Cyan
Write-Host '  INSTALANDO SINCRONIZAÇÃO AUTOMÁTICA' -ForegroundColor Cyan
Write-Host '============================================' -ForegroundColor Cyan
Write-Host ''

# Remover tarefa antiga se existir
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Write-Host 'Removendo tarefa antiga...' -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

# Criar ação
$action = New-ScheduledTaskAction -Execute 'PowerShell.exe' -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$scriptPath`""

# Criar trigger (a cada 5 minutos)
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 5) -RepetitionDuration ([TimeSpan]::MaxValue)

# Criar configurações
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RunOnlyIfNetworkAvailable

# Criar principal (rodar com seu usuário)
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType S4U -RunLevel Highest

# Registrar tarefa
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description 'Sincroniza automaticamente o Excel do Calendar View com GitHub/Vercel'

Write-Host 'INSTALAÇÃO CONCLUÍDA!' -ForegroundColor Green
Write-Host ''
Write-Host 'A partir de agora:' -ForegroundColor Yellow
Write-Host '  1. A tarefa roda automaticamente a cada 5 minutos' -ForegroundColor Gray
Write-Host '  2. Detecta mudanças no Excel' -ForegroundColor Gray
Write-Host '  3. Faz commit e push para GitHub' -ForegroundColor Gray
Write-Host '  4. GitHub Actions converte para JSON' -ForegroundColor Gray
Write-Host '  5. Vercel faz deploy automaticamente' -ForegroundColor Gray
Write-Host ''
Write-Host 'Você e seu time só precisam:' -ForegroundColor Green
Write-Host '  - Editar o Excel normalmente' -ForegroundColor Green
Write-Host '  - Salvar (Ctrl+S)' -ForegroundColor Green
Write-Host '  - Aguardar ~20-25 minutos' -ForegroundColor Green
Write-Host ''
Write-Host 'Para desinstalar: .\uninstall-task.ps1' -ForegroundColor Cyan
Write-Host ''
