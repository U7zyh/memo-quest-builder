import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, BarChart3, Calendar, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Memo } from "./MemoForm";

interface ReportGeneratorProps {
  memos: Memo[];
}

export const ReportGenerator = ({ memos }: ReportGeneratorProps) => {
  const [reportConfig, setReportConfig] = useState({
    dateFrom: "",
    dateTo: "",
    filterBy: "all",
    format: "html"
  });
  const { toast } = useToast();

  const generateReport = () => {
    let filteredMemos = memos;

    // Apply date filters
    if (reportConfig.dateFrom) {
      filteredMemos = filteredMemos.filter(memo => 
        memo.receivedDate >= reportConfig.dateFrom
      );
    }
    if (reportConfig.dateTo) {
      filteredMemos = filteredMemos.filter(memo => 
        memo.receivedDate <= reportConfig.dateTo
      );
    }

    // Apply other filters
    if (reportConfig.filterBy !== "all") {
      // Add more filter logic here when connected to backend
    }

    const reportHtml = generateReportHTML(filteredMemos);
    
    if (reportConfig.format === "html") {
      downloadHTMLReport(reportHtml);
    } else {
      downloadCSVReport(filteredMemos);
    }

    toast({
      title: "Report Generated",
      description: `Successfully generated report with ${filteredMemos.length} memos.`
    });
  };

  const generateReportHTML = (memos: Memo[]) => {
    const currentDate = new Date().toLocaleDateString();
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Memo System Report - ${currentDate}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f8fafc; }
        .header { background: #3b82f6; color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0 0 0; opacity: 0.9; }
        .summary { background: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .memo-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .memo-header { border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 15px; }
        .memo-title { font-size: 18px; font-weight: bold; color: #1e293b; margin: 0 0 5px 0; }
        .memo-meta { color: #64748b; font-size: 14px; }
        .memo-content { color: #475569; line-height: 1.6; }
        .stats { display: flex; gap: 20px; margin-bottom: 20px; }
        .stat { background: #f1f5f9; padding: 15px; border-radius: 6px; text-align: center; flex: 1; }
        .stat-number { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .stat-label { color: #64748b; font-size: 14px; margin-top: 5px; }
        @media print { body { margin: 20px; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>📝 Memo System Report</h1>
        <p>Generated on ${currentDate} | Total Memos: ${memos.length}</p>
    </div>
    
    <div class="summary">
        <h2>Report Summary</h2>
        <div class="stats">
            <div class="stat">
                <div class="stat-number">${memos.length}</div>
                <div class="stat-label">Total Memos</div>
            </div>
            <div class="stat">
                <div class="stat-number">${new Set(memos.map(m => m.from)).size}</div>
                <div class="stat-label">Unique Senders</div>
            </div>
            <div class="stat">
                <div class="stat-number">${new Set(memos.map(m => m.to)).size}</div>
                <div class="stat-label">Unique Recipients</div>
            </div>
        </div>
        <p><strong>Report Period:</strong> ${reportConfig.dateFrom || 'All time'} to ${reportConfig.dateTo || 'Present'}</p>
    </div>

    <div class="memos-section">
        <h2>Memo Details</h2>
        ${memos.map(memo => `
            <div class="memo-card">
                <div class="memo-header">
                    <h3 class="memo-title">${memo.subject}</h3>
                    <div class="memo-meta">
                        <strong>From:</strong> ${memo.from} | 
                        <strong>To:</strong> ${memo.to} | 
                        <strong>Date:</strong> ${memo.receivedDate ? new Date(memo.receivedDate).toLocaleDateString() : 'Not specified'}
                        ${memo.dataDispatcher ? ` | <strong>Dispatcher:</strong> ${memo.dataDispatcher}` : ''}
                    </div>
                </div>
                ${memo.content ? `<div class="memo-content">${memo.content}</div>` : ''}
            </div>
        `).join('')}
    </div>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px;">
        <p>Generated by Memo Management System - ${currentDate}</p>
    </div>
</body>
</html>`;
  };

  const downloadHTMLReport = (htmlContent: string) => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memo-report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSVReport = (memos: Memo[]) => {
    const headers = ['Subject', 'From', 'To', 'Received Date', 'Data Dispatcher', 'Content'];
    const csvContent = [
      headers.join(','),
      ...memos.map(memo => [
        `"${memo.subject}"`,
        `"${memo.from}"`,
        `"${memo.to}"`,
        `"${memo.receivedDate || ''}"`,
        `"${memo.dataDispatcher || ''}"`,
        `"${memo.content || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memo-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full professional-card">
      <CardHeader className="pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold">Generate Report</CardTitle>
            <CardDescription className="text-base mt-1">
              Create and download reports in HTML or CSV format
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateFrom">From Date</Label>
            <div className="relative">
              <Input
                id="dateFrom"
                type="date"
                value={reportConfig.dateFrom}
                onChange={(e) => setReportConfig(prev => ({ ...prev, dateFrom: e.target.value }))}
              />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateTo">To Date</Label>
            <div className="relative">
              <Input
                id="dateTo"
                type="date"
                value={reportConfig.dateTo}
                onChange={(e) => setReportConfig(prev => ({ ...prev, dateTo: e.target.value }))}
              />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filterBy">Filter By</Label>
            <Select 
              value={reportConfig.filterBy} 
              onValueChange={(value) => setReportConfig(prev => ({ ...prev, filterBy: value }))}
            >
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Memos</SelectItem>
                <SelectItem value="recent">Recent (Last 30 days)</SelectItem>
                <SelectItem value="urgent">Urgent Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="format">Report Format</Label>
            <Select 
              value={reportConfig.format} 
              onValueChange={(value) => setReportConfig(prev => ({ ...prev, format: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="html">HTML Report</SelectItem>
                <SelectItem value="csv">CSV Export</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border/50">
          <Button onClick={generateReport} className="flex-1 h-12 text-base gradient-primary hover:opacity-90 transition-opacity">
            <FileDown className="mr-2 h-5 w-5" />
            Generate & Download Report
          </Button>
        </div>

        <div className="text-sm bg-gradient-to-r from-muted/30 to-muted/50 p-4 rounded-lg border-l-4 border-primary">
          <p className="font-semibold text-foreground mb-2">Report will include:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              Summary statistics
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              Filtered memo details
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              Professional formatting
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              Print-friendly layout (HTML)
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};