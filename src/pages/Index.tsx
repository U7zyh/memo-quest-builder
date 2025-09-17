import { useState } from "react";
import { MemoForm, Memo } from "@/components/MemoForm";
import { MemoList } from "@/components/MemoList";
import { ReportGenerator } from "@/components/ReportGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, List, BarChart3 } from "lucide-react";

const Index = () => {
  const [memos, setMemos] = useState<Memo[]>([]);

  const handleMemoSubmit = (memoData: Omit<Memo, 'id'>) => {
    const newMemo: Memo = {
      ...memoData,
      id: Date.now().toString(),
    };
    setMemos(prev => [newMemo, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            📝 Memo Management System
          </h1>
          <p className="text-muted-foreground">
            Create, manage, and generate reports for your organizational memos
          </p>
        </header>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Create Memo</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center space-x-2">
              <List className="h-4 w-4" />
              <span>View Memos</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="mt-6">
            <MemoForm onMemoSubmit={handleMemoSubmit} />
          </TabsContent>
          
          <TabsContent value="list" className="mt-6">
            <MemoList memos={memos} />
          </TabsContent>
          
          <TabsContent value="reports" className="mt-6">
            <ReportGenerator memos={memos} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
