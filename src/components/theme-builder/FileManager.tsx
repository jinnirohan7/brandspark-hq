import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Upload, 
  Folder, 
  File, 
  Download, 
  Trash2, 
  Plus,
  Search,
  FolderOpen,
  FileText,
  FileCode,
  Image,
  Settings
} from 'lucide-react'

export interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  path: string
  content?: string
  size?: number
  lastModified?: Date
  children?: FileNode[]
  isOpen?: boolean
}

interface FileManagerProps {
  files: FileNode[]
  onFileSelect: (file: FileNode) => void
  onFileUpload: (files: FileList) => void
  onFolderUpload: (files: FileList) => void
  onCreateFile: (path: string, name: string) => void
  onCreateFolder: (path: string, name: string) => void
  onDeleteFile: (file: FileNode) => void
  selectedFile?: FileNode
  searchTerm: string
  onSearchChange: (term: string) => void
}

export const FileManager: React.FC<FileManagerProps> = ({
  files,
  onFileSelect,
  onFileUpload,
  onFolderUpload,
  onCreateFile,
  onCreateFolder,
  onDeleteFile,
  selectedFile,
  searchTerm,
  onSearchChange
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (file: FileNode) => {
    if (file.type === 'folder') {
      return expandedFolders.has(file.id) ? 
        <FolderOpen className="h-4 w-4 text-blue-500" /> : 
        <Folder className="h-4 w-4 text-blue-500" />
    }

    const extension = file.name.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
      case 'vue':
      case 'py':
      case 'php':
        return <FileCode className="h-4 w-4 text-green-500" />
      case 'html':
      case 'css':
      case 'scss':
      case 'less':
        return <FileCode className="h-4 w-4 text-orange-500" />
      case 'json':
      case 'xml':
      case 'yaml':
        return <Settings className="h-4 w-4 text-purple-500" />
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <Image className="h-4 w-4 text-pink-500" />
      case 'md':
      case 'txt':
        return <FileText className="h-4 w-4 text-gray-500" />
      default:
        return <File className="h-4 w-4 text-gray-400" />
    }
  }

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  const filterFiles = (nodes: FileNode[], term: string): FileNode[] => {
    if (!term) return nodes
    
    return nodes.filter(node => {
      if (node.name.toLowerCase().includes(term.toLowerCase())) {
        return true
      }
      if (node.type === 'folder' && node.children) {
        const filteredChildren = filterFiles(node.children, term)
        return filteredChildren.length > 0
      }
      return false
    }).map(node => {
      if (node.type === 'folder' && node.children) {
        return {
          ...node,
          children: filterFiles(node.children, term)
        }
      }
      return node
    })
  }

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    const filteredNodes = filterFiles(nodes, searchTerm)
    
    return filteredNodes.map((node) => (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${
            selectedFile?.id === node.id ? 'bg-muted' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.id)
            } else {
              onFileSelect(node)
            }
          }}
        >
          {getFileIcon(node)}
          <span className="flex-1 text-sm truncate">{node.name}</span>
          {node.type === 'file' && (
            <Badge variant="outline" className="text-xs">
              {formatFileSize(node.size)}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              onDeleteFile(node)
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        
        {node.type === 'folder' && 
         node.children && 
         expandedFolders.has(node.id) && (
          <div>
            {renderFileTree(node.children, depth + 1)}
          </div>
        )}
      </div>
    ))
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base flex items-center gap-2">
          <Folder className="h-4 w-4" />
          Project Files
        </CardTitle>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => folderInputRef.current?.click()}
          >
            <FolderOpen className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="flex gap-2 p-4 border-b">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const name = prompt('Enter file name:')
              if (name) onCreateFile('/', name)
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            File
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const name = prompt('Enter folder name:')
              if (name) onCreateFolder('/', name)
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Folder
          </Button>
        </div>
        
        <ScrollArea className="h-[400px]">
          <div className="p-2 group">
            {files.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Folder className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No files uploaded</p>
                <p className="text-sm">Upload files or folders to get started</p>
              </div>
            ) : (
              renderFileTree(files)
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            onFileUpload(e.target.files)
          }
        }}
      />
      
      <input
        ref={folderInputRef}
        type="file"
        multiple
        {...({ webkitdirectory: "" } as any)}
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            onFolderUpload(e.target.files)
          }
        }}
      />
    </Card>
  )
}