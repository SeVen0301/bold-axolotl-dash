import { useState, useRef } from "react";
import { 
  FileUp, Loader2, User, Briefcase, Save, Download, ChevronLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

export function ContractReviewPage(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = () => {
    // Trigger the hidden file input
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsLoading(true);
    console.log("Selected file:", files[0]);
    
    // Simulate processing time
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, you would process the file here
    }, 1500);
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Button variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" />
          返回首页
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>合同审查</CardTitle>
          <CardDescription>上传合同文件进行智能分析</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload">
            <TabsList>
              <TabsTrigger value="upload">上传合同</TabsTrigger>
              <TabsTrigger value="results">分析结果</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg p-4">
                <Button 
                  onClick={handleFileUpload}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileUp className="mr-2 h-4 w-4" />
                  )}
                  选择合同文件
                </Button>
                <p className="mt-2 text-sm text-gray-500">
                  支持 PDF, DOC, DOCX 格式
                </p>
                
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
              </div>
            </TabsContent>
            <TabsContent value="results">
              分析结果将在这里显示
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}