import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/mode-css'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/theme-github'
import { 
  Code, 
  Plus, 
  Trash2, 
  Eye, 
  Copy, 
  Save, 
  Download,
  Upload,
  Settings,
  Zap,
  Globe,
  CreditCard,
  BarChart3,
  MessageCircle,
  Mail,
  Share2,
  Shield,
  Cookie
} from 'lucide-react'

interface CodeSnippet {
  id: string
  name: string
  type: 'html' | 'css' | 'javascript'
  code: string
  position: 'head' | 'body-start' | 'body-end' | 'global'
  enabled: boolean
  conditions?: {
    pages?: string[]
    devices?: ('desktop' | 'tablet' | 'mobile')[]
    userTypes?: ('all' | 'logged-in' | 'logged-out')[]
  }
}

interface Integration {
  id: string
  name: string
  category: string
  description: string
  icon: React.ReactNode
  fields: {
    name: string
    label: string
    type: 'text' | 'textarea' | 'select' | 'boolean'
    required: boolean
    placeholder?: string
    options?: string[]
  }[]
  codeTemplate: string
  enabled: boolean
  settings: Record<string, any>
}

interface CodeEmbeddingProps {
  customCode: {
    globalCSS: string
    globalJS: string
    headCode: string
    bodyStartCode: string
    bodyEndCode: string
  }
  snippets: CodeSnippet[]
  integrations: Integration[]
  onUpdateCustomCode: (code: any) => void
  onUpdateSnippets: (snippets: CodeSnippet[]) => void
  onUpdateIntegrations: (integrations: Integration[]) => void
}

export const CodeEmbedding: React.FC<CodeEmbeddingProps> = ({
  customCode,
  snippets,
  integrations,
  onUpdateCustomCode,
  onUpdateSnippets,
  onUpdateIntegrations
}) => {
  const [activeTab, setActiveTab] = useState('custom-code')
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [showSnippetDialog, setShowSnippetDialog] = useState(false)
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false)

  const predefinedIntegrations: Integration[] = [
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      category: 'Analytics',
      description: 'Track website traffic and user behavior',
      icon: <BarChart3 className="h-4 w-4" />,
      fields: [
        {
          name: 'trackingId',
          label: 'Tracking ID',
          type: 'text',
          required: true,
          placeholder: 'G-XXXXXXXXXX'
        }
      ],
      codeTemplate: `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id={{trackingId}}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '{{trackingId}}');
</script>`,
      enabled: false,
      settings: {}
    },
    {
      id: 'facebook-pixel',
      name: 'Facebook Pixel',
      category: 'Analytics',
      description: 'Track conversions and build audiences',
      icon: <BarChart3 className="h-4 w-4" />,
      fields: [
        {
          name: 'pixelId',
          label: 'Pixel ID',
          type: 'text',
          required: true,
          placeholder: '1234567890123456'
        }
      ],
      codeTemplate: `<!-- Facebook Pixel -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '{{pixelId}}');
fbq('track', 'PageView');
</script>`,
      enabled: false,
      settings: {}
    },
    {
      id: 'stripe-payments',
      name: 'Stripe Payments',
      category: 'Payments',
      description: 'Accept online payments securely',
      icon: <CreditCard className="h-4 w-4" />,
      fields: [
        {
          name: 'publishableKey',
          label: 'Publishable Key',
          type: 'text',
          required: true,
          placeholder: 'pk_test_...'
        }
      ],
      codeTemplate: `<!-- Stripe.js -->
<script src="https://js.stripe.com/v3/"></script>
<script>
  const stripe = Stripe('{{publishableKey}}');
</script>`,
      enabled: false,
      settings: {}
    },
    {
      id: 'intercom-chat',
      name: 'Intercom',
      category: 'Communication',
      description: 'Live chat and customer messaging',
      icon: <MessageCircle className="h-4 w-4" />,
      fields: [
        {
          name: 'appId',
          label: 'App ID',
          type: 'text',
          required: true,
          placeholder: 'abcd1234'
        }
      ],
      codeTemplate: `<!-- Intercom -->
<script>
  window.intercomSettings = {
    app_id: "{{appId}}"
  };
</script>
<script>(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/{{appId}}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
</script>`,
      enabled: false,
      settings: {}
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      category: 'Email Marketing',
      description: 'Email marketing and automation',
      icon: <Mail className="h-4 w-4" />,
      fields: [
        {
          name: 'audienceId',
          label: 'Audience ID',
          type: 'text',
          required: true,
          placeholder: 'abc123def456'
        },
        {
          name: 'datacenter',
          label: 'Data Center',
          type: 'text',
          required: true,
          placeholder: 'us1'
        }
      ],
      codeTemplate: `<!-- Mailchimp Signup Form -->
<div id="mc_embed_signup">
<form action="https://{{datacenter}}.list-manage.com/subscribe/post?u={{audienceId}}" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
    <div id="mc_embed_signup_scroll">
        <input type="email" value="" name="EMAIL" class="email" id="mce-EMAIL" placeholder="email address" required>
        <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_{{audienceId}}" tabindex="-1" value=""></div>
        <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div>
    </div>
</form>
</div>`,
      enabled: false,
      settings: {}
    },
    {
      id: 'hotjar',
      name: 'Hotjar',
      category: 'Analytics',
      description: 'Heatmaps and user session recordings',
      icon: <BarChart3 className="h-4 w-4" />,
      fields: [
        {
          name: 'hjid',
          label: 'Site ID',
          type: 'text',
          required: true,
          placeholder: '1234567'
        }
      ],
      codeTemplate: `<!-- Hotjar Tracking Code -->
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:{{hjid}},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>`,
      enabled: false,
      settings: {}
    },
    {
      id: 'cookie-consent',
      name: 'Cookie Consent',
      category: 'Legal',
      description: 'GDPR compliant cookie consent banner',
      icon: <Cookie className="h-4 w-4" />,
      fields: [
        {
          name: 'message',
          label: 'Consent Message',
          type: 'textarea',
          required: true,
          placeholder: 'This website uses cookies to ensure you get the best experience.'
        },
        {
          name: 'buttonText',
          label: 'Button Text',
          type: 'text',
          required: true,
          placeholder: 'Accept'
        }
      ],
      codeTemplate: `<!-- Cookie Consent -->
<style>
.cookie-consent {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #333;
  color: white;
  padding: 15px;
  text-align: center;
  z-index: 9999;
}
</style>
<div id="cookie-consent" class="cookie-consent">
  <p>{{message}} <button onclick="acceptCookies()" style="margin-left: 10px; padding: 5px 10px; background: #007cba; color: white; border: none; cursor: pointer;">{{buttonText}}</button></p>
</div>
<script>
function acceptCookies() {
  document.getElementById('cookie-consent').style.display = 'none';
  localStorage.setItem('cookieConsent', 'accepted');
}
if (localStorage.getItem('cookieConsent') === 'accepted') {
  document.getElementById('cookie-consent').style.display = 'none';
}
</script>`,
      enabled: false,
      settings: {}
    }
  ]

  const addSnippet = useCallback(() => {
    const newSnippet: CodeSnippet = {
      id: `snippet-${Date.now()}`,
      name: 'New Snippet',
      type: 'html',
      code: '',
      position: 'head',
      enabled: true,
      conditions: {
        pages: [],
        devices: ['desktop', 'tablet', 'mobile'],
        userTypes: ['all']
      }
    }
    onUpdateSnippets([...snippets, newSnippet])
    setSelectedSnippet(newSnippet)
    setShowSnippetDialog(true)
  }, [snippets, onUpdateSnippets])

  const updateSnippet = useCallback((updatedSnippet: CodeSnippet) => {
    const updated = snippets.map(snippet => 
      snippet.id === updatedSnippet.id ? updatedSnippet : snippet
    )
    onUpdateSnippets(updated)
    setSelectedSnippet(updatedSnippet)
  }, [snippets, onUpdateSnippets])

  const deleteSnippet = useCallback((snippetId: string) => {
    const filtered = snippets.filter(snippet => snippet.id !== snippetId)
    onUpdateSnippets(filtered)
  }, [snippets, onUpdateSnippets])

  const enableIntegration = useCallback((integration: Integration, settings: Record<string, any>) => {
    const updated = integrations.map(int => 
      int.id === integration.id 
        ? { ...int, enabled: true, settings }
        : int
    )
    onUpdateIntegrations(updated)
  }, [integrations, onUpdateIntegrations])

  const disableIntegration = useCallback((integrationId: string) => {
    const updated = integrations.map(int => 
      int.id === integrationId 
        ? { ...int, enabled: false }
        : int
    )
    onUpdateIntegrations(updated)
  }, [integrations, onUpdateIntegrations])

  const generateCode = useCallback((integration: Integration) => {
    let code = integration.codeTemplate
    Object.entries(integration.settings).forEach(([key, value]) => {
      code = code.replace(new RegExp(`{{${key}}}`, 'g'), value)
    })
    return code
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Code Embedding</h2>
          <p className="text-muted-foreground">
            Add custom code and integrate third-party services
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="custom-code">Custom Code</TabsTrigger>
          <TabsTrigger value="snippets">Code Snippets</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="custom-code" className="space-y-6">
          <div className="grid gap-6">
            {/* Global CSS */}
            <Card>
              <CardHeader>
                <CardTitle>Global CSS</CardTitle>
              </CardHeader>
              <CardContent>
                <AceEditor
                  mode="css"
                  theme="monokai"
                  value={customCode.globalCSS}
                  onChange={(value) => onUpdateCustomCode({ ...customCode, globalCSS: value })}
                  name="global-css-editor"
                  width="100%"
                  height="200px"
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2
                  }}
                />
              </CardContent>
            </Card>

            {/* Global JavaScript */}
            <Card>
              <CardHeader>
                <CardTitle>Global JavaScript</CardTitle>
              </CardHeader>
              <CardContent>
                <AceEditor
                  mode="javascript"
                  theme="monokai"
                  value={customCode.globalJS}
                  onChange={(value) => onUpdateCustomCode({ ...customCode, globalJS: value })}
                  name="global-js-editor"
                  width="100%"
                  height="200px"
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2
                  }}
                />
              </CardContent>
            </Card>

            {/* Head Code */}
            <Card>
              <CardHeader>
                <CardTitle>Head Code</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Code inserted before closing &lt;/head&gt; tag
                </p>
              </CardHeader>
              <CardContent>
                <AceEditor
                  mode="html"
                  theme="monokai"
                  value={customCode.headCode}
                  onChange={(value) => onUpdateCustomCode({ ...customCode, headCode: value })}
                  name="head-code-editor"
                  width="100%"
                  height="150px"
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2
                  }}
                />
              </CardContent>
            </Card>

            {/* Body Start Code */}
            <Card>
              <CardHeader>
                <CardTitle>Body Start Code</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Code inserted after opening &lt;body&gt; tag
                </p>
              </CardHeader>
              <CardContent>
                <AceEditor
                  mode="html"
                  theme="monokai"
                  value={customCode.bodyStartCode}
                  onChange={(value) => onUpdateCustomCode({ ...customCode, bodyStartCode: value })}
                  name="body-start-code-editor"
                  width="100%"
                  height="150px"
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2
                  }}
                />
              </CardContent>
            </Card>

            {/* Body End Code */}
            <Card>
              <CardHeader>
                <CardTitle>Body End Code</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Code inserted before closing &lt;/body&gt; tag
                </p>
              </CardHeader>
              <CardContent>
                <AceEditor
                  mode="html"
                  theme="monokai"
                  value={customCode.bodyEndCode}
                  onChange={(value) => onUpdateCustomCode({ ...customCode, bodyEndCode: value })}
                  name="body-end-code-editor"
                  width="100%"
                  height="150px"
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="snippets" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Code Snippets</h3>
            <Button onClick={addSnippet}>
              <Plus className="mr-2 h-4 w-4" />
              Add Snippet
            </Button>
          </div>

          <div className="grid gap-4">
            {snippets.map((snippet) => (
              <Card key={snippet.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={snippet.enabled}
                        onCheckedChange={(enabled) => updateSnippet({ ...snippet, enabled })}
                      />
                      <div>
                        <h4 className="font-medium">{snippet.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{snippet.type}</Badge>
                          <Badge variant="secondary">{snippet.position}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSnippet(snippet)
                          setShowSnippetDialog(true)
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSnippet(snippet.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {snippets.length === 0 && (
              <div className="text-center py-8">
                <Code className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="text-lg font-medium mb-2">No code snippets</h4>
                <p className="text-muted-foreground mb-4">
                  Add custom code snippets with conditional loading
                </p>
                <Button onClick={addSnippet}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Snippet
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Available Integrations</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {predefinedIntegrations.map((integration) => {
                const isEnabled = integrations.find(int => int.id === integration.id)?.enabled || false
                
                return (
                  <Card key={integration.id} className="group hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded">
                            {integration.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{integration.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {integration.category}
                            </Badge>
                          </div>
                        </div>
                        {isEnabled && (
                          <Badge className="bg-green-500">
                            <Zap className="mr-1 h-3 w-3" />
                            Active
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {integration.description}
                      </p>
                      
                      <div className="flex gap-2">
                        {isEnabled ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedIntegration(integration)
                                setShowIntegrationDialog(true)
                              }}
                            >
                              <Settings className="mr-1 h-3 w-3" />
                              Configure
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => disableIntegration(integration.id)}
                            >
                              Disable
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedIntegration(integration)
                              setShowIntegrationDialog(true)
                            }}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Setup
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Snippet Dialog */}
      <Dialog open={showSnippetDialog} onOpenChange={setShowSnippetDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedSnippet ? 'Edit Snippet' : 'Add Snippet'}
            </DialogTitle>
          </DialogHeader>
          {selectedSnippet && <SnippetEditor snippet={selectedSnippet} onUpdate={updateSnippet} />}
        </DialogContent>
      </Dialog>

      {/* Integration Dialog */}
      <Dialog open={showIntegrationDialog} onOpenChange={setShowIntegrationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedIntegration ? `Configure ${selectedIntegration.name}` : 'Setup Integration'}
            </DialogTitle>
          </DialogHeader>
          {selectedIntegration && (
            <IntegrationEditor 
              integration={selectedIntegration} 
              onEnable={enableIntegration}
              onDisable={disableIntegration}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

const SnippetEditor: React.FC<{
  snippet: CodeSnippet
  onUpdate: (snippet: CodeSnippet) => void
}> = ({ snippet, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="snippet-name">Name</Label>
          <Input
            id="snippet-name"
            value={snippet.name}
            onChange={(e) => onUpdate({ ...snippet, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="snippet-type">Type</Label>
          <Select
            value={snippet.type}
            onValueChange={(value: 'html' | 'css' | 'javascript') => 
              onUpdate({ ...snippet, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="snippet-position">Position</Label>
        <Select
          value={snippet.position}
          onValueChange={(value: 'head' | 'body-start' | 'body-end' | 'global') => 
            onUpdate({ ...snippet, position: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="head">Head</SelectItem>
            <SelectItem value="body-start">Body Start</SelectItem>
            <SelectItem value="body-end">Body End</SelectItem>
            <SelectItem value="global">Global</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="snippet-code">Code</Label>
        <AceEditor
          mode={snippet.type === 'css' ? 'css' : snippet.type === 'javascript' ? 'javascript' : 'html'}
          theme="github"
          value={snippet.code}
          onChange={(value) => onUpdate({ ...snippet, code: value })}
          name="snippet-code-editor"
          width="100%"
          height="200px"
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2
          }}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={snippet.enabled}
          onCheckedChange={(enabled) => onUpdate({ ...snippet, enabled })}
        />
        <Label>Enable this snippet</Label>
      </div>
    </div>
  )
}

const IntegrationEditor: React.FC<{
  integration: Integration
  onEnable: (integration: Integration, settings: Record<string, any>) => void
  onDisable: (integrationId: string) => void
}> = ({ integration, onEnable, onDisable }) => {
  const [settings, setSettings] = useState(integration.settings || {})
  const isEnabled = integration.enabled

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
        {integration.icon}
        <div>
          <h4 className="font-medium">{integration.name}</h4>
          <p className="text-sm text-muted-foreground">{integration.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        {integration.fields.map((field) => (
          <div key={field.name}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.type === 'textarea' ? (
              <Textarea
                id={field.name}
                value={settings[field.name] || ''}
                onChange={(e) => setSettings({ ...settings, [field.name]: e.target.value })}
                placeholder={field.placeholder}
              />
            ) : field.type === 'select' ? (
              <Select
                value={settings[field.name] || ''}
                onValueChange={(value) => setSettings({ ...settings, [field.name]: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.type === 'boolean' ? (
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings[field.name] || false}
                  onCheckedChange={(checked) => setSettings({ ...settings, [field.name]: checked })}
                />
                <Label>{field.label}</Label>
              </div>
            ) : (
              <Input
                id={field.name}
                value={settings[field.name] || ''}
                onChange={(e) => setSettings({ ...settings, [field.name]: e.target.value })}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4 border-t">
        {isEnabled ? (
          <Button variant="outline" onClick={() => onDisable(integration.id)}>
            Disable Integration
          </Button>
        ) : (
          <div />
        )}
        <Button onClick={() => onEnable(integration, settings)}>
          {isEnabled ? 'Update Settings' : 'Enable Integration'}
        </Button>
      </div>
    </div>
  )
}