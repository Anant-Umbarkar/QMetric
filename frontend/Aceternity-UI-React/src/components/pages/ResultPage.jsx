import React, { useState, useEffect } from 'react';
import { AlertCircle, Download, CheckCircle } from 'lucide-react';

const ResultPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const authToken = sessionStorage.getItem('accessToken');
    if (authToken) {
      fetchData(authToken);
    } else {
      setError('Authorization token is required');
      setLoading(false);
    }
  }, []);

  const fetchData = async (authToken) => {
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
      const bloomsData = collectedData?.BloomsData || {};
      const moduleData = collectedData?.ModuleData || [];
      const coData = collectedData?.COData || {};
      const finalScore = collectedData?.FinalScore || 0;
      const blommLevelMap = data?.blommLevelMap || {};
      const sequence = data?.Sequence || [];
      const coRecommendations = collectedData?.CORecommendations || [];
      const moduleRecommendations = collectedData?.ModuleRecommendations || [];
      const questionRecommendations = collectedData?.QuestionRecommendations || [];

      const totalQuestions = questionRecommendations.length;
      const matchingQuestions = questionRecommendations.filter(q => q.remark === 'Matches Expected Blooms Level').length;
      const higherQuestions = questionRecommendations.filter(q => q.remark === 'Higher than Expected Blooms Level').length;
      const lowerQuestions = questionRecommendations.filter(q => q.remark === 'Lower than Expected Blooms Level').length;
      const matchPercentage = totalQuestions > 0 ? (matchingQuestions / totalQuestions * 100).toFixed(1) : 0;

      // Generate table rows for CO configuration
      const coRows = Object.keys(sequence[0]?.COs || {}).map(co => {
        const coDataItem = sequence[0].COs[co];
        return `
          <tr>
            <td class="text-center">${co}</td>
            <td class="text-center">${coDataItem.weight || 0}%</td>
            <td class="text-center">${coDataItem.blooms?.[0] || 'N/A'}</td>
          </tr>
        `;
      }).join('');

      // Generate table rows for modules
      const moduleRows = Object.keys(sequence[0]?.ModuleHours || {}).map(module => {
        const hours = sequence[0].ModuleHours[module];
        return `
          <tr>
            <td class="text-center">${module}</td>
            <td class="text-center">${hours || 0}</td>
          </tr>
        `;
      }).join('');

      // Generate table rows for Bloom's level map
      const bloomLevelMapRows = Object.keys(blommLevelMap).map(level => `
        <tr>
          <td>${level}</td>
          <td class="text-center">${blommLevelMap[level]}</td>
        </tr>
      `).join('');

      // Generate table rows for Bloom's data
      const bloomDataRows = Object.keys(bloomsData).map(level => {
        const bloomData = bloomsData[level];
        const variance = (bloomData.marks || 0) - (bloomData.weights || 0);
        return `
          <tr>
            <td>${bloomData.name || `Level ${level}`}</td>
            <td class="text-center">${bloomData.level}</td>
            <td class="text-center">${(bloomData.weights || 0).toFixed(1)}%</td>
            <td class="text-center">${(bloomData.marks || 0).toFixed(1)}%</td>
            <td class="text-center ${variance < 0 ? 'negative' : 'positive'}">
              ${variance > 0 ? '+' : ''}${variance.toFixed(1)}%
            </td>
            <td class="text-center">${bloomData.No_Of_Questions || 0}</td>
          </tr>
        `;
      }).join('');

      // Generate table rows for module analysis
      const moduleAnalysisRows = moduleData.map((module, index) => {
        const variance = (module.actual || 0) - (module.expected || 0);
        return `
          <tr>
            <td class="text-center">Module ${index + 1}</td>
            <td class="text-center">${(module.expected || 0).toFixed(1)}%</td>
            <td class="text-center">${(module.actual || 0).toFixed(1)}%</td>
            <td class="text-center ${variance < 0 ? 'negative' : 'positive'}">
              ${variance > 0 ? '+' : ''}${variance.toFixed(1)}%
            </td>
          </tr>
        `;
      }).join('');

      // Generate table rows for CO analysis
      const coAnalysisRows = Object.keys(coData).map(co => `
        <tr>
          <td class="text-center">CO${co}</td>
          <td class="text-center">${(coData[co] || 0).toFixed(1)}%</td>
          <td class="text-center positive">Complete</td>
        </tr>
      `).join('');

      // Generate table rows for question recommendations
      const questionRows = questionRecommendations.map((rec, index) => `
        <tr>
          <td class="text-center">${index + 1}</td>
          <td>${rec.QuestionData || 'N/A'}</td>
          <td class="text-center">${rec.marks || 0}</td>
          <td class="text-center">${rec.co || 'N/A'}</td>
          <td class="text-center">${rec.extractedVerb || 'N/A'}</td>
          <td class="text-center">${rec.highestVerb || 'N/A'}</td>
          <td class="text-center ${rec.qScore === 1 ? 'status-match' : rec.qScore === 2 ? 'status-higher' : 'status-lower'}">
            ${rec.qScore}
          </td>
          <td class="text-center ${rec.remark === 'Matches Expected Blooms Level' ? 'status-match' : rec.remark === 'Higher than Expected Blooms Level' ? 'status-higher' : 'status-lower'}">
            ${rec.remark || 'No remarks'}
          </td>
        </tr>
      `).join('');

      // Generate table rows for CO recommendations
      const coRecommendationRows = coRecommendations.map(rec => {
        const variance = (rec.actual || 0) - (rec.expected || 0);
        return `
          <tr>
            <td class="text-center">${rec.co}</td>
            <td class="text-center">${(rec.expected || 0).toFixed(1)}%</td>
            <td class="text-center">${(rec.actual || 0).toFixed(1)}%</td>
            <td class="text-center ${variance < 0 ? 'negative' : 'positive'}">
              ${variance > 0 ? '+' : ''}${variance.toFixed(1)}%
            </td>
            <td>${rec.suggestion}</td>
          </tr>
        `;
      }).join('');

      // Generate table rows for module recommendations
      const moduleRecommendationRows = moduleRecommendations.map(rec => {
        const variance = (rec.actual || 0) - (rec.expected || 0);
        return `
          <tr>
            <td class="text-center">${rec.module}</td>
            <td class="text-center">${(rec.expected || 0).toFixed(1)}%</td>
            <td class="text-center">${(rec.actual || 0).toFixed(1)}%</td>
            <td class="text-center ${variance < 0 ? 'negative' : 'positive'}">
              ${variance > 0 ? '+' : ''}${variance.toFixed(1)}%
            </td>
            <td>${rec.suggestion}</td>
          </tr>
        `;
      }).join('');

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Assessment Analysis Report</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #1a1a1a;
                    background: #ffffff;
                    padding: 40px 60px;
                    font-size: 11pt;
                }
                
                .report-container {
                    max-width: 1100px;
                    margin: 0 auto;
                }
                
                .header {
                    border-bottom: 2px solid #1a1a1a;
                    padding-bottom: 30px;
                    margin-bottom: 50px;
                }
                
                .header h1 {
                    font-size: 28pt;
                    font-weight: 600;
                    color: #1a1a1a;
                    margin-bottom: 8px;
                    letter-spacing: -0.5px;
                }
                
                .header-subtitle {
                    font-size: 11pt;
                    color: #666;
                    margin-bottom: 20px;
                }
                
                .header-meta {
                    display: flex;
                    justify-content: space-between;
                    font-size: 9pt;
                    color: #666;
                    margin-top: 20px;
                }
                
                .section {
                    margin-bottom: 50px;
                }
                
                .section-title {
                    font-size: 14pt;
                    font-weight: 600;
                    color: #1a1a1a;
                    margin-bottom: 20px;
                    letter-spacing: -0.3px;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px 40px;
                    margin-bottom: 30px;
                }
                
                .info-item {
                    border-bottom: 1px solid #e5e5e5;
                    padding-bottom: 8px;
                }
                
                .info-label {
                    font-size: 9pt;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 4px;
                }
                
                .info-value {
                    font-size: 11pt;
                    color: #1a1a1a;
                    font-weight: 500;
                }
                
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    font-size: 10pt;
                }
                
                table thead {
                    border-bottom: 2px solid #1a1a1a;
                }
                
                table th {
                    padding: 12px 8px;
                    text-align: left;
                    font-weight: 600;
                    font-size: 9pt;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #1a1a1a;
                }
                
                table td {
                    padding: 10px 8px;
                    border-bottom: 1px solid #f0f0f0;
                    color: #1a1a1a;
                }
                
                table tbody tr:hover {
                    background-color: #fafafa;
                }
                
                .text-center {
                    text-align: center;
                }
                
                .status-match {
                    color: #22c55e;
                    font-weight: 500;
                }
                
                .status-higher {
                    color: #3b82f6;
                    font-weight: 500;
                }
                
                .status-lower {
                    color: #ef4444;
                    font-weight: 500;
                }
                
                .positive {
                    color: #22c55e;
                }
                
                .negative {
                    color: #ef4444;
                }
                
                .warning {
                    color: #f59e0b;
                }
                
                .score-section {
                    text-align: center;
                    padding: 50px 0;
                    border-top: 2px solid #1a1a1a;
                    border-bottom: 2px solid #1a1a1a;
                    margin: 50px 0;
                }
                
                .score-label {
                    font-size: 10pt;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: #666;
                    margin-bottom: 15px;
                }
                
                .score-value {
                    font-size: 60pt;
                    font-weight: 300;
                    color: #1a1a1a;
                    line-height: 1;
                    letter-spacing: -2px;
                }
                
                .score-description {
                    font-size: 10pt;
                    color: #666;
                    margin-top: 15px;
                }
                
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 30px;
                    margin: 40px 0;
                }
                
                .stat-card {
                    text-align: center;
                    padding: 20px;
                    border: 1px solid #e5e5e5;
                }
                
                .stat-value {
                    font-size: 32pt;
                    font-weight: 300;
                    color: #1a1a1a;
                    line-height: 1;
                    margin-bottom: 8px;
                }
                
                .stat-label {
                    font-size: 9pt;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .analysis-box {
                    background: #fafafa;
                    padding: 25px;
                    margin: 30px 0;
                    border-left: 3px solid #1a1a1a;
                }
                
                .analysis-box h4 {
                    font-size: 11pt;
                    font-weight: 600;
                    margin-bottom: 12px;
                    color: #1a1a1a;
                }
                
                .analysis-box p {
                    margin: 8px 0;
                    font-size: 10pt;
                    color: #1a1a1a;
                    line-height: 1.7;
                }
                
                .footer {
                    margin-top: 60px;
                    padding-top: 30px;
                    border-top: 1px solid #e5e5e5;
                    text-align: center;
                    color: #666;
                    font-size: 9pt;
                }
                
                .divider {
                    height: 1px;
                    background: #e5e5e5;
                    margin: 40px 0;
                }
                
                @media print {
                    body {
                        padding: 20px;
                    }
                    
                    .header {
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    
                    .section {
                        margin-bottom: 30px;
                        page-break-inside: auto;
                    }
                    
                    .section-title {
                        page-break-after: avoid;
                    }
                    
                    table {
                        page-break-inside: auto;
                    }
                    
                    table tr {
                        page-break-inside: avoid;
                    }
                    
                    .score-section {
                        padding: 30px 0;
                        margin: 30px 0;
                        page-break-inside: avoid;
                    }
                    
                    .stats-grid {
                        margin: 20px 0;
                        page-break-inside: avoid;
                    }
                    
                    .info-grid {
                        page-break-inside: avoid;
                    }
                    
                    .analysis-box {
                        page-break-inside: avoid;
                        margin: 20px 0;
                    }
                    
                    .divider {
                        margin: 20px 0;
                        page-break-after: avoid;
                    }
                }
            </style>
        </head>
        <body>
            <div class="report-container">
                <div class="header">
                    <h1>Question Paper Assessment Analysis Report</h1>
                    <div class="header-subtitle">Course Outcome & Cognitive Level Evaluation</div>
                    <div class="header-meta">
                        <span>Generated ${new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                        <span>Report ID: ${data._id?.slice(-8) || 'N/A'}</span>
                    </div>
                </div>

                <!-- Course Information -->
                <div class="section">
                    <div class="section-title">Course Information</div>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Institution</div>
                            <div class="info-value">${data['College Name'] || 'N/A'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Department</div>
                            <div class="info-value">${data['Branch'] || 'N/A'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Course</div>
                            <div class="info-value">${data['Course Name'] || 'N/A'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Code</div>
                            <div class="info-value">${data['Course Code'] || 'N/A'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Instructor</div>
                            <div class="info-value">${data['Course Teacher'] || 'N/A'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Academic Period</div>
                            <div class="info-value">Year ${data['Year Of Study'] || 'N/A'}, Sem ${data['Semester'] || 'N/A'}</div>
                        </div>
                    </div>
                </div>

                <!-- Final Score -->
                <div class="score-section">
                    <div class="score-label">Overall Assessment Score</div>
                    <div class="score-value">${finalScore.toFixed(1)}%</div>
                    <div class="score-description">Based on alignment, distribution, and taxonomy analysis</div>
                </div>

                <!-- Key Metrics -->
                <div class="section">
                    <div class="section-title">Key Metrics</div>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">${totalQuestions}</div>
                            <div class="stat-label">Total Questions</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${matchingQuestions}</div>
                            <div class="stat-label">Aligned Questions</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${higherQuestions}</div>
                            <div class="stat-label">Higher Level</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${lowerQuestions}</div>
                            <div class="stat-label">Lower Level</div>
                        </div>
                    </div>
                </div>

                <div class="divider"></div>

                <!-- Course Outcomes -->
                <div class="section">
                    <div class="section-title">Course Outcomes Configuration</div>
                    <table>
                        <thead>
                            <tr>
                                <th class="text-center">Outcome</th>
                                <th class="text-center">Weight</th>
                                <th class="text-center">Target Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${coRows}
                        </tbody>
                    </table>
                </div>

                <!-- Modules -->
                <div class="section">
                    <div class="section-title">Module Distribution</div>
                    <table>
                        <thead>
                            <tr>
                                <th class="text-center">Module</th>
                                <th class="text-center">Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${moduleRows}
                        </tbody>
                    </table>
                </div>

                <div class="divider"></div>
            
                <!-- Bloom's Mapping -->
                <div class="section">
                    <div class="section-title">Bloom's Taxonomy Mapping</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Cognitive Level</th>
                                <th class="text-center">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${bloomLevelMapRows}
                        </tbody>
                    </table>
                </div>
    
                <!-- Question Analysis -->
                <div class="section">
                    <div class="section-title">Detailed Question-wise Analysis</div>
                    <table>
                        <thead>
                            <tr>
                                <th class="text-center">#</th>
                                <th>Question</th>
                                <th class="text-center">Marks</th>
                                <th class="text-center">CO</th>
                                <th class="text-center">Type</th>
                                <th class="text-center">Module</th>
                                <th class="text-center">Bloom's Verbs</th>
                                <th class="text-center">Level</th>
                                <th class="text-center">Bloom's Highest Verb</th>
                                <th class="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${questionData.map((question, index) => `
                              <tr>
                                <td class="text-center">${index + 1}</td>
                                <td>${question.Question || 'N/A'}</td>
                                <td class="text-center">${question.Marks || 0}</td>
                                <td class="text-center">${question.CO || 'N/A'}</td>
                                <td class="text-center">${question['QT'] || 'N/A'}</td>
                                <td class="text-center">${question.Module || 'N/A'}</td>
                                <td class="text-center">${question['Bloom\'s Verbs'] || 'N/A'}</td>
                                <td class="text-center">${question['Bloom\'s Taxonomy Level'] || 'N/A'}</td>
                                <td class="text-center">${question['Bloom\'s Highest Verb'] || 'N/A'}</td>
                                <td class="text-center ${question.Remark === 'Matches Expected Blooms Level' ? 'status-match' : question.Remark === 'Higher than Expected Blooms Level' ? 'status-higher' : 'status-lower'}">${question.Remark || 'No remarks'}</td>
                              </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="divider"></div>

                <!-- Module Analysis -->
                <div class="section">
                    <div class="section-title">Module Coverage Analysis</div>
                    <table>
                        <thead>
                            <tr>
                                <th class="text-center">Module</th>
                                <th class="text-center">Expected</th>
                                <th class="text-center">Actual</th>
                                <th class="text-center">Variance</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${moduleAnalysisRows}
                        </tbody>
                    </table>
                </div>

                <!-- Bloom's Analysis -->
                <div class="section">
                    <div class="section-title">Bloom's Taxonomy Analysis</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Level</th>
                                <th class="text-center">#</th>
                                <th class="text-center">Expected</th>
                                <th class="text-center">Actual</th>
                                <th class="text-center">Variance</th>
                                <th class="text-center">Questions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${bloomDataRows}
                        </tbody>
                    </table>
                </div>

                <!-- CO Coverage -->
                <div class="section">
                    <div class="section-title">Course Outcome Coverage</div>
                    <table>
                        <thead>
                            <tr>
                                <th class="text-center">Outcome</th>
                                <th class="text-center">Coverage</th>
                                <th class="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${coAnalysisRows}
                        </tbody>
                    </table>
                </div>
                <div class="divider"></div>
                      
                <!-- Question Recommendations -->
                <div class="section">
                    <div class="section-title">Question Recommendations</div>
                    <table>
                        <thead>
                            <tr>
                                <th class="text-center">#</th>
                                <th>Question</th>
                                <th class="text-center">Marks</th>
                                <th class="text-center">CO</th>
                                <th class="text-center">Extracted Verb</th>
                                <th class="text-center">Highest Verb</th>
                                <th class="text-center">Q-Score</th>
                                <th class="text-center">Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${questionRows}
                        </tbody>
                    </table>
                </div>

                <div class="divider"></div>

                ${coRecommendations.length > 0 ? `
                <div class="divider"></div>
                <div class="section">
                    <div class="section-title">Course Outcome Recommendations</div>
                    <table style="width: 100%; table-layout: fixed;">
                        <thead>
                            <tr>
                                <th class="text-center">CO</th>
                                <th class="text-center">Expected</th>
                                <th class="text-center">Actual</th>
                                <th class="text-center">Variance</th>
                                <th>Recommendation</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${coRecommendationRows}
                        </tbody>
                    </table>
                </div>
                ` : ''}

                ${moduleRecommendations.length > 0 ? `
                <div class="section">
                    <div class="section-title">Module Recommendations</div>
                    <table style="width: 100%; table-layout: fixed;">
                        <thead>
                            <tr>
                                <th class="text-center">Module</th>
                                <th class="text-center">Expected</th>
                                <th class="text-center">Actual</th>
                                <th class="text-center">Variance</th>
                                <th>Recommendation</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${moduleRecommendationRows}
                        </tbody>
                    </table>
                </div>
                ` : ''}

                <div class="divider"></div>

                <!-- Analysis -->
                <div class="section">
                    <div class="section-title">Performance Analysis</div>
                    <div class="analysis-box">
                        <h4>Assessment Quality</h4>
                        <p>${
                          finalScore >= 80 
                            ? 'The assessment demonstrates strong alignment with learning objectives and cognitive levels.'
                            : finalScore >= 60 
                            ? 'The assessment shows reasonable alignment with room for improvement in question design and distribution.'
                            : 'Significant adjustments are required to align with expected standards and cognitive level distribution.'
                        }</p>
                    </div>
                    <div class="analysis-box">
                        <h4>Alignment Status</h4>
                        <p>${matchPercentage}% of questions match their expected Bloom's taxonomy levels, with ${higherQuestions} questions at higher cognitive levels and ${lowerQuestions} below target. ${
                          matchPercentage >= 80 
                            ? 'This indicates strong cognitive level alignment across the assessment.'
                            : matchPercentage >= 60
                            ? 'Consider reviewing questions that fall below expected cognitive levels.'
                            : 'A substantial revision of question design is recommended to improve alignment.'
                        }</p>
                    </div>
                </div>

                <div class="footer">
                    <p>This report provides comprehensive analysis of assessment quality based on Course Outcome alignment, Module distribution, and Bloom's Taxonomy compliance.</p>
                    <p style="margin-top: 10px;">Generated on ${new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                </div>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-900 font-medium">Loading analysis data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">Unable to Load Report</h2>
          <p className="text-gray-900 text-center mb-4">{error}</p>
          <button
            onClick={() => {
              const authToken = sessionStorage.getItem('accessToken');
              if (authToken) fetchData(authToken);
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">No Data Available</h2>
          <p className="text-gray-900 text-center">No analysis data found.</p>
        </div>
      </div>
    );
  }

  const collectedData = data['Collected Data']?.[0];
  const finalScore = collectedData?.FinalScore || 0;
  const questionData = collectedData?.QuestionData || [];
  const bloomsData = collectedData?.BloomsData || {};
  const moduleData = collectedData?.ModuleData || [];
  const coData = collectedData?.COData || {};
  const sequence = data?.Sequence || [];
  const blommLevelMap = data?.blommLevelMap || {};
  const questionRecommendations = collectedData?.QuestionRecommendations || [];
  const coRecommendations = collectedData?.CORecommendations || [];
  const moduleRecommendations = collectedData?.ModuleRecommendations || [];

  const totalQuestions = questionRecommendations.length;
  const matchingQuestions = questionRecommendations.filter(q => q.remark === 'Matches Expected Blooms Level').length;
  const higherQuestions = questionRecommendations.filter(q => q.remark === 'Higher than Expected Blooms Level').length;
  const lowerQuestions = questionRecommendations.filter(q => q.remark === 'Lower than Expected Blooms Level').length;
  const matchPercentage = totalQuestions > 0 ? (matchingQuestions / totalQuestions * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Download Button */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Analysis Report</h1>
              <p className="text-gray-900">Course Outcome & Cognitive Level Evaluation</p>
            </div>
            <button
              onClick={downloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              <Download className="h-5 w-5" />
              {isDownloading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Final Score Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-8 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Overall Assessment Score</h2>
            </div>
            <div className="text-6xl font-bold text-blue-600 mb-2">{finalScore.toFixed(1)}%</div>
            <p className="text-gray-900">Based on alignment, distribution, and taxonomy analysis</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">{totalQuestions}</div>
            <div className="text-sm text-gray-900 uppercase tracking-wide font-medium">Total Questions</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{matchingQuestions}</div>
            <div className="text-sm text-gray-900 uppercase tracking-wide font-medium">Aligned Questions</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{higherQuestions}</div>
            <div className="text-sm text-gray-900 uppercase tracking-wide font-medium">Higher Level</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">{lowerQuestions}</div>
            <div className="text-sm text-gray-900 uppercase tracking-wide font-medium">Lower Level</div>
          </div>
        </div>

        {/* Course Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border-b border-gray-200 pb-2">
              <div className="text-xs text-gray-700 uppercase tracking-wide mb-1 font-medium">Institution</div>
              <div className="text-sm font-medium text-gray-900">{data['College Name'] || 'N/A'}</div>
            </div>
            <div className="border-b border-gray-200 pb-2">
              <div className="text-xs text-gray-700 uppercase tracking-wide mb-1 font-medium">Department</div>
              <div className="text-sm font-medium text-gray-900">{data['Branch'] || 'N/A'}</div>
            </div>
            <div className="border-b border-gray-200 pb-2">
              <div className="text-xs text-gray-700 uppercase tracking-wide mb-1 font-medium">Course</div>
              <div className="text-sm font-medium text-gray-900">{data['Course Name'] || 'N/A'}</div>
            </div>
            <div className="border-b border-gray-200 pb-2">
              <div className="text-xs text-gray-700 uppercase tracking-wide mb-1 font-medium">Code</div>
              <div className="text-sm font-medium text-gray-900">{data['Course Code'] || 'N/A'}</div>
            </div>
            <div className="border-b border-gray-200 pb-2">
              <div className="text-xs text-gray-700 uppercase tracking-wide mb-1 font-medium">Instructor</div>
              <div className="text-sm font-medium text-gray-900">{data['Course Teacher'] || 'N/A'}</div>
            </div>
            <div className="border-b border-gray-200 pb-2">
              <div className="text-xs text-gray-700 uppercase tracking-wide mb-1 font-medium">Academic Period</div>
              <div className="text-sm font-medium text-gray-900">Year {data['Year Of Study'] || 'N/A'}, Sem {data['Semester'] || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Course Outcomes Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Outcomes Configuration</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Outcome</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Weight</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Target Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.keys(sequence[0]?.COs || {}).map(co => {
                  const coDataItem = sequence[0].COs[co];
                  return (
                    <tr key={co} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">{co}</td>
                      <td className="px-4 py-3 text-center text-gray-900">{coDataItem.weight || 0}%</td>
                      <td className="px-4 py-3 text-center text-gray-900">{coDataItem.blooms?.[0] || 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Module Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Module Distribution</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Module</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.keys(sequence[0]?.ModuleHours || {}).map(module => {
                  const hours = sequence[0].ModuleHours[module];
                  return (
                    <tr key={module} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">{module}</td>
                      <td className="px-4 py-3 text-center text-gray-900">{hours || 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bloom's Taxonomy Mapping */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Bloom's Taxonomy Mapping</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Cognitive Level</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.keys(blommLevelMap).map(level => (
                  <tr key={level} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">{level}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{blommLevelMap[level]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Question Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Question-wise Analysis ({questionData.length} questions)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Question</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Marks</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">CO</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Module</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Level</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {questionData.map((q, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{i + 1}</td>
                    <td className="px-4 py-3 text-gray-900">{q.Question || 'N/A'}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{q.Marks || 0}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{q.CO || 'N/A'}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{q.Module || 'N/A'}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{q['Bloom\'s Taxonomy Level'] || 'N/A'}</td>
                    <td className={`px-4 py-3 text-center font-medium ${
                      q.Remark === 'Matches Expected Blooms Level' ? 'text-green-600' :
                      q.Remark === 'Higher than Expected Blooms Level' ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {q.Remark || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Blooms Taxonomy Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Bloom's Taxonomy Analysis</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Level</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">#</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Expected</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Actual</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Variance</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Questions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.keys(bloomsData).map(level => {
                  const bloomData = bloomsData[level];
                  const variance = (bloomData.marks || 0) - (bloomData.weights || 0);
                  return (
                    <tr key={level} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">{bloomData.name || `Level ${level}`}</td>
                      <td className="px-4 py-3 text-center text-gray-900">{bloomData.level}</td>
                      <td className="px-4 py-3 text-center text-gray-900">{(bloomData.weights || 0).toFixed(1)}%</td>
                      <td className="px-4 py-3 text-center text-gray-900">{(bloomData.marks || 0).toFixed(1)}%</td>
                      <td className={`px-4 py-3 text-center font-medium ${variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-center text-gray-900">{bloomData.No_Of_Questions || 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Module Coverage Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Module Coverage Analysis</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Module</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Expected</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Actual</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {moduleData.map((module, index) => {
                  const variance = (module.actual || 0) - (module.expected || 0);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">Module {index + 1}</td>
                      <td className="px-4 py-3 text-center text-gray-900">{(module.expected || 0).toFixed(1)}%</td>
                      <td className="px-4 py-3 text-center text-gray-900">{(module.actual || 0).toFixed(1)}%</td>
                      <td className={`px-4 py-3 text-center font-medium ${variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CO Coverage */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Outcome Coverage</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Outcome</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Coverage</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.keys(coData).map(co => (
                  <tr key={co} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center text-gray-900 font-medium">CO{co}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{(coData[co] || 0).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-center text-green-600 font-medium">Complete</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Question Recommendations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Question Recommendations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Question</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Marks</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">CO</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Extracted Verb</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Highest Verb</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Q-Score</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {questionRecommendations.map((rec, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center text-gray-900">{index + 1}</td>
                    <td className="px-4 py-3 text-gray-900">{rec.QuestionData || 'N/A'}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{rec.marks || 0}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{rec.co || 'N/A'}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{rec.extractedVerb || 'N/A'}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{rec.highestVerb || 'N/A'}</td>
                    <td className={`px-4 py-3 text-center font-medium ${
                      rec.qScore === 1 ? 'text-green-600' : rec.qScore === 2 ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {rec.qScore}
                    </td>
                    <td className={`px-4 py-3 text-center font-medium ${
                      rec.remark === 'Matches Expected Blooms Level' ? 'text-green-600' :
                      rec.remark === 'Higher than Expected Blooms Level' ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {rec.remark || 'No remarks'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        {(coRecommendations.length > 0 || moduleRecommendations.length > 0) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
            <div className="space-y-4">
              {coRecommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Course Outcome Recommendations</h3>
                  <div className="space-y-2">
                    {coRecommendations.map((rec, i) => (
                      <div key={i} className="bg-amber-50 border border-amber-200 rounded p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-900">{rec.co}</span>
                          <span className={`text-sm font-medium ${rec.actual < rec.expected ? 'text-red-600' : 'text-green-600'}`}>
                            {(rec.actual - rec.expected).toFixed(1)}% variance
                          </span>
                        </div>
                        <p className="text-sm text-gray-900">{rec.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {moduleRecommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Module Recommendations</h3>
                  <div className="space-y-2">
                    {moduleRecommendations.map((rec, i) => (
                      <div key={i} className="bg-blue-50 border border-blue-200 rounded p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-900">{rec.module}</span>
                          <span className={`text-sm font-medium ${rec.actual < rec.expected ? 'text-red-600' : 'text-green-600'}`}>
                            {(rec.actual - rec.expected).toFixed(1)}% variance
                          </span>
                        </div>
                        <p className="text-sm text-gray-900">{rec.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Performance Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Analysis</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 border-l-4 border-gray-900 p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Assessment Quality</h3>
              <p className="text-sm text-gray-900">
                {finalScore >= 80 
                  ? 'The assessment demonstrates strong alignment with learning objectives and cognitive levels.'
                  : finalScore >= 60 
                  ? 'The assessment shows reasonable alignment with room for improvement in question design and distribution.'
                  : 'Significant adjustments are required to align with expected standards and cognitive level distribution.'}
              </p>
            </div>
            <div className="bg-gray-50 border-l-4 border-gray-900 p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Alignment Status</h3>
              <p className="text-sm text-gray-900">
                {matchPercentage}% of questions match their expected Bloom's taxonomy levels, with {higherQuestions} questions 
                at higher cognitive levels and {lowerQuestions} below target. {
                  matchPercentage >= 80 
                    ? 'This indicates strong cognitive level alignment across the assessment.'
                    : matchPercentage >= 60
                    ? 'Consider reviewing questions that fall below expected cognitive levels.'
                    : 'A substantial revision of question design is recommended to improve alignment.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;