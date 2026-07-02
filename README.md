# ResearchMind 🧠
> **The AI-Powered Institutional Memory Layer for Academic Research Laboratories.**

ResearchMind is an advanced scientific workspace designed to preserve, query, and visualize years of institutional knowledge. It sits as an intelligent semantic layer on top of relational research data, mapping the links between projects, researchers, experiments, datasets, meetings, and publications. By integrating **Cognee** for knowledge graph generation and **Google Gemini** for synthesis reasoning, it proactively alerts researchers to duplicate studies, suggests collaborations, maps research journeys, and answers natural language questions about the lab's history.

---

## 🚀 Key Features

### 1. Workspace Lifecycle Hub
- **Labs & Projects Management**: Multi-lab workspace supporting research organization by labs and individual projects.
- **Entity Registries**: Dedicated schemas and dashboards for **Experiments** (hypotheses, methodology, results), **Datasets** (versions, storage size, formatting), **Meetings** (agendas, action items), and **Publications** (venues, submission status).

### 2. Cognee Institutional Memory Layer
- **Recall Center (AI Chat)**: A responsive 3-column chat interface where researchers query years of lab knowledge in natural language, receiving Gemini-synthesized answers backed by supporting entity citations and memory breadcrumb paths.
- **Memory Sync Engine**: Hooks into Supabase mutations, automatically queuing memory additions (`remember()`), validations (`improve()`), and prunes (`forget()`) to sync the Cognee semantic graph.
- **Offline Sync Queue**: Utilizes an automated Supabase table queue with exponential backoff retries to guarantee memory sync even during transient network or server timeouts.

### 3. Interactive Memory Graph
- **React Flow Canvas**: Dynamic, color-coded rendering of all lab nodes (Projects, Papers, Researchers, Experiments, etc.) and their semantic links.
- **Query Highlighting**: Highlighting searches by keeping matching nodes and direct neighbors opaque while dimming others to 15%.
- **Metadata Drawer**: Slide-out panel presenting node details, file links, and AI query shortcuts.

### 4. Research Journey Timeline
- **Chronological Lifecycle**: Maps projects from initial hypothesis sync down to publications.
- **Milestone Checklist**: Automatically scans database logs to confirm major discoveries, paper submissions, and accepted publications.
- **Knowledge Growth Trend**: Interactive Chart.js trend line plotting node generation volume week-over-week.

### 5. Proactive AI Research Insights
- **Insights Dashboard**: Proactively scans Supabase states and Cognee relationships, feeding them to Google Gemini to auto-generate structured cards (Duplicate Research warnings, Research Gaps, Potential Collaborators).
- **History & Save Sinks**: Allows researchers to save critical insights or ignore/archive them.

### 6. Hackathon Demo Ready
- **Demo Mode**: One-click toggle in Settings that locks Supabase writes and shows persistent alerts, preventing live presentation data corruption.
- **Command Palette (Ctrl + K)**: Universal search overlay to jump to pages or execute theme and demo toggle commands instantly.
- **Dark Mode**: Polished appearance persistence using class-based Tailwind overrides.
- **Mobile Collapsible Layout**: Clean hamburger overlays collapsing sidebars on tablet and phone viewports.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19, Vite, Tailwind CSS 4, shadcn/ui
- **State & Routing**: React Router 7, React Hooks, LocalStorage persistence
- **Canvas Rendering**: React Flow v11 (custom layouts & layout nodes)
- **Data Visualization**: Chart.js, react-chartjs-2
- **Backend & Auth**: Supabase Database, Supabase Auth, Supabase Storage, Realtime
- **Semantic Memory**: Cognee REST engine (Graph database and entity indexing)
- **Reasoning Layer**: Google Gemini API (`gemini-1.5-flash`)

---

## 📐 Architecture Overview

```
                      +-------------------+
                      |   React Frontend  |
                      +---------+---------+
                                |
             +------------------+------------------+
             |                                     |
             v                                     v
     +---------------+                     +---------------+
     |   Supabase    |                     |    Cognee     |
     |  (Relational  |                     |   (Semantic   |
     |   Database)   |                     | Memory Graph) |
     +-------+-------+                     +-------+-------+
             |                                     |
             +------------------+------------------+
                                |
                                v
                      +-------------------+
                      |   Google Gemini   |
                      | (Synthesis/Logic) |
                      +-------------------+
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Gemini API Configuration (Synthesis Reasoning)
VITE_GEMINI_API_KEY=your-google-gemini-api-key

# Cognee API Configuration (Institutional Memory Graph)
VITE_COGNEE_API_URL=http://localhost:8000
VITE_COGNEE_API_KEY=your-cognee-api-key-here
```

---

## 📦 Getting Started

### 1. Prerequisities
Install Node.js (version 18 or higher).

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Database Seeding (Supabase)
Run the SQL queries in `supabase/schema.sql` and `supabase/memory_queue.sql` inside your Supabase SQL editor. To seed the database with sample lab data, execute:
```bash
node seed.js
```

### 4. Running Locally
Start the development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📂 Folder Structure

```
src/
├── components/          # Reusable UI widgets & forms
│   ├── dashboard/       # Command Palette & Health ring components
│   ├── graph/           # React Flow nodes, legends, and details drawers
│   ├── journey/         # Timeline step cards and filters
│   └── memory/          # Search overlays and history sidebars
├── context/             # React Theme & state contexts
├── data/                # Seed structures
├── layouts/             # Workspace & root layout wrappers
├── pages/               # Main viewpages (Journey, Graph, Insights, Settings)
├── routes/              # Client-side router mappings
├── services/            # Supabase API clients & Cognee/Gemini services
└── utils/               # Formatting helper scripts and layout layouters
```

---

## 🔮 Future Scope
- **Direct PDF/Paper Parsing**: Integrated OCR to feed paper figures directly into Cognee's structural nodes.
- **Autonomous Lab Assistants**: Agents that automatically run background jobs to evaluate hypotheses using Gemini and report results.
- **Federated Lab Network**: Secure memory sharing across multiple university lab instances without leaking raw dataset files.
