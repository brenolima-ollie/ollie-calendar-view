# Script PowerShell para corrigir e fazer redeploy

Write-Host "=== Fazendo commit das correções ===" -ForegroundColor Green

# Adicionar arquivos corrigidos
git add package.json
git add postcss.config.mjs
git add app/globals.css
git add next-env.d.ts

# Commit
git commit -m "Fix: ajusta Tailwind CSS v3 e configurações para build correto"

# Push para GitHub
Write-Host "`n=== Fazendo push para GitHub ===" -ForegroundColor Green
git push

Write-Host "`n=== Deploy iniciado! ===" -ForegroundColor Green
Write-Host "O Vercel detectará o push e fará deploy automático em ~2 minutos." -ForegroundColor Cyan
Write-Host "Acompanhe em: https://vercel.com/dashboard" -ForegroundColor Cyan
