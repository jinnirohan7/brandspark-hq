import React, { useState, useEffect } from 'react'
import AceEditor from 'react-ace'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FileManager, FileNode } from './FileManager'
import { ProjectRunner } from './ProjectRunner'
import { 
  Code, 
  Save, 
  Copy, 
  Download,
  Settings,
  Plus,
  X,
  Search,
  Replace
} from 'lucide-react'

// Import ace editor themes and modes
import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/mode-css'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-typescript'
import 'ace-builds/src-noconflict/mode-jsx'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-vue'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/mode-php'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/theme-twilight'
import 'ace-builds/src-noconflict/theme-dracula'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/theme-solarized_light'
import 'ace-builds/src-noconflict/theme-solarized_dark'

interface EditorTab {
  id: string
  file: FileNode
  isModified: boolean
}

interface EnhancedCodeEditorProps {
  onCodeUpdate?: (code: string, filename: string) => void
  onPreviewUpdate?: (previewHtml: string) => void
  initialFiles?: FileNode[]
  theme?: any
}

export const EnhancedCodeEditor: React.FC<EnhancedCodeEditorProps> = ({
  onCodeUpdate,
  onPreviewUpdate,
  initialFiles = [],
  theme
}) => {
  const [files, setFiles] = useState<FileNode[]>(initialFiles)
  const [openTabs, setOpenTabs] = useState<EditorTab[]>([])
  const [activeTab, setActiveTab] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<FileNode>()
  const [editorTheme, setEditorTheme] = useState('github')
  const [fontSize, setFontSize] = useState(14)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFindReplace, setShowFindReplace] = useState(false)
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')

  // File operations
  const generateUniqueId = () => Math.random().toString(36).substr(2, 9)

  const buildFileTree = (fileList: FileList): FileNode[] => {
    const fileMap = new Map<string, FileNode>()
    
    Array.from(fileList).forEach((file) => {
      const pathParts = file.webkitRelativePath || file.name
      const parts = pathParts.split('/')
      let currentPath = ''
      
      parts.forEach((part, index) => {
        const parentPath = currentPath
        currentPath = currentPath ? `${currentPath}/${part}` : part
        
        if (!fileMap.has(currentPath)) {
          const isFile = index === parts.length - 1
          const node: FileNode = {
            id: generateUniqueId(),
            name: part,
            type: isFile ? 'file' : 'folder',
            path: currentPath,
            size: isFile ? file.size : undefined,
            lastModified: isFile ? new Date(file.lastModified) : undefined,
            children: isFile ? undefined : []
          }
          
          if (isFile) {
            const reader = new FileReader()
            reader.onload = (e) => {
              node.content = e.target?.result as string
              setFiles([...files])
            }
            reader.readAsText(file)
          }
          
          fileMap.set(currentPath, node)
          
          if (parentPath && fileMap.has(parentPath)) {
            const parent = fileMap.get(parentPath)!
            if (parent.children && !parent.children.find(c => c.name === part)) {
              parent.children.push(node)
            }
          }
        }
      })
    })
    
    return Array.from(fileMap.values()).filter(node => !node.path.includes('/'))
  }

  const handleFileUpload = (fileList: FileList) => {
    const newFiles = buildFileTree(fileList)
    setFiles(prev => [...prev, ...newFiles])
  }

  const handleFolderUpload = (fileList: FileList) => {
    const newFiles = buildFileTree(fileList)
    setFiles(prev => [...prev, ...newFiles])
  }

  const handleCreateFile = (path: string, name: string) => {
    const newFile: FileNode = {
      id: generateUniqueId(),
      name,
      type: 'file',
      path: `${path}${name}`,
      content: '',
      size: 0,
      lastModified: new Date()
    }
    
    setFiles(prev => [...prev, newFile])
    handleFileSelect(newFile)
  }

  const handleCreateFolder = (path: string, name: string) => {
    const newFolder: FileNode = {
      id: generateUniqueId(),
      name,
      type: 'folder',
      path: `${path}${name}`,
      children: []
    }
    
    setFiles(prev => [...prev, newFolder])
  }

  const handleDeleteFile = (file: FileNode) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${file.name}?`)
    if (!confirmDelete) return
    
    setFiles(prev => prev.filter(f => f.id !== file.id))
    setOpenTabs(prev => prev.filter(tab => tab.file.id !== file.id))
    
    if (selectedFile?.id === file.id) {
      const remainingTabs = openTabs.filter(tab => tab.file.id !== file.id)
      if (remainingTabs.length > 0) {
        setActiveTab(remainingTabs[0].id)
        setSelectedFile(remainingTabs[0].file)
      } else {
        setActiveTab('')
        setSelectedFile(undefined)
      }
    }
  }

  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'folder') return
    
    setSelectedFile(file)
    
    const existingTab = openTabs.find(tab => tab.file.id === file.id)
    if (existingTab) {
      setActiveTab(existingTab.id)
    } else {
      const newTab: EditorTab = {
        id: generateUniqueId(),
        file,
        isModified: false
      }
      setOpenTabs(prev => [...prev, newTab])
      setActiveTab(newTab.id)
    }
  }

  const handleCodeChange = (value: string) => {
    if (!selectedFile) return
    
    // Update file content
    setFiles(prev => prev.map(file => 
      file.id === selectedFile.id 
        ? { ...file, content: value }
        : file
    ))
    
    // Mark tab as modified
    setOpenTabs(prev => prev.map(tab => 
      tab.file.id === selectedFile.id 
        ? { ...tab, isModified: true }
        : tab
    ))
    
    onCodeUpdate?.(value, selectedFile.name)
  }

  const handleTabClose = (tabId: string) => {
    const tab = openTabs.find(t => t.id === tabId)
    if (tab?.isModified) {
      const shouldClose = window.confirm(`${tab.file.name} has unsaved changes. Close anyway?`)
      if (!shouldClose) return
    }
    
    setOpenTabs(prev => prev.filter(t => t.id !== tabId))
    
    if (activeTab === tabId) {
      const remainingTabs = openTabs.filter(t => t.id !== tabId)
      if (remainingTabs.length > 0) {
        setActiveTab(remainingTabs[0].id)
        setSelectedFile(remainingTabs[0].file)
      } else {
        setActiveTab('')
        setSelectedFile(undefined)
      }
    }
  }

  const handleSave = () => {
    if (!selectedFile) return
    
    setOpenTabs(prev => prev.map(tab => 
      tab.file.id === selectedFile.id 
        ? { ...tab, isModified: false }
        : tab
    ))
  }

  const getLanguageMode = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'js': return 'javascript'
      case 'jsx': return 'jsx'
      case 'ts': return 'typescript'
      case 'tsx': return 'tsx'
      case 'html': return 'html'
      case 'css': return 'css'
      case 'json': return 'json'
      case 'vue': return 'vue'
      case 'py': return 'python'
      case 'php': return 'php'
      default: return 'text'
    }
  }

  const copyToClipboard = async () => {
    if (!selectedFile?.content) return
    
    try {
      await navigator.clipboard.writeText(selectedFile.content)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const downloadFile = () => {
    if (!selectedFile?.content) return
    
    const blob = new Blob([selectedFile.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = selectedFile.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const activeTabData = openTabs.find(tab => tab.id === activeTab)

  return (
    <Tabs defaultValue="editor" className="h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="editor">Code Editor</TabsTrigger>
        <TabsTrigger value="files">File Manager</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      
      <TabsContent value="editor" className="flex-1 flex flex-col space-y-4">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Code className="h-4 w-4" />
                Code Editor
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <Select value={editorTheme} onValueChange={setEditorTheme}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="monokai">Monokai</SelectItem>
                    <SelectItem value="twilight">Twilight</SelectItem>
                    <SelectItem value="dracula">Dracula</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="solarized_light">Solarized Light</SelectItem>
                    <SelectItem value="solarized_dark">Solarized Dark</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(Number(value))}>
                  <SelectTrigger className="w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 12, 14, 16, 18, 20, 22, 24].map(size => (
                      <SelectItem key={size} value={size.toString()}>{size}px</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFindReplace(!showFindReplace)}
                >
                  <Search className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="sm" onClick={downloadFile}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* File Tabs */}
            {openTabs.length > 0 && (
              <div className="flex gap-1 border-b">
                {openTabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-t-md cursor-pointer transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-muted border-b-2 border-primary' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setSelectedFile(tab.file)
                    }}
                  >
                    <span className="text-sm">{tab.file.name}</span>
                    {tab.isModified && (
                      <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTabClose(tab.id)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Find and Replace */}
            {showFindReplace && (
              <div className="flex gap-2 p-2 bg-muted rounded-md">
                <Input
                  placeholder="Find..."
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Replace..."
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  <Replace className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="flex-1 p-0">
            {activeTabData ? (
              <AceEditor
                mode={getLanguageMode(activeTabData.file.name)}
                theme={editorTheme}
                value={activeTabData.file.content || ''}
                onChange={handleCodeChange}
                name="enhanced-code-editor"
                editorProps={{ $blockScrolling: true }}
                fontSize={fontSize}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                width="100%"
                height="100%"
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 2,
                  wrap: true
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Code className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No file selected</p>
                  <p className="text-sm">Open a file from the File Manager to start editing</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="files" className="flex-1">
        <FileManager
          files={files}
          onFileSelect={handleFileSelect}
          onFileUpload={handleFileUpload}
          onFolderUpload={handleFolderUpload}
          onCreateFile={handleCreateFile}
          onCreateFolder={handleCreateFolder}
          onDeleteFile={handleDeleteFile}
          selectedFile={selectedFile}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </TabsContent>
      
      <TabsContent value="preview" className="flex-1">
        <ProjectRunner
          files={files}
          onPreviewUpdate={onPreviewUpdate || (() => {})}
          selectedFile={selectedFile}
        />
      </TabsContent>
    </Tabs>
  )
}