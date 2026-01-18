# Setup Google Sheets (100% Automático)

## Vantagens do Google Sheets

✅ **Time todo edita online simultaneamente**
✅ **Sem conflitos de arquivo**
✅ **Não precisa salvar/sincronizar manualmente**
✅ **Histórico de versões integrado**
✅ **Funciona de qualquer lugar**
✅ **GitHub Actions baixa automaticamente a cada 15 min**

## Passo 1: Criar/Migrar para Google Sheets

### Opção A: Criar do Zero
1. Acesse: https://sheets.google.com
2. Crie nova planilha
3. Nomeie: "Ollie Calendar 2026"
4. Crie as colunas:
   - Data
   - Nome
   - Geografia
   - Tipo
   - Esforço
   - Status
   - Notas

### Opção B: Importar Excel Existente
1. Abra Google Sheets
2. File > Import > Upload
3. Selecione: `lancamentos_campanhas_2026.xlsx`
4. Import location: "Replace spreadsheet"

## Passo 2: Tornar Público (Apenas Leitura)

1. Na planilha, clique em **"Share"** (canto superior direito)
2. Em "General access", mude para **"Anyone with the link"**
3. Permissão: **"Viewer"** (apenas visualização)
4. Clique em "Copy link"
5. O link será algo como:
   ```
   https://docs.google.com/spreadsheets/d/1ABC...XYZ/edit
   ```

## Passo 3: Extrair o SHEET_ID

Do link copiado, pegue apenas o ID (parte entre `/d/` e `/edit`):

```
https://docs.google.com/spreadsheets/d/1ABC...XYZ/edit
                                         ↑ Esta parte ↑
```

Exemplo:
- Link: `https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0/edit`
- SHEET_ID: `1a2b3c4d5e6f7g8h9i0`

## Passo 4: Configurar GitHub Secret

1. Acesse: https://github.com/brenolima-ollie/ollie-calendar-view/settings/secrets/actions
2. Clique em "New repository secret"
3. Name: `GOOGLE_SHEETS_URL`
4. Value: Cole o **SHEET_ID** (só o ID, não o link completo)
5. Clique em "Add secret"

## Passo 5: Ativar Workflow

1. Vá para: https://github.com/brenolima-ollie/ollie-calendar-view/actions
2. Clique em "Update Calendar from Google Sheets"
3. Clique em "Enable workflow" (se necessário)
4. Clique em "Run workflow" > "Run workflow" para testar

## Passo 6: Testar

1. Faça uma mudança no Google Sheets
2. Aguarde ~15 minutos (próxima execução automática)
3. Ou force execução manual:
   - GitHub Actions > Update Calendar from Google Sheets > Run workflow
4. Veja mudanças em: https://ollie-calendar-view.vercel.app

## Fluxo Automático Final

```
Google Sheets editado
      ↓
Mudanças salvas automaticamente
      ↓
GitHub Actions baixa (a cada 15 min)
      ↓
Converte para JSON
      ↓
Faz commit se houver mudanças
      ↓
Vercel detecta e faz deploy (~2 min)
      ↓
Site atualizado!
```

**Tempo total: ~15-17 minutos do Google Sheets até o site**

## Compartilhar com Time

1. Abra o Google Sheets
2. Clique em "Share"
3. Adicione emails do time com permissão **"Editor"**
4. Todos podem editar simultaneamente!

## Dropdowns no Google Sheets

Para adicionar dropdowns (validação de dados):

1. Selecione a coluna (ex: Geografia)
2. Data > Data validation
3. Criteria: "List of items"
4. Itens: `Ollie BR, Ollie MX, Ollie CO, Ollie EU, Ollie CL, Noma BR, Joomi BR, Ollie CB`
5. Show dropdown in cell: ✓
6. Save

Repita para:
- **Tipo**: `Lançamento, Campanha, Nova Operação`
- **Esforço**: `P, M, G`
- **Status**: `🟢 Live, 🟡 Em Dev, 🟡 Criativo, 🔴 Crítico, 🔴 Atrasado, ⚪ Pausado, ⚪ Cancelado`

## Vantagens vs Excel

| Recurso | Excel | Google Sheets |
|---------|-------|---------------|
| Edição simultânea | ❌ | ✅ |
| Sincronização manual | ✅ Necessária | ❌ Automática |
| Funciona offline | ✅ | ⚠️ Com app |
| Histórico de versões | ⚠️ Manual | ✅ Automático |
| Automação GitHub | ⚠️ Complexo | ✅ Simples |
| Acesso remoto | ⚠️ OneDrive | ✅ Qualquer lugar |

## Manter Excel como Backup

Você pode manter o Excel e fazer export periódico:
- Google Sheets > File > Download > Microsoft Excel
