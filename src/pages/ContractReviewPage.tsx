import { useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContractReviewPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      // Mock analysis results
      setAnalysisResult(`合同审查结果：
      
1. 争议解决条款：建议明确指定仲裁机构
2. 付款条款：付款期限未明确，建议补充具体天数
3. 保密条款：涵盖范围充分
4. 违约责任：赔偿上限设置合理

风险提示：
- 第8条中的终止条件可能对贵方不利
- 附件A中的知识产权归属表述模糊`);
    }, 2500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">AI合同审查工具</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>上传合同文件</CardTitle>
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
          
          {fileName && (
            <div className="mt-4 text-center">
              <p className="text-gray-700">
                <span className="font-medium">已选文件:</span> {fileName}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {isProcessing && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold">AI正在分析合同...</h2>
          <p className="text-gray-600 mt-2">这可能需要几秒钟时间</p>
        </div>
      )}

      {analysisResult && !isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle>审查结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-6 rounded-lg">
              <pre className="whitespace-pre-wrap font-sans text-gray-800">
                {analysisResult}
              </pre>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" className="mr-2">
                导出报告
              </Button>
              <Button>保存结果</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContractReviewPage;