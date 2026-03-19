# 💪 Força — Treino AB App

Web app completa para tracking de treino AB personalizado.  
**Stack:** Next.js 14 + TypeScript + Tailwind CSS + Supabase + Vercel

---

## 🚀 Deploy em 5 passos

### 1. Criar base de dados (Supabase) — gratuito

1. Vai a **https://supabase.com** e cria conta gratuita
2. Cria um **New Project** (guarda a password)
3. No painel do projeto, vai a **SQL Editor → New Query**
4. Cola o conteúdo do ficheiro `supabase-schema.sql` e clica **Run**
5. Vai a **Project Settings → API** e copia:
   - `Project URL` → NEXT_PUBLIC_SUPABASE_URL
   - `anon public key` → NEXT_PUBLIC_SUPABASE_ANON_KEY

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Abre `.env.local` e substitui os valores com os do Supabase.

### 4. Testar localmente

```bash
npm run dev
```

Abre http://localhost:3000

### 5. Deploy no Vercel — gratuito

```bash
npm install -g vercel
vercel
```

Ou usa o GitHub:
1. Faz push do código para um repositório no GitHub
2. Vai a **https://vercel.com** → Import Project
3. Em **Environment Variables** adiciona:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Clica **Deploy** — a app fica online em ~1 min!

---

## 👥 Partilhar com amigos

Depois do deploy, cada amigo:
1. Vai ao URL da app (ex: `https://forca-app.vercel.app`)
2. Clica **Criar conta**
3. Preenche nome, peso e altura
4. Começa a registar os treinos!

Cada utilizador tem os seus próprios dados — totalmente separados.

---

## 📱 Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Dashboard** | Visão geral do dia, sequência, volume semanal, dias em falta |
| **Treino** | Regista séries, vê exercícios anteriores, timer de descanso automático |
| **Progresso** | Gráficos de peso corporal e evolução por exercício |
| **Metas** | Define cargas alvo, acompanha progresso, alertas de prazo |
| **Perfil** | IMC, metas nutricionais personalizadas, guia de suplementação |

---

## 🏋️ Exercícios (adaptados para peso livre)

Todos os exercícios foram adaptados para usar apenas **halteres, barras e pesos livres**:

- ~~Tríceps corda~~ → **Tríceps testa (skull crusher)**
- ~~Leg press~~ → **Avanço com halteres (lunges)**
- ~~Mesa/cadeira flexora~~ → **Leg curl deitado com halter**
- ~~Agachamento hack~~ → **Agachamento goblet com halter**
- ~~Pulley frente~~ → **Remada pegada supinada**

---

## 🏗️ Estrutura do projeto

```
src/
├── app/
│   ├── (app)/           # Rotas protegidas (requer login)
│   │   ├── dashboard/   # Página inicial
│   │   ├── treino/      # Registo de treinos
│   │   ├── progresso/   # Gráficos e histórico
│   │   ├── metas/       # Objetivos por exercício
│   │   └── perfil/      # Perfil e nutrição
│   ├── login/
│   └── signup/
├── lib/
│   ├── supabase/        # Cliente Supabase
│   ├── workoutData.ts   # Dados dos exercícios
│   └── utils.ts         # Funções utilitárias
├── types/               # TypeScript types
└── middleware.ts         # Autenticação
```

---

## 🔧 Personalizar exercícios

Edita o ficheiro `src/lib/workoutData.ts` para:
- Adicionar novos exercícios
- Modificar séries/repetições
- Alterar os dias do plano
