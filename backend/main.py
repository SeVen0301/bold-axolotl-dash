from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
import uuid
import json
from typing import Dict, List
from pydantic import BaseModel

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DeepSeek API configuration
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")  # Set your API key in environment variables

class AnalysisRequest(BaseModel):
    role: str
    contract_text: str

class AnalysisResult(BaseModel):
    contract_type: str
    risks: List[str]
    recommendations: List[str]
    role_perspective: str

def analyze_contract_with_deepseek(contract_text: str, role: str) -> Dict:
    """
    Send contract text to DeepSeek API for analysis from a specific role perspective
    """
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    prompt = f"""
    你是一名专业的合同审查律师。请从{role}的角度审查以下合同，指出潜在风险并提供修改建议。
    合同内容如下：
    {contract_text}
    
    请按照以下JSON格式返回分析结果：
    {{
        "contract_type": "合同类型",
        "risks": ["风险点1", "风险点2", ...],
        "recommendations": ["建议1", "建议2", ...],
        "role_perspective": "作为{role}需要特别关注的条款说明"
    }}
    """
    
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": "你是一名专业的合同审查律师，请从用户指定的角度对合同进行审查，指出潜在风险并提供修改建议。返回结果必须是有效的JSON格式。"},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 2000
    }
    
    response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()

def extract_text_from_file(file_path: str) -> str:
    """
    Extract text from contract file (simplified version)
    In production, use libraries like PyPDF2, python-docx, etc.
    """
    # This is a placeholder - in a real implementation, you'd use:
    # For PDF: PyPDF2 or pdfplumber
    # For DOCX: python-docx
    # For DOC: antiword or convert to docx first
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

@app.post("/upload-contract")
async def upload_contract(file: UploadFile = File(...)):
    """
    Upload contract file and return a file ID for processing
    """
    # Save file temporarily
    file_id = str(uuid.uuid4())
    file_path = f"uploads/{file_id}.txt"
    
    # In production, save with original extension and handle different file types
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    
    return {"file_id": file_id, "filename": file.filename}

@app.post("/analyze-contract")
async def analyze_contract(request: AnalysisRequest):
    """
    Analyze contract text from a specific role perspective using DeepSeek API
    """
    try:
        response = analyze_contract_with_deepseek(request.contract_text, request.role)
        ai_response = response["choices"][0]["message"]["content"]
        
        # Extract JSON from AI response
        json_start = ai_response.find('{')
        json_end = ai_response.rfind('}') + 1
        json_str = ai_response[json_start:json_end]
        
        # Parse JSON
        analysis_result = json.loads(json_str)
        
        # Convert to Pydantic model for validation
        return AnalysisResult(**analysis_result)
        
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)