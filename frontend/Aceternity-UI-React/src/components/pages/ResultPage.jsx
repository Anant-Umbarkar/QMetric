import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, BookOpen, Users, Target, TrendingUp, Clock, Download } from 'lucide-react';

const ResultPage = ( ) => {
  const authToken = sessionStorage.getItem('accessToken');
  console.log('Token:', authToken);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    if (authToken) {
      fetchData();
    } else {
      setError('Authorization token is required');
      setLoading(false);
    }
  }, [authToken]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:80/upload/totext', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or expired token');
        } else if (response.status === 403) {
          throw new Error('Forbidden: Insufficient permissions');
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setData(result.data);
      } else {
        throw new Error('Invalid response format or unsuccessful request');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      setIsDownloading(true);
      
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        throw new Error('Unable to open print window');
      }

      const collectedData = data['Collected Data']?.[0];
      const questionData = collectedData?.QuestionData || [];
      const bloomRecommendations = collectedData?.BloomRecommendations || [];
      const coRecommendations = collectedData?.CORecommendations || [];
      const moduleRecommendations = collectedData?.ModuleRecommendations || [];
      const finalScore = collectedData?.FinalScore || 0;

      const questionRows = questionData.map((question, index) => {
        const bloomsLevel = question['Bloom\'s Taxonomy Level'] || 'N/A';
        const bloomsVerbs = question['Bloom\'s Verbs'] || 'N/A';
        return `
          <tr>
            <td>${question.QT || 'N/A'}</td>
            <td>${question.Marks || 0}</td>
            <td>${question.CO || 'N/A'}</td>
            <td>Module ${question.Module || 'N/A'}</td>
            <td>Level ${bloomsLevel} (${bloomsVerbs})</td>
            <td><span class="status-badge">${question.Remark || 'No remarks'}</span></td>
          </tr>
        `;
      }).join('');

      const bloomRecommendationItems = bloomRecommendations.map(rec => `
        <div class="recommendation">
          <div class="rec-header">
            <span>Question ${rec.questionIndex || 'N/A'} - ${rec.co || 'N/A'}</span>
            <span class="rec-stats">Expected Level: ${rec.expectedLevel || 0} | Actual Level: ${rec.actualLevel || 0}</span>
          </div>
          <div class="rec-content">${rec.suggestion || 'No suggestion'}</div>
        </div>
      `).join('');

      const coRecommendationItems = coRecommendations.map(rec => `
        <div class="recommendation">
          <div class="rec-header">
            <span>${rec.co || 'N/A'}</span>
            <span class="rec-stats">Expected: ${rec.expected || 0}% | Actual: ${rec.actual || 0}%</span>
          </div>
          <div class="rec-content">${rec.suggestion || 'No suggestion'}</div>
        </div>
      `).join('');

      const moduleRecommendationItems = moduleRecommendations.map(rec => `
        <div class="recommendation">
          <div class="rec-header">
            <span>${rec.module || 'N/A'}</span>
            <span class="rec-stats">Expected: ${rec.expected || 0}% | Actual: ${rec.actual || 0}%</span>
          </div>
          <div class="rec-content">${rec.suggestion || 'No suggestion'}</div>
        </div>
      `).join('');

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Course Analysis Report - ${data['Course Name'] || 'Course Report'}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #374151;
              background: white;
              padding: 20px;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 20px;
            }
            .title { 
              font-size: 24px; 
              font-weight: bold; 
              color: #1f2937;
              margin-bottom: 10px;
            }
            .subtitle { 
              font-size: 14px; 
              color: #6b7280;
              margin-bottom: 15px;
            }
            .score { 
              font-size: 36px; 
              font-weight: bold; 
              color: #2563eb;
              margin: 10px 0;
            }
            .score-label { 
              font-size: 12px; 
              color: #6b7280;
            }
            .section { 
              margin-bottom: 25px; 
              page-break-inside: avoid;
            }
            .section-title { 
              font-size: 18px; 
              font-weight: bold; 
              margin-bottom: 15px;
              color: #1f2937;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 5px;
            }
            .info-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
              gap: 15px; 
              margin-bottom: 20px;
            }
            .info-item { 
              padding: 15px; 
              border: 1px solid #e5e7eb;
              border-radius: 8px;
            }
            .info-label { 
              font-weight: bold; 
              color: #374151;
              margin-bottom: 5px;
            }
            .info-value { 
              color: #6b7280; 
              font-size: 14px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 20px;
              page-break-inside: avoid;
            }
            th, td { 
              padding: 8px 12px; 
              text-align: left; 
              border: 1px solid #e5e7eb;
              font-size: 12px;
            }
            th { 
              background-color: #f9fafb; 
              font-weight: bold;
              color: #374151;
            }
            .recommendation { 
              margin-bottom: 15px; 
              padding: 15px; 
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              page-break-inside: avoid;
            }
            .rec-header { 
              font-weight: bold; 
              margin-bottom: 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .rec-content { 
              color: #2563eb; 
              font-size: 14px;
            }
            .rec-stats { 
              font-size: 12px; 
              color: #6b7280;
            }
            .status-badge { 
              padding: 4px 8px; 
              border-radius: 12px; 
              font-size: 10px;
              background-color: #fef3c7;
              color: #92400e;
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px; 
              color: #6b7280;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Course Analysis Report</div>
            <div class="subtitle">${data['College Name'] || 'N/A'} • ${data['Branch'] || 'N/A'} • ${data['Year Of Study'] || 'N/A'}</div>
            <div class="score">${finalScore.toFixed(1)}%</div>
            <div class="score-label">Final Score</div>
          </div>

          <div class="section">
            <div class="section-title">Bloom's Taxonomy Recommendations</div>
            ${bloomRecommendationItems}
          </div>

          <div class="section">
            <div class="section-title">Course Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Course</div>
                <div class="info-value">${data['Course Name'] || 'N/A'} (${data['Course Code'] || 'N/A'})</div>
              </div>
              <div class="info-item">
                <div class="info-label">Instructor</div>
                <div class="info-value">${data['Course Teacher'] || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Semester</div>
                <div class="info-value">${data['Semester'] || 'N/A'} Semester</div>
              </div>
              <div class="info-item">
                <div class="info-label">Questions Analyzed</div>
                <div class="info-value">${questionData.length} Questions</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Question Analysis</div>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Marks</th>
                  <th>CO</th>
                  <th>Module</th>
                  <th>Bloom's Level</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${questionRows}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Course Outcome Recommendations</div>
            ${coRecommendationItems}
          </div>

          <div class="section">
            <div class="section-title">Module Recommendations</div>
            ${moduleRecommendationItems}
          </div>

          <div class="footer">
            <p>Report generated on ${formatDate(data.createdAt)}</p>
            <p>Last updated: ${formatDate(data.updatedAt)}</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }, 250);
      };

    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course analysis report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
            Unable to Load Report
          </h2>
          <p className="text-gray-600 text-center mb-4">
            {error}
          </p>
          <button
            onClick={fetchData}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
            No Data Available
          </h2>
          <p className="text-gray-600 text-center">
            No course analysis data found.
          </p>
        </div>
      </div>
    );
  }

  const collectedData = data['Collected Data']?.[0];
  const questionData = collectedData?.QuestionData || [];
  const bloomsData = collectedData?.BloomsData || {};
  const bloomRecommendations = collectedData?.BloomRecommendations || [];
  const coRecommendations = collectedData?.CORecommendations || [];
  const moduleRecommendations = collectedData?.ModuleRecommendations || [];
  const finalScore = collectedData?.FinalScore || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8" ref={reportRef}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                Course Analysis Report
              </h1>
              <p className="text-gray-600 mt-2">
                {data['College Name']} • {data['Branch']} • {data['Year Of Study']}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={downloadPDF}
                disabled={isDownloading}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              >
                <Download className="h-4 w-4" />
                {isDownloading ? 'Generating...' : 'Download PDF'}
              </button>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {finalScore.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">Final Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-900">Course</span>
            </div>
            <p className="text-sm text-gray-600">{data['Course Name']}</p>
            <p className="text-xs text-gray-500">{data['Course Code']}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">Instructor</span>
            </div>
            <p className="text-sm text-gray-600">{data['Course Teacher']}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-900">Semester</span>
            </div>
            <p className="text-sm text-gray-600">{data['Semester']} Semester</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-gray-900">Questions</span>
            </div>
            <p className="text-sm text-gray-600">{questionData.length} Questions</p>
          </div>
        </div>

        {/* Question Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Question Analysis</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-black-700">Question Type</th>
                  <th className="text-left py-3 px-4 font-medium text-black-700">Marks</th>
                  <th className="text-left py-3 px-4 font-medium text-black-700">CO</th>
                  <th className="text-left py-3 px-4 font-medium text-black-700">Module</th>
                  <th className="text-left py-3 px-4 font-medium text-black-700">Bloom's Level</th>
                  <th className="text-left py-3 px-4 font-medium text-black-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {questionData.map((question, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4">{question.QT}</td>
                    <td className="py-3 px-4">{question.Marks}</td>
                    <td className="py-3 px-4">{question.CO}</td>
                    <td className="py-3 px-4">Module {question.Module}</td>
                    <td className="py-3 px-4">
                      Level {question["Bloom's Taxonomy Level"]} ({question["Bloom's Verbs"]})
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        {question.Remark}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Bloom's Recommendations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bloom's Taxonomy Recommendations</h3>
            <div className="space-y-3">
              {bloomRecommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                    <span className="font-medium text-gray-900">Q{rec.questionIndex} - {rec.co}</span>
                    <span className="text-xs text-gray-600">
                      Expected: L{rec.expectedLevel} | Actual: L{rec.actualLevel}
                    </span>
                  </div>
                  <p className="text-sm text-purple-600">{rec.suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CO Recommendations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Outcome Recommendations</h3>
            <div className="space-y-3">
              {coRecommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{rec.co}</span>
                    <span className="text-sm text-gray-600">
                      Expected: {rec.expected}% | Actual: {rec.actual}%
                    </span>
                  </div>
                  <p className="text-sm text-blue-600">{rec.suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Module Recommendations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Recommendations</h3>
            <div className="space-y-3">
              {moduleRecommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{rec.module}</span>
                    <span className="text-sm text-gray-600">
                      Expected: {rec.expected}% | Actual: {rec.actual}%
                    </span>
                  </div>
                  <p className="text-sm text-green-600">{rec.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-lg shadow-md p-4 text-center text-sm text-gray-500">
          <p>Report generated on {formatDate(data.createdAt)}</p>
          <p>Last updated: {formatDate(data.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;