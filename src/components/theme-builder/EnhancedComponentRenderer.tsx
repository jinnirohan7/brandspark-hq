import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Star, Mail, Users, Zap, Image as ImageIcon, Play } from 'lucide-react'

interface Component {
  id: string
  type: string
  name: string
  content: any
  styles: any
}

interface EnhancedComponentRendererProps {
  component: Component
  isPreview: boolean
  isSelected?: boolean
  onClick?: () => void
  onDoubleClick?: () => void
}

export const EnhancedComponentRenderer: React.FC<EnhancedComponentRendererProps> = ({
  component,
  isPreview,
  isSelected,
  onClick,
  onDoubleClick
}) => {
  const containerStyle = {
    ...component.styles,
    cursor: isPreview ? 'default' : 'pointer',
    outline: isSelected && !isPreview ? '2px solid hsl(var(--primary))' : 'none',
    position: 'relative' as const
  }

  const renderComponent = () => {
    switch (component.type) {
      case 'text':
        const TextTag = component.content.tag || 'p'
        return (
          <TextTag 
            style={containerStyle}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
          >
            {component.content.text || 'Your text here...'}
          </TextTag>
        )

      case 'image':
        return (
          <div style={containerStyle} onClick={onClick} onDoubleClick={onDoubleClick}>
            <img
              src={component.content.src || '/api/placeholder/400/300'}
              alt={component.content.alt || 'Image'}
              className="w-full h-auto object-cover rounded"
              loading="lazy"
            />
          </div>
        )

      case 'video':
        return (
          <div style={containerStyle} onClick={onClick} onDoubleClick={onDoubleClick}>
            <div className="relative bg-muted rounded-lg overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-12 w-12 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Video Player</p>
                  {component.content.src && (
                    <p className="text-xs mt-1 truncate max-w-[200px]">{component.content.src}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 'button':
        return (
          <div style={{ ...containerStyle, display: 'flex', alignItems: 'center' }} onClick={onClick} onDoubleClick={onDoubleClick}>
            <Button 
              variant={component.content.variant || 'default'}
              className="pointer-events-none"
            >
              {component.content.text || 'Click me'}
            </Button>
          </div>
        )

      case 'product-card':
        return (
          <div style={containerStyle} onClick={onClick} onDoubleClick={onDoubleClick}>
            <Card className="w-full max-w-sm">
              <CardHeader className="p-0">
                <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src={component.content.image || '/api/placeholder/300/300'}
                    alt={component.content.title || 'Product'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg">
                  {component.content.title || 'Product Name'}
                </CardTitle>
                <CardDescription className="mt-2">
                  {component.content.description || 'Product description...'}
                </CardDescription>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-2xl font-bold text-primary">
                    {component.content.price || '$99.99'}
                  </span>
                  <Button size="sm">Add to Cart</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'form':
        return (
          <div style={containerStyle} onClick={onClick} onDoubleClick={onDoubleClick}>
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Contact Form</CardTitle>
                <CardDescription>Get in touch with us</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {component.content.fields?.map((field: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <Label>{field.label || field.name}</Label>
                    {field.type === 'textarea' ? (
                      <Textarea placeholder={`Enter ${field.label || field.name}`} />
                    ) : (
                      <Input type={field.type || 'text'} placeholder={`Enter ${field.label || field.name}`} />
                    )}
                  </div>
                ))}
                <Button className="w-full">
                  {component.content.submitText || 'Submit'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      case 'gallery':
        return (
          <div style={containerStyle} onClick={onClick} onDoubleClick={onDoubleClick}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {component.content.images?.slice(0, 6).map((image: string, index: number) => (
                <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={image || '/api/placeholder/300/200'}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              )) || (
                <div className="col-span-full flex items-center justify-center py-12 bg-muted rounded-lg">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Image Gallery</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 'carousel':
        return (
          <div style={containerStyle} onClick={onClick} onDoubleClick={onDoubleClick}>
            <div className="relative bg-muted rounded-lg overflow-hidden">
              <div className="aspect-[2/1] bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="flex space-x-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <div className="w-3 h-3 rounded-full bg-primary/30"></div>
                    <div className="w-3 h-3 rounded-full bg-primary/30"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {component.content.slides?.[0]?.title || 'Slide Title'}
                  </h3>
                  <p className="text-muted-foreground">
                    {component.content.slides?.[0]?.description || 'Slide description...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'hero':
        return (
          <div 
            style={{
              ...containerStyle,
              backgroundImage: component.content.backgroundImage ? `url(${component.content.backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              minHeight: '400px'
            }}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                {component.content.title || 'Welcome to Our Site'}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl">
                {component.content.subtitle || 'Discover amazing experiences with us'}
              </p>
              <Button size="lg" variant="secondary">
                {component.content.ctaText || 'Get Started'}
              </Button>
            </div>
          </div>
        )

      case 'testimonial':
        return (
          <div style={containerStyle} onClick={onClick} onDoubleClick={onDoubleClick}>
            <Card className="w-full max-w-lg">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg italic mb-4">
                  "{component.content.quote || 'This service is absolutely amazing! Highly recommended.'}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{component.content.author || 'John Doe'}</p>
                    <p className="text-sm text-muted-foreground">
                      {component.content.role || 'Happy Customer'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'pricing':
        return (
          <div style={containerStyle} onClick={onClick} onDoubleClick={onDoubleClick}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Basic', 'Pro', 'Enterprise'].map((plan, index) => (
                <Card key={plan} className={index === 1 ? 'border-primary shadow-lg' : ''}>
                  <CardHeader className="text-center">
                    <CardTitle>{plan}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold text-primary">
                        ${['9', '29', '99'][index]}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      'Feature 1',
                      'Feature 2',
                      'Feature 3',
                      index > 0 ? 'Advanced Feature' : null,
                      index > 1 ? 'Premium Support' : null
                    ].filter(Boolean).map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    <Button className="w-full mt-4" variant={index === 1 ? 'default' : 'outline'}>
                      Choose {plan}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 'team':
        return (
          <div style={containerStyle} onClick={onClick} onDoubleClick={onDoubleClick}>
            <Card className="w-full max-w-sm text-center">
              <CardContent className="pt-6">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {component.content.name || 'Team Member'}
                </h3>
                <p className="text-primary font-medium mb-3">
                  {component.content.role || 'Position'}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {component.content.bio || 'Bio information about this team member...'}
                </p>
                <div className="flex justify-center space-x-2">
                  <Button variant="outline" size="sm">LinkedIn</Button>
                  <Button variant="outline" size="sm">Twitter</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'feature':
        return (
          <div style={containerStyle} onClick={onClick} onDoubleClick={onDoubleClick}>
            <Card className="w-full max-w-sm text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {component.content.title || 'Feature Title'}
                </h3>
                <p className="text-muted-foreground">
                  {component.content.description || 'Feature description goes here...'}
                </p>
              </CardContent>
            </Card>
          </div>
        )

      case 'newsletter':
        return (
          <div style={containerStyle} onClick={onClick} onDoubleClick={onDoubleClick}>
            <Card>
              <CardContent className="pt-6 text-center">
                <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">
                  {component.content.title || 'Subscribe to Newsletter'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {component.content.description || 'Stay updated with our latest news and offers'}
                </p>
                <div className="flex gap-2 max-w-md mx-auto">
                  <Input placeholder="Enter your email" type="email" />
                  <Button>Subscribe</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'footer':
        return (
          <div style={containerStyle} onClick={onClick} onDoubleClick={onDoubleClick}>
            <div className="w-full bg-muted/50 border-t">
              <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <h4 className="font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>About Us</li>
                      <li>Our Team</li>
                      <li>Careers</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Services</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Web Design</li>
                      <li>Development</li>
                      <li>Consulting</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Support</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Help Center</li>
                      <li>Contact</li>
                      <li>Privacy</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Connect</h4>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Facebook</Button>
                      <Button variant="outline" size="sm">Twitter</Button>
                    </div>
                  </div>
                </div>
                <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                  <p>&copy; 2024 Your Company. All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div 
            style={containerStyle} 
            className="p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg text-center"
            onClick={onClick}
            onDoubleClick={onDoubleClick}
          >
            <p className="text-muted-foreground">
              {component.type} component
            </p>
          </div>
        )
    }
  }

  return renderComponent()
}