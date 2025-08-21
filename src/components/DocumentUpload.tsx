import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, XCircle, Clock, Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

interface Document {
  id: string
  document_type: string
  document_name: string
  file_path: string
  verification_status: string
  uploaded_at: string
  expires_at?: string
  document_number?: string
}

interface DocumentUploadProps {
  documentType: string
  title: string
  description: string
  bucket: 'kyc-documents' | 'business-documents'
  documents: Document[]
  onDocumentChange: () => void
  acceptedFormats?: string[]
  isRequired?: boolean
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documentType,
  title,
  description,
  bucket,
  documents,
  onDocumentChange,
  acceptedFormats = ['.pdf', '.jpg', '.jpeg', '.png'],
  isRequired = false
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  const existingDoc = documents.find(doc => doc.document_type === documentType)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    // Validate file type
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!acceptedFormats.includes(fileExt)) {
      toast({
        title: "Invalid file type",
        description: `Please select a file with one of these formats: ${acceptedFormats.join(', ')}`,
        variant: "destructive"
      })
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)

    try {
      // Create file path
      const fileName = `${user.id}/${documentType}_${Date.now()}${fileExt}`

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Save document record to database
      const { error: dbError } = await supabase
        .from('seller_documents')
        .insert({
          seller_id: user.id,
          document_type: documentType,
          document_name: file.name,
          file_path: fileName,
          file_size: file.size,
          mime_type: file.type
        })

      if (dbError) throw dbError

      onDocumentChange()

      toast({
        title: "Success",
        description: "Document uploaded successfully"
      })
    } catch (error) {
      console.error('Error uploading document:', error)
      toast({
        title: "Upload failed",
        description: "Failed to upload document",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleViewDocument = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 3600) // 1 hour expiry

      if (error) throw error

      window.open(data.signedUrl, '_blank')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open document",
        variant: "destructive"
      })
    }
  }

  const handleDeleteDocument = async (docId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('seller_documents')
        .delete()
        .eq('id', docId)

      if (dbError) throw dbError

      onDocumentChange()

      toast({
        title: "Success",
        description: "Document deleted successfully"
      })
    } catch (error) {
      console.error('Error deleting document:', error)
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive"
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          {isRequired && <Badge variant="destructive">Required</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        {existingDoc ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{existingDoc.document_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded {new Date(existingDoc.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {getStatusIcon(existingDoc.verification_status)}
                  <Badge 
                    variant="secondary" 
                    className={getStatusColor(existingDoc.verification_status)}
                  >
                    {existingDoc.verification_status}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDocument(existingDoc.file_path)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteDocument(existingDoc.id, existingDoc.file_path)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Replace Document
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              Drag and drop your document here, or click to browse
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Choose File'}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Accepted formats: {acceptedFormats.join(', ')} (Max 10MB)
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}