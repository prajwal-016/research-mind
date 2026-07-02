# ResearchMind: Hackathon Submission & Demo Kit

Welcome to the hackathon submission kit for **ResearchMind**. This document contains all the materials required for submission, judging, and live presentation.

---

## 📄 Project Description

### The Problem
Academic research laboratories lose valuable knowledge when researchers graduate or transition out of projects. Hypotheses that failed, details on why a dataset formatting was chosen, and casual sync decisions are buried in PDF uploads, chats, or unindexed notebooks. Relational databases store *what* was done, but lose the *why*—the connections between why an experiment succeeded, what paper suggested the method, and which dataset it evaluated.

### Our Solution
**ResearchMind** is the first AI-driven **Institutional Memory Layer** for scientific research teams. It bridges the gap between relational records (managed via Supabase) and semantic relationships (extracted via Cognee's knowledge graphs). Using Google Gemini as its reasoning engine, the system acts as a proactive co-pilot. Instead of waiting to be queried, it automatically analyzes lab memory graphs to recommend papers, warn researchers about duplicate experiments before they run, flag research gaps in project timelines, and chart complete project lifecycles from initial sketch to NeurIPS/ArXiv publications.

---

## 🏆 Judging Highlights

1. **Dual-Layer Architecture (Supabase + Cognee)**: Relational tables remain the system of record. Cognee manages long-term memory, semantic graph nodes, and relationship discovery.
2. **Proactive AI Reasoning (Google Gemini)**: The system feeds structured laboratory context and Cognee relationships to Gemini, generating actionable insights (Gaps, duplicate indicators, methodologies).
3. **Interactive React Flow Memory Graph**: Renders hundreds of nodes withHorizontal positioning based on entity hierarchy, offering real-time search query highlighting (dimming non-matching node paths to 15% opacity).
4. **Resilient Sync Engine**: Features a background `memory_queue` retry table inside Supabase, supporting automated backoffs so Cognee stays in sync even during transient server timeouts.
5. **Polished Command Palette (Ctrl+K)**: Instant search and system execution stubs, providing a super-premium keyboard-first user experience.
6. **Robust Hackathon Demo Safety**: Features a one-click **Demo Mode** toggle that intercept and block all destructive Supabase writes, preventing presentation hiccups.

---

## 🎙️ 5-Minute Pitch & Demo Script

### [0:00 - 1:00] Slide Presentation: The Problem
- **Pitch**: *"Meet Sarah. She is a first-year PhD candidate joining our AI Lab. She spends her first three months reading papers and running tests. What she doesn't know is that two years ago, a former student ran the exact same experiment, hit a latency bottleneck, and abandoned it. That knowledge is lost. Today, we change that."*
- **Value**: Introduce ResearchMind: preserving the why, mapping knowledge graphs, and proactively assisting researchers.

### [1:00 - 2:00] Entering the Dashboard
- **Action**: Load the workspace overview. Show the live **Memory Health Score** (94%) and live entity counts.
- **Script**: *"Here is our AI NLP Lab Workspace. All metrics here are queried dynamically. Sarah doesn't have to read files. She opens the Left Sidebar, clicks Recall Memory, or presses Ctrl+K to toggle the Command Palette. We type 'Latency' and navigate directly to our active trial."*

### [2:00 - 3:00] Visualizing with the Memory Graph
- **Action**: Navigate to the **Memory Graph** page. Search for *"FAISS"*.
- **Script**: *"Sarah wants to see how indexing is linked. In our interactive canvas, typing 'FAISS' dims unrelated nodes to 15% opacity, highlighting the path: Project -> Experiment -> Dataset -> Decision. She clicks the Experiment node. The Right Panel slides out, showing Alice Chen logged it, its status is completed, and offers a button to query AI memory about it."*

### [3:00 - 4:00] Exploring the Timeline & Proactive AI Insights
- **Action**: Navigate to **Research Journey** timeline, then **AI Research Insights**.
- **Script**: *"On the Research Journey, we see the complete chronological path of Sarah's project, from raw idea to NeurIPS publication. In our AI Research Insights tab, the system proactively warns us: 'Duplicate research detected. A highly similar FAISS indexing experiment was completed in 2025 by Priya Nair.' The reasoning block outlines the exact parameter overlaps, suggesting Sarah reach out to Priya for collaboration."*

### [4:00 - 5:00] Demo Mode & Settings
- **Action**: Navigate to **Settings**. Toggle **Demo Mode** on. Try to delete an experiment to trigger the warning toast.
- **Script**: *"For a flawless hackathon demo, we built Demo Mode. By turning it on in settings, all relational deletes are blocked locally. If I try to delete a record during a pitch, it safely warns me. The build is fully compiled, verified, and ready for deployment!"*

---

## 🛠️ API & Integration Documentation

### 1. Supabase Event Queues
- **Table**: `memory_queue`
- **Columns**: `id` (UUID), `operation` (text), `entity_type` (text), `payload` (JSONB), `status` (text), `retry_count` (int), `last_error` (text).
- **Behavior**: Relational services trigger fire-and-forget hooks. If Cognee returns a transient `5xx` error, the record is stored as `pending` and retried automatically.

### 2. Cognee Graph Ingestion
- **POST** `/api/v1/add`: Ingests structured text blocks.
- **POST** `/api/v1/cognify`: Processes text blocks into semantic nodes.
- **POST** `/api/v1/search`: Queries graph nodes (`GRAPH_COMPLETION` or `INSIGHTS`).

### 3. Google Gemini Synthesis
- **Model**: `gemini-1.5-flash`
- **Input**: Supabase entities list + Cognee semantic triples.
- **Output**: Valid JSON array of recommendation insights.

---

## 🤖 AI Disclosure & Tooling

The following AI assistants and utilities were used in the development of ResearchMind:
- **Antigravity (Google DeepMind)**: Core coding companion used to orchestrate services integration, write React components, design React Flow layout adapters, construct Gemini prompts, and verify production builds.
- **Supabase AI Assistant**: Assisted in writing the PL/pgSQL database seed functions and foreign key relational constraint triggers.
