import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Search, Send, Paperclip, MoreVertical } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function RenterMessages() {
  const [selectedChat, setSelectedChat] = useState("1");
  const [message, setMessage] = useState("");

  const conversations = [
    {
      id: "1",
      name: "BuildPro Rentals",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=BuildPro",
      lastMessage: "Equipment is ready for pickup",
      time: "5 min ago",
      unread: 2,
      online: true,
    },
    {
      id: "2",
      name: "TechTools Nigeria",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TechTools",
      lastMessage: "Thank you for your booking!",
      time: "2 hours ago",
      unread: 0,
      online: false,
    },
  ];

  const messages = [
    {
      id: "1",
      sender: "renter",
      text: "Hi! I'd like to book your jackhammer from Feb 10-14.",
      time: "10:30 AM",
    },
    {
      id: "2",
      sender: "vendor",
      text: "Hello! Yes, it's available for those dates.",
      time: "10:32 AM",
    },
    {
      id: "3",
      sender: "renter",
      text: "Great! What's the pickup location?",
      time: "10:35 AM",
    },
    {
      id: "4",
      sender: "vendor",
      text: "You can pick it up at our warehouse in Ikeja. Equipment is ready for pickup.",
      time: "10:38 AM",
    },
  ];

  return (
    <>
      <SEO title="Messages - Renter Dashboard" description="Chat with vendors" />
      
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Messages</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-4 lg:col-span-1">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input type="text" placeholder="Search messages..." className="pl-10" />
              </div>

              <div className="space-y-2">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedChat(conv.id)}
                    className={`w-full p-4 rounded-lg transition-colors text-left ${
                      selectedChat === conv.id
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <img src={conv.avatar} alt={conv.name} />
                        </Avatar>
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-slate-900 truncate">{conv.name}</p>
                          <span className="text-xs text-slate-500">{conv.time}</span>
                        </div>
                        <p className="text-sm text-slate-600 truncate">{conv.lastMessage}</p>
                      </div>

                      {conv.unread > 0 && (
                        <div className="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-medium">{conv.unread}</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="lg:col-span-2 flex flex-col h-[600px]">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <img src={conversations[0].avatar} alt={conversations[0].name} />
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900">{conversations[0].name}</p>
                    <p className="text-sm text-slate-600">Online</p>
                  </div>
                </div>

                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "renter" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.sender === "renter"
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-slate-900"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === "renter" ? "text-white/70" : "text-slate-500"
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button className="bg-primary hover:bg-primary/90">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}