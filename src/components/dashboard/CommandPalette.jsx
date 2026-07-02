import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, Brain, FolderKanban, FlaskConical, FileText, Database, Users, Lightbulb, Award, Sparkles, Monitor, Sun, Moon, Keyboard } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';
import { demoModeUtil } from '@/utils/demo';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const ENTITY_ICONS = {
  project: FolderKanban,
  experiment: FlaskConical,
  paper: FileText,
  dataset: Database,
  meeting: Users,
  decision: Lightbulb,
  publication: Award
};

export function CommandPalette({ isOpen, onClose }) {
  const { labId } = useParams();
  const navigate = useNavigate();
  const { theme, setTheme, toggleTheme } = useTheme();

  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);
  const listRef = useRef(null);

  // 1. Fetch search candidates from database
  useEffect(() => {
    if (!isOpen || !labId) return;

    async function fetchSearchCandidates() {
      setIsLoading(true);
      try {
        const [
          { data: projects },
          { data: experiments },
          { data: papers },
          { data: datasets },
          { data: meetings },
          { data: decisions },
          { data: publications }
        ] = await Promise.all([
          supabase.from('projects').select('id, name').eq('lab_id', labId).limit(10),
          supabase.from('experiments').select('id, title').eq('lab_id', labId).limit(10),
          supabase.from('research_papers').select('id, title').eq('lab_id', labId).limit(10),
          supabase.from('datasets').select('id, name').eq('lab_id', labId).limit(10),
          supabase.from('meetings').select('id, title').eq('lab_id', labId).limit(10),
          supabase.from('research_decisions').select('id, title').eq('lab_id', labId).limit(10),
          supabase.from('publications').select('id, title').eq('lab_id', labId).limit(10)
        ]);

        const candidates = [];

        (projects || []).forEach(p => candidates.push({ id: p.id, title: p.name, type: 'project', url: `/labs/${labId}/projects/${p.id}` }));
        (experiments || []).forEach(e => candidates.push({ id: e.id, title: e.title, type: 'experiment', url: `/labs/${labId}/experiments/${e.id}` }));
        (papers || []).forEach(p => candidates.push({ id: p.id, title: p.title, type: 'paper', url: `/labs/${labId}/knowledge?tab=papers` }));
        (datasets || []).forEach(d => candidates.push({ id: d.id, title: d.name, type: 'dataset', url: `/labs/${labId}/knowledge?tab=datasets` }));
        (meetings || []).forEach(m => candidates.push({ id: m.id, title: m.title, type: 'meeting', url: `/labs/${labId}/knowledge?tab=meetings` }));
        (decisions || []).forEach(d => candidates.push({ id: d.id, title: d.title, type: 'decision', url: `/labs/${labId}/review` }));
        (publications || []).forEach(pb => candidates.push({ id: pb.id, title: pb.title, type: 'publication', url: `/labs/${labId}/knowledge?tab=papers` }));

        setItems(candidates);
      } catch (err) {
        console.warn('[CommandPalette] Candidates fetch failed:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSearchCandidates();
  }, [isOpen, labId]);

  // Focus input on mount
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  // Static commands list
  const systemCommands = useMemo(() => [
    { title: 'Go to Home Dashboard', type: 'system', action: () => navigate(`/labs/${labId}`) },
    { title: 'Go to Memory Graph Canvas', type: 'system', action: () => navigate(`/labs/${labId}/graph`) },
    { title: 'Go to Research Journey Timeline', type: 'system', action: () => navigate(`/labs/${labId}/journey`) },
    { title: 'Go to AI Research Insights', type: 'system', action: () => navigate(`/labs/${labId}/insights`) },
    { title: 'Go to Workspace Settings', type: 'system', action: () => navigate(`/labs/${labId}/settings`) },
    { title: 'Toggle Dark Mode / Light Mode', type: 'system', action: () => { toggleTheme(); toast.success('Theme preference toggled'); } },
    {
      title: demoModeUtil.isActive() ? 'Deactivate Demo Mode' : 'Activate Demo Mode',
      type: 'system',
      action: () => {
        const next = !demoModeUtil.isActive();
        demoModeUtil.setActive(next);
        toast.info(next ? 'Demo Mode activated (writes blocked)' : 'Demo Mode deactivated');
      }
    }
  ], [labId, navigate, toggleTheme]);

  // Combined searchable list
  const filteredList = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      // Show system commands and first 5 candidates
      return [...systemCommands, ...items.slice(0, 10)];
    }

    const matchedItems = items.filter(item => item.title.toLowerCase().includes(q));
    const matchedCommands = systemCommands.filter(cmd => cmd.title.toLowerCase().includes(q));

    return [...matchedCommands, ...matchedItems];
  }, [query, items, systemCommands]);

  // Keyboard navigation listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredList.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredList.length) % filteredList.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredList[selectedIndex]) {
          handleExecute(filteredList[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredList, selectedIndex, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleExecute = (item) => {
    if (item.type === 'system') {
      item.action();
    } else if (item.url) {
      navigate(item.url);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Main dialog */}
      <div className="relative w-full max-w-lg bg-card/95 border border-border/50 rounded-2xl shadow-2xl flex flex-col max-h-[50vh] overflow-hidden backdrop-blur-md animate-in fade-in duration-200">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 border-b border-border/40 shrink-0">
          <Search className="w-4 h-4 text-muted-foreground/60 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a query or command (e.g. 'theme', 'graph')..."
            className="w-full py-3.5 bg-transparent border-none text-xs font-semibold text-foreground focus:outline-none placeholder:text-muted-foreground/50"
          />
          <kbd className="bg-muted border border-border/50 text-[9px] px-1.5 py-0.5 rounded shadow-sm shrink-0 flex items-center gap-0.5 font-bold">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <ScrollArea className="flex-1 overflow-y-auto" ref={listRef}>
          {filteredList.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground/60 text-xs italic">
              No matching commands or entities found.
            </div>
          ) : (
            <div className="p-2 space-y-0.5">
              {filteredList.map((item, idx) => {
                const isActive = idx === selectedIndex;
                const Icon = item.type === 'system' ? Sparkles : (ENTITY_ICONS[item.type] || Brain);

                return (
                  <button
                    key={idx}
                    data-active={isActive}
                    onClick={() => handleExecute(item)}
                    className={cn(
                      "w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-xs font-semibold select-none cursor-pointer",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted text-foreground/80 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                      <span className="truncate">{item.title}</span>
                    </div>

                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[9px] uppercase tracking-wider font-bold py-0.5 px-1.5",
                        isActive ? "border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10" : "bg-muted border-border/30 text-muted-foreground"
                      )}
                    >
                      {item.type}
                    </Badge>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer shortcuts */}
        <div className="p-3 bg-muted/40 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground font-semibold px-4 shrink-0">
          <span className="flex items-center gap-2">
            <Keyboard className="w-3.5 h-3.5" />
            Use arrow keys to navigate, enter to select
          </span>
          <span>
            ResearchMind Cmd Palette
          </span>
        </div>

      </div>
    </div>
  );
}
export default CommandPalette;
