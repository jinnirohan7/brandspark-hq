import React, { useState } from 'react'
import AceEditor from 'react-ace'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Code, 
  Play, 
  Save, 
  Download, 
  Upload,
  Copy,
  RefreshCw,
  FileCode,
  Database,
  Globe,
  Smartphone
} from 'lucide-react'

// Import ace editor themes and modes
import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/mode-css'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-typescript'
import 'ace-builds/src-noconflict/mode-jsx'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-sql'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/theme-twilight'
import 'ace-builds/src-noconflict/theme-dracula'

interface CodeTemplate {
  id: string
  name: string
  framework: string
  language: string
  code: string
  description: string
  dependencies?: string[]
}

interface MultiFrameworkCodeEditorProps {
  onCodeUpdate?: (code: string, framework: string, language: string) => void
  initialCode?: string
  initialFramework?: string
  theme?: any
}

export const MultiFrameworkCodeEditor: React.FC<MultiFrameworkCodeEditorProps> = ({
  onCodeUpdate,
  initialCode = '',
  initialFramework = 'react',
  theme
}) => {
  const [activeFramework, setActiveFramework] = useState(initialFramework)
  const [activeLanguage, setActiveLanguage] = useState('javascript')
  const [code, setCode] = useState(initialCode)
  const [editorTheme, setEditorTheme] = useState('github')
  const [fontSize, setFontSize] = useState(14)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const frameworks = [
    { id: 'react', name: 'React', icon: <Code className="h-4 w-4" /> },
    { id: 'angular', name: 'Angular', icon: <Globe className="h-4 w-4" /> },
    { id: 'nextjs', name: 'Next.js', icon: <Smartphone className="h-4 w-4" /> },
    { id: 'nodejs', name: 'Node.js', icon: <Database className="h-4 w-4" /> },
    { id: 'html', name: 'HTML/CSS', icon: <FileCode className="h-4 w-4" /> },
    { id: 'graphql', name: 'GraphQL', icon: <Database className="h-4 w-4" /> }
  ]

  const languages = {
    react: ['jsx', 'typescript', 'css'],
    angular: ['typescript', 'html', 'css'],
    nextjs: ['jsx', 'typescript', 'css'],
    nodejs: ['javascript', 'typescript'],
    html: ['html', 'css', 'javascript'],
    graphql: ['javascript', 'json']
  }

  const codeTemplates: CodeTemplate[] = [
    {
      id: 'react-component',
      name: 'React Component',
      framework: 'react',
      language: 'jsx',
      description: 'Basic React functional component with theme integration',
      code: `import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const ThemeAwareComponent = ({ theme }) => {
  const styles = {
    backgroundColor: theme?.colors?.background || '#ffffff',
    color: theme?.colors?.foreground || '#000000',
    fontFamily: theme?.typography?.fontFamily || 'Inter',
    borderRadius: theme?.borderRadius?.md || '6px'
  }

  return (
    <Card style={styles}>
      <CardHeader>
        <CardTitle>Welcome to Your Theme</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          This component automatically adapts to your theme settings.
        </p>
        <Button 
          style={{
            backgroundColor: theme?.colors?.primary || '#3b82f6',
            color: '#ffffff'
          }}
        >
          Get Started
        </Button>
      </CardContent>
    </Card>
  )
}

export default ThemeAwareComponent`,
      dependencies: ['react', '@/components/ui/card', '@/components/ui/button']
    },
    {
      id: 'angular-component',
      name: 'Angular Component',
      framework: 'angular',
      language: 'typescript',
      description: 'Angular component with theme service integration',
      code: `import { Component, Input, OnInit } from '@angular/core'
import { ThemeService } from './theme.service'

@Component({
  selector: 'app-theme-aware',
  template: \`
    <div class="theme-card" [ngStyle]="cardStyles">
      <div class="card-header">
        <h2 [ngStyle]="titleStyles">Welcome to Your Theme</h2>
      </div>
      <div class="card-content">
        <p [ngStyle]="textStyles">
          This component automatically adapts to your theme settings.
        </p>
        <button 
          class="btn-primary" 
          [ngStyle]="buttonStyles"
          (click)="onGetStarted()"
        >
          Get Started
        </button>
      </div>
    </div>
  \`,
  styleUrls: ['./theme-aware.component.css']
})
export class ThemeAwareComponent implements OnInit {
  @Input() theme: any

  cardStyles: any = {}
  titleStyles: any = {}
  textStyles: any = {}
  buttonStyles: any = {}

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.updateStyles()
  }

  updateStyles() {
    this.cardStyles = {
      'background-color': this.theme?.colors?.background || '#ffffff',
      'border-radius': this.theme?.borderRadius?.md || '6px',
      'padding': '24px',
      'box-shadow': '0 2px 4px rgba(0,0,0,0.1)'
    }

    this.titleStyles = {
      'color': this.theme?.colors?.foreground || '#000000',
      'font-family': this.theme?.typography?.fontFamily || 'Inter',
      'font-size': '1.5rem',
      'font-weight': '600'
    }

    this.textStyles = {
      'color': this.theme?.colors?.foreground || '#666666',
      'font-family': this.theme?.typography?.fontFamily || 'Inter'
    }

    this.buttonStyles = {
      'background-color': this.theme?.colors?.primary || '#3b82f6',
      'color': '#ffffff',
      'border': 'none',
      'border-radius': this.theme?.borderRadius?.md || '6px',
      'padding': '8px 16px',
      'cursor': 'pointer'
    }
  }

  onGetStarted() {
    console.log('Get started clicked!')
  }
}`,
      dependencies: ['@angular/core', './theme.service']
    },
    {
      id: 'nextjs-page',
      name: 'Next.js Page',
      framework: 'nextjs',
      language: 'tsx',
      description: 'Next.js page component with SSR theme support',
      code: `import React from 'react'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { useTheme } from '@/hooks/useTheme'

interface ThemePageProps {
  initialTheme?: any
}

const ThemePage: React.FC<ThemePageProps> = ({ initialTheme }) => {
  const { theme, updateTheme } = useTheme(initialTheme)

  const pageStyles = {
    backgroundColor: theme?.colors?.background || '#ffffff',
    color: theme?.colors?.foreground || '#000000',
    fontFamily: theme?.typography?.fontFamily || 'Inter',
    minHeight: '100vh',
    padding: '2rem'
  }

  const headerStyles = {
    backgroundColor: theme?.colors?.primary || '#3b82f6',
    color: '#ffffff',
    padding: '1rem',
    borderRadius: theme?.borderRadius?.lg || '8px',
    marginBottom: '2rem'
  }

  return (
    <>
      <Head>
        <title>Theme Showcase</title>
        <meta name="description" content="Beautiful themed page" />
        <style jsx global>{\`
          :root {
            --primary-color: \${theme?.colors?.primary || '#3b82f6'};
            --background-color: \${theme?.colors?.background || '#ffffff'};
            --foreground-color: \${theme?.colors?.foreground || '#000000'};
          }
        \`}</style>
      </Head>
      
      <div style={pageStyles}>
        <header style={headerStyles}>
          <h1>Welcome to Your Themed Website</h1>
          <p>This page is dynamically styled based on your theme configuration</p>
        </header>
        
        <main>
          <section>
            <h2>Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  style={{
                    backgroundColor: theme?.colors?.muted || '#f8fafc',
                    padding: '1.5rem',
                    borderRadius: theme?.borderRadius?.md || '6px',
                    textAlign: 'center'
                  }}
                >
                  <h3>Feature {i}</h3>
                  <p>Amazing theme-aware feature</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // Fetch theme data at build time
  const initialTheme = {
    colors: {
      primary: '#3b82f6',
      background: '#ffffff',
      foreground: '#000000'
    }
  }

  return {
    props: {
      initialTheme
    },
    revalidate: 60 // Revalidate every minute
  }
}

export default ThemePage`,
      dependencies: ['next', 'react', '@/hooks/useTheme']
    },
    {
      id: 'nodejs-api',
      name: 'Node.js API',
      framework: 'nodejs',
      language: 'javascript',
      description: 'Express.js API endpoint for theme management',
      code: `const express = require('express')
const cors = require('cors')
const { supabase } = require('./config/supabase')

const app = express()
app.use(cors())
app.use(express.json())

// Get all themes
app.get('/api/themes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('website_themes')
      .select('*')
      .order('is_featured', { ascending: false })

    if (error) throw error

    res.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('Error fetching themes:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Apply theme to user
app.post('/api/themes/:themeId/apply', async (req, res) => {
  try {
    const { themeId } = req.params
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      })
    }

    // Deactivate current themes
    await supabase
      .from('user_themes')
      .update({ is_active: false })
      .eq('user_id', userId)

    // Apply new theme
    const { data, error } = await supabase
      .from('user_themes')
      .insert({
        user_id: userId,
        theme_id: themeId,
        customizations_json: {},
        is_active: true
      })
      .select()

    if (error) throw error

    res.json({
      success: true,
      data: data[0]
    })
  } catch (error) {
    console.error('Error applying theme:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Update theme customizations
app.put('/api/user-themes/:userThemeId', async (req, res) => {
  try {
    const { userThemeId } = req.params
    const { customizations } = req.body

    const { data, error } = await supabase
      .from('user_themes')
      .update({ 
        customizations_json: customizations,
        updated_at: new Date().toISOString()
      })
      .eq('id', userThemeId)
      .select()

    if (error) throw error

    res.json({
      success: true,
      data: data[0]
    })
  } catch (error) {
    console.error('Error updating customizations:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(\`Theme API server running on port \${PORT}\`)
})`,
      dependencies: ['express', 'cors', './config/supabase']
    },
      {
        id: 'graphql-schema',
        name: 'GraphQL Schema',
        framework: 'graphql',
        language: 'javascript',
        description: 'GraphQL schema for theme management with resolver implementation',
        code: `// GraphQL Schema and Resolvers for Theme Management
const { gql } = require('apollo-server-express')

// GraphQL Type Definitions
const typeDefs = gql\`
  type Theme {
    id: ID!
    name: String!
    category: String!
    description: String
    previewImageUrl: String
    templateData: JSON
    layoutJson: JSON
    tags: [String!]
    price: Float!
    isFeatured: Boolean!
    isPremium: Boolean
    rating: Float!
    downloads: Int!
    createdAt: String!
    updatedAt: String!
  }

  type UserTheme {
    id: ID!
    userId: ID!
    themeId: ID!
    theme: Theme!
    customizationsJson: JSON!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    themes(
      category: String
      search: String
      featured: Boolean
      premium: Boolean
      minRating: Float
      maxPrice: Float
      limit: Int
      offset: Int
    ): [Theme!]!
    
    theme(id: ID!): Theme
    userThemes(userId: ID!): [UserTheme!]!
    activeUserTheme(userId: ID!): UserTheme
  }

  type Mutation {
    applyTheme(userId: ID!, themeId: ID!): UserTheme!
    updateThemeCustomizations(
      userThemeId: ID!
      customizations: JSON!
    ): UserTheme!
  }

  scalar JSON
\`

// GraphQL Resolvers
const resolvers = {
  Query: {
    themes: async (_, args, { supabase }) => {
      let query = supabase
        .from('website_themes')
        .select('*')
        .order('is_featured', { ascending: false })

      if (args.category) {
        query = query.eq('category', args.category)
      }
      if (args.featured !== undefined) {
        query = query.eq('is_featured', args.featured)
      }
      if (args.premium !== undefined) {
        query = query.eq('is_premium', args.premium)
      }
      if (args.minRating) {
        query = query.gte('rating', args.minRating)
      }
      if (args.maxPrice) {
        query = query.lte('price', args.maxPrice)
      }
      if (args.limit) {
        query = query.limit(args.limit)
      }
      if (args.offset) {
        query = query.range(args.offset, args.offset + (args.limit || 10) - 1)
      }

      const { data, error } = await query
      if (error) throw new Error(error.message)
      return data || []
    },

    theme: async (_, { id }, { supabase }) => {
      const { data, error } = await supabase
        .from('website_themes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw new Error(error.message)
      return data
    },

    userThemes: async (_, { userId }, { supabase }) => {
      const { data, error } = await supabase
        .from('user_themes')
        .select(\`
          *,
          theme:website_themes(*)
        \`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return data || []
    },

    activeUserTheme: async (_, { userId }, { supabase }) => {
      const { data, error } = await supabase
        .from('user_themes')
        .select(\`
          *,
          theme:website_themes(*)
        \`)
        .eq('user_id', userId)
        .eq('is_active', true)
        .single()

      if (error) return null
      return data
    }
  },

  Mutation: {
    applyTheme: async (_, { userId, themeId }, { supabase }) => {
      // Deactivate current themes
      await supabase
        .from('user_themes')
        .update({ is_active: false })
        .eq('user_id', userId)

      // Apply new theme
      const { data, error } = await supabase
        .from('user_themes')
        .insert({
          user_id: userId,
          theme_id: themeId,
          customizations_json: {},
          is_active: true
        })
        .select(\`
          *,
          theme:website_themes(*)
        \`)
        .single()

      if (error) throw new Error(error.message)
      return data
    },

    updateThemeCustomizations: async (_, { userThemeId, customizations }, { supabase }) => {
      const { data, error } = await supabase
        .from('user_themes')
        .update({ 
          customizations_json: customizations,
          updated_at: new Date().toISOString()
        })
        .eq('id', userThemeId)
        .select(\`
          *,
          theme:website_themes(*)
        \`)
        .single()

      if (error) throw new Error(error.message)
      return data
    }
  }
}

module.exports = { typeDefs, resolvers }`,
        dependencies: ['apollo-server-express', 'graphql']
      }
  ]

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    onCodeUpdate?.(newCode, activeFramework, activeLanguage)
  }

  const handleFrameworkChange = (framework: string) => {
    setActiveFramework(framework)
    setActiveLanguage(languages[framework as keyof typeof languages][0])
    
    // Load template for new framework
    const template = codeTemplates.find(t => t.framework === framework)
    if (template) {
      setCode(template.code)
    }
  }

  const loadTemplate = (template: CodeTemplate) => {
    setActiveFramework(template.framework)
    setActiveLanguage(template.language)
    setCode(template.code)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `theme-${activeFramework}-${activeLanguage}.${activeLanguage === 'jsx' ? 'jsx' : activeLanguage === 'typescript' ? 'ts' : activeLanguage}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Framework and Language Selection */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Framework:</label>
          <Select value={activeFramework} onValueChange={handleFrameworkChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {frameworks.map((framework) => (
                <SelectItem key={framework.id} value={framework.id}>
                  <div className="flex items-center gap-2">
                    {framework.icon}
                    {framework.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Language:</label>
          <Select value={activeLanguage} onValueChange={setActiveLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages[activeFramework as keyof typeof languages]?.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Theme:</label>
          <Select value={editorTheme} onValueChange={setEditorTheme}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="github">Light</SelectItem>
              <SelectItem value="monokai">Dark</SelectItem>
              <SelectItem value="twilight">Twilight</SelectItem>
              <SelectItem value="dracula">Dracula</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Font Size:</label>
          <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12px</SelectItem>
              <SelectItem value="14">14px</SelectItem>
              <SelectItem value="16">16px</SelectItem>
              <SelectItem value="18">18px</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Templates Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Code Templates</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-80">
                <div className="p-4 space-y-2">
                  {codeTemplates
                    .filter(t => t.framework === activeFramework)
                    .map((template) => (
                    <Button
                      key={template.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => loadTemplate(template)}
                    >
                      <FileCode className="mr-2 h-3 w-3" />
                      <div className="text-left">
                        <div className="text-xs font-medium">{template.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {template.description}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Code Editor */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Code Editor
                  <Badge variant="secondary">
                    {activeFramework} / {activeLanguage}
                  </Badge>
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="mr-1 h-3 w-3" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadCode}>
                    <Download className="mr-1 h-3 w-3" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Play className="mr-1 h-3 w-3" />
                    Run
                  </Button>
                  <Button size="sm">
                    <Save className="mr-1 h-3 w-3" />
                    Save
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <AceEditor
                  mode={activeLanguage === 'jsx' ? 'javascript' : activeLanguage}
                  theme={editorTheme}
                  onChange={handleCodeChange}
                  value={code}
                  name="theme-code-editor"
                  editorProps={{ $blockScrolling: true }}
                  fontSize={fontSize}
                  showPrintMargin={true}
                  showGutter={true}
                  highlightActiveLine={true}
                  width="100%"
                  height="400px"
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                    useWorker: false
                  }}
                />
              </div>

              {/* Code Dependencies */}
              {codeTemplates.find(t => t.framework === activeFramework && t.language === activeLanguage)?.dependencies && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Dependencies:</h4>
                  <div className="flex flex-wrap gap-1">
                    {codeTemplates
                      .find(t => t.framework === activeFramework && t.language === activeLanguage)
                      ?.dependencies?.map((dep) => (
                      <Badge key={dep} variant="outline" className="text-xs">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}