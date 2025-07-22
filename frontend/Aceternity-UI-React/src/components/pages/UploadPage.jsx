import React, { useState } from 'react';
import { Trash2, Upload, FileText, Plus, Check, Target, BookOpen, Loader2, AlertCircle } from 'lucide-react';

const UploadPage = () => {
  const [formData, setFormData] = useState({
    "College Name": "",
    "Branch": "",
    "Year Of Study": "",
    "Semester": "",
    "Course Name": "",
    "Course Code": "",
    "Course Teacher": ""
  });

  const [courseOutcomes, setCourseOutcomes] = useState([]);
  const [modules, setModules] = useState([]);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  // Validation function
  const validateForm = () => {
    setError('');
    
    // Check required fields
    const requiredFields = ["College Name", "Branch", "Course Name", "Course Code"];
    for (let field of requiredFields) {
      if (!formData[field].trim()) {
        setError(`${field} is required`);
        return false;
      }
    }
    
    // Validate course outcomes
    if (courseOutcomes.length === 0) {
      setError("At least one course outcome is required");
      return false;
    }
    
    // Validate course outcomes have required fields
    for (let i = 0; i < courseOutcomes.length; i++) {
      const co = courseOutcomes[i];
      if (!co.weight || parseFloat(co.weight) <= 0) {
        setError(`Course Outcome ${i + 1} must have a valid weight`);
        return false;
      }
      if (!co.blooms) {
        setError(`Course Outcome ${i + 1} must have a Bloom's level selected`);
        return false;
      }
    }
    
    // Validate weight sum
    const totalWeight = courseOutcomes.reduce((sum, co) => sum + (parseFloat(co.weight) || 0), 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      setError(`Course outcome weights should sum to 100%. Current total: ${totalWeight.toFixed(1)}%`);
      return false;
    }
    
    // Validate modules
    if (modules.length === 0) {
      setError("At least one module is required");
      return false;
    }
    
    for (let i = 0; i < modules.length; i++) {
      const module = modules[i];
      if (!module.name.trim()) {
        setError(`Module ${i + 1} name is required`);
        return false;
      }
      if (!module.hours || parseFloat(module.hours) <= 0) {
        setError(`Module ${i + 1} must have valid teaching hours`);
        return false;
      }
    }
    
    return true;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user makes changes
  };

  const handleAddCO = () => {
    setCourseOutcomes([...courseOutcomes, { weight: "", blooms: "" }]);
  };

  const handleAddModule = () => {
    setModules([...modules, { name: "", hours: "" }]);
  };

  const handleCOChange = (index, field, value) => {
    const updatedCOs = [...courseOutcomes];
    updatedCOs[index][field] = value;
    setCourseOutcomes(updatedCOs);
    setError(''); // Clear error when user makes changes
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
    setError(''); // Clear error when user makes changes
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    
    if (droppedFile && isValidFileType(droppedFile)) {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please upload a valid Excel (.xlsx, .xls) or PDF file');
    }
  };

  const isValidFileType = (file) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/pdf'
    ];
    return allowedTypes.includes(file.type);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (isValidFileType(selectedFile)) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a valid Excel (.xlsx, .xls) or PDF file');
        e.target.value = ''; // Reset file input
      }
    }
  };

 const handleSubmit = async () => {
    if (!file) {
      setError("Please upload a file (Excel or PDF)!");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);
    setError('');
    
    // Transform course outcomes and modules into backend's expected format
    const transformedSequence = [
      // Add course outcomes with backend structure
      ...courseOutcomes.map((co, index) => ({
        name: `CO${index + 1}`,
        type: "CO",
        weight: parseFloat(co.weight), // Convert to number
        blooms: [co.blooms] // Convert to array
      })),
      // Add modules with backend structure
      ...modules.map(module => ({
        name: module.name,
        type: "Module",
        hours: parseFloat(module.hours) // Convert to number
      }))
    ];
    
    // Prepare form data to send to the backend
    const formDataToSend = new FormData();
    formDataToSend.append("file", file);
    formDataToSend.append("FormData", JSON.stringify(formData)); // Capital F
    formDataToSend.append("Sequence", JSON.stringify(transformedSequence)); // Backend expects Sequence

    try {
      const token = sessionStorage.getItem('accessToken')
      
      const API_BASE_URL = 'http://localhost:80'; 
      const headers = {};
      console.log(token)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      

      const response = await fetch(`${API_BASE_URL}/upload/totext`, {
        method: 'POST',
        headers,
        body: formDataToSend
      });

      // Check if response is ok first
      if (response.ok) {
        // Try to parse as JSON, but handle cases where it might not be JSON
        let data;
        try {
          const text = await response.text();
          data = text ? JSON.parse(text) : {};
        } catch (jsonError) {
          console.warn('Response is not valid JSON, treating as success');
          data = { message: 'Upload successful' };
        }
        
        console.log('Data submitted successfully:', data);
        alert('File uploaded and processed successfully!');
        // Reset form on success
        setFile(null);
        setCourseOutcomes([]);
        setModules([]);
        setFormData({
          "College Name": "",
          "Branch": "",
          "Year Of Study": "",
          "Semester": "",
          "Course Name": "",
          "Course Code": "",
          "Course Teacher": ""
        });
      } else {
        // Handle error responses
        let errorMessage;
        try {
          const text = await response.text();
          if (text) {
            // Try to parse as JSON first
            try {
              const data = JSON.parse(text);
              errorMessage = data.message || data.error || text;
            } catch {
              // If not JSON, use the text directly
              errorMessage = text;
            }
          } else {
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
        } catch (textError) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        
        console.error('Upload failed:', errorMessage);
        
        // Provide more specific error messages
        if (response.status === 403) {
          setError('Access denied. Please check your authentication token or login again.');
        } else if (response.status === 401) {
          setError('Authentication required. Please login again.');
        } else if (response.status === 413) {
          setError('File too large. Please upload a smaller file.');
        } else {
          setError(`Upload failed: ${errorMessage}`);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else if (!navigator.onLine) {
        setError('No internet connection. Please check your connection and try again.');
      } else {
        setError(`Upload failed: ${error.message || 'Unknown error occurred'}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const deleteCO = (index) => {
    setCourseOutcomes(courseOutcomes.filter((_, i) => i !== index));
  };

  const deleteModule = (index) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const downloadSample = () => {
    const sampleData = [
      ['Question', 'CO', 'Marks', 'Difficulty', 'Module'],
      ['What is the definition of...?', 'CO1', '5', 'Easy', 'Module 1'],
      ['Explain the concept of...?', 'CO2', '10', 'Medium', 'Module 2'],
      ['Analyze the following...?', 'CO3', '15', 'Hard', 'Module 3']
    ];
    
    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_paper_format.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCurrentWeightSum = () => {
    return courseOutcomes.reduce((sum, co) => sum + (parseFloat(co.weight) || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Upload className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Upload Paper and Details
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Course Information Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <span>Course Information</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(formData).map((key) => (
                <div key={key} className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {key}
                    {["College Name", "Branch", "Course Name", "Course Code"].includes(key) && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md text-gray-900 placeholder-gray-500"
                    placeholder={`Enter ${key.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Course Outcomes Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Target className="text-white" size={16} />
                </div>
                <span>Course Outcomes</span>
              </h2>
              <div className="flex items-center space-x-4">
                {courseOutcomes.length > 0 && (
                  <div className="text-sm">
                    <span className={`font-medium ${Math.abs(getCurrentWeightSum() - 100) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                      Total Weight: {getCurrentWeightSum().toFixed(1)}%
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleAddCO}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Plus size={16} />
                  <span>Add CO</span>
                </button>
              </div>
            </div>

            {courseOutcomes.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-dashed border-purple-200">
                <Target className="text-purple-300 mx-auto mb-4" size={48} />
                <p className="text-gray-600 text-lg">No course outcomes added yet</p>
                <p className="text-gray-500 text-sm mt-2">Click "Add CO" to define your course outcomes</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courseOutcomes.map((co, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">CO{index + 1}</span>
                        </div>
                        <span className="font-semibold text-gray-900">Course Outcome {index + 1}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteCO(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                        title="Delete CO"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Weight (%) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            placeholder="0-100"
                            value={co.weight}
                            onChange={(e) => handleCOChange(index, 'weight', e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                            min="0"
                            max="100"
                            step="0.1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bloom's Level <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={co.blooms}
                            onChange={(e) => handleCOChange(index, 'blooms', e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900"
                          >
                            <option value="">Select Level</option>
                            <option value="Remember">Remember</option>
                            <option value="Understand">Understand</option>
                            <option value="Apply">Apply</option>
                            <option value="Analyze">Analyze</option>
                            <option value="Evaluate">Evaluate</option>
                            <option value="Create">Create</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modules Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-white" size={16} />
                </div>
                <span>Course Modules</span>
              </h2>
              <button
                type="button"
                onClick={handleAddModule}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Plus size={16} />
                <span>Add Module</span>
              </button>
            </div>

            {modules.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-dashed border-green-200">
                <BookOpen className="text-green-300 mx-auto mb-4" size={48} />
                <p className="text-gray-600 text-lg">No modules added yet</p>
                <p className="text-gray-500 text-sm mt-2">Click "Add Module" to structure your course content</p>
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">M{index + 1}</span>
                        </div>
                        <span className="font-semibold text-gray-900">Module {index + 1}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteModule(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                        title="Delete Module"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Module Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter module name or topic..."
                          value={module.name}
                          onChange={(e) => handleModuleChange(index, 'name', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teaching Hours <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          placeholder="Hours"
                          value={module.hours}
                          onChange={(e) => handleModuleChange(index, 'hours', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                          min="0"
                          step="0.5"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* File Upload Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Upload className="text-white" size={16} />
                </div>
                <span>Upload Paper File</span>
              </h2>
              <button
                type="button"
                onClick={downloadSample}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <FileText size={16} />
                <span>Download Sample</span>
              </button>
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                dragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : file 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="text-green-600" size={32} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{file.name}</p>
                    <p className="text-sm text-gray-600">Ready to upload ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium underline"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="text-gray-400" size={32} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">Upload Paper File</p>
                    <p className="text-sm text-gray-600">Drag and drop your file here or click to browse</p>
                    <p className="text-xs text-gray-500 mt-1">Supported formats: .xlsx, .xls, .pdf (Max 10MB)</p>
                  </div>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <FileText size={16} />
                    <span>Choose File</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!file || isUploading}
              className="inline-flex items-center space-x-3 px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-semibold rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isUploading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Check size={20} />
                  <span>Submit Paper</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;