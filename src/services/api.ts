import { showError } from "@/utils/toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const uploadContract = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  try {
    const response = await fetch(`${API_BASE_URL}/upload-contract`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("文件上传失败");
    }
    
    return await response.json();
  } catch (error) {
    showError("上传合同文件时出错");
    console.error("Upload error:", error);
    throw error;
  }
};

export const analyzeContract = async (fileId: string, role: string, contractText: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze-contract`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role,
        contract_text: contractText,
      }),
    });
    
    if (!response.ok) {
      throw new Error("合同分析失败");
    }
    
    return await response.json();
  } catch (error) {
    showError("分析合同时出错");
    console.error("Analysis error:", error);
    throw error;
  }
};