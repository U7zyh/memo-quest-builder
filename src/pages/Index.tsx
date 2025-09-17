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
    <div className="min-h-screen p-4 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">
              Memo Management System
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Streamline your organizational communication with our professional memo management platform
          </p>
        </header>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-muted/50 rounded-xl backdrop-blur-sm">
            <TabsTrigger 
              value="create" 
              className="flex items-center space-x-2 h-12 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
            >
              <FileText className="h-5 w-5" />
              <span className="hidden sm:inline">Create Memo</span>
              <span className="sm:hidden">Create</span>
            </TabsTrigger>
            <TabsTrigger 
              value="list" 
              className="flex items-center space-x-2 h-12 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
            >
              <List className="h-5 w-5" />
              <span className="hidden sm:inline">View Memos</span>
              <span className="sm:hidden">Memos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="flex items-center space-x-2 h-12 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="hidden sm:inline">Reports</span>
              <span className="sm:hidden">Reports</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="mt-8">
            <MemoForm onMemoSubmit={handleMemoSubmit} />
          </TabsContent>
          
          <TabsContent value="list" className="mt-8">
            <MemoList memos={memos} />
          </TabsContent>
          
          <TabsContent value="reports" className="mt-8">
            <ReportGenerator memos={memos} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
