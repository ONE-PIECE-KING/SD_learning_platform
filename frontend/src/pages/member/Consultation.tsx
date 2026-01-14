import { useState } from "react";
import { Calendar as CalendarIcon, Video, Clock, DollarSign, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useMemberRole } from "@/contexts/MemberRoleContext";

// Mock data
const upcomingBookings = [
  { id: 1, teacher: "桑尼老師", date: "2024-01-20", time: "14:00-15:00", status: "confirmed" },
  { id: 2, teacher: "資料分析專家", date: "2024-01-25", time: "10:00-11:00", status: "pending" },
];

const availableSlots = [
  { id: 1, time: "09:00-10:00", available: true },
  { id: 2, time: "10:00-11:00", available: false },
  { id: 3, time: "14:00-15:00", available: true },
  { id: 4, time: "15:00-16:00", available: true },
];

export default function MemberConsultation() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { isTeacher } = useMemberRole();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">一對一諮詢</h1>
        <p className="text-muted-foreground mt-1">
          {isTeacher ? "管理你的諮詢時段與預約" : "預約專業老師的一對一諮詢"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              選擇日期
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {isTeacher ? "設定可預約時段" : "可預約時段"}
            </CardTitle>
            <CardDescription>
              {date?.toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableSlots.map((slot) => (
                <Button
                  key={slot.id}
                  variant={slot.available ? "outline" : "ghost"}
                  disabled={!slot.available && !isTeacher}
                  className="h-auto py-3 flex-col"
                >
                  <span className="font-medium">{slot.time}</span>
                  <span className="text-xs text-muted-foreground">
                    {slot.available ? (isTeacher ? "已開放" : "可預約") : "已預約"}
                  </span>
                </Button>
              ))}
            </div>
            {isTeacher && (
              <Button variant="cta" className="w-full mt-4">
                儲存時段設定
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>{isTeacher ? "即將進行的諮詢" : "我的預約"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Video className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{isTeacher ? "學生諮詢" : booking.teacher}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.date} {booking.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                    {booking.status === "confirmed" ? "已確認" : "待確認"}
                  </Badge>
                  <Button variant="outline" size="sm">取消</Button>
                  <Button variant="cta" size="sm" className="gap-1">
                    <Phone className="h-4 w-4" />
                    進入會議室
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interview Room Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            訪談室
          </CardTitle>
          <CardDescription>預約時間到時，由此進入線上會談室</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary rounded-lg aspect-video max-w-2xl flex items-center justify-center">
            <div className="text-center">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">目前沒有進行中的諮詢</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">剩餘時間: --:--</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">計費: NT$ 0</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-1">
                <MessageSquare className="h-4 w-4" />
                對話
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
