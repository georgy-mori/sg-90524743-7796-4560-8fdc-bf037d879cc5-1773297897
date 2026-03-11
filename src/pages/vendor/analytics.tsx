import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp,
  DollarSign,
  Calendar,
  Package,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function VendorAnalytics() {
  const earningsData = [
    { month: "Jul", earnings: 180000 },
    { month: "Aug", earnings: 220000 },
    { month: "Sep", earnings: 190000 },
    { month: "Oct", earnings: 280000 },
    { month: "Nov", earnings: 310000 },
    { month: "Dec", earnings: 350000 },
    { month: "Jan", earnings: 425000 },
  ];

  const bookingsData = [
    { month: "Jul", bookings: 12 },
    { month: "Aug", bookings: 18 },
    { month: "Sep", bookings: 15 },
    { month: "Oct", bookings: 22 },
    { month: "Nov", bookings: 25 },
    { month: "Dec", bookings: 28 },
    { month: "Jan", bookings: 32 },
  ];

  const categoryData = [
    { name: "Construction", value: 45, color: "#0F172A" },
    { name: "Power Tools", value: 30, color: "#F97316" },
    { name: "Transport", value: 15, color: "#3B82F6" },
    { name: "Others", value: 10, color: "#10B981" },
  ];

  const topEquipment = [
    { name: "Concrete Mixer", bookings: 45, revenue: 675000 },
    { name: "Scaffolding Set", bookings: 38, revenue: 950000 },
    { name: "Power Generator", bookings: 32, revenue: 576000 },
    { name: "Welding Machine", bookings: 28, revenue: 336000 },
  ];

  return (
    <>
      <SEO 
        title="Analytics - Vendor Dashboard"
        description="View your performance analytics"
      />
      
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
              <p className="text-slate-600 mt-1">Track your business performance</p>
            </div>
            
            <div className="flex gap-3">
              <select className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <span className="flex items-center text-sm text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +18%
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-900">₦2.45M</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <span className="flex items-center text-sm text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +12%
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-slate-900">168</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <span className="flex items-center text-sm text-red-600">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  -3%
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-1">Active Listings</p>
              <p className="text-3xl font-bold text-slate-900">24</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="flex items-center text-sm text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +5.2%
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-1">Avg. Rating</p>
              <p className="text-3xl font-bold text-slate-900">4.8</p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Earnings Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Tooltip />
                  <Line type="monotone" dataKey="earnings" stroke="#F97316" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Bookings Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bookingsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#0F172A" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Category Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-sm text-slate-600">{cat.name}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="lg:col-span-2 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Top Performing Equipment</h3>
              <div className="space-y-4">
                {topEquipment.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-slate-300">#{index + 1}</span>
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-600">{item.bookings} bookings</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-primary">₦{item.revenue.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}