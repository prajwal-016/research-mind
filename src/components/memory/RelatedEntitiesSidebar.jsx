import { Link, useParams } from 'react-router-dom';
import { FlaskConical, FileText, Users, Lightbulb, Database, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * RelatedEntitiesSidebar — Right sidebar displaying connected entities and similar discoveries.
 * Includes relevance score matching and links to navigate directly to workspace details.
 */
export function RelatedEntitiesSidebar({
  experiments = [],
  papers = [],
  meetings = [],
  decisions = [],
  datasets = [],
  publications = [],
  isLoading = false
}) {
  const { labId } = useParams();

  const renderSection = (title, items, icon, pathBuilder, entityTypeLabel) => {
    if (!items || items.length === 0) return null;
    const Icon = icon;

    return (
      <div className="space-y-2">
        <h5 className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider px-1">
          {title} ({items.length})
        </h5>
        <div className="space-y-1.5">
          {items.map((item, idx) => {
            const path = pathBuilder(item.id);
            return (
              <Link
                key={idx}
                to={path}
                className="block p-3 rounded-xl border bg-card/50 hover:bg-primary/5 hover:border-primary/20 transition-all text-xs group"
              >
                <div className="flex gap-2">
                  <div className="p-1 rounded bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="font-semibold text-foreground/85 group-hover:text-foreground line-clamp-2 leading-tight">
                      {item.title}
                    </p>
                    {item.relevance !== undefined && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground">Relevance</span>
                        <Badge variant="outline" className="h-4 text-[9px] px-1 bg-primary/5 border-primary/10">
                          {Math.round((item.relevance || 1) * 100)}%
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  const hasAnyItems = experiments.length > 0 || papers.length > 0 ||
                      meetings.length > 0 || decisions.length > 0 ||
                      datasets.length > 0 || publications.length > 0;

  return (
    <div className="w-72 h-full flex flex-col border-l bg-card/45 shrink-0 select-none">
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-6">
          <div className="px-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Memory Context
            </h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Connected nodes extracted from graph memory matching this query.
            </p>
          </div>

          <hr className="border-border/40" />

          {isLoading ? (
            <div className="space-y-4 py-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="space-y-2 animate-pulse px-1">
                  <div className="h-3 w-20 bg-muted rounded" />
                  <div className="h-16 bg-muted rounded-xl" />
                </div>
              ))}
            </div>
          ) : !hasAnyItems ? (
            <div className="text-center py-12 text-muted-foreground/60 px-2">
              <Sparkles className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-xs italic">No related nodes discovered.</p>
              <p className="text-[10px] mt-1">Submit a question to see related entities in the graph.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Related Experiments */}
              {renderSection(
                'Experiments',
                experiments,
                FlaskConical,
                (id) => `/labs/${labId}/experiments/${id}`,
                'Experiment'
              )}

              {/* Related Papers */}
              {renderSection(
                'Research Papers',
                papers,
                FileText,
                () => `/labs/${labId}/knowledge?tab=papers`,
                'Paper'
              )}

              {/* Related Meetings */}
              {renderSection(
                'Meeting Notes',
                meetings,
                Users,
                () => `/labs/${labId}/knowledge?tab=meetings`,
                'Meeting'
              )}

              {/* Related Decisions */}
              {renderSection(
                'Decisions',
                decisions,
                Lightbulb,
                () => `/labs/${labId}/review`,
                'Decision'
              )}

              {/* Datasets */}
              {renderSection(
                'Datasets',
                datasets,
                Database,
                () => `/labs/${labId}/knowledge?tab=datasets`,
                'Dataset'
              )}

              {/* Publications */}
              {renderSection(
                'Publications',
                publications,
                FileText,
                () => `/labs/${labId}/knowledge?tab=papers`,
                'Publication'
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
