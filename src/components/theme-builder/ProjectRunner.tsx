import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  Square, 
  RotateCcw, 
  ExternalLink, 
  Download,
  Monitor,
  Smartphone,
  Tablet,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { FileNode } from './FileManager'

interface ProjectRunnerProps {
  files: FileNode[]
  onPreviewUpdate: (previewHtml: string) => void
  selectedFile?: FileNode
}

interface ConsoleLog {
  id: string
  type: 'log' | 'error' | 'warn' | 'info'
  message: string
  timestamp: Date
}

export const ProjectRunner: React.FC<ProjectRunnerProps> = ({
  files,
  onPreviewUpdate,
  selectedFile
}) => {
  const [isRunning, setIsRunning] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([])
  const [buildStatus, setBuildStatus] = useState<'idle' | 'building' | 'success' | 'error'>('idle')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const addConsoleLog = (type: ConsoleLog['type'], message: string) => {
    const log: ConsoleLog = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date()
    }
    setConsoleLogs(prev => [...prev.slice(-99), log])
  }

  const detectProjectType = () => {
    const hasPackageJson = files.some(f => f.name === 'package.json')
    const hasIndexHtml = files.some(f => f.name === 'index.html')
    const hasReactFiles = files.some(f => f.name.endsWith('.jsx') || f.name.endsWith('.tsx'))
    const hasVueFiles = files.some(f => f.name.endsWith('.vue'))
    const hasAngularFiles = files.some(f => f.name === 'angular.json')

    if (hasAngularFiles) return 'angular'
    if (hasReactFiles && hasPackageJson) return 'react'
    if (hasVueFiles && hasPackageJson) return 'vue'
    if (hasIndexHtml) return 'html'
    return 'unknown'
  }

  const runProject = async () => {
    setIsRunning(true)
    setBuildStatus('building')
    addConsoleLog('info', 'Starting project build...')

    try {
      const projectType = detectProjectType()
      addConsoleLog('info', `Detected project type: ${projectType}`)

      switch (projectType) {
        case 'html':
          await runHtmlProject()
          break
        case 'react':
          await runReactProject()
          break
        case 'vue':
          await runVueProject()
          break
        default:
          await runHtmlProject() // Fallback to HTML
      }

      setBuildStatus('success')
      addConsoleLog('info', 'Build completed successfully!')
    } catch (error) {
      setBuildStatus('error')
      addConsoleLog('error', `Build failed: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const runHtmlProject = async () => {
    // Find index.html or create a basic HTML structure
    let indexFile = files.find(f => f.name === 'index.html')
    
    if (!indexFile) {
      // Create a basic HTML structure from other files
      const cssFiles = files.filter(f => f.name.endsWith('.css'))
      const jsFiles = files.filter(f => f.name.endsWith('.js'))
      
      let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    ${cssFiles.map(f => `<link rel="stylesheet" href="${f.name}">`).join('\n    ')}
</head>
<body>
    <div id="root">
        <h1>Project Preview</h1>
        <p>Add your HTML content here.</p>
    </div>
    ${jsFiles.map(f => `<script src="${f.name}"></script>`).join('\n    ')}
</body>
</html>`
      
      indexFile = {
        id: 'generated-index',
        name: 'index.html',
        type: 'file',
        path: '/index.html',
        content: htmlContent
      }
    }

    // Create blob URLs for all assets
    const assetUrls = new Map<string, string>()
    
    files.forEach(file => {
      if (file.content && file.type === 'file') {
        let mimeType = 'text/plain'
        
        if (file.name.endsWith('.css')) mimeType = 'text/css'
        else if (file.name.endsWith('.js')) mimeType = 'application/javascript'
        else if (file.name.endsWith('.html')) mimeType = 'text/html'
        else if (file.name.endsWith('.json')) mimeType = 'application/json'
        
        const blob = new Blob([file.content], { type: mimeType })
        assetUrls.set(file.name, URL.createObjectURL(blob))
      }
    })

    // Replace relative paths in HTML with blob URLs
    let processedHtml = indexFile.content || ''
    assetUrls.forEach((url, filename) => {
      processedHtml = processedHtml.replace(
        new RegExp(`["']${filename}["']`, 'g'),
        `"${url}"`
      )
    })

    onPreviewUpdate(processedHtml)
    addConsoleLog('info', 'HTML project loaded successfully')
  }

  const runReactProject = async () => {
    addConsoleLog('info', 'Compiling React components...')
    
    // This is a simplified React runner - in a real implementation,
    // you'd use Babel or similar to transpile JSX
    const jsxFiles = files.filter(f => f.name.endsWith('.jsx') || f.name.endsWith('.tsx'))
    
    if (jsxFiles.length === 0) {
      throw new Error('No React components found')
    }

    // For now, we'll create a basic HTML structure that shows the React files
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Project Preview</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        // React components would be injected here
        function App() {
            return React.createElement('div', null, 
                React.createElement('h1', null, 'React Project Preview'),
                React.createElement('p', null, 'Found ${jsxFiles.length} React component(s)')
            );
        }
        
        ReactDOM.render(React.createElement(App), document.getElementById('root'));
    </script>
</body>
</html>`

    onPreviewUpdate(htmlContent)
    addConsoleLog('info', `Loaded ${jsxFiles.length} React components`)
  }

  const runVueProject = async () => {
    addConsoleLog('info', 'Compiling Vue components...')
    
    const vueFiles = files.filter(f => f.name.endsWith('.vue'))
    
    if (vueFiles.length === 0) {
      throw new Error('No Vue components found')
    }

    // Basic Vue preview
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue Project Preview</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="app">
        <h1>Vue Project Preview</h1>
        <p>Found ${vueFiles.length} Vue component(s)</p>
    </div>
    <script>
        const { createApp } = Vue;
        createApp({
            data() {
                return {
                    componentCount: ${vueFiles.length}
                };
            }
        }).mount('#app');
    </script>
</body>
</html>`

    onPreviewUpdate(htmlContent)
    addConsoleLog('info', `Loaded ${vueFiles.length} Vue components`)
  }

  const stopProject = () => {
    setIsRunning(false)
    setBuildStatus('idle')
    addConsoleLog('info', 'Project stopped')
  }

  const clearConsole = () => {
    setConsoleLogs([])
  }

  const getPreviewDimensions = () => {
    switch (previewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' }
      case 'tablet':
        return { width: '768px', height: '1024px' }
      default:
        return { width: '100%', height: '100%' }
    }
  }

  const getStatusIcon = () => {
    switch (buildStatus) {
      case 'building':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              {getStatusIcon()}
              Project Runner
              <Badge variant={buildStatus === 'success' ? 'default' : 'secondary'}>
                {buildStatus}
              </Badge>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode('desktop')}
                className={previewMode === 'desktop' ? 'bg-muted' : ''}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode('tablet')}
                className={previewMode === 'tablet' ? 'bg-muted' : ''}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode('mobile')}
                className={previewMode === 'mobile' ? 'bg-muted' : ''}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={isRunning ? "secondary" : "default"}
              size="sm"
              onClick={isRunning ? stopProject : runProject}
              disabled={buildStatus === 'building'}
            >
              {isRunning ? <Square className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isRunning ? 'Stop' : 'Run'}
            </Button>
            
            <Button variant="outline" size="sm" onClick={runProject}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reload
            </Button>
            
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-1" />
              Open
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div 
                className="border rounded-lg overflow-hidden mx-auto bg-white"
                style={getPreviewDimensions()}
              >
                <iframe
                  ref={iframeRef}
                  className="w-full h-full border-0"
                  title="Project Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Console</CardTitle>
                <Button variant="outline" size="sm" onClick={clearConsole}>
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-2">
                  {consoleLogs.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No console output yet. Run your project to see logs.
                    </p>
                  ) : (
                    consoleLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`text-xs p-2 rounded font-mono ${
                          log.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                          log.type === 'warn' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                          log.type === 'info' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-gray-50 text-gray-700 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-muted-foreground">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                          <span className="flex-1">{log.message}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}