import { Link } from "react-router-dom";
import { GraduationCap, Move, Bell, Shield, CreditCard, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Settings() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">設定</h1>
        <p className="text-muted-foreground mt-1">管理你的帳號與偏好設定</p>
      </div>

      {/* Become Teacher CTA */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground">我要當老師</h3>
              <p className="text-muted-foreground text-sm mt-1">
                分享你的專業知識，成為桑尼資料科學的講師，開始你的線上教學之旅
              </p>
            </div>
            <Button variant="cta" asChild>
              <Link to="/become-teacher">了解更多</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Nav Edit */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Move className="h-5 w-5 text-muted-foreground" />
            <CardTitle>導航列編輯</CardTitle>
          </div>
          <CardDescription>自訂側邊欄的項目順序與顯示</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {["我的課程", "購課記錄", "一對一諮詢", "設定", "個人簡介", "資源分享"].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Move className="h-4 w-4 text-muted-foreground cursor-move" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <CardTitle>通知設定</CardTitle>
          </div>
          <CardDescription>管理你想接收的通知類型</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>課程更新通知</Label>
              <p className="text-sm text-muted-foreground">當課程有新單元時通知我</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>促銷活動通知</Label>
              <p className="text-sm text-muted-foreground">接收限時優惠與活動資訊</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Email 電子報</Label>
              <p className="text-sm text-muted-foreground">每週學習精選與技術新知</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Other Settings Links */}
      <Card>
        <CardContent className="p-0">
          <Link to="/student/settings/security" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">帳號安全</p>
                <p className="text-sm text-muted-foreground">密碼、兩步驟驗證</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
          <Link to="/student/settings/payment" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-t border-border">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">付款方式</p>
                <p className="text-sm text-muted-foreground">管理信用卡與付款設定</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
