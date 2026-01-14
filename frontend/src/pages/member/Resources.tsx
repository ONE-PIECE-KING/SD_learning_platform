import { useState } from "react";
import { Share2, FileText, BookOpen, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemberRole } from "@/contexts/MemberRoleContext";

// Mock data
const articles = [
  { id: 1, title: "Python 資料視覺化技巧", category: "技術新訊", status: "published", date: "2024-01-10", views: 256 },
  { id: 2, title: "機器學習入門指南", category: "知識分享", status: "draft", date: "2024-01-15", views: 0 },
];

const sharedNotes = [
  { id: 1, course: "Python 資料分析入門", chapter: "第一章", shares: 12, likes: 45 },
  { id: 2, course: "SQL 資料庫精通", chapter: "第三章", shares: 8, likes: 23 },
];

export default function MemberResources() {
  const { isTeacher } = useMemberRole();
  const [isWriting, setIsWriting] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">資源分享</h1>
          <p className="text-muted-foreground mt-1">
            {isTeacher ? "撰寫與發布專業文章" : "分享你的學習筆記"}
          </p>
        </div>
        <Button variant="cta" className="gap-2" onClick={() => setIsWriting(true)}>
          <Plus className="h-4 w-4" />
          {isTeacher ? "撰寫文章" : "分享筆記"}
        </Button>
      </div>

      {isWriting ? (
        /* Article Writing Mode */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              撰寫文章
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">文章標題</Label>
              <Input id="title" placeholder="輸入文章標題" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">文章分類</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="選擇分類" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">技術新訊</SelectItem>
                  <SelectItem value="knowledge">知識分享</SelectItem>
                  <SelectItem value="tutorial">教學文章</SelectItem>
                  <SelectItem value="experience">學習心得</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">文章內容</Label>
              <Textarea id="content" placeholder="開始撰寫你的文章..." rows={12} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsWriting(false)}>取消</Button>
              <Button variant="outline">儲存草稿</Button>
              <Button variant="cta">發布文章</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Resource List Mode */
        <Tabs defaultValue="articles" className="w-full">
          <TabsList>
            <TabsTrigger value="articles" className="gap-2">
              <FileText className="h-4 w-4" />
              我的文章
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-2">
              <BookOpen className="h-4 w-4" />
              筆記分享
            </TabsTrigger>
          </TabsList>

          {/* Articles Tab */}
          <TabsContent value="articles" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>我的文章</CardTitle>
                <CardDescription>管理你發布的文章</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {articles.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{article.title}</h4>
                          <Badge variant={article.status === "published" ? "default" : "secondary"}>
                            {article.status === "published" ? "已發布" : "草稿"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{article.category}</span>
                          <span>{article.date}</span>
                          {article.status === "published" && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {article.views} 次觀看
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>筆記分享</CardTitle>
                <CardDescription>你分享給其他同學的課程筆記</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sharedNotes.map((note) => (
                    <div key={note.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{note.course}</h4>
                          <p className="text-sm text-muted-foreground">{note.chapter}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" />
                          {note.shares}
                        </span>
                        <span>❤️ {note.likes}</span>
                        <Button variant="outline" size="sm">取消分享</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
