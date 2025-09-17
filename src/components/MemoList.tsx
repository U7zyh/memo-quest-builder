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
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-lg mb-2">No Memos Yet</CardTitle>
          <CardDescription>
            Create your first memo using the form above or import from CSV.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Recent Memos</h2>
        <Badge variant="secondary" className="text-sm">
          {memos.length} {memos.length === 1 ? 'memo' : 'memos'}
        </Badge>
      </div>
      
      <div className="grid gap-4">
        {memos.map((memo) => (
          <Card 
            key={memo.id} 
            className="transition-all duration-200 hover:shadow-md cursor-pointer"
            onClick={() => onMemoSelect?.(memo)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base leading-tight">
                    {memo.subject}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>From: {memo.from}</span>
                    </div>
                    <ArrowRight className="h-3 w-3" />
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>To: {memo.to}</span>
                    </div>
                  </div>
                </div>
                {memo.receivedDate && (
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    <span>{new Date(memo.receivedDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            
            {(memo.content || memo.dataDispatcher) && (
              <CardContent className="pt-0">
                {memo.content && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {memo.content}
                  </p>
                )}
                {memo.dataDispatcher && (
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Dispatcher: {memo.dataDispatcher}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
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