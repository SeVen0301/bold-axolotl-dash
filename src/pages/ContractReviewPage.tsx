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
  const [step, setStep] = useState<'upload' | 'confirmation' | 'roleSelection' | 'review' | 'history'>('upload');
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

      setStep('confirmation');
    } catch (error) {
      console.error("Upload failed:", error);
      showError("文件处理失败");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderConfirmationStep = () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>文件已上传</CardTitle>
        <CardDescription>请确认您的合同文件</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-gray-100 rounded-lg p-4 w-full">
            <div className="flex items-center">
              <FileUp className="w-6 h-6 text-gray-500 mr-3" />
              <span className="font-medium truncate">{fileName}</span>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 w-full">
            <Button 
              variant="outline" 
              onClick={() => {
                setFileName(null);
                setStep('upload');
              }}
            >
              重新选择
            </Button>
            <Button onClick={() => setStep('roleSelection')}>
              确认上传
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // ... rest of the component (same as before) ...

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
          {step === 'confirmation' && renderConfirmationStep()}
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