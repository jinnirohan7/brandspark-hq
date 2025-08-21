import { CheckCircle, AlertCircle, XCircle, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface AccountHealthProps {
  verificationScore: number
  complianceStatus: string
  kycStatus: string
  documentsVerified: number
  totalDocuments: number
}

export const AccountHealthCard: React.FC<AccountHealthProps> = ({
  verificationScore,
  complianceStatus,
  kycStatus,
  documentsVerified,
  totalDocuments
}) => {
  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getHealthIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
      case 'complete':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'incomplete':
        return <Badge className="bg-red-100 text-red-800">Incomplete</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Account Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Score</span>
            <div className="flex items-center gap-2">
              {getHealthIcon(verificationScore)}
              <span className={`text-sm font-bold ${getHealthColor(verificationScore)}`}>
                {verificationScore}%
              </span>
            </div>
          </div>
          <Progress value={verificationScore} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">KYC Status</p>
            {getStatusBadge(kycStatus)}
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Compliance</p>
            {getStatusBadge(complianceStatus)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Documents Verified</span>
            <span className="font-medium">{documentsVerified}/{totalDocuments}</span>
          </div>
          <Progress 
            value={(documentsVerified / totalDocuments) * 100} 
            className="h-2" 
          />
        </div>

        {verificationScore < 100 && (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-2">Next Steps:</p>
            <ul className="text-xs space-y-1">
              {kycStatus !== 'verified' && (
                <li>• Complete KYC verification</li>
              )}
              {documentsVerified < totalDocuments && (
                <li>• Upload all required documents</li>
              )}
              {complianceStatus === 'incomplete' && (
                <li>• Complete business compliance details</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}