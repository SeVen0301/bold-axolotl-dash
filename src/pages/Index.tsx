import { MadeWithDyad } from "@/components/made-with-dyad";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">欢迎使用AI合同审查工具</h1>
        <p className="text-xl text-gray-600 mb-8">
          智能分析合同条款，识别潜在风险，保障您的权益
        </p>
        
        <div className="mb-10 flex justify-center">
          <div className="bg-blue-100 p-4 rounded-full">
            <FileText className="w-16 h-16 text-blue-600" />
          </div>
        </div>
        
        <div className="mb-8">
          <Link to="/contract-review">
            <Button size="lg" className="text-lg py-6 px-8">
              开始审查合同
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">智能分析</h3>
            <p className="text-gray-600">
              自动识别合同中的关键条款和潜在风险点
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">专业建议</h3>
            <p className="text-gray-600">
              提供法律专业人士认可的修改建议
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-2">快速高效</h3>
            <p className="text-gray-600">
              几分钟内完成人工需要数小时的分析工作
            </p>
          </div>
        </div>
      </div>
      
      <MadeWithDyad />
    </div>
  );
};

export default Index;