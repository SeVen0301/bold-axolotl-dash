import { useState, useRef } from "react";
import { 
  FileUp, Loader2, User, Briefcase, ChevronLeft 
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast";

export function ContractReviewPage(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsLoading(true);
    const file = files[0];
    setUploadedFile(file);
    
    // Simulate processing time
    setTimeout(() => {
      setIsLoading(false);
      showSuccess(`文件上传成功: ${file.name}`);
    }, 1000);
  };
  
  const handleAnalyze = () => {
    if (!uploadedFile) {
      showError("请先上传合同文件");
      return;
    }
    
    if (!selectedRole) {
      showError("请选择您的合同角色");
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        contractType: "劳动合同",
        risks: [
          "试用期条款不明确",
          "竞业禁止条款过于宽泛",
          "未明确约定薪资调整机制"
        ],
        recommendations: [
          "明确试用期期限及转正条件",
          "限定竞业禁止的范围和期限",
          "添加薪资年度调整机制条款"
        ],
        rolePerspective: selectedRole === "甲方" 
          ? "作为甲方，需关注员工离职后的商业秘密保护" 
          : "作为乙方，需关注工作时间和休假制度的合理性"
      });
      
      // Switch to results tab
      document.querySelector('[data-state="active"]')?.closest('.tabs')?.querySelector('[value="results"]')?.click();
    }, 2000);
  };
  
  const renderAnalysisResults = () => {
    if (!analysisResult) {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">分析结果将在这里显示</h3>
          <p className="text-gray-500">上传合同文件并分析后，系统将显示审查结果</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">合同类型</h3>
          <p className="text-lg">{analysisResult.contractType}</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-red-700">潜在风险</h3>
          <ul className="list-disc pl-6 space-y-2">
            {analysisResult.risks.map((risk: string, index: number) => (
              <li key={index} className="text-red-600">{risk}</li>
            ))}
          </ul>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-green-700">修改建议</h3>
          <ul className="list-disc pl-6 space-y-2">
            {analysisResult.recommendations.map((rec: string, index: number) => (
              <li key={index} className="text-green-600">{rec}</li>
            ))}
          </ul>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-blue-700">角色视角</h3>
          <p>{analysisResult.rolePerspective}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <a href="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            返回首页
          </a>
        </Button>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">合同审查</CardTitle>
          <CardDescription>上传合同文件进行智能分析</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload">
            <TabsList>
              <TabsTrigger value="upload" className="px-4 py-2">上传合同</TabsTrigger>
              <TabsTrigger value="results" className="px-4 py-2">分析结果</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="pt-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
                {!uploadedFile ? (
                  <>
                    <Button 
                      onClick={handleFileUpload}
                      disabled={isLoading}
                      className="px-6 py-3 text-base"
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <FileUp className="mr-2 h-5 w-5" />
                      )}
                      选择合同文件
                    </Button>
                    <p className="mt-4 text-sm text-gray-500">
                      支持 PDF, DOC, DOCX 格式
                    </p>
                  </>
                ) : (
                  <div className="text-center w-full">
                    <div className="bg-green-100 text-green-800 rounded-full py-2 px-4 inline-flex items-center mb-4">
                      <FileUp className="mr-2 h-5 w-5" />
                      <span className="font-medium">{uploadedFile.name}</span>
                    </div>
                    
                    <div className="mt-6 w-full max-w-md mx-auto">
                      <h3 className="font-medium text-lg mb-3">请选择您在合同中的角色</h3>
                      <div className="flex justify-center gap-4 mb-6">
                        <Button 
                          variant={selectedRole === "甲方" ? "default" : "outline"}
                          onClick={() => setSelectedRole("甲方")}
                          className="flex items-center"
                        >
                          <User className="mr-2 h-4 w-4" /> 甲方
                        </Button>
                        <Button 
                          variant={selectedRole === "乙方" ? "default" : "outline"}
                          onClick={() => setSelectedRole("乙方")}
                          className="flex items-center"
                        >
                          <Briefcase className="mr-2 h-4 w-4" /> 乙方
                        </Button>
                      </div>
                      
                      <Button 
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !selectedRole}
                        className="w-full py-6 text-lg"
                      >
                        {isAnalyzing ? (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : "开始分析合同"}
                      </Button>
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="results" className="pt-6 min-h-[500px]">
              {renderAnalysisResults()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}