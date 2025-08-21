import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, AlertCircle, CheckCircle, FileText, X } from "lucide-react";
import { toast } from "sonner";

interface CSVImportProps {
  onImport: (products: any[]) => void;
  onClose: () => void;
}

interface ImportedProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: "valid" | "error" | "warning";
  errors: string[];
  warnings: string[];
}

const CSVImport = ({ onImport, onClose }: CSVImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importedData, setImportedData] = useState<ImportedProduct[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [step, setStep] = useState<"upload" | "preview" | "complete">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requiredColumns = ["name", "sku", "category", "price", "stock"];
  const optionalColumns = ["description", "weight", "lowStockThreshold", "tags"];

  const sampleData = [
    {
      name: "Wireless Mouse",
      sku: "WM-001",
      category: "Electronics",
      price: "999",
      stock: "50",
      description: "Ergonomic wireless mouse",
      weight: "0.15",
      lowStockThreshold: "10",
      tags: "electronics,computer,wireless"
    },
    {
      name: "Bluetooth Headphones",
      sku: "BH-002", 
      category: "Electronics",
      price: "2499",
      stock: "25",
      description: "Noise-cancelling headphones",
      weight: "0.3",
      lowStockThreshold: "5",
      tags: "electronics,audio,bluetooth"
    }
  ];

  const downloadSampleCSV = () => {
    const csvContent = [
      [...requiredColumns, ...optionalColumns].join(","),
      ...sampleData.map(row => 
        [...requiredColumns, ...optionalColumns].map(col => 
          row[col as keyof typeof row] || ""
        ).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product_import_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split("\n").filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const rows = lines.slice(1);

    return rows.map((row, index) => {
      const values = row.split(",").map(v => v.trim());
      const product: any = { id: `imported-${index}` };

      headers.forEach((header, i) => {
        product[header] = values[i] || "";
      });

      return product;
    });
  };

  const validateProduct = (product: any): ImportedProduct => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field validation
    requiredColumns.forEach(col => {
      if (!product[col] || product[col].toString().trim() === "") {
        errors.push(`${col} is required`);
      }
    });

    // Data type validation
    if (product.price && isNaN(parseFloat(product.price))) {
      errors.push("Price must be a valid number");
    }
    
    if (product.stock && isNaN(parseInt(product.stock))) {
      errors.push("Stock must be a valid number");
    }

    // Business rule validation
    if (product.price && parseFloat(product.price) < 0) {
      errors.push("Price cannot be negative");
    }

    if (product.stock && parseInt(product.stock) < 0) {
      errors.push("Stock cannot be negative");
    }

    // Warnings
    if (product.lowStockThreshold && parseInt(product.stock) <= parseInt(product.lowStockThreshold)) {
      warnings.push("Current stock is below low stock threshold");
    }

    if (!product.description || product.description.trim() === "") {
      warnings.push("Description is missing");
    }

    const status = errors.length > 0 ? "error" : warnings.length > 0 ? "warning" : "valid";

    return {
      id: product.id,
      name: product.name || "",
      sku: product.sku || "",
      category: product.category || "",
      price: parseFloat(product.price) || 0,
      stock: parseInt(product.stock) || 0,
      status,
      errors,
      warnings
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }

    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const parsedData = parseCSV(csvText);
      const validatedData = parsedData.map(validateProduct);
      
      setImportedData(validatedData);
      setStep("preview");
    };
    
    reader.readAsText(selectedFile);
  };

  const processImport = async () => {
    setImporting(true);
    setImportProgress(0);

    const validProducts = importedData.filter(p => p.status !== "error");
    
    for (let i = 0; i < validProducts.length; i++) {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 100));
      setImportProgress(((i + 1) / validProducts.length) * 100);
    }

    // Convert to proper format for the main system
    const formattedProducts = validProducts.map((product, index) => ({
      id: `PROD-${Date.now()}-${index}`,
      name: product.name,
      sku: product.sku,
      category: product.category,
      stock: product.stock,
      reserved: 0,
      available: product.stock,
      lowStockThreshold: 10,
      price: `₹${product.price.toLocaleString()}`,
      status: product.stock > 10 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock"
    }));

    onImport(formattedProducts);
    setStep("complete");
    setImporting(false);

    toast.success(`Successfully imported ${validProducts.length} products`);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      valid: { variant: "default" as const, icon: CheckCircle, text: "Valid" },
      warning: { variant: "secondary" as const, icon: AlertCircle, text: "Warning" },
      error: { variant: "destructive" as const, icon: AlertCircle, text: "Error" }
    };

    const config = variants[status as keyof typeof variants];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const validCount = importedData.filter(p => p.status === "valid").length;
  const warningCount = importedData.filter(p => p.status === "warning").length;
  const errorCount = importedData.filter(p => p.status === "error").length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Products from CSV
            </CardTitle>
            <CardDescription>
              Upload a CSV file to bulk import products into your inventory
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === "upload" && (
            <div className="space-y-6">
              {/* Upload Area */}
              <div 
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload CSV File</h3>
                <p className="text-muted-foreground mb-4">
                  Click to browse or drag and drop your CSV file here
                </p>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Sample Template */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">CSV Template</CardTitle>
                  <CardDescription>
                    Download our template to ensure your CSV file has the correct format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Required Columns:</h4>
                      <div className="flex flex-wrap gap-2">
                        {requiredColumns.map(col => (
                          <Badge key={col} variant="default">{col}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Optional Columns:</h4>
                      <div className="flex flex-wrap gap-2">
                        {optionalColumns.map(col => (
                          <Badge key={col} variant="secondary">{col}</Badge>
                        ))}
                      </div>
                    </div>

                    <Button onClick={downloadSampleCSV} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === "preview" && (
            <div className="space-y-6">
              {/* Import Summary */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-green-600">{validCount}</div>
                    <p className="text-sm text-muted-foreground">Valid Products</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
                    <p className="text-sm text-muted-foreground">With Warnings</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                    <p className="text-sm text-muted-foreground">With Errors</p>
                  </CardContent>
                </Card>
              </div>

              {/* Preview Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview Import Data</CardTitle>
                  <CardDescription>
                    Review your products before importing. Products with errors will be skipped.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Issues</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importedData.slice(0, 10).map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{getStatusBadge(product.status)}</TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>₹{product.price.toLocaleString()}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {product.errors.map((error, i) => (
                                <div key={i} className="text-xs text-red-600">{error}</div>
                              ))}
                              {product.warnings.map((warning, i) => (
                                <div key={i} className="text-xs text-yellow-600">{warning}</div>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {importedData.length > 10 && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Showing first 10 products. {importedData.length - 10} more products will be processed.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setStep("upload")}>
                  Back
                </Button>
                <Button 
                  onClick={processImport} 
                  disabled={validCount === 0 || importing}
                >
                  {importing ? "Importing..." : `Import ${validCount} Products`}
                </Button>
              </div>
            </div>
          )}

          {step === "complete" && (
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <Progress value={importProgress} className="w-full" />
                <div className="space-y-2">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <h3 className="text-2xl font-bold">Import Complete!</h3>
                  <p className="text-muted-foreground">
                    Successfully imported {validCount} products into your inventory.
                  </p>
                </div>
              </div>
              
              <Button onClick={onClose}>
                Done
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CSVImport;