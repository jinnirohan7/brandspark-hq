import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Filter,
  Plus,
  FileText,
  Video,
  Book
} from 'lucide-react'

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: '',
    description: ''
  })

  const supportTickets = [
    {
      id: 'SPT-001',
      subject: 'Payment Settlement Delay',
      category: 'Payments',
      priority: 'High',
      status: 'Open',
      created: '2024-01-15',
      lastUpdate: '2024-01-16',
      agent: 'Priya Sharma'
    },
    {
      id: 'SPT-002',
      subject: 'Product Listing Issue',
      category: 'Listings',
      priority: 'Medium',
      status: 'In Progress',
      created: '2024-01-14',
      lastUpdate: '2024-01-15',
      agent: 'Rajesh Kumar'
    },
    {
      id: 'SPT-003',
      subject: 'Account Verification Query',
      category: 'Account',
      priority: 'Low',
      status: 'Resolved',
      created: '2024-01-10',
      lastUpdate: '2024-01-12',
      agent: 'Anita Singh'
    }
  ]

  const faqData = [
    {
      category: 'Account & Setup',
      questions: [
        'How do I complete my seller verification?',
        'What documents are required for GST registration?',
        'How to update bank account details?',
        'Setting up payment methods'
      ]
    },
    {
      category: 'Orders & Shipping',
      questions: [
        'How to process orders efficiently?',
        'Managing shipping and tracking',
        'Handling returns and refunds',
        'Bulk order processing'
      ]
    },
    {
      category: 'Payments & Fees',
      questions: [
        'Understanding fee structure',
        'Payment settlement schedule',
        'Tax calculations and GST',
        'Commission and charges'
      ]
    },
    {
      category: 'Products & Listings',
      questions: [
        'Creating product listings',
        'Inventory management',
        'Product photography guidelines',
        'SEO optimization for listings'
      ]
    }
  ]

  const resources = [
    {
      title: 'Seller Handbook',
      description: 'Complete guide to selling successfully',
      icon: Book,
      type: 'Guide'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video instructions',
      icon: Video,
      type: 'Video'
    },
    {
      title: 'API Documentation',
      description: 'Technical integration guides',
      icon: FileText,
      type: 'Technical'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'Resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'Medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
      case 'Low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const handleCreateTicket = () => {
    console.log('Creating ticket:', ticketForm)
    // Reset form
    setTicketForm({ subject: '', category: '', priority: '', description: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Support Center</h1>
          <p className="text-muted-foreground mt-2">Get help with your seller account and business</p>
        </div>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-8 w-8 mx-auto text-primary mb-3" />
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-4">Chat with our support team</p>
            <Button size="sm" className="w-full">Start Chat</Button>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6 text-center">
            <Phone className="h-8 w-8 mx-auto text-primary mb-3" />
            <h3 className="font-semibold mb-2">Phone Support</h3>
            <p className="text-sm text-muted-foreground mb-4">Call us: 1800-XXX-XXXX</p>
            <Button size="sm" variant="outline" className="w-full">Call Now</Button>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6 text-center">
            <Mail className="h-8 w-8 mx-auto text-primary mb-3" />
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-sm text-muted-foreground mb-4">seller-support@company.com</p>
            <Button size="sm" variant="outline" className="w-full">Send Email</Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="create">Create Ticket</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tickets List */}
          <div className="space-y-4">
            {supportTickets.map((ticket) => (
              <Card key={ticket.id} className="border-border">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{ticket.subject}</h3>
                        <Badge variant="outline" className="text-xs">#{ticket.id}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Category: {ticket.category}</span>
                        <span>Agent: {ticket.agent}</span>
                        <span>Created: {ticket.created}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqData.map((category) => (
              <Card key={category.category} className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.questions.map((question, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                        <p className="text-sm font-medium">{question}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Card key={resource.title} className="border-border">
                <CardContent className="p-6 text-center">
                  <resource.icon className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                  <Badge variant="outline" className="mb-4">{resource.type}</Badge>
                  <Button className="w-full">Access Resource</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>
                Describe your issue and we'll help you resolve it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input
                  placeholder="Brief description of your issue"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={ticketForm.category} onValueChange={(value) => setTicketForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account">Account & Setup</SelectItem>
                      <SelectItem value="orders">Orders & Shipping</SelectItem>
                      <SelectItem value="payments">Payments & Fees</SelectItem>
                      <SelectItem value="listings">Products & Listings</SelectItem>
                      <SelectItem value="technical">Technical Issues</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select value={ticketForm.priority} onValueChange={(value) => setTicketForm(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Provide detailed information about your issue..."
                  rows={5}
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <Button onClick={handleCreateTicket} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Support