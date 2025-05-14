import { useState } from 'react';
import { Upload, MessageSquare, Database, Send, X } from 'lucide-react';

export default function SQLDataAnalysisAI() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setIsUploading(true);
      
      // Simulate file processing
      setTimeout(() => {
        setFile(uploadedFile);
        setIsUploading(false);
        
        // Add system message about successful upload
        setMessages(prev => [
          ...prev, 
          { 
            type: 'system', 
            content: `Successfully uploaded "${uploadedFile.name}". You can now ask questions about this dataset.` 
          }
        ]);
      }, 1500);
    }
  };

  const handleSendPrompt = () => {
    if (!prompt.trim() || !file) return;
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: prompt }]);
    
    // Simulate AI processing
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      
      // Add AI response
      setMessages(prev => [
        ...prev, 
        { 
          type: 'ai', 
          content: `Analysis complete. This is a simulated response to your query: "${prompt}" regarding the ${file.name} dataset.`
        }
      ]);
      
      setPrompt('');
    }, 2000);
  };

  const removeFile = () => {
    setFile(null);
    setMessages([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto p-4 flex items-center">
          <Database className="text-blue-600 mr-2" />
          <h1 className="text-xl font-semibold text-gray-800">SQL Data Analysis AI</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
        {/* Welcome Section */}
        {!file && messages.length === 0 && (
          <div className="text-center my-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Analyze your SQL datasets with AI</h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Upload your SQL file and ask questions in natural language to get instant insights about your data.
            </p>
          </div>
        )}

        {/* File Upload Section */}
        {!file ? (
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 mb-6 text-center">
            <input
              id="file-upload"
              type="file"
              accept=".sql,.db,.sqlite"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label 
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <Upload className="h-12 w-12 text-blue-500 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-1">Upload SQL dataset</p>
              <p className="text-sm text-gray-500">Drag and drop or click to browse</p>
              <p className="text-xs text-gray-400 mt-2">Supports .sql, .db, and .sqlite files</p>
              <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full text-sm font-medium transition">
                Select File
              </button>
            </label>
            {isUploading && (
              <div className="mt-4">
                <p className="text-blue-600">Processing your file...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <Database className="text-blue-500 mr-2" />
              <span className="font-medium text-gray-700">{file.name}</span>
            </div>
            <button 
              onClick={removeFile} 
              className="text-gray-500 hover:text-red-500 transition"
              title="Remove file"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Messages Section */}
        {messages.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex-1 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg max-w-full ${
                    message.type === 'user' 
                      ? 'bg-blue-100 text-blue-800 ml-auto' 
                      : message.type === 'system'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prompt Input */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex items-end p-3">
            <div className="flex-1">
              <textarea 
                placeholder={file ? "Ask a question about your data..." : "Upload a SQL file to get started"}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={!file || isSending}
                className="w-full resize-none border-none focus:ring-0 p-0 text-gray-800 bg-transparent placeholder-gray-400 outline-none"
                rows={3}
              />
            </div>
            <button
              onClick={handleSendPrompt}
              disabled={!file || !prompt.trim() || isSending}
              className={`ml-3 p-2 rounded-full ${
                !file || !prompt.trim() || isSending
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 transition'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">SQL Data Analysis AI</p>
          <p className="text-sm text-gray-500">© 2025</p>
        </div>
      </footer>
    </div>
  );
}