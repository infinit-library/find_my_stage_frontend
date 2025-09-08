import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mic,
  Users,
  Star,
  TrendingUp,
  Calendar,
  MapPin,
  DollarSign,
  Filter,
  Search,
  Bell,
  Settings,
  User,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import conferenceImage from "@/assets/conference-opportunity.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Mock data for speaking opportunities
  const opportunities = [
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      organizer: "TechCorp Events",
      location: "San Francisco, CA",
      date: "March 15, 2024",
      fee: "$5,000",
      type: "Keynote",
      audience: "500+",
      topics: ["AI", "Innovation", "Leadership"],
      status: "new",
      deadline: "Feb 20, 2024"
    },
    {
      id: 2,
      title: "Digital Marketing Conference",
      organizer: "Marketing Pro",
      location: "New York, NY",
      date: "April 22, 2024",
      fee: "$3,500",
      type: "Panel",
      audience: "300+",
      topics: ["Marketing", "Digital", "Strategy"],
      status: "applied",
      deadline: "Mar 1, 2024"
    },
    {
      id: 3,
      title: "Startup Ecosystem Forum",
      organizer: "Venture Hub",
      location: "Austin, TX",
      date: "May 10, 2024",
      fee: "$2,000",
      type: "Workshop",
      audience: "150+",
      topics: ["Startups", "Entrepreneurship", "Funding"],
      status: "shortlisted",
      deadline: "Mar 15, 2024"
    },
    {
      id: 4,
      title: "Women in Tech Leadership",
      organizer: "WomenTech Global",
      location: "Seattle, WA",
      date: "June 5, 2024",
      fee: "$4,000",
      type: "Keynote",
      audience: "400+",
      topics: ["Leadership", "Diversity", "Technology"],
      status: "new",
      deadline: "Apr 10, 2024"
    }
  ];

  const stats = [
    { label: "Applications Sent", value: "12", icon: Calendar, color: "text-blue-600" },
    { label: "Opportunities Found", value: "45", icon: Search, color: "text-green-600" },
    { label: "Success Rate", value: "67%", icon: TrendingUp, color: "text-blue-700" },
    { label: "Total Earnings", value: "$28K", icon: DollarSign, color: "text-yellow-600" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-100 text-blue-800">New</Badge>;
      case "applied":
        return <Badge className="bg-yellow-100 text-yellow-800">Applied</Badge>;
      case "shortlisted":
        return <Badge className="bg-green-100 text-green-800">Shortlisted</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLocation = filterLocation === "all" || opp.location.includes(filterLocation);
    const matchesType = filterType === "all" || opp.type.toLowerCase() === filterType.toLowerCase();

    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 border-b bg-card">
        <div className="flex items-center gap-2">
          <Mic className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Find My Stage
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/")}>
            Home
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome back, Sarah! 👋</h1>
          <p className="text-muted-foreground">
            Here are your latest speaking opportunities and performance insights.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="opportunities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="opportunities">Speaking Opportunities</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="profile">Profile & Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Find Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by event name, organizer, or topic..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={filterLocation} onValueChange={setFilterLocation}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="WA">Washington</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="keynote">Keynote</SelectItem>
                      <SelectItem value="panel">Panel</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              {filteredOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="shadow-card hover:shadow-elegant transition-smooth">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={conferenceImage}
                      alt={opportunity.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(opportunity.status)}
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                        <CardDescription>{opportunity.organizer}</CardDescription>
                      </div>
                      <Badge variant="outline">{opportunity.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{opportunity.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{opportunity.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>{opportunity.fee}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{opportunity.audience}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {opportunity.topics.map((topic, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Deadline:</strong> {opportunity.deadline}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="cta" className="flex-1">
                      Apply Now
                    </Button>
                    <Button variant="outline">
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Application History</CardTitle>
                <CardDescription>
                  Track your submitted applications and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunities.filter(opp => opp.status !== "new").map((opp) => (
                    <div key={opp.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{opp.title}</h4>
                        <p className="text-sm text-muted-foreground">{opp.organizer}</p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(opp.status)}
                        <p className="text-sm text-muted-foreground mt-1">{opp.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Profile Management</CardTitle>
                <CardDescription>
                  Update your speaker profile and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="cta" onClick={() => navigate("/profile")}>
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;