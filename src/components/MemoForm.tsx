import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, FileText, Users, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Memo {
  id: string;
  subject: string;
  receivedDate: string;
  from: string;
  to: string;
  dataDispatcher: string;
  content?: string;
}

interface MemoFormProps {
  onMemoSubmit: (memo: Omit<Memo, 'id'>) => void;
}

export const MemoForm = ({ onMemoSubmit }: MemoFormProps) => {
  const [formData, setFormData] = useState({
    subject: "",
    receivedDate: "",
    from: "",
    to: "",
    dataDispatcher: "",
    content: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.from || !formData.to) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Subject, From, To)",
        variant: "destructive"
      });
      return;
    }
    
    onMemoSubmit(formData);
    setFormData({
      subject: "",
      receivedDate: "",
      from: "",
      to: "",
      dataDispatcher: "",
      content: ""
    });
    
    toast({
      title: "Success",
      description: "Memo has been created successfully!"
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        // Simple CSV parsing - in real app, this would be handled by backend
        toast({
          title: "CSV Import",
          description: `Ready to import ${lines.length - 1} records. Connect to Supabase to process the data.`
        });
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Error reading CSV file. Please check the format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary-foreground" />
          <CardTitle className="text-xl">Create New Memo</CardTitle>
        </div>
        <CardDescription>
          Fill in the memo details below. All fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="Enter memo subject"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="receivedDate">Received Date</Label>
              <div className="relative">
                <Input
                  id="receivedDate"
                  type="date"
                  value={formData.receivedDate}
                  onChange={(e) => handleInputChange("receivedDate", e.target.value)}
                />
                <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">From *</Label>
              <Input
                id="from"
                placeholder="Sender name/department"
                value={formData.from}
                onChange={(e) => handleInputChange("from", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="to">To *</Label>
              <Input
                id="to"
                placeholder="Recipient name/department"
                value={formData.to}
                onChange={(e) => handleInputChange("to", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataDispatcher">Data Dispatcher</Label>
            <Input
              id="dataDispatcher"
              placeholder="Data dispatcher name"
              value={formData.dataDispatcher}
              onChange={(e) => handleInputChange("dataDispatcher", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Memo content/description"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <FileText className="mr-2 h-4 w-4" />
              Create Memo
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};