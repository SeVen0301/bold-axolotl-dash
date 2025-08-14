// ... existing code ...

const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setFileName(file.name);
  setIsProcessing(true);

  try {
    // ... file processing code ...

    // Instead of going directly to roleSelection, go to confirmation
    setStep('confirmation');
  } catch (error) {
    // ... error handling ...
  } finally {
    setIsProcessing(false);
  }
};

// ... rest of the component ...