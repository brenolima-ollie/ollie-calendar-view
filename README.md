# Calendar View - Ollie Growth & Tech

Sistema de visualização de calendário para gerenciar ~60 lançamentos e campanhas por ano através de 7 operações (Ollie BR/MX/CO/EU/CL + Noma Beauty + Joomi Beauty).

## Tech Stack

- **Next.js 16** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Lucide React** - Ícones
- **Vercel** - Deploy

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Build para Produção

```bash
npm run build
```

Gera exportação estática na pasta `/out`.

## Deploy no Vercel

### Método 1: Via CLI

```bash
npm install -g vercel
vercel
```

### Método 2: Via GitHub

1. Faça push do código para GitHub
2. Conecte o repositório no [Vercel Dashboard](https://vercel.com/dashboard)
3. Deploy automático em cada push

## Atualizar Dados

### Opção 1: Rodar script Python (Recomendado)

```bash
cd ..
python converter_para_json.py
```

Isso lê `lancamentos_campanhas_2026.xlsx` e atualiza `app/data.json`.

### Opção 2: Editar JSON manualmente

Edite `app/data.json` diretamente seguindo a estrutura:

```json
{
  "ID": "Jan01",
  "Data": "2026-01-15",
  "Nome": "Nome do Produto",
  "Geografia": "BR",
  "Tipo": "Lançamento",
  "Status": "🟢 Live",
  "Owner": "Nome",
  "Notas": "Observações"
}
```

## Estrutura do Projeto

```
calendar-view-app/
├── app/
│   ├── layout.tsx          # Layout raiz
│   ├── page.tsx            # Página principal
│   ├── globals.css         # Estilos globais
│   └── data.json           # Dados do calendário
├── components/
│   ├── CalendarGrid.tsx    # Grid do calendário
│   ├── EventsList.tsx      # Lista detalhada de eventos
│   ├── StatsCards.tsx      # Cards de estatísticas
│   └── Legend.tsx          # Legenda de cores
├── public/                 # Assets estáticos
├── package.json
├── next.config.js          # Configuração Next.js
├── tailwind.config.ts      # Configuração Tailwind
└── tsconfig.json           # Configuração TypeScript
```

## Customização

### Cores

Edite `tailwind.config.ts` para ajustar paleta de cores:

```typescript
colors: {
  ollie: {
    red: '#E7002A',
    orange: '#FF502C',
    // ...
  }
}
```

### Geografias

Adicione novas geografias em `CalendarGrid.tsx` e `EventsList.tsx`:

```typescript
const COLORS: Record<string, string> = {
  BR: "#E7002A",
  // Adicione aqui
  AR: "#75AADB",
};
```

## Features

- Visualização de 12 meses (navegação por tabs)
- Código de cores por geografia/marca
- 4 níveis de status (Live, Dev, Backlog, Crítico)
- Estatísticas automáticas
- Design responsivo
- Exportação estática (funciona offline)
- Deploy otimizado para Vercel

## Licença

Uso interno - Ollie/Baker Brands
