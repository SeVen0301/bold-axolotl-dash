import { useState } from "react";
import { FileUp, Loader2, User, Briefcase, Save, Download, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showError, showSuccess } from "@/utils/toast";
import { uploadContract, analyzeContract } from "@/services/api";

// Mock contract types for demonstration
const CONTRACT_TYPES = ["劳动合同", "租赁合同", "采购合同", "技术服务合同", "合伙协议"];
const CONTRACT_ROLES = ["甲方", "乙方", "丙方", "其他相关方"];

// Mock saved contracts
const MOCK_SAVED_CONTRACTS = [
  { id: 1, name: "劳动合同-2024-06-15", date: "2024-06-15", type: "劳动合同", role: "甲方" },
  { id: 2, name: "技术服务合同-2024-06-10", date: "2024-06-10", type: "技术服务合同", role: "乙方" },
  { id: 3, name: "采购合同-2024-06-05", date: "2024-06-05", type: "采购合同", role: "甲方" },
];

type AnalysisResult = {
  contractType: string;
  risks: string[];
  recommendations: string[];
  rolePerspective: string;
};

function ContractReviewPage() {
  // State declarations
  const [step, setStep] = useState<'upload' | 'roleSelection' | 'review' | 'history'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [contractType, setContractType] = useState<string>('');
  const [savedContracts, setSavedContracts] = useState(MOCK_SAVED_CONTRACTS);
  const [contractName, setContractName] = useState("");
  const [fileId, setFileId] = useState("");
  const [contractText, setContractText] = useState("");

  // Helper function to read file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    try {
      // Upload file to backend
      const uploadResult = await uploadContract(file);
      setFileId(uploadResult.file_id);

      // Read file content (in real app, this would come from backend)
      const fileContent = await readFileAsText(file);
      setContractText(fileContent);

      // Mock contract type detection (in real app, this would come from backend)
      const detectedType = CONTRACT_TYPES[Math.floor(Math.random() * CONTRACT_TYPES.length)];
      setContractType(detectedType);

      // Generate contract name
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
      setContractName(`${detectedType}-${formattedDate}`);

      setStep('roleSelection');
    } catch (error) {
      console.error("Upload failed:", error);
      showError("文件处理失败");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRoleSelect = async (role: string) => {
    setSelectedRole(role);
    setIsProcessing(true);

    try {
      // Call backend for analysis
      const result = await analyzeContract(fileId, role, contractText);
      
      setAnalysisResult({
        contractType: result.contract_type,
        risks: result.risks,
        recommendations: result.recommendations,
        rolePerspective: result.role_perspective
      });

      setStep('review');
      showSuccess("合同分析完成");
    } catch (error) {
      console.error("Analysis failed:", error);
      showError("合同分析失败");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveResult = () => {
    // In a real app, this would save to backend
    showSuccess("分析结果已保存");
  };

  const handleDownloadResult = () => {
    // In a real app, this would generate a downloadable report
    showSuccess("报告下载中...");
  };

  const renderUploadStep = () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>上传合同文件</CardTitle>
        <CardDescription>支持 PDF, DOC, DOCX, TXT 格式</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <label className="flex flex-col items-center cursor-pointer">
              {isProcessing ? (
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              ) : (
                <>
                  <FileUp className="w-12 h-12 text-gray-400" />
                  <p className="mt-4 font-medium">点击或拖拽文件到此处</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {fileName || "选择合同文件"}
                  </p>
                </>
              )}
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt"
                disabled={isProcessing}
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">
            我们不会存储您的合同文件，分析完成后文件将被删除
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderRoleSelectionStep = () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>选择您的角色</CardTitle>
        <CardDescription>我们将从您选择的角色角度分析合同</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {CONTRACT_ROLES.map((role) => (
            <Button
              key={role}
              variant={selectedRole === role ? "default" : "outline"}
              className="h-24 flex flex-col items-center justify-center"
              onClick={() => handleRoleSelect(role)}
              disabled={isProcessing}
            >
              {role === "甲方" ? (
                <Briefcase className="w-8 h-8 mb-2" />
              ) : (
                <User className="w-8 h-8 mb-2" />
              )}
              <span>{role}</span>
            </Button>
          ))}
        </div>
        {isProcessing && (
          <div className="mt-4 flex justify-center">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            <span className="ml-2">分析中，请稍候...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderReviewStep = () => (
    <div className="w-full max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => setStep('roleSelection')}>
          <ChevronLeft className="w-4 h-4 mr-2" /> 返回
        </Button>
        <div className="space-x-2">
          <Button variant="secondary" onClick={handleSaveResult}>
            <Save className="w-4 h-4 mr-2" /> 保存结果
          </Button>
          <Button onClick={handleDownloadResult}>
            <Download className="w-4 h-4 mr-2" /> 下载报告
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{contractName} - 分析报告</h2>
          <div className="flex space-x-4 text-gray-600">
            <span>合同类型: {analysisResult?.contractType}</span>
            <span>分析角色: {selectedRole}</span>
          </div>
        </div>

        <Tabs defaultValue="risks" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="risks">风险分析</TabsTrigger>
            <TabsTrigger value="recommendations">修改建议</TabsTrigger>
            <TabsTrigger value="perspective">角色视角</TabsTrigger>
          </TabsList>
          
          <TabsContent value="risks">
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {analysisResult?.risks.map((risk, index) => (
                    <li key={index} className="flex">
                      <span className="text-red-500 font-bold mr-2">●</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommendations">
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {analysisResult?.recommendations.map((rec, index) => (
                    <li key={index} className="flex">
                      <span className="text-green-500 font-bold mr-2">●</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="perspective">
            <Card>
              <CardContent className="p-6">
                <p className="whitespace-pre-line">{analysisResult?.rolePerspective}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  const renderHistoryStep = () => (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">历史合同分析</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedContracts.map((contract) => (
          <Card key={contract.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{contract.name}</CardTitle>
              <CardDescription>{contract.date} · {contract.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>分析角色: {contract.role}</p>
              <Button variant="outline" className="mt-4 w-full">
                查看详情
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold">合同智能分析</h1>
          <p className="text-gray-600 mt-2">
            上传您的合同文件，我们将为您分析潜在风险并提供专业建议
          </p>
        </div>

        <div className="flex justify-center">
          {step === 'upload' && renderUploadStep()}
          {step === 'roleSelection' && renderRoleSelectionStep()}
          {step === 'review' && renderReviewStep()}
          {step === 'history' && renderHistoryStep()}
        </div>

        <div className="mt-12 flex justify-center">
          <Button 
            variant={step === 'history' ? "default" : "outline"} 
            onClick={() => setStep(step === 'history' ? 'upload' : 'history')}
          >
            {step === 'history' ? "返回分析" : "查看历史记录"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ContractReviewPage;