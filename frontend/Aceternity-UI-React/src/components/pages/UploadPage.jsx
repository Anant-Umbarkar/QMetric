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
    setError('');
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
    setError('');
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
    setError('');
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
        e.target.value = '';
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
      const token = sessionStorage.getItem('accessToken');
      console.log('Token:', token);

      const API_BASE_URL = 'https://qmetric-2.onrender.com'; 
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('https://qmetric-2.onrender.com/upload/totext', {
        method: 'POST',
        headers,
        body: formDataToSend
      });

      // Check if response is ok first
      if (response.ok) {
        let responseData;
        let resultId;

        try {
          responseData = await response.json();
          console.log('Full response:', responseData);

          // Extract the ID from response - adjust based on your backend's response structure
          if (typeof responseData === 'string') {
            // If response is directly the ID as string
            resultId = responseData._id;
          } else if (responseData.id) {
            // If response has an id field
            resultId = responseData._id;
          } else if (responseData.result_id) {
            // If response has a result_id field
            resultId = responseData.result_id;
          } else if (responseData.data && responseData.data.id) {
            // If response has nested id
            resultId = responseData.data.id;
          } else {
            // If response is an object, you might need to extract differently
            console.warn('Could not extract ID from response:', responseData);
            resultId = responseData; // fallback
          }

          console.log('Extracted ID:', resultId);

          if (resultId) {
            // Success message
            alert('File uploaded and processed successfully!');

            // Redirect to result page using native browser navigation
            window.location.href = '/result';

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
            throw new Error('No result ID received from server');
          }

        } catch (jsonError) {
          console.error('Error parsing response:', jsonError);
          setError('Invalid response from server. Please try again.');
        }

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Upload className="text-white" size={16} />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Upload Paper and Details
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <h3 className="font-medium text-red-800">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Course Information Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <span className="w-6 h-6 bg-gray-900 text-white text-xs rounded flex items-center justify-center">1</span>
              <span>Course Information</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(formData).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black bg-white"
                    placeholder={`Enter ${key.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Course Outcomes Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Target className="text-gray-700" size={18} />
                <span>Course Outcomes</span>
              </h2>
              <div className="flex items-center space-x-4">
                {courseOutcomes.length > 0 && (
                  <div className="text-sm">
                    <span className={`font-medium ${Math.abs(getCurrentWeightSum() - 100) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                      Total: {getCurrentWeightSum().toFixed(1)}%
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleAddCO}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
                >
                  <Plus size={14} />
                  <span>Add CO</span>
                </button>
              </div>
            </div>

            {courseOutcomes.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Target className="text-gray-400 mx-auto mb-3" size={32} />
                <p className="text-gray-600">No course outcomes added yet</p>
                <p className="text-gray-500 text-sm mt-1">Click "Add CO" to define your course outcomes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {courseOutcomes.map((co, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 bg-gray-700 text-white text-xs rounded flex items-center justify-center">
                          CO{index + 1}
                        </span>
                        <span className="font-medium text-gray-900">Course Outcome {index + 1}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteCO(index)}
                        className="text-gray-500 hover:text-red-600 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Weight (%) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          placeholder="0-100"
                          value={co.weight}
                          onChange={(e) => handleCOChange(index, 'weight', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black bg-white"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bloom's Level <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={co.blooms}
                          onChange={(e) => handleCOChange(index, 'blooms', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black bg-white"
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
                ))}
              </div>
            )}
          </div>

          {/* Modules Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <BookOpen className="text-gray-700" size={18} />
                <span>Course Modules</span>
              </h2>
              <button
                type="button"
                onClick={handleAddModule}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
              >
                <Plus size={14} />
                <span>Add Module</span>
              </button>
            </div>

            {modules.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <BookOpen className="text-gray-400 mx-auto mb-3" size={32} />
                <p className="text-gray-600">No modules added yet</p>
                <p className="text-gray-500 text-sm mt-1">Click "Add Module" to structure your course content</p>
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 bg-gray-700 text-white text-xs rounded flex items-center justify-center">
                          M{index + 1}
                        </span>
                        <span className="font-medium text-gray-900">Module {index + 1}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteModule(index)}
                        className="text-gray-500 hover:text-red-600 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Module Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter module name or topic..."
                          value={module.name}
                          onChange={(e) => handleModuleChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teaching Hours <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          placeholder="Hours"
                          value={module.hours}
                          onChange={(e) => handleModuleChange(index, 'hours', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black bg-white"
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
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Upload className="text-gray-700" size={18} />
                <span>Upload Paper File</span>
              </h2>
              <button
                type="button"
                onClick={downloadSample}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
              >
                <FileText size={14} />
                <span>Download Sample</span>
              </button>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragOver 
                  ? 'border-gray-500 bg-gray-100' 
                  : file 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-3">
                  <FileText className="text-green-600 mx-auto" size={32} />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600">Ready to upload ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-red-600 hover:text-red-800 text-sm underline"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="text-gray-400 mx-auto" size={32} />
                  <div>
                    <p className="font-medium text-gray-900">Upload Paper File</p>
                    <p className="text-sm text-gray-600">Drag and drop your file here or click to browse</p>
                    <p className="text-xs text-gray-500 mt-1">Supported formats: .xlsx, .xls (Max 10MB)</p>
                  </div>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 cursor-pointer"
                  >
                    <FileText size={14} />
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
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
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