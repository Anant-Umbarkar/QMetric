import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  TrendingUp, 
  Target, 
  BookOpen, 
  Brain, 
  AlertCircle, 
  CheckCircle, 
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Award,
  Building
} from 'lucide-react';

const ResultPage = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for demonstration - replace with actual API call
  const mockResults = {
    FinalScore: 75.5,
    courseInfo: {
      collegeName: "ABC Engineering College",
      department: "Computer Science & Engineering",
      course: "Data Structures and Algorithms",
      courseCode: "CS301",
      semester: "III",
      academicYear: "2024-25",
      instructor: "Dr. John Smith",
      evaluationDate: "2024-07-07"
    },
    QuestionData: [
      {
        "Question": "Define data structure and explain its importance in computer science.",
        "CO": "CO1",
        "Marks": 5,
        "Bloom's Taxonomy Level": 1,
        "Module": "Module 1",
        "Question Type": "Short Answer",
        "Remark": "Matches Expected Blooms Level"
      },
      {
        "Question": "Explain the working principle of binary search algorithm with suitable example.",
        "CO": "CO2", 
        "Marks": 10,
        "Bloom's Taxonomy Level": 2,
        "Module": "Module 2",
        "Question Type": "Long Answer",
        "Remark": "Higher than Expected Blooms Level"
      },
      {
        "Question": "Implement a stack data structure using arrays and demonstrate push and pop operations.",
        "CO": "CO3",
        "Marks": 15,
        "Bloom's Taxonomy Level": 3,
        "Module": "Module 3", 
        "Question Type": "Programming",
        "Remark": "Lower than Expected Blooms Level"
      },
      {
        "Question": "Analyze the time complexity of merge sort algorithm and compare it with quick sort.",
        "CO": "CO4",
        "Marks": 20,
        "Bloom's Taxonomy Level": 4,
        "Module": "Module 4",
        "Question Type": "Analytical",
        "Remark": "Matches Expected Blooms Level"
      }
    ],
    BloomsData: {
      1: { level: 1, weights: 25, marks: 15, BT_penalty: 0, No_Of_Questions: 3 },
      2: { level: 2, weights: 30, marks: 25, BT_penalty: 0, No_Of_Questions: 4 },
      3: { level: 3, weights: 25, marks: 20, BT_penalty: 0, No_Of_Questions: 2 },
      4: { level: 4, weights: 20, marks: 15, BT_penalty: 0, No_Of_Questions: 1 }
    },
    COData: {
      1: 20,
      2: 25,
      3: 30,
      4: 25
    },
    ModuleData: [
      { expected: 25, actual: 20, name: "Introduction to Data Structures" },
      { expected: 30, actual: 35, name: "Linear Data Structures" },
      { expected: 25, actual: 25, name: "Non-linear Data Structures" },
      { expected: 20, actual: 20, name: "Algorithms and Complexity" }
    ],
    summary: {
      totalQuestions: 4,
      totalMarks: 50,
      averageMarksPerQuestion: 12.5,
      bloomsCompliance: 85,
      moduleCompliance: 92,
      coCompliance: 88
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
    //   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:80';
    //   const response = await fetch(`${API_BASE_URL}/upload/totext`);
    //   const data = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResults(mockResults);
    } catch (err) {
      setError('Failed to fetch evaluation results');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-700';
    if (score >= 70) return 'text-blue-700';
    if (score >= 55) return 'text-yellow-700';
    return 'text-red-700';
  };

  const getScoreBackground = (score) => {
    if (score >= 85) return 'from-green-600 to-green-700';
    if (score >= 70) return 'from-blue-600 to-blue-700';
    if (score >= 55) return 'from-yellow-600 to-yellow-700';
    return 'from-red-600 to-red-700';
  };

  const getGrade = (score) => {
    if (score >= 85) return 'A+';
    if (score >= 75) return 'A';
    if (score >= 65) return 'B+';
    if (score >= 55) return 'B';
    return 'C';
  };

  const getRemarkIcon = (remark) => {
    if (remark === "Matches Expected Blooms Level") return <CheckCircle className="text-green-600" size={16} />;
    if (remark === "Higher than Expected Blooms Level") return <ArrowUp className="text-blue-600" size={16} />;
    if (remark === "Lower than Expected Blooms Level") return <ArrowDown className="text-red-600" size={16} />;
    return <Minus className="text-gray-600" size={16} />;
  };

  const bloomsLevels = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];

  const generateReport = () => {
    const reportData = {
      ...results,
      generatedAt: new Date().toISOString(),
      reportType: 'Question Paper Quality Assessment Report'
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QP_Assessment_Report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <RefreshCw className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-xl font-semibold text-gray-700">Processing Assessment Results...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we analyze the question paper</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <p className="text-xl font-semibold text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchResults}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Retry Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Award className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Question Paper Quality Assessment Report</h1>
                  <p className="text-sm text-gray-600">Academic Quality Assurance - Course Evaluation</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchResults}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <RefreshCw size={16} />
                <span>Refresh</span>
              </button>
              <button
                onClick={generateReport}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Download size={16} />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Course Information Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="text-blue-600 mr-2" size={20} />
              Course Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600 font-medium">Institution</p>
                <p className="text-gray-900">{results.courseInfo.collegeName}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Department</p>
                <p className="text-gray-900">{results.courseInfo.department}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Course</p>
                <p className="text-gray-900">{results.courseInfo.course}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Course Code</p>
                <p className="text-gray-900">{results.courseInfo.courseCode}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Semester</p>
                <p className="text-gray-900">{results.courseInfo.semester}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Academic Year</p>
                <p className="text-gray-900">{results.courseInfo.academicYear}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Course Instructor</p>
                <p className="text-gray-900">{results.courseInfo.instructor}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Evaluation Date</p>
                <p className="text-gray-900">{results.courseInfo.evaluationDate}</p>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Executive Summary</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r ${getScoreBackground(results.FinalScore)} mb-4`}>
                    <span className="text-2xl font-bold text-white">{results.FinalScore.toFixed(1)}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Overall Quality Score</h3>
                  <p className="text-lg font-medium text-gray-600">Grade: {getGrade(results.FinalScore)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{results.summary.totalQuestions}</p>
                  <p className="text-sm text-gray-600">Total Questions</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{results.summary.totalMarks}</p>
                  <p className="text-sm text-gray-600">Total Marks</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{results.summary.bloomsCompliance}%</p>
                  <p className="text-sm text-gray-600">Bloom's Compliance</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{results.summary.coCompliance}%</p>
                  <p className="text-sm text-gray-600">CO Compliance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Question Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="text-blue-600 mr-2" size={20} />
              Detailed Question Analysis
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 border-b">S.No.</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 border-b">Question</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 border-b">CO</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 border-b">Marks</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 border-b">Bloom's Level</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 border-b">Module</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 border-b">Assessment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.QuestionData.map((question, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">{index + 1}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 max-w-md">{question.Question}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {question.CO}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{question.Marks}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          L{question["Bloom's Taxonomy Level"]} - {bloomsLevels[question["Bloom's Taxonomy Level"] - 1]}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{question.Module}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getRemarkIcon(question.Remark)}
                          <span className="text-xs text-gray-600">{question.Remark}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bloom's Taxonomy Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="text-purple-600 mr-2" size={20} />
              Bloom's Taxonomy Distribution Analysis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(results.BloomsData).map(([level, data]) => (
                <div key={level} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">L{level}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{bloomsLevels[level - 1]}</h4>
                        <p className="text-xs text-gray-600">Cognitive Level {level}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Questions:</span>
                      <span className="font-medium text-gray-900">{data.No_Of_Questions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Marks:</span>
                      <span className="font-medium text-gray-900">{data.marks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weightage:</span>
                      <span className="font-medium text-gray-900">{data.weights.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Outcomes Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="text-green-600 mr-2" size={20} />
              Course Outcomes Coverage Analysis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(results.COData).map(([co, marks]) => (
                <div key={co} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">CO{co}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Course Outcome {co}</h4>
                        <p className="text-xs text-gray-600">Learning Objective Assessment</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Allocated Marks:</span>
                      <span className="font-medium text-gray-900">{marks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coverage Percentage:</span>
                      <span className="font-medium text-gray-900">
                        {((marks / results.QuestionData.reduce((sum, q) => sum + q.Marks, 0)) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(marks / results.QuestionData.reduce((sum, q) => sum + q.Marks, 0)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Module Coverage Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="text-orange-600 mr-2" size={20} />
              Module Coverage Assessment
            </h3>
            
            <div className="space-y-4">
              {results.ModuleData.map((module, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Module {index + 1}</h4>
                      <p className="text-sm text-gray-600">{module.name}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {module.actual === module.expected ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle size={16} />
                          <span className="text-sm font-medium">Optimal Coverage</span>
                        </div>
                      ) : module.actual > module.expected ? (
                        <div className="flex items-center space-x-1 text-blue-600">
                          <ArrowUp size={16} />
                          <span className="text-sm font-medium">Over-emphasized</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-red-600">
                          <ArrowDown size={16} />
                          <span className="text-sm font-medium">Under-emphasized</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Expected Coverage</span>
                        <span className="text-sm font-medium text-gray-900">{module.expected.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-500 h-2 rounded-full" 
                          style={{ width: `${module.expected}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Actual Coverage</span>
                        <span className="text-sm font-medium text-gray-900">{module.actual.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            module.actual > module.expected ? 'bg-blue-600' : 
                            module.actual < module.expected ? 'bg-red-600' : 'bg-green-600'
                          }`}
                          style={{ width: `${module.actual}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations for Quality Enhancement</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-gray-700">
                  <strong>Bloom's Taxonomy Balance:</strong> Consider adjusting question distribution to maintain optimal cognitive level progression across all learning objectives.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-gray-700">
                  <strong>Course Outcome Alignment:</strong> Ensure proportional coverage of all course outcomes based on their defined weightages in the course curriculum.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-gray-700">
                  <strong>Module Coverage:</strong> Review module emphasis to align with prescribed teaching hours and learning objectives.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-gray-700">
                  <strong>Assessment Validity:</strong> Maintain consistent question quality standards across all cognitive levels and learning domains.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <p>© 2024 Academic Quality Assurance System. All rights reserved.</p>
            <p>Report generated on {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResultPage;