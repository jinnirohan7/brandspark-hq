import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bell, Mail, MessageSquare, Phone, Clock, CheckCircle, Send, AlertCircle } from 'lucide-react'
import { useOrderManagement } from '@/hooks/useOrderManagement'

interface NotificationTemplate {
  id: string
  name: string
  type: string
  message: string
  channels: string[]
}

const notificationTemplates: NotificationTemplate[] = [
  {
    id: 'delay_weather',
    name: 'Weather Delay',
    type: 'delay',
    message: 'Your order delivery has been delayed by 1-2 days due to adverse weather conditions. We apologize for the inconvenience.',
    channels: ['email', 'sms']
  },
  {
    id: 'delay_logistics',
    name: 'Logistics Delay',
    type: 'delay',
    message: 'Your order is experiencing a slight delay due to high volume. Expected delivery: [NEW_DATE]',
    channels: ['email', 'sms', 'whatsapp']
  },
  {
    id: 'ndr_standard',
    name: 'Standard NDR',
    type: 'ndr',
    message: 'We attempted to deliver your order but were unable to complete the delivery. Please contact us to reschedule.',
    channels: ['email', 'sms', 'whatsapp']
  },
  {
    id: 'delivery_success',
    name: 'Delivery Confirmation',
    type: 'delivery',
    message: 'Great news! Your order has been successfully delivered. Thank you for shopping with us.',
    channels: ['email', 'sms']
  }
]

export const OrderNotifications = () => {
  const { notifications, orders, sendDelayNotification, loading } = useOrderManagement()
  const [selectedOrder, setSelectedOrder] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null)
  const [customMessage, setCustomMessage] = useState('')
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['email'])
  const [isCustomMessage, setIsCustomMessage] = useState(false)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'delay': return <Clock className="h-4 w-4 text-orange-600" />
      case 'ndr': return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'delivery': return <CheckCircle className="h-4 w-4 text-green-600" />
      default: return <Bell className="h-4 w-4 text-blue-600" />
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-3 w-3" />
      case 'sms': return <Phone className="h-3 w-3" />
      case 'whatsapp': return <MessageSquare className="h-3 w-3" />
      default: return <Bell className="h-3 w-3" />
    }
  }

  const handleSendNotification = async () => {
    if (!selectedOrder) return

    const message = isCustomMessage ? customMessage : selectedTemplate?.message || ''
    if (!message || selectedChannels.length === 0) return

    await sendDelayNotification(selectedOrder, message, selectedChannels)
    
    // Reset form
    setSelectedOrder('')
    setSelectedTemplate(null)
    setCustomMessage('')
    setSelectedChannels(['email'])
    setIsCustomMessage(false)
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = notificationTemplates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(template)
      setSelectedChannels(template.channels)
    }
  }

  const handleChannelToggle = (channel: string) => {
    setSelectedChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    )
  }

  // Statistics
  const totalNotifications = notifications.length
  const todayNotifications = notifications.filter(n => 
    new Date(n.sent_at).toDateString() === new Date().toDateString()
  ).length
  const notificationsByType = notifications.reduce((acc, n) => {
    acc[n.notification_type] = (acc[n.notification_type] || 0) + 1
    return acc
  }, {} as { [key: string]: number })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Order Notifications</h2>
          <p className="text-muted-foreground">Manage customer communications and delay notifications</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send Customer Notification</DialogTitle>
              <DialogDescription>
                Send notifications to customers about order updates, delays, or delivery information
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Order Selection */}
              <div>
                <label className="text-sm font-medium">Select Order</label>
                <Select onValueChange={setSelectedOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an order" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.slice(0, 20).map(order => (
                      <SelectItem key={order.id} value={order.id}>
                        #{order.id.slice(-8)} - {order.customer_name} - ₹{order.total_amount}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Message Type Toggle */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="custom-message"
                  checked={isCustomMessage}
                  onCheckedChange={(checked) => setIsCustomMessage(checked === true)}
                />
                <label htmlFor="custom-message" className="text-sm font-medium">
                  Use custom message
                </label>
              </div>

              {/* Template or Custom Message */}
              {!isCustomMessage ? (
                <div>
                  <label className="text-sm font-medium">Notification Template</label>
                  <Select onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name} ({template.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTemplate && (
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <p className="text-sm">{selectedTemplate.message}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium">Custom Message</label>
                  <Textarea 
                    placeholder="Enter your custom notification message"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={4}
                  />
                </div>
              )}

              {/* Channel Selection */}
              <div>
                <label className="text-sm font-medium mb-3 block">Notification Channels</label>
                <div className="flex gap-4">
                  {['email', 'sms', 'whatsapp'].map(channel => (
                    <div key={channel} className="flex items-center space-x-2">
                      <Checkbox 
                        id={channel}
                        checked={selectedChannels.includes(channel)}
                        onCheckedChange={() => handleChannelToggle(channel)}
                      />
                      <label htmlFor={channel} className="flex items-center gap-1 text-sm font-medium capitalize">
                        {getChannelIcon(channel)}
                        {channel}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Send Button */}
              <Button 
                onClick={handleSendNotification}
                disabled={
                  !selectedOrder || 
                  (!isCustomMessage && !selectedTemplate) || 
                  (isCustomMessage && !customMessage) ||
                  selectedChannels.length === 0 ||
                  loading
                }
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Notifications</p>
                <h3 className="text-2xl font-bold">{totalNotifications}</h3>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sent Today</p>
                <h3 className="text-2xl font-bold">{todayNotifications}</h3>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delay Notifications</p>
                <h3 className="text-2xl font-bold">{notificationsByType.delay || 0}</h3>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                <h3 className="text-2xl font-bold">
                  {notifications.length > 0 
                    ? Math.round((notifications.filter(n => n.customer_response).length / notifications.length) * 100)
                    : 0}%
                </h3>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Latest customer communications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.slice(0, 10).map(notification => (
              <div key={notification.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    {getNotificationIcon(notification.notification_type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Order #{notification.order_id.slice(-8)}</h4>
                      <Badge variant="secondary" className="capitalize">
                        {notification.notification_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Sent via:
                      </span>
                      {notification.sent_via.map(channel => (
                        <Badge key={channel} variant="outline" className="text-xs">
                          <span className="flex items-center gap-1">
                            {getChannelIcon(channel)}
                            {channel}
                          </span>
                        </Badge>
                      ))}
                    </div>
                    {notification.customer_response && (
                      <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                        <strong>Customer Response:</strong> {notification.customer_response}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {new Date(notification.sent_at).toLocaleString()}
                </div>
              </div>
            ))}
            
            {notifications.length === 0 && (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Notifications Yet</h3>
                <p className="text-muted-foreground">Customer notifications will appear here once sent.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Templates</CardTitle>
          <CardDescription>Pre-configured message templates for common scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notificationTemplates.map(template => (
              <div key={template.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{template.name}</h4>
                  <Badge variant="outline" className="capitalize">
                    {template.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {template.message}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Channels:</span>
                  {template.channels.map(channel => (
                    <Badge key={channel} variant="outline" className="text-xs">
                      <span className="flex items-center gap-1">
                        {getChannelIcon(channel)}
                        {channel}
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}