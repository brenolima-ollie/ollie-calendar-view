"""
Script para baixar dados do Google Sheets e converter para JSON
Roda no GitHub Actions a cada 15 minutos (100% automático)
"""

import pandas as pd
import json
from datetime import datetime, date
import sys

# URL pública do Google Sheets (modo CSV)
# Substitua SHEET_ID pelo ID da sua planilha
SHEET_URL = 'https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid=0'

try:
    print('Baixando dados do Google Sheets...')

    # Ler CSV do Google Sheets
    df = pd.read_csv(SHEET_URL)

    print(f'Total de linhas: {len(df)}')

    # Remover linhas vazias
    df = df.dropna(how='all')
    df = df[df['Data'].notna()]

    # Converter datetime para string
    for col in df.columns:
        if pd.api.types.is_datetime64_any_dtype(df[col]):
            df[col] = df[col].astype(str).replace('NaT', '')

    df = df.fillna('')

    # Gerar IDs automaticamente
    df['ID'] = df.groupby('Data').cumcount().add(1).astype(str).str.zfill(3)
    df['ID'] = df['Data'].str.replace('-', '') + '-' + df['ID']

    # Garantir que Esforço existe
    if 'Esforço' not in df.columns:
        df['Esforço'] = ''

    # Reordenar colunas (sem Owner)
    cols_order = ['ID', 'Data', 'Nome', 'Geografia', 'Tipo', 'Esforço', 'Status', 'Notas']
    for col in df.columns:
        if col not in cols_order and col != 'Owner':
            cols_order.append(col)
    cols = [col for col in cols_order if col in df.columns and col != 'Owner']
    df = df[cols]

    # Converter para JSON
    data = df.to_dict('records')

    # Verificar datetime objects
    for i, record in enumerate(data):
        for key, value in record.items():
            if isinstance(value, (datetime, date, pd.Timestamp)):
                data[i][key] = str(value)

    # Salvar JSON
    with open('app/data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f'✓ Convertido {len(data)} eventos para JSON')
    print('✓ Arquivo salvo: app/data.json')

except Exception as e:
    print(f'ERRO: {e}')
    sys.exit(1)
