# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PhotoLabs AI is a portrait image generation tool built with React + Vite, powered by Google Gemini 3 Pro AI model. Users upload a photo, select an artistic style, customize parameters, and generate AI-enhanced portraits.

**Architecture**: Supabase backend with Edge Functions. API keys and prompt templates are stored server-side; the frontend only receives non-sensitive data.

## Development Commands

```bash
npm run dev          # Start dev server on port 3000
npm run build        # Build for production
npm run preview      # Preview production build

# Supabase CLI (for backend changes)
npx supabase functions deploy get-styles      # Deploy styles API
npx supabase functions deploy generate-image  # Deploy image generation API
```

## Environment Setup

1. Copy `.env.local.example` to `.env.local`
2. Configure Supabase credentials:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```

3. In Supabase Dashboard → Settings → Edge Functions, add:

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

## Architecture

### Backend: Supabase Edge Functions

Two Deno-based Edge Functions handle all server-side logic:

- **`get-styles`**: Fetches styles from database, parses `[option1/option2]` variables, returns `PublicPortraitStyle[]` without `prompt_template`
- **`generate-image`**: Receives styleId + variables, builds prompt from database template, calls Gemini API

The Gemini API key is stored in Supabase environment variables and never exposed to the frontend.

### Frontend: API Service with Fallback

[api.ts](src/services/api.ts) implements a fallback strategy:

1. Try Edge Function first
2. On failure, fall back to local data from [portrait-styles.ts](src/constants/portrait-styles.ts)

This enables development without Supabase running.

### Dynamic Prompt System

Prompt templates use `[option1/option2/option3]` syntax for user-customizable parameters:

- **Parsing**: [`parseVariables()`](supabase/functions/get-styles/index.ts#L38-L50) extracts options into `StyleVariable[]`
- **Building**: [`buildPrompt()`](supabase/functions/generate-image/index.ts#L29-L36) replaces `[...]` placeholders with user selections
- **Frontend Display**: Variables are rendered as dropdown selects in [DynamicForm.tsx](src/components/parameter-input/DynamicForm.tsx)

### Type System

Two style interfaces with different sensitivity levels:

- **`DatabaseStyle`** ([types/style.ts](src/types/style.ts)): Full schema including `prompt_template` (server-only)
- **`PublicPortraitStyle`**: Safe subset with `variables[]` instead of raw template (client-safe)

### View State Machine

[App.tsx](src/App.tsx) manages navigation with a single `currentView` state:

```text
home → upload → workspace
  ↓       ↓
features  about
```

### Path Aliases

Configured in [vite.config.ts](vite.config.ts):

- `@/` → `src/`
- `@/components`, `@/services`, `@/types`, `@/constants`, `@/utils`

## Adding a New Style

### Option 1: Database (Production)

1. Insert into Supabase `styles` table with all fields including `prompt_template`
2. Edge Functions will automatically expose it

### Option 2: Local Fallback (Development)

1. Add entry to `RAW_STYLES` array in [portrait-styles.ts](src/constants/portrait-styles.ts)
2. Include `promptTemplate` with `[option1/option2]` syntax for customizable parameters

## Image Processing

- **Upload limit**: 5MB ([App.tsx:72](src/App.tsx#L72))
- **API call**: Base64 image sent directly to Edge Function; Gemini configured with `imageSize: '2K'`, `aspectRatio: '3:4'`

## Security Model

- API keys stored only in Supabase Edge Functions environment
- `prompt_template` never sent to frontend; only parsed `variables[]` array
- Error messages sanitized before returning to client
