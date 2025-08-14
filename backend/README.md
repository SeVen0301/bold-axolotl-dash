# Contract Analysis Backend

This backend integrates with DeepSeek's API to analyze contracts.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/MacOS
venv\Scripts\activate    # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file with your DeepSeek API key:
```env
DEEPSEEK_API_KEY=your_api_key_here
```

4. Run the server:
```bash
uvicorn main:app --reload
```

## API Endpoints

- POST `/upload-contract`: Upload a contract file
  - Returns: `{"file_id": "uuid", "filename": "original_name.txt"}`
  
- POST `/analyze-contract`: Analyze contract text
  - Request body:
    ```json
    {
      "role": "甲方",
      "contract_text": "合同内容..."
    }
    ```
  - Returns:
    ```json
    {
      "contract_type": "劳动合同",
      "risks": ["风险点1", "风险点2"],
      "recommendations": ["建议1", "建议2"],
      "role_perspective": "作为甲方需要关注..."
    }
    ```

## Notes

- In production, implement proper text extraction for PDF/DOCX files
- Add error handling and rate limiting
- Use a database for file storage instead of local filesystem