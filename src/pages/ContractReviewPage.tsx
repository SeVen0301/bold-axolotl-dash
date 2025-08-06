import { useState } from "react";
import { FileUp, Loader2, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock contract types for demonstration
const CONTRACT_TYPES = ["劳动合同", "租赁合同", "采购合同", "技术服务合同", "合伙协议"];
const CONTRACT_ROLES = ["甲方", "乙方", "丙方", "其他相关方"];

const ContractReviewPage = () => {
  const [step, setStep] = useState<'upload' | 'roleSelection' | 'review'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    contractType: string;
    risks: string[];
    recommendations: string[];
    rolePerspective: string;
  } | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [contractType, setContractType] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Mock contract type detection (random selection)
      const detectedType = CONTRACT_TYPES[Math.floor(Math.random() * CONTRACT_TYPES.length)];
      setContractType(detectedType);
      
      setStep('roleSelection');
    }, 2000);
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setIsProcessing(true);
    
    // Simulate AI analysis from selected perspective
    setTimeout(() => {
      setIsProcessing(false);
      
      // Mock analysis results based on role
      const rolePerspective = `作为${role}，您需要关注以下条款：`;
      
      const risks = [
        `付款条款：作为${role}，付款期限对您${role === '甲方' ? '有利' : '不利'}`,
        `违约责任：赔偿上限设置${role === '乙方' ? '过高' : '合理'}`,
        `知识产权：${role === '丙方' ? '未明确归属' : '归属清晰'}`,
        `争议解决：${role === '甲方' ? '法院管辖对您有利' : '建议改为仲裁'}`
      ];
      
      const recommendations = [
        `${role === '乙方' ? '要求' : '接受'}付款期限${role === '乙方' ? '缩短' : '延长'}至30天`,
        `${role === '甲方' ? '维持' : '降低'}违约责任上限金额`,
        `${role === '丙方' ? '增加' : '明确'}知识产权归属条款`,
        `${role === '乙方' ? '建议' : '接受'}将争议解决方式改为仲裁`
      ];
      
      setAnalysisResult({
        contractType,
        risks,
        recommendations,
        rolePerspective
      });
      setStep('review');
    }, 2500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">AI合同审查工具</h1>
      
      {/* Step indicators */}
      <div className="flex justify-between mb-8 relative">
        <div className="flex-1 flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
            ${step !== 'upload' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <span className="text-sm font-medium">上传合同</span>
        </div>
        
        <div className="absolute top-5 left-1/4 w-1/2 h-1 bg-gray-200 z-0">
          <div className={`h-full transition-all duration-500 ease-in-out 
            ${step === 'roleSelection' || step === 'review' ? 'w-full bg-blue-500' : 'w-0'}`}></div>
        </div>
        
        <div className="flex-1 flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
            ${step === 'roleSelection' || step === 'review' ? 
              (step === 'review' ? 'bg-blue-500 text-white' : 'bg-blue-200') : 'bg-gray-200'}`}>
            2
          </div>
          <span className="text-sm font-medium">选择身份</span>
        </div>
        
        <div className="absolute top-5 right-1/4 w-1/2 h-1 bg-gray-200 z-0">
          <div className={`h-full transition-all duration-500 ease-in-out 
            ${step === 'review' ? 'w-full bg-blue-500' : 'w-0'}`}></div>
        </div>
        
        <div className="flex-1 flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
            ${step === 'review' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
            3
          </div>
          <span className="text-sm font-medium">审查结果</span>
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>上传合同文件</CardTitle>
            <CardDescription>支持PDF, DOCX, DOC格式</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center w-full">
              <label 
                htmlFor="contract-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileUp className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">点击上传</span> 或拖放文件
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOCX, DOC (最大 10MB)
                  </p>
                </div>
                <input 
                  id="contract-upload" 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing state */}
      {isProcessing && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold">
            {step === 'upload' ? '正在分析合同类型...' : '正在生成审查报告...'}
          </h2>
          <p className="text-gray-600 mt-2">这可能需要几秒钟时间</p>
        </div>
      )}

      {/* Step 2: Role Selection */}
      {step === 'roleSelection' && !isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle>选择您的合同身份</CardTitle>
            <CardDescription>
              检测到合同类型: <span className="font-semibold">{contractType}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CONTRACT_ROLES.map((role) => (
                <Button
                  key={role}
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center"
                  onClick={() => handleRoleSelect(role)}
                >
                  <div className="mb-3 p-3 bg-blue-100 rounded-full">
                    {role === '甲方' ? <Briefcase className="w-8 h-8 text-blue-600" /> : <User className="w-8 h-8 text-blue-600" />}
                  </div>
                  <span className="text-lg font-medium">{role}</span>
                </Button>
              ))}
            </div>
            <div className="mt-6 text-sm text-gray-500">
              <p>请选择您在合同中的身份，AI将从该角度分析合同条款</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review Results */}
      {step === 'review' && analysisResult && !isProcessing && (
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>合同审查报告</CardTitle>
              <CardDescription>
                合同类型: {contractType} | 审查角度: {selectedRole}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="font-medium">{analysisResult.rolePerspective}</p>
              </div>
              
              <Tabs defaultValue="risks" className="w-full">
                <TabsList className="grid grid-cols-2 w-full max-w-xs">
                  <TabsTrigger value="risks">风险分析</TabsTrigger>
                  <TabsTrigger value="recommendations">修改建议</TabsTrigger>
                </TabsList>
                
                <TabsContent value="risks">
                  <div className="mt-4 space-y-3">
                    {analysisResult.risks.map((risk, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <span className="w-5 h-5 rounded-full bg-red-100 text-red-800 flex items-center justify-center text-xs">
                            !
                          </span>
                        </div>
                        <p className="ml-3 text-gray-800">{risk}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="recommendations">
                  <div className="mt-4 space-y-3">
                    {analysisResult.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <span className="w-5 h-5 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs">
                            ✓
                          </span>
                        </div>
                        <p className="ml-3 text-gray-800">{rec}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setStep('roleSelection')}
            >
              重新选择身份
            </Button>
            <div>
              <Button variant="outline" className="mr-2">
                导出报告
              </Button>
              <Button>保存结果</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractReviewPage;