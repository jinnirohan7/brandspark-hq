import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ColorPicker } from 'react-color'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-css'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-monokai'
import { 
  Palette, 
  Type, 
  Layout, 
  Space, 
  Code,
  Eye, 
  Save, 
  RotateCcw,
  Copy,
  Download,
  Upload,
  Wand2,
  Sun,
  Moon,
  Monitor,
  Brush,
  Grid3X3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react'

interface ColorScheme {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  destructive: string
  border: string
}

interface Typography {
  fontFamily: string
  headingFont: string
  bodyFont: string
  baseFontSize: number
  lineHeight: number
  letterSpacing: number
  fontWeights: {
    light: number
    normal: number
    medium: number
    semibold: number
    bold: number
  }
}

interface Spacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
}

interface BorderRadius {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  full: string
}

interface Shadows {
  sm: string
  md: string
  lg: string
  xl: string
  none: string
}

interface Animation {
  duration: string
  easing: string
  hover: boolean
  transitions: boolean
}

interface Customizations {
  colors: ColorScheme
  typography: Typography
  spacing: Spacing
  borderRadius: BorderRadius
  shadows: Shadows
  animation: Animation
  layout: {
    maxWidth: string
    columns: number
    gutter: string
  }
  customCSS: string
  customJS: string
  darkMode: boolean
}

interface ProfessionalCustomizationPanelProps {
  currentTheme?: any
  customizations: Customizations
  onUpdateCustomizations: (customizations: Customizations) => void
  onResetToDefault: () => void
  onSave: () => void
  onExport: () => void
  onImport: (file: File) => void
}

export const ProfessionalCustomizationPanel: React.FC<ProfessionalCustomizationPanelProps> = ({
  currentTheme,
  customizations,
  onUpdateCustomizations,
  onResetToDefault,
  onSave,
  onExport,
  onImport
}) => {
  const [selectedColorField, setSelectedColorField] = useState<string | null>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [previewMode, setPreviewMode] = useState<'light' | 'dark' | 'auto'>('auto')

  const updateCustomization = useCallback((path: string, value: any) => {
    const keys = path.split('.')
    const newCustomizations = { ...customizations }
    
    let current = newCustomizations as any
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value
    
    onUpdateCustomizations(newCustomizations)
  }, [customizations, onUpdateCustomizations])

  const handleColorChange = useCallback((field: string, color: any) => {
    updateCustomization(`colors.${field}`, color.hex)
  }, [updateCustomization])

  const generateColorPalette = useCallback(() => {
    // AI-powered color generation based on primary color
    const baseColor = customizations.colors.primary
    // Implement color harmony generation
    const harmonicColors = {
      secondary: adjustColor(baseColor, -30, 0, 20),
      accent: adjustColor(baseColor, 60, 10, -10),
      background: '#ffffff',
      foreground: '#000000',
      muted: adjustColor(baseColor, 0, -80, 95),
      destructive: '#ef4444',
      border: adjustColor(baseColor, 0, -60, 90)
    }
    
    updateCustomization('colors', { ...customizations.colors, ...harmonicColors })
  }, [customizations.colors, updateCustomization])

  const adjustColor = (hex: string, hueShift: number, satShift: number, lightShift: number): string => {
    // Convert hex to HSL, adjust, convert back
    // This is a simplified version - in practice, you'd use a proper color manipulation library
    return hex // Placeholder
  }

  const presetColorSchemes = [
    { name: 'Modern Blue', colors: { primary: '#3b82f6', secondary: '#1e40af', accent: '#06b6d4' } },
    { name: 'Elegant Purple', colors: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a855f7' } },
    { name: 'Professional Green', colors: { primary: '#10b981', secondary: '#059669', accent: '#34d399' } },
    { name: 'Warm Orange', colors: { primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24' } },
    { name: 'Classic Red', colors: { primary: '#ef4444', secondary: '#dc2626', accent: '#f87171' } },
    { name: 'Minimalist Gray', colors: { primary: '#6b7280', secondary: '#4b5563', accent: '#9ca3af' } }
  ]

  const fontPairings = [
    { name: 'Modern Sans', heading: 'Inter', body: 'Inter' },
    { name: 'Classic Serif', heading: 'Playfair Display', body: 'Source Serif Pro' },
    { name: 'Tech Mono', heading: 'JetBrains Mono', body: 'Roboto' },
    { name: 'Elegant Script', heading: 'Dancing Script', body: 'Open Sans' },
    { name: 'Professional', heading: 'Montserrat', body: 'Lato' },
    { name: 'Creative Bold', heading: 'Oswald', body: 'Nunito' }
  ]

  const animationPresets = [
    { name: 'Subtle', duration: '200ms', easing: 'ease-out' },
    { name: 'Smooth', duration: '300ms', easing: 'ease-in-out' },
    { name: 'Snappy', duration: '150ms', easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    { name: 'Bouncy', duration: '400ms', easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
    { name: 'None', duration: '0ms', easing: 'linear' }
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4 bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Theme Customization</h2>
            <p className="text-sm text-muted-foreground">
              Customize every aspect of your theme
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onResetToDefault}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={onSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="colors" className="h-full flex flex-col">
          <TabsList className="mx-4 mt-4">
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="spacing" className="flex items-center gap-2">
              <Space className="h-4 w-4" />
              Spacing
            </TabsTrigger>
            <TabsTrigger value="effects" className="flex items-center gap-2">
              <Brush className="h-4 w-4" />
              Effects
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Custom Code
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="colors" className="space-y-6 mt-0">
              {/* Color Scheme Presets */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Color Schemes</CardTitle>
                    <Button size="sm" variant="outline" onClick={generateColorPalette}>
                      <Wand2 className="mr-2 h-4 w-4" />
                      AI Generate
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {presetColorSchemes.map((scheme) => (
                      <Button
                        key={scheme.name}
                        variant="outline"
                        className="h-auto p-3 flex flex-col items-start"
                        onClick={() => updateCustomization('colors', { ...customizations.colors, ...scheme.colors })}
                      >
                        <div className="flex gap-1 mb-2">
                          {Object.values(scheme.colors).map((color, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded-sm border"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <span className="text-xs">{scheme.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Individual Color Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>Brand Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(customizations.colors).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded border-2 border-border cursor-pointer"
                          style={{ backgroundColor: value }}
                          onClick={() => {
                            setSelectedColorField(key)
                            setShowColorPicker(true)
                          }}
                        />
                        <Input
                          value={value}
                          onChange={(e) => updateCustomization(`colors.${key}`, e.target.value)}
                          className="w-20 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Dark Mode Toggle */}
              <Card>
                <CardHeader>
                  <CardTitle>Theme Mode</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      <span>Dark Mode</span>
                      <Moon className="h-4 w-4" />
                    </div>
                    <Switch
                      checked={customizations.darkMode}
                      onCheckedChange={(checked) => updateCustomization('darkMode', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="typography" className="space-y-6 mt-0">
              {/* Font Pairings */}
              <Card>
                <CardHeader>
                  <CardTitle>Font Pairings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {fontPairings.map((pairing) => (
                      <Button
                        key={pairing.name}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-start"
                        onClick={() => {
                          updateCustomization('typography.headingFont', pairing.heading)
                          updateCustomization('typography.bodyFont', pairing.body)
                        }}
                      >
                        <div className="w-full text-left">
                          <div className="font-bold text-lg mb-1" style={{ fontFamily: pairing.heading }}>
                            Heading Sample
                          </div>
                          <div className="text-sm text-muted-foreground" style={{ fontFamily: pairing.body }}>
                            Body text sample with this font pairing
                          </div>
                          <Badge variant="secondary" className="mt-2 text-xs">
                            {pairing.name}
                          </Badge>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Typography Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>Typography Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Base Font Size</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        value={[customizations.typography.baseFontSize]}
                        onValueChange={([value]) => updateCustomization('typography.baseFontSize', value)}
                        min={12}
                        max={24}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-12">
                        {customizations.typography.baseFontSize}px
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label>Line Height</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        value={[customizations.typography.lineHeight]}
                        onValueChange={([value]) => updateCustomization('typography.lineHeight', value)}
                        min={1.2}
                        max={2.0}
                        step={0.1}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-12">
                        {customizations.typography.lineHeight}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label>Letter Spacing</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        value={[customizations.typography.letterSpacing]}
                        onValueChange={([value]) => updateCustomization('typography.letterSpacing', value)}
                        min={-0.05}
                        max={0.1}
                        step={0.01}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-12">
                        {customizations.typography.letterSpacing}em
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Text Formatting */}
              <Card>
                <CardHeader>
                  <CardTitle>Text Formatting</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Underline className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button variant="outline" size="sm">
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <AlignRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layout" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Layout Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Max Width</Label>
                    <Select
                      value={customizations.layout.maxWidth}
                      onValueChange={(value) => updateCustomization('layout.maxWidth', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1200px">1200px (Default)</SelectItem>
                        <SelectItem value="1140px">1140px (Bootstrap)</SelectItem>
                        <SelectItem value="1024px">1024px (Compact)</SelectItem>
                        <SelectItem value="100%">100% (Full Width)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Grid Columns</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        value={[customizations.layout.columns]}
                        onValueChange={([value]) => updateCustomization('layout.columns', value)}
                        min={6}
                        max={24}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-12">
                        {customizations.layout.columns}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label>Gutter Size</Label>
                    <Select
                      value={customizations.layout.gutter}
                      onValueChange={(value) => updateCustomization('layout.gutter', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16px">16px (Tight)</SelectItem>
                        <SelectItem value="24px">24px (Default)</SelectItem>
                        <SelectItem value="32px">32px (Spacious)</SelectItem>
                        <SelectItem value="48px">48px (Very Spacious)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="spacing" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Spacing Scale</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(customizations.spacing).map(([key, value]) => (
                    <div key={key}>
                      <Label className="capitalize">{key} Spacing</Label>
                      <Input
                        value={value}
                        onChange={(e) => updateCustomization(`spacing.${key}`, e.target.value)}
                        placeholder="e.g., 8px, 1rem"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="effects" className="space-y-6 mt-0">
              {/* Border Radius */}
              <Card>
                <CardHeader>
                  <CardTitle>Border Radius</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(customizations.borderRadius).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label className="capitalize">{key}</Label>
                      <Input
                        value={value}
                        onChange={(e) => updateCustomization(`borderRadius.${key}`, e.target.value)}
                        className="w-20"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Shadows */}
              <Card>
                <CardHeader>
                  <CardTitle>Box Shadows</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(customizations.shadows).map(([key, value]) => (
                    <div key={key}>
                      <Label className="capitalize">{key} Shadow</Label>
                      <Input
                        value={value}
                        onChange={(e) => updateCustomization(`shadows.${key}`, e.target.value)}
                        placeholder="e.g., 0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Animations */}
              <Card>
                <CardHeader>
                  <CardTitle>Animations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {animationPresets.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          updateCustomization('animation.duration', preset.duration)
                          updateCustomization('animation.easing', preset.easing)
                        }}
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Hover Effects</Label>
                    <Switch
                      checked={customizations.animation.hover}
                      onCheckedChange={(checked) => updateCustomization('animation.hover', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Smooth Transitions</Label>
                    <Switch
                      checked={customizations.animation.transitions}
                      onCheckedChange={(checked) => updateCustomization('animation.transitions', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="code" className="space-y-6 mt-0">
              {/* Custom CSS */}
              <Card>
                <CardHeader>
                  <CardTitle>Custom CSS</CardTitle>
                </CardHeader>
                <CardContent>
                  <AceEditor
                    mode="css"
                    theme="monokai"
                    value={customizations.customCSS}
                    onChange={(value) => updateCustomization('customCSS', value)}
                    name="custom-css-editor"
                    editorProps={{ $blockScrolling: true }}
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

              {/* Custom JavaScript */}
              <Card>
                <CardHeader>
                  <CardTitle>Custom JavaScript</CardTitle>
                </CardHeader>
                <CardContent>
                  <AceEditor
                    mode="javascript"
                    theme="monokai"
                    value={customizations.customJS}
                    onChange={(value) => updateCustomization('customJS', value)}
                    name="custom-js-editor"
                    editorProps={{ $blockScrolling: true }}
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

              {/* Code Templates */}
              <Card>
                <CardHeader>
                  <CardTitle>Code Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      Google Analytics
                    </Button>
                    <Button variant="outline" size="sm">
                      Facebook Pixel
                    </Button>
                    <Button variant="outline" size="sm">
                      Live Chat Widget
                    </Button>
                    <Button variant="outline" size="sm">
                      Cookie Banner
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Color Picker Modal */}
      {showColorPicker && selectedColorField && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-80">
            <CardHeader>
              <CardTitle>Choose Color</CardTitle>
            </CardHeader>
            <CardContent>
              <ColorPicker
                color={customizations.colors[selectedColorField as keyof ColorScheme]}
                onChange={(color) => handleColorChange(selectedColorField, color)}
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowColorPicker(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowColorPicker(false)}>
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}