import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, Database, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PapersTab } from '@/components/knowledge/PapersTab';
import { DatasetsTab } from '@/components/knowledge/DatasetsTab';
import { MeetingsTab } from '@/components/knowledge/MeetingsTab';

export default function KnowledgeBasePage() {
  const { labId } = useParams();
  
  return (
    <div className="flex-1 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">
            Query and explore your lab's stored institutional knowledge.
          </p>
        </div>

        <Tabs defaultValue="papers" className="space-y-6">
          <TabsList className="bg-muted/50 border">
            <TabsTrigger value="papers" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Papers & Publications
            </TabsTrigger>
            <TabsTrigger value="datasets" className="gap-2">
              <Database className="h-4 w-4" />
              Datasets
            </TabsTrigger>
            <TabsTrigger value="meetings" className="gap-2">
              <Users className="h-4 w-4" />
              Meeting Notes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="papers" className="mt-0">
            <PapersTab labId={labId} />
          </TabsContent>
          
          <TabsContent value="datasets" className="mt-0">
            <DatasetsTab labId={labId} />
          </TabsContent>
          
          <TabsContent value="meetings" className="mt-0">
            <MeetingsTab labId={labId} />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
