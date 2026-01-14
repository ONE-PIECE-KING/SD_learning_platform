import { Upload, Plus, Video, DollarSign, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CourseUpload() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">課程上架</h1>
        <p className="text-muted-foreground mt-1">建立並發布你的線上課程</p>
      </div>

      <Tabs defaultValue="outline" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            課程大綱
          </TabsTrigger>
          <TabsTrigger value="videos" className="gap-2">
            <Video className="h-4 w-4" />
            影片上傳
          </TabsTrigger>
          <TabsTrigger value="pricing" className="gap-2">
            <DollarSign className="h-4 w-4" />
            定價設定
          </TabsTrigger>
          <TabsTrigger value="submit" className="gap-2">
            <Send className="h-4 w-4" />
            送出審核
          </TabsTrigger>
        </TabsList>

        {/* Outline Tab */}
        <TabsContent value="outline" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>課程基本資訊</CardTitle>
              <CardDescription>填寫課程的基本資料</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">課程名稱</Label>
                <Input id="title" placeholder="輸入課程名稱" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">課程簡介</Label>
                <Textarea id="description" placeholder="描述你的課程內容..." rows={4} />
              </div>
              <div className="space-y-2">
                <Label>課程封面</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">拖曳圖片或點擊上傳</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    選擇檔案
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">目標受眾</Label>
                <Textarea id="audience" placeholder="這堂課適合誰？" rows={2} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>章節管理</CardTitle>
              <CardDescription>建立課程章節並上傳教學影片</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chapter List */}
              <div className="space-y-3">
                {[1, 2].map((chapter) => (
                  <div key={chapter} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">第 {chapter} 章：章節標題</h4>
                      <Button variant="ghost" size="sm">編輯</Button>
                    </div>
                    <div className="space-y-2 pl-4">
                      <div className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">1.1 單元名稱</span>
                        <span className="text-xs text-muted-foreground ml-auto">10:30</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">1.2 單元名稱</span>
                        <span className="text-xs text-muted-foreground ml-auto">15:45</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                新增章節
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>定價設定</CardTitle>
              <CardDescription>設定課程售價與優惠方案</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">課程售價 (TWD)</Label>
                <Input id="price" type="number" placeholder="2000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">早鳥優惠價 (TWD)</Label>
                <Input id="discount" type="number" placeholder="1600" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount-end">早鳥優惠截止日</Label>
                <Input id="discount-end" type="date" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Submit Tab */}
        <TabsContent value="submit" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>送出審核</CardTitle>
              <CardDescription>確認所有資訊後送出審核</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">課程名稱</span>
                  <span className="font-medium">尚未填寫</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">章節數量</span>
                  <span className="font-medium">0 章</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">定價</span>
                  <span className="font-medium">尚未設定</span>
                </div>
              </div>
              <Button variant="cta" className="w-full" disabled>
                <Send className="h-4 w-4 mr-2" />
                送出審核
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                審核通常需要 1-3 個工作天
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
