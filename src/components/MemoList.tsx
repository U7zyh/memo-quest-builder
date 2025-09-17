import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, User, ArrowRight, FileText } from "lucide-react";
import { Memo } from "./MemoForm";

interface MemoListProps {
  memos: Memo[];
  onMemoSelect?: (memo: Memo) => void;
}

export const MemoList = ({ memos, onMemoSelect }: MemoListProps) => {
  if (memos.length === 0) {
    return (
      <Card className="w-full professional-card">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-6">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl mb-3">No Memos Yet</CardTitle>
          <CardDescription className="text-center max-w-sm">
            Create your first memo using the form above or import from CSV to get started.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Recent Memos</h2>
        <Badge variant="secondary" className="px-3 py-1 text-sm">
          {memos.length} {memos.length === 1 ? 'memo' : 'memos'}
        </Badge>
      </div>
      
      <div className="grid gap-6">
        {memos.map((memo) => (
          <Card 
            key={memo.id} 
            className="professional-card transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            onClick={() => onMemoSelect?.(memo)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <CardTitle className="text-lg leading-tight font-semibold">
                    {memo.subject}
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm">
                    <div className="flex items-center space-x-2 px-3 py-2 bg-muted/50 rounded-lg">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">From:</span>
                      <span className="font-medium">{memo.from}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
                    <div className="flex items-center space-x-2 px-3 py-2 bg-muted/50 rounded-lg">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">To:</span>
                      <span className="font-medium">{memo.to}</span>
                    </div>
                  </div>
                </div>
                {memo.receivedDate && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-accent/50 rounded-lg text-sm">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    <span className="font-medium">{new Date(memo.receivedDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            
            {(memo.content || memo.dataDispatcher) && (
              <CardContent className="pt-0 space-y-3">
                {memo.content && (
                  <div className="p-4 bg-gradient-to-r from-muted/30 to-muted/50 rounded-lg border-l-4 border-primary">
                    <p className="text-foreground leading-relaxed">
                      {memo.content}
                    </p>
                  </div>
                )}
                {memo.dataDispatcher && (
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="px-3 py-1">
                      Dispatcher: {memo.dataDispatcher}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      View Details →
                    </Button>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};