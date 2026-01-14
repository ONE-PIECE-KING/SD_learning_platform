import { useState } from "react";
import { Filter, Download, Receipt, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const transactions = [
  { id: "ORD-2024-001", date: "2024-01-15", course: "Python 資料分析入門", amount: 2000, status: "completed" },
  { id: "ORD-2024-002", date: "2024-01-10", course: "機器學習實戰", amount: 3000, status: "completed" },
  { id: "ORD-2023-045", date: "2023-12-20", course: "SQL 資料庫精通", amount: 1500, status: "completed" },
];

const refunds = [
  { id: "REF-2024-001", date: "2024-01-05", course: "深度學習進階", amount: 2500, status: "refunded" },
];

export default function MemberPurchaseHistory() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">購課記錄</h1>
          <p className="text-muted-foreground mt-1">查看你的消費與退款記錄</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          匯出記錄
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList>
          <TabsTrigger value="transactions" className="gap-2">
            <Receipt className="h-4 w-4" />
            消費明細
            <Badge variant="secondary" className="ml-1">{transactions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="refunds" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            退款記錄
            <Badge variant="secondary" className="ml-1">{refunds.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>消費交易明細</CardTitle>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  篩選
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">訂單編號</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">日期</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">課程名稱</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">金額</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">狀態</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-border last:border-0">
                        <td className="py-3 px-4 text-sm font-mono">{tx.id}</td>
                        <td className="py-3 px-4 text-sm">{tx.date}</td>
                        <td className="py-3 px-4 font-medium">{tx.course}</td>
                        <td className="py-3 px-4 text-right">NT$ {tx.amount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          <Badge variant="outline" className="text-success border-success">
                            已完成
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Refunds Tab */}
        <TabsContent value="refunds" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>退款交易明細</CardTitle>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  篩選
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">退款編號</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">日期</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">課程名稱</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">退款金額</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">狀態</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refunds.map((ref) => (
                      <tr key={ref.id} className="border-b border-border last:border-0">
                        <td className="py-3 px-4 text-sm font-mono">{ref.id}</td>
                        <td className="py-3 px-4 text-sm">{ref.date}</td>
                        <td className="py-3 px-4 font-medium">{ref.course}</td>
                        <td className="py-3 px-4 text-right">NT$ {ref.amount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          <Badge variant="outline">已退款</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
