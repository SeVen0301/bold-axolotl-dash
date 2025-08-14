import { useState, useRef } from "react";
import { 
  FileUp, Loader2, ChevronLeft 
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
      alert(`文件上传成功: ${files[0].name}`); // Add success notification
    }, 1500);
  };
  
  return (
    <div className="container mx-auto py-8 px-4"> {/* Increased padding */}
      <div className="mb-6"> {/* Increased margin */}
        <Button variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" />
          返回首页
        </Button>
      </div>
      
      <Card className="shadow-lg"> {/* Added shadow for better visibility */}
        <CardHeader>
          <CardTitle className="text-2xl">合同审查</CardTitle> {/* Larger title */}
          <CardDescription>上传合同文件进行智能分析</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload">
            <TabsList>
              <TabsTrigger value="upload" className="px-4 py-2">上传合同</TabsTrigger> {/* Larger tabs */}
              <TabsTrigger value="results" className="px-4 py-2">分析结果</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="pt-6"> {/* Added top padding */}
              <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50"> {/* Larger area, better styling */}
                <Button 
                  onClick={handleFileUpload}
                  disabled={isLoading}
                  className="px-6 py-3 text-base" // Larger button
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> // Larger icon
                  ) : (
                    <FileUp className="mr-2 h-5 w-5" />
                  )}
                  选择合同文件
                </Button>
                <p className="mt-4 text-sm text-gray-500"> {/* Increased margin */}
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
            <TabsContent value="results" className="pt-6 min-h-[320px]"> {/* Minimum height */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">分析结果将在这里显示</h3>
                <p className="text-gray-500">上传合同文件后，系统将自动进行分析并显示结果</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}