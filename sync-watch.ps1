# Sincronizador simples - deixe esta janela aberta
# Minimizar a janela é OK, mas não feche

$excelPath = 'c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar\calendar-view-app\lancamentos_campanhas_2026.xlsx'
$repoPath = 'c:\Users\breno.lima\OneDrive - Ollie\growth_lifecycle\site_calendar\calendar-view-app'

Set-Location $repoPath

Write-Host '======================================' -ForegroundColor Cyan
Write-Host '  CALENDAR SYNC - Rodando' -ForegroundColor Cyan
Write-Host '======================================' -ForegroundColor Cyan
Write-Host ''
Write-Host 'Monitorando: lancamentos_campanhas_2026.xlsx' -ForegroundColor Yellow
Write-Host 'Verificando a cada 30 segundos' -ForegroundColor Yellow
Write-Host ''
Write-Host 'Minimize esta janela (não feche!)' -ForegroundColor Gray
Write-Host 'Press Ctrl+C para parar' -ForegroundColor Gray
Write-Host ''

$lastHash = ''

while ($true) {
    $timestamp = Get-Date -Format 'HH:mm:ss'

    if (Test-Path $excelPath) {
        try {
            $currentHash = (Get-FileHash $excelPath -Algorithm MD5).Hash

            if ($lastHash -eq '') {
                $lastHash = $currentHash
                Write-Host "[$timestamp] Monitoramento iniciado" -ForegroundColor Green
            }
            elseif ($currentHash -ne $lastHash) {
                Write-Host "[$timestamp] Mudança detectada!" -ForegroundColor Green

                $status = git status --porcelain lancamentos_campanhas_2026.xlsx

                if ($status) {
                    Write-Host "[$timestamp]   git add..." -ForegroundColor Gray
                    git add lancamentos_campanhas_2026.xlsx

                    Write-Host "[$timestamp]   git commit..." -ForegroundColor Gray
                    $commitTime = Get-Date -Format 'yyyy-MM-dd HH:mm'
                    git commit -m "Auto-update: Excel [$commitTime]"

                    Write-Host "[$timestamp]   git push..." -ForegroundColor Gray
                    git push

                    Write-Host "[$timestamp] SYNC COMPLETO!" -ForegroundColor Green
                    Write-Host ''
                }

                $lastHash = $currentHash
            }
        } catch {
            Write-Host "[$timestamp] Erro: $_" -ForegroundColor Red
        }
    }

    Start-Sleep -Seconds 30
}
