# Oltre lo sguardo oltre la pelle ✦ Segni e testimonianze

Piattaforma moderna ad alto impatto visivo progettata per archiviare, consultare e valorizzare documenti e schede di sintesi, ottimizzata per il deployment istantaneo su **Vercel**.

---

## ⚡ Stack Tecnologico

Questo progetto adotta il miglior stack disponibile nell'ecosistema web moderno:

| Componente | Tecnologia | Ruolo & Vantaggi |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) | Server Components, velocità di build istantanea e integrazione nativa con Vercel. |
| **Linguaggio** | [TypeScript](https://www.typescriptlang.org/) | Type safety rigorosa e manutenibilità a lungo termine. |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Nuovo motore CSS lightning-fast, zero overhead a runtime, glassmorphism e gradienti dark-mode. |
| **Animazioni** | [Framer Motion](https://www.framer.com/motion/) | Micro-interazioni fluide a 60 FPS, transizioni di stato e layout animation. |
| **Smooth Scroll** | [Lenis](https://lenis.darkroom.engineering/) | Scorrimento inerziale cinematico ad alta precisione. |
| **Iconografia** | [Lucide React](https://lucide.dev/) | Icone SVG moderne, leggere e completamente tree-shakeable. |
| **Hosting & Edge** | [Vercel](https://vercel.com/) | Edge network globale, ottimizzazione immagini, anteprime branch e zero-config. |

---

## 📁 Struttura del Progetto

```
archivio-sintesi/
├── src/
│   ├── app/
│   │   ├── globals.css         # Stili globali, token design, gradienti mesh e glassmorphism
│   │   ├── layout.tsx          # Root layout con font Geist, SEO metadata e provider SmoothScroll
│   │   └── page.tsx            # Pagina principale ad alto impatto visivo
│   ├── components/
│   │   ├── Navbar.tsx          # Barra di navigazione responsive con effetto vetro smerigliato
│   │   ├── Hero.tsx            # Sezione introduttiva animata con Framer Motion
│   │   ├── ArchivePreview.tsx  # Catalogo interattivo delle sintesi con filtri e ricerca live
│   │   ├── TechStack.tsx       # Vetrina dettagliata delle scelte architetturali
│   │   ├── DeployGuide.tsx     # Guida pratica al deploy su Vercel (CLI + Git)
│   │   ├── Footer.tsx          # Footer con link e copyright
│   │   └── SmoothScroll.tsx    # Integrazione client Lenis per lo smooth scroll
│   └── lib/
│       └── utils.ts            # Helper `cn()` con clsx e tailwind-merge
├── public/                     # Asset statici
├── vercel.json                 # Configurazione Vercel con header di sicurezza
├── package.json
└── tsconfig.json
```

---

## 🚀 Avvio Rapido in Locale

1. **Installa le dipendenze** (già eseguito):
   ```bash
   npm install
   ```

2. **Avvia il server di sviluppo Turbopack**:
   ```bash
   npm run dev
   ```
   Apri [http://localhost:3000](http://localhost:3000) nel browser per vedere il sito in esecuzione.

3. **Verifica della build di produzione**:
   ```bash
   npm run build
   ```

---

## 🌐 Deploy su Vercel

### Metodo 1: Tramite Vercel CLI (Più Veloce)

Dalla cartella del progetto:

```bash
npx vercel
```

Segui le istruzioni a video (accetta le opzioni predefinite: Next.js verrà rilevato automaticamente). Per il deploy in produzione:

```bash
npx vercel --prod
```

### Metodo 2: Tramite Git & Dashboard Vercel

1. Inizializza il repository Git (se non ancora presente) e fai il push su GitHub/GitLab:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit - archivio sintesi"
   # collega al tuo repo remoto:
   git remote add origin https://github.com/TUO_UTENTE/archivio-sintesi.git
   git push -u origin main
   ```
2. Vai su [vercel.com/new](https://vercel.com/new).
3. Importa il repository: le impostazioni di build (`next build`) e output directory (`.next`) sono autoconfigurate.
4. Clicca su **Deploy**.
