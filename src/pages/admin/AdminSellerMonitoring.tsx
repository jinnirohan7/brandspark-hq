import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Monitor, 
  Eye, 
  ExternalLink, 
  Activity, 
  Users, 
  Layout, 
  Palette, 
  Settings,
  Globe,
  BarChart3,
  TrendingUp,
  Clock,
  Search
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SellerData {
  id: string;
  full_name: string;
  email: string;
  company_name: string;
  last_login: string;
  websites_count: number;
  themes_count: number;
  current_theme: string;
  builder_status: 'idle' | 'building' | 'customizing' | 'publishing';
  last_activity: string;
}

interface ThemeActivity {
  id: string;
  seller_name: string;
  theme_name: string;
  action: string;
  timestamp: string;
  details: any;
}

interface BuilderSession {
  id: string;
  seller_id: string;
  seller_name: string;
  session_start: string;
  current_tab: string;
  last_action: string;
  is_active: boolean;
}

const AdminSellerMonitoring = () => {
  const [sellers, setSellers] = useState<SellerData[]>([]);
  const [themeActivities, setThemeActivities] = useState<ThemeActivity[]>([]);
  const [builderSessions, setBuilderSessions] = useState<BuilderSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState<SellerData | null>(null);
  const [showSellerDetails, setShowSellerDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Fetch sellers with their theme builder activity
  const fetchSellers = async () => {
    try {
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .order('last_login', { ascending: false });

      if (error) throw error;

      const sellersData: SellerData[] = (data || []).map(seller => ({
        id: seller.id,
        full_name: seller.full_name,
        email: seller.email,
        company_name: seller.company_name || '',
        last_login: seller.last_login || seller.created_at,
        websites_count: 0, // Simulated for demo
        themes_count: 0, // Simulated for demo
        current_theme: 'None', // Simulated for demo
        builder_status: Math.random() > 0.7 ? 'building' : 'idle', // Simulated for demo
        last_activity: seller.updated_at
      }));

      setSellers(sellersData);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load seller data',
        variant: 'destructive'
      });
    }
  };

  // Fetch theme activities
  const fetchThemeActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('user_themes')
        .select(`
          *,
          theme:website_themes(name)
        `)
        .order('updated_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const activities: ThemeActivity[] = (data || []).map(item => ({
        id: item.id,
        seller_name: 'Unknown Seller', // Simulated for demo
        theme_name: item.theme?.name || 'Unknown Theme',
        action: item.is_active ? 'Applied Theme' : 'Customized Theme',
        timestamp: item.updated_at,
        details: item.customizations_json
      }));

      setThemeActivities(activities);
    } catch (error) {
      console.error('Error fetching theme activities:', error);
    }
  };

  // Simulate real-time builder sessions (in production, this would be from WebSocket or real-time subscriptions)
  const generateBuilderSessions = () => {
    const activeSessions: BuilderSession[] = sellers
      .filter(seller => seller.builder_status !== 'idle')
      .map(seller => ({
        id: `session-${seller.id}`,
        seller_id: seller.id,
        seller_name: seller.full_name,
        session_start: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        current_tab: ['builder', 'library', 'ai-chat', 'code'][Math.floor(Math.random() * 4)],
        last_action: ['Dragging component', 'Editing text', 'Applying theme', 'Customizing colors'][Math.floor(Math.random() * 4)],
        is_active: true
      }));

    setBuilderSessions(activeSessions);
  };

  // Navigate to seller's dashboard (impersonation)
  const impersonateSeller = (sellerId: string) => {
    // In production, this would set up secure impersonation
    const newWindow = window.open(`/dashboard?admin_view=true&seller_id=${sellerId}`, '_blank');
    if (newWindow) {
      toast({
        title: 'Success',
        description: 'Opened seller dashboard in new tab'
      });
    }
  };

  // Monitor specific seller
  const monitorSeller = (seller: SellerData) => {
    setSelectedSeller(seller);
    setShowSellerDetails(true);
  };

  const filteredSellers = sellers.filter(seller =>
    seller.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSellers(), fetchThemeActivities()]);
      generateBuilderSessions();
      setLoading(false);
    };

    loadData();

    // Set up real-time updates (simulate)
    const interval = setInterval(() => {
      generateBuilderSessions();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Seller Activity Monitoring</h1>
          <p className="text-muted-foreground">Real-time monitoring of seller theme builder activities</p>
        </div>
        <Button variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          Live Mode
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Sellers</p>
                <p className="text-2xl font-bold">{sellers.filter(s => s.builder_status !== 'idle').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Builder Sessions</p>
                <p className="text-2xl font-bold">{builderSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Theme Customizations</p>
                <p className="text-2xl font-bold">{themeActivities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Published Sites</p>
                <p className="text-2xl font-bold">{sellers.reduce((sum, seller) => sum + seller.websites_count, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Live Sessions</TabsTrigger>
          <TabsTrigger value="activities">Recent Activities</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search sellers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Sellers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Seller Dashboard Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seller</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Current Theme</TableHead>
                    <TableHead>Websites</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSellers.map(seller => (
                    <TableRow key={seller.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{seller.full_name}</div>
                          <div className="text-sm text-muted-foreground">{seller.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{seller.company_name}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            seller.builder_status === 'building' ? 'default' :
                            seller.builder_status === 'customizing' ? 'secondary' :
                            seller.builder_status === 'publishing' ? 'outline' : 'secondary'
                          }
                        >
                          <Activity className="h-3 w-3 mr-1" />
                          {seller.builder_status}
                        </Badge>
                      </TableCell>
                      <TableCell>{seller.current_theme}</TableCell>
                      <TableCell>{seller.websites_count}</TableCell>
                      <TableCell>{new Date(seller.last_activity).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => monitorSeller(seller)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => impersonateSeller(seller.id)}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Builder Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {builderSessions.map(session => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{session.seller_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Active in: <Badge variant="outline">{session.current_tab}</Badge>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Last action: {session.last_action}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm">Live</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => impersonateSeller(session.seller_id)}
                        >
                          <Monitor className="h-4 w-4 mr-1" />
                          Watch
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {builderSessions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No active builder sessions
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Theme Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seller</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Theme</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {themeActivities.map(activity => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.seller_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{activity.action}</Badge>
                      </TableCell>
                      <TableCell>{activity.theme_name}</TableCell>
                      <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Builder Usage Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Daily Active Users</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-bold">+12%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Theme Customizations</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-bold">+8%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Published Websites</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-bold">+15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Theme Library</span>
                    <span className="font-bold">89%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Drag & Drop Builder</span>
                    <span className="font-bold">76%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>AI Suggestions</span>
                    <span className="font-bold">62%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Code Editor</span>
                    <span className="font-bold">34%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Seller Details Dialog */}
      <Dialog open={showSellerDetails} onOpenChange={setShowSellerDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Seller Details: {selectedSeller?.full_name}</DialogTitle>
          </DialogHeader>
          {selectedSeller && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedSeller.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Company</Label>
                  <p className="text-sm">{selectedSeller.company_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Current Theme</Label>
                  <p className="text-sm">{selectedSeller.current_theme}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Websites</Label>
                  <p className="text-sm">{selectedSeller.websites_count}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => impersonateSeller(selectedSeller.id)}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Access Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSellerDetails(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSellerMonitoring;