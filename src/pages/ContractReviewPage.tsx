// ... existing imports ...
import { uploadContract, analyzeContract } from "@/services/api";

// ... inside ContractReviewPage component ...

const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setFileName(file.name);
  setIsProcessing(true);

  try {
    // Upload file to backend
    const uploadResult = await uploadContract(file);
    setFileId(uploadResult.file_id);
    
    // For demo, we'll simulate text extraction
    const fileContent = await readFileAsText(file);
    setContractText(fileContent);
    
    // Mock contract type detection (in real app, this would come from backend)
    const detectedType = CONTRACT_TYPES[Math.floor(Math.random() * CONTRACT_TYPES.length)];
    setContractType(detectedType);
    
    // Generate default contract name
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
  } catch (error) {
    console.error("Analysis failed:", error);
    showError("合同分析失败");
  } finally {
    setIsProcessing(false);
  }
};

// Helper function to read file as text
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("无法读取文件"));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

// ... rest of the component ...