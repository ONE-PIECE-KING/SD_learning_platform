import { useState } from "react";
import { Filter, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const transactions = [
  {
    id: "TXN-2024-001",
    date: "2024-01-15",
    course: "Python 資料科學入門",
    amount: 2980,
    status: "completed",
    method: "信用卡",
  },
  {
    id: "TXN-2024-002",
    date: "2024-01-20",
    course: "機器學習實戰班",
    amount: 4980,
    status: "completed",
    method: "Line Pay",
  },
  {
    id: "TXN-2024-003",
    date: "2024-02-01",
    course: "資料視覺化大師班",
    amount: 1980,
    status: "completed",
    method: "信用卡",
  },
  {
    id: "TXN-2024-004",
    date: "2024-02-10",
    course: "SQL 資料庫管理",
    amount: 2480,
    status: "pending",
    method: "ATM 轉帳",
  },
];

const refunds = [
  {
    id: "RFD-2024-001",
    date: "2024-01-25",
    course: "Excel 進階應用",
    amount: 1280,
    status: "completed",
    reason: "重複購買",
  },
];

export default function PurchaseHistory() {
  const [activeTab, setActiveTab] = useState("transactions");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success/10 text-success border-success/20">已完成</Badge>;
      case "pending":
        return <Badge className="bg-cta/10 text-cta border-cta/20">處理中</Badge>;
      case "failed":
        return <Badge variant="destructive">失敗</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">購課記錄</h1>
          <p className="text-muted-foreground mt-1">查看您的消費與退款明細</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          匯出記錄
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground">總消費金額</p>
          <p className="text-2xl font-bold text-foreground mt-1">NT$ 12,420</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground">購買課程數</p>
          <p className="text-2xl font-bold text-foreground mt-1">4</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground">退款金額</p>
          <p className="text-2xl font-bold text-muted-foreground mt-1">NT$ 1,280</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="transactions">消費記錄</TabsTrigger>
            <TabsTrigger value="refunds">退款記錄</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            篩選
          </Button>
        </div>

        <TabsContent value="transactions" className="mt-4">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>訂單編號</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead>課程名稱</TableHead>
                  <TableHead>付款方式</TableHead>
                  <TableHead className="text-right">金額</TableHead>
                  <TableHead>狀態</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">{tx.id}</TableCell>
                    <TableCell>{tx.date}</TableCell>
                    <TableCell>{tx.course}</TableCell>
                    <TableCell>{tx.method}</TableCell>
                    <TableCell className="text-right">NT$ {tx.amount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(tx.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="refunds" className="mt-4">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>退款編號</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead>課程名稱</TableHead>
                  <TableHead>退款原因</TableHead>
                  <TableHead className="text-right">金額</TableHead>
                  <TableHead>狀態</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refunds.map((rf) => (
                  <TableRow key={rf.id}>
                    <TableCell className="font-medium">{rf.id}</TableCell>
                    <TableCell>{rf.date}</TableCell>
                    <TableCell>{rf.course}</TableCell>
                    <TableCell>{rf.reason}</TableCell>
                    <TableCell className="text-right">NT$ {rf.amount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(rf.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="icon" disabled>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="default" size="icon">1</Button>
        <Button variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
