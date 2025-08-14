// ... existing imports and state ...

function ContractReviewPage() {
  // ... existing state and helper functions ...

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