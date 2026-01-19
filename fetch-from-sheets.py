"""
Script para baixar dados do Google Sheets e converter para JSON
Roda no GitHub Actions a cada 5 minutos (100% automático)
"""

import pandas as pd
import json
from datetime import datetime, date
import sys
import os

# Pegar URL completo do environment
SHEETS_URL = os.environ.get('SHEETS_URL', '')

# Extrair SHEET_ID e GID da URL se for URL completo
if 'docs.google.com' in SHEETS_URL:
    # É uma URL completa
    import re
    sheet_match = re.search(r'/d/([a-zA-Z0-9-_]+)', SHEETS_URL)
    gid_match = re.search(r'gid=([0-9]+)', SHEETS_URL)

    SHEET_ID = sheet_match.group(1) if sheet_match else ''
    GID = gid_match.group(1) if gid_match else '0'
else:
    # É só o ID
    SHEET_ID = SHEETS_URL
    GID = '0'

# URL pública do Google Sheets (modo CSV)
SHEET_URL = f'https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={GID}'

try:
    print(f'Sheet ID: {SHEET_ID}')
    print(f'URL: {SHEET_URL}')
    print('Baixando dados do Google Sheets...')

    # Ler CSV do Google Sheets
    df = pd.read_csv(SHEET_URL)

    print(f'Total de linhas: {len(df)}')

    # Remover linhas vazias
    df = df.dropna(how='all')
    df = df[df['Data'].notna()]

    # Converter coluna Data para formato YYYY-MM-DD (sem timestamp)
    if 'Data' in df.columns:
        # Se for datetime, converte para date apenas
        if pd.api.types.is_datetime64_any_dtype(df['Data']):
            df['Data'] = pd.to_datetime(df['Data']).dt.date.astype(str)
        else:
            # Se for string, garante formato correto
            df['Data'] = pd.to_datetime(df['Data'], errors='coerce').dt.date.astype(str)

    # Converter outros datetime para string
    for col in df.columns:
        if col != 'Data' and pd.api.types.is_datetime64_any_dtype(df[col]):
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
