import { useState } from "react";
import { User, Award, Briefcase, Save, Eye, Camera, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemberRole } from "@/contexts/MemberRoleContext";

// Mock data
const certificates = [
  { id: 1, name: "Python 資料分析入門", date: "2024-01-15", issuer: "桑尼資料科學" },
  { id: 2, name: "SQL 資料庫精通", date: "2023-12-20", issuer: "桑尼資料科學" },
];

const works = [
  { id: 1, title: "電商資料分析專案", description: "使用 Python 分析電商銷售數據", link: "#" },
  { id: 2, title: "機器學習預測模型", description: "建立房價預測模型", link: "#" },
];

export default function MemberProfile() {
  const { isTeacher } = useMemberRole();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">個人簡介</h1>
          <p className="text-muted-foreground mt-1">
            {isTeacher ? "編輯你的講師公開頁面" : "建立你的學習檔案"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            預覽
          </Button>
          <Button variant="cta" className="gap-2">
            <Save className="h-4 w-4" />
            發布
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            基本資料
          </TabsTrigger>
          <TabsTrigger value="certificates" className="gap-2">
            <Award className="h-4 w-4" />
            我的證書
          </TabsTrigger>
          <TabsTrigger value="works" className="gap-2">
            <Briefcase className="h-4 w-4" />
            我的作品
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>個人資訊</CardTitle>
              <CardDescription>這些資訊將會顯示在你的公開頁面</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center relative">
                  <User className="h-12 w-12 text-muted-foreground" />
                  <Button size="icon" variant="secondary" className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <p className="font-medium">頭像照片</p>
                  <p className="text-sm text-muted-foreground">建議使用 400x400 以上的正方形圖片</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名 / 暱稱</Label>
                  <Input id="name" placeholder="輸入你的名稱" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">{isTeacher ? "專業領域" : "職稱"}</Label>
                  <Input id="title" placeholder={isTeacher ? "例如：資料科學家" : "例如：軟體工程師"} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">自我介紹</Label>
                <Textarea id="bio" placeholder="介紹一下你自己..." rows={4} />
              </div>

              {isTeacher && (
                <div className="space-y-2">
                  <Label htmlFor="experience">教學經歷</Label>
                  <Textarea id="experience" placeholder="分享你的教學或工作經驗..." rows={3} />
                </div>
              )}

              <div className="space-y-2">
                <Label>社群連結</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="LinkedIn 連結" />
                  </div>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="GitHub 連結" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>我的證書</CardTitle>
              <CardDescription>完成課程後獲得的電子證書</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="border border-border rounded-lg p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{cert.name}</p>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      <p className="text-xs text-muted-foreground">{cert.date}</p>
                    </div>
                    <Button variant="outline" size="sm">查看</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Works Tab */}
        <TabsContent value="works" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>我的作品</CardTitle>
                  <CardDescription>展示你的課程相關實作作品</CardDescription>
                </div>
                <Button variant="outline" className="gap-2">
                  <Briefcase className="h-4 w-4" />
                  新增作品
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {works.map((work) => (
                  <div key={work.id} className="border border-border rounded-lg p-4">
                    <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                      <Briefcase className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-medium">{work.title}</h4>
                    <p className="text-sm text-muted-foreground">{work.description}</p>
                    <Button variant="link" size="sm" className="p-0 mt-2">
                      查看專案 →
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
