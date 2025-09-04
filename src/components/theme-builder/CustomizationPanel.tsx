import { useState } from 'react'
import { Palette, Type, Layout, Save, RotateCcw, Space } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { UserTheme } from '@/hooks/useThemeBuilder'

interface CustomizationPanelProps {
  currentTheme: UserTheme | null
  onUpdateCustomizations: (customizations: any) => void
  onResetToDefault: () => void
}

export const CustomizationPanel = ({
  currentTheme,
  onUpdateCustomizations,
  onResetToDefault
}: CustomizationPanelProps) => {
  const [customizations, setCustomizations] = useState(
    currentTheme?.customizations_json || {}
  )

  const updateCustomization = (section: string, key: string, value: any) => {
    const newCustomizations = {
      ...customizations,
      [section]: {
        ...customizations[section],
        [key]: value
      }
    }
    setCustomizations(newCustomizations)
  }

  const handleSave = () => {
    onUpdateCustomizations(customizations)
  }

  const handleReset = () => {
    setCustomizations({})
    onResetToDefault()
  }

  if (!currentTheme) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Theme Selected</h3>
            <p>Apply a theme first to start customizing</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const fonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat',
    'Playfair Display', 'Merriweather', 'Source Sans Pro', 'Nunito'
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Customize Theme</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="colors" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors">
            <Palette className="h-4 w-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography">
            <Type className="h-4 w-4 mr-2" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="layout">
            <Layout className="h-4 w-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="spacing">
            <Space className="h-4 w-4 mr-2" />
            Spacing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={customizations.colors?.primary || '#3b82f6'}
                      onChange={(e) => updateCustomization('colors', 'primary', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={customizations.colors?.primary || '#3b82f6'}
                      onChange={(e) => updateCustomization('colors', 'primary', e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={customizations.colors?.secondary || '#6b7280'}
                      onChange={(e) => updateCustomization('colors', 'secondary', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={customizations.colors?.secondary || '#6b7280'}
                      onChange={(e) => updateCustomization('colors', 'secondary', e.target.value)}
                      placeholder="#6b7280"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accent-color"
                      type="color"
                      value={customizations.colors?.accent || '#f59e0b'}
                      onChange={(e) => updateCustomization('colors', 'accent', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={customizations.colors?.accent || '#f59e0b'}
                      onChange={(e) => updateCustomization('colors', 'accent', e.target.value)}
                      placeholder="#f59e0b"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background-color">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="background-color"
                      type="color"
                      value={customizations.colors?.background || '#ffffff'}
                      onChange={(e) => updateCustomization('colors', 'background', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={customizations.colors?.background || '#ffffff'}
                      onChange={(e) => updateCustomization('colors', 'background', e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Typography Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Font</Label>
                  <Select
                    value={customizations.typography?.primaryFont || 'Inter'}
                    onValueChange={(value) => updateCustomization('typography', 'primaryFont', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map((font) => (
                        <SelectItem key={font} value={font}>
                          <span style={{ fontFamily: font }}>{font}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Secondary Font</Label>
                  <Select
                    value={customizations.typography?.secondaryFont || 'Roboto'}
                    onValueChange={(value) => updateCustomization('typography', 'secondaryFont', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map((font) => (
                        <SelectItem key={font} value={font}>
                          <span style={{ fontFamily: font }}>{font}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Heading Size Scale</Label>
                  <Slider
                    value={[customizations.typography?.headingScale || 1.2]}
                    onValueChange={([value]) => updateCustomization('typography', 'headingScale', value)}
                    min={1}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">
                    Current: {customizations.typography?.headingScale || 1.2}x
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Line Height</Label>
                  <Slider
                    value={[customizations.typography?.lineHeight || 1.6]}
                    onValueChange={([value]) => updateCustomization('typography', 'lineHeight', value)}
                    min={1.2}
                    max={2.4}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">
                    Current: {customizations.typography?.lineHeight || 1.6}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Layout Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Full Width Layout</Label>
                    <div className="text-sm text-muted-foreground">
                      Use full browser width
                    </div>
                  </div>
                  <Switch
                    checked={customizations.layout?.fullWidth || false}
                    onCheckedChange={(checked) => updateCustomization('layout', 'fullWidth', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Content Width (px)</Label>
                  <Input
                    type="number"
                    value={customizations.layout?.maxWidth || 1200}
                    onChange={(e) => updateCustomization('layout', 'maxWidth', parseInt(e.target.value))}
                    disabled={customizations.layout?.fullWidth}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Header Style</Label>
                  <Select
                    value={customizations.layout?.headerStyle || 'default'}
                    onValueChange={(value) => updateCustomization('layout', 'headerStyle', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="centered">Centered</SelectItem>
                      <SelectItem value="sticky">Sticky</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Footer Style</Label>
                  <Select
                    value={customizations.layout?.footerStyle || 'default'}
                    onValueChange={(value) => updateCustomization('layout', 'footerStyle', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spacing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spacing Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Section Padding</Label>
                  <Slider
                    value={[customizations.spacing?.sectionPadding || 40]}
                    onValueChange={([value]) => updateCustomization('spacing', 'sectionPadding', value)}
                    min={20}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">
                    Current: {customizations.spacing?.sectionPadding || 40}px
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Element Spacing</Label>
                  <Slider
                    value={[customizations.spacing?.elementSpacing || 20]}
                    onValueChange={([value]) => updateCustomization('spacing', 'elementSpacing', value)}
                    min={10}
                    max={50}
                    step={2}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">
                    Current: {customizations.spacing?.elementSpacing || 20}px
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Border Radius</Label>
                  <Slider
                    value={[customizations.spacing?.borderRadius || 8]}
                    onValueChange={([value]) => updateCustomization('spacing', 'borderRadius', value)}
                    min={0}
                    max={24}
                    step={2}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">
                    Current: {customizations.spacing?.borderRadius || 8}px
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}