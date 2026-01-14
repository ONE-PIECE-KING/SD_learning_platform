import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Video, MessageSquare, User, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const teachers = [
  {
    id: 1,
    name: "桑尼老師",
    avatar: "桑",
    specialty: "機器學習 / Python",
    rating: 4.9,
    sessions: 128,
    price: 800,
    available: ["09:00", "10:00", "14:00", "15:00"],
  },
  {
    id: 2,
    name: "David 老師",
    avatar: "D",
    specialty: "資料工程 / SQL",
    rating: 4.8,
    sessions: 96,
    price: 700,
    available: ["11:00", "13:00", "16:00"],
  },
];

const upcomingBookings = [
  {
    id: 1,
    teacher: "桑尼老師",
    date: "2024-02-15",
    time: "14:00 - 15:00",
    topic: "機器學習模型調參",
    status: "upcoming",
  },
];

const pastBookings = [
  {
    id: 1,
    teacher: "David 老師",
    date: "2024-02-01",
    time: "10:00 - 11:00",
    topic: "SQL 效能優化",
    status: "completed",
  },
];

export default function Consultation() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">一對一諮詢</h1>
        <p className="text-muted-foreground mt-1">預約專家指導，解決你的學習疑問</p>
      </div>

      <Tabs defaultValue="booking">
        <TabsList>
          <TabsTrigger value="booking">預約諮詢</TabsTrigger>
          <TabsTrigger value="upcoming">即將進行</TabsTrigger>
          <TabsTrigger value="history">歷史記錄</TabsTrigger>
        </TabsList>

        <TabsContent value="booking" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card>
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

            {/* Teacher Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  選擇老師
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {teachers.map((teacher) => (
                  <button
                    key={teacher.id}
                    onClick={() => setSelectedTeacher(teacher.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      selectedTeacher === teacher.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="font-medium text-primary">{teacher.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{teacher.name}</p>
                        <p className="text-xs text-muted-foreground">{teacher.specialty}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3 w-3 fill-cta text-cta" />
                          {teacher.rating}
                        </div>
                        <p className="text-xs text-muted-foreground">{teacher.sessions} 場</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">NT$ {teacher.price}/hr</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Time Selection & Booking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  選擇時段
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTeacher ? (
                  <>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {teachers
                        .find((t) => t.id === selectedTeacher)
                        ?.available.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                    </div>
                    {selectedTime && (
                      <div className="space-y-4 pt-4 border-t border-border">
                        <div className="text-sm text-muted-foreground">
                          <p>日期：{date?.toLocaleDateString("zh-TW")}</p>
                          <p>時間：{selectedTime}</p>
                          <p>費用：NT$ {teachers.find((t) => t.id === selectedTeacher)?.price}</p>
                        </div>
                        <Button variant="cta" className="w-full">
                          確認預約
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    請先選擇老師
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Video className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{booking.teacher}</p>
                        <p className="text-sm text-muted-foreground">{booking.topic}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.date} {booking.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-success/10 text-success">即將開始</Badge>
                      <Button variant="cta">進入會議室</Button>
                      <Button variant="outline">取消預約</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="space-y-4">
            {pastBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{booking.teacher}</p>
                        <p className="text-sm text-muted-foreground">{booking.topic}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.date} {booking.time}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">已完成</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
