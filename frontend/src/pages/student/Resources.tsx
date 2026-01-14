import { useState } from "react";
import { PenLine, Share2, Eye, Heart, MessageSquare, Plus, FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sharedNotes = [
  {
    id: 1,
    title: "Python for 迴圈完整筆記",
    course: "Python 資料科學入門",
    views: 128,
    likes: 24,
    date: "2024-02-01",
  },
  {
    id: 2,
    title: "機器學習演算法比較表",
    course: "機器學習實戰班",
    views: 256,
    likes: 48,
    date: "2024-01-25",
  },
];

const myArticles = [
  {
    id: 1,
    title: "從零開始學習 Python 的 10 個建議",
    category: "知識分享",
    status: "published",
    views: 512,
    comments: 12,
    date: "2024-02-05",
  },
];

export default function Resources() {
  const [isWriting, setIsWriting] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">資源分享</h1>
          <p className="text-muted-foreground mt-1">分享你的筆記與知識，幫助更多人學習</p>
        </div>
        <Button variant="cta" className="gap-2" onClick={() => setIsWriting(true)}>
          <Plus className="h-4 w-4" />
          撰寫文章
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">2</p>
                <p className="text-sm text-muted-foreground">共享筆記</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <PenLine className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1</p>
                <p className="text-sm text-muted-foreground">發布文章</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cta/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-cta" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">896</p>
                <p className="text-sm text-muted-foreground">總瀏覽數</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Heart className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">72</p>
                <p className="text-sm text-muted-foreground">獲得讚數</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="notes">
        <TabsList>
          <TabsTrigger value="notes" className="gap-2">
            <BookOpen className="h-4 w-4" />
            共享筆記
          </TabsTrigger>
          <TabsTrigger value="articles" className="gap-2">
            <PenLine className="h-4 w-4" />
            我的文章
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-4">
          <div className="space-y-4">
            {sharedNotes.map((note) => (
              <Card key={note.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{note.title}</p>
                        <p className="text-sm text-muted-foreground">{note.course}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {note.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" /> {note.likes}
                          </span>
                          <span>{note.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">編輯</Button>
                      <Button variant="outline" size="sm">取消分享</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="articles" className="mt-4">
          {isWriting ? (
            <Card>
              <CardHeader>
                <CardTitle>撰寫新文章</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>文章標題</Label>
                  <Input placeholder="輸入吸引人的標題..." />
                </div>
                <div className="space-y-2">
                  <Label>文章分類</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇分類" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">技術新訊</SelectItem>
                      <SelectItem value="knowledge">知識分享</SelectItem>
                      <SelectItem value="career">轉職案例</SelectItem>
                      <SelectItem value="prompt">提示詞工程</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>文章內容</Label>
                  <Textarea placeholder="開始撰寫你的文章..." className="min-h-[300px]" />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsWriting(false)}>取消</Button>
                  <Button variant="outline">儲存草稿</Button>
                  <Button variant="cta">發布文章</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myArticles.map((article) => (
                <Card key={article.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                          <PenLine className="h-6 w-6 text-success" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{article.title}</p>
                            <Badge className="bg-success/10 text-success text-xs">已發布</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{article.category}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" /> {article.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" /> {article.comments}
                            </span>
                            <span>{article.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">編輯</Button>
                        <Button variant="outline" size="sm">查看</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
