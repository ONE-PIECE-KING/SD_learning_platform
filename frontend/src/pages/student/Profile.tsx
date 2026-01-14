import { useState } from "react";
import { Camera, Award, Briefcase, Link as LinkIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const certificates = [
  { id: 1, name: "Python 資料科學入門", date: "2024-01-20", verified: true },
  { id: 2, name: "資料視覺化大師班", date: "2024-02-05", verified: true },
];

const works = [
  { id: 1, title: "股票預測模型", description: "使用 LSTM 預測台股走勢", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop" },
  { id: 2, title: "客戶分群分析", description: "RFM 模型與 K-means 聚類", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop" },
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">個人簡介</h1>
          <p className="text-muted-foreground mt-1">建立你的學習檔案，展示學習成果</p>
        </div>
        <Button 
          variant={isEditing ? "cta" : "outline"} 
          onClick={() => setIsEditing(!isEditing)}
          className="gap-2"
        >
          {isEditing ? <><Save className="h-4 w-4" /> 儲存變更</> : "編輯資料"}
        </Button>
      </div>

      {/* Profile Form */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">王</span>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">學習等級：進階</p>
            </div>

            {/* Form Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>暱稱</Label>
                <Input defaultValue="王小明" disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue="wang@example.com" disabled />
              </div>
              <div className="space-y-2">
                <Label>職業</Label>
                <Input defaultValue="軟體工程師" disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <Label>公司/學校</Label>
                <Input defaultValue="科技公司" disabled={!isEditing} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>自我介紹</Label>
                <Textarea 
                  defaultValue="熱愛資料科學，正在學習機器學習與深度學習，希望能轉職成為資料科學家。" 
                  disabled={!isEditing}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>社群連結</Label>
                <div className="flex gap-2">
                  <Input placeholder="GitHub" disabled={!isEditing} />
                  <Input placeholder="LinkedIn" disabled={!isEditing} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Certificates and Works */}
      <Tabs defaultValue="certificates">
        <TabsList>
          <TabsTrigger value="certificates" className="gap-2">
            <Award className="h-4 w-4" />
            我的證書
          </TabsTrigger>
          <TabsTrigger value="works" className="gap-2">
            <Briefcase className="h-4 w-4" />
            我的作品
          </TabsTrigger>
        </TabsList>

        <TabsContent value="certificates" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <Card key={cert.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                      <Award className="h-6 w-6 text-success" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{cert.name}</p>
                        {cert.verified && (
                          <Badge className="bg-success/10 text-success text-xs">已驗證</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">取得日期：{cert.date}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="works" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {works.map((work) => (
              <Card key={work.id} className="overflow-hidden">
                <div className="aspect-video">
                  <img src={work.image} alt={work.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-foreground">{work.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{work.description}</p>
                </CardContent>
              </Card>
            ))}
            <Card className="flex items-center justify-center min-h-[200px] border-dashed">
              <Button variant="outline">+ 新增作品</Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
