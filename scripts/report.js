// 全局变量
let reportData = {};
let radarChart = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadReportData();
    initializeReport();
});

// 加载报告数据
function loadReportData() {
    // 检查URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const studentIndex = urlParams.get('student');
    const surveyId = urlParams.get('surveyId');
    
    // 如果有 surveyId，保存到 localStorage（用于后续保存报告）
    if (surveyId) {
        localStorage.setItem('currentSurveyId', surveyId);
        console.log('从URL参数获取 Survey ID:', surveyId);
    }
    
    let dataKey = 'reportData';
    if (studentIndex !== null) {
        dataKey = `reportData_${studentIndex}`;
    }
    
    const data = localStorage.getItem(dataKey);
    if (data) {
        reportData = JSON.parse(data);
    } else {
        // 如果没有数据，使用示例数据
        reportData = generateSampleData();
    }
}

// 生成示例数据
function generateSampleData() {
    return {
        student: {
            studentName: '张同学',
            gender: '女',
            grade: '高二',
            school: '北京市第一中学',
            subjectGroup: '物理组',
            studyDestination: '英国',
            majorPreference: '工科',
            englishTestType: '雅思',
            englishScore: '6.5',
            currentTotal: '580',
            predictedTotal: '620'
        },
        admin: {
            radar: {
                academicAbility: 75,
                languageAbility: 70,
                artisticQuality: 80,
                socialAbility: 85,
                independentLiving: 78
            },
            detailedAnalysis: {
                academic: {
                    strengths: '学术基础较为扎实，理论知识掌握良好，具备一定的学科思维能力。',
                    weaknesses: '在深层次理解和创新思维方面还有提升空间，缺乏跨学科整合能力。',
                    suggestions: '建议参与更多学术挑战项目，如数学竞赛、科学实验等，培养批判性思维和创新能力。'
                },
                language: {
                    strengths: '英语基础较好，能够进行基本的英语交流，阅读理解能力不错。',
                    weaknesses: '口语表达的流利度和准确性有待提升，学术英语写作能力需要加强。',
                    suggestions: '建议参加雅思/托福培训，多进行英语口语练习，阅读英文学术文章，练习学术写作。'
                },
                artistic: {
                    strengths: '文体素养较好，具备一定的文体特长，有稳定的兴趣爱好。',
                    weaknesses: '文体技能还需要进一步提升，缺乏相关证书或奖项。',
                    suggestions: '建议深化文体特长发展，参加相关比赛和考级，争取获得证书或奖项。'
                },
                social: {
                    strengths: '生活能力较好，具备基本的时间管理和自我管理能力，能够应对大部分日常生活需求。',
                    weaknesses: '在某些生活技能方面还需要进一步提升，适应新环境的能力有待加强。',
                    suggestions: '建议学习更多生活技能，提升适应能力，培养独立解决问题的能力。'
                }
            },
            analysis: {
                suggestions: '1. 参与更多学术挑战项目，培养创新思维和批判性思维\n2. 重点提升英语能力，准备标准化语言考试\n3. 深化个人特长发展，在优势领域建立突出表现\n4. 培养独立生活技能，为留学做好准备'
            },
            universities: {
                reach: [
                    { name: '剑桥大学', englishName: 'University of Cambridge', majorDirection: '工科', major: '工程学', location: '英国', logo: 'image/global-universities/University_of_Cambridge.png' },
                    { name: '伦敦帝国学院', englishName: 'Imperial College London', majorDirection: '工科', major: '计算机科学', location: '英国', logo: 'image/global-universities/Imperial_College_London.png' }
                ],
                match: [
                    { name: '曼彻斯特大学', englishName: 'The University of Manchester', majorDirection: '工科', major: '电子工程', location: '英国', logo: 'image/global-universities/The_University_of_Manchester.png' },
                    { name: '伯明翰大学', englishName: 'University of Birmingham', majorDirection: '工科', major: '机械工程', location: '英国', logo: 'image/global-universities/University_of_Birmingham.png' }
                ],
                safety: [
                    { name: '利兹大学', englishName: 'University of Leeds', majorDirection: '工科', major: '土木工程', location: '英国', logo: 'image/global-universities/University_of_Leeds.png' },
                    { name: '谢菲尔德大学', englishName: 'The University of Sheffield', majorDirection: '理科', major: '材料科学', location: '英国', logo: 'image/global-universities/The_University_of_Sheffield.png' }
                ]
            },
            service: {
                title: '高考成绩锁定海外名校！',
                subtitle: '联系我们获取更多高考海外升学资讯及个性化解决方案',
                qrCodeImage: '', // 如果为空则使用默认图片
                contactEmail: 'maerzchen@live.com',
                techSupport: '未名教育'
            }
        }
    };
}

// 初始化报告
function initializeReport() {
    // 设置报告日期
    const currentDate = new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('report-date').textContent = currentDate;
    
    // 填充学生信息
    fillStudentInfo();
    
    // 创建雷达图
    createRadarChart();
    
    // 填充分析和建议
    fillAnalysisAndSuggestions();
    
    // 填充院校推荐
    fillUniversityRecommendations();
    
    // 填充服务引流内容
    fillServiceContent();
    
    // 保存报告到数据库（如果有 surveyId）
    setTimeout(() => {
        saveReportToDatabase();
    }, 1000); // 等待1秒确保所有内容都已渲染
}

// 保存报告到数据库
async function saveReportToDatabase() {
    try {
        const surveyId = localStorage.getItem('currentSurveyId');
        if (!surveyId) {
            console.log('没有找到 surveyId，跳过保存报告');
            return;
        }
        
        // 获取报告HTML内容
        const reportContent = document.getElementById('report-content');
        if (!reportContent) {
            console.error('找不到报告内容元素');
            return;
        }
        
        // 获取完整的HTML（包括样式）
        // 注意：不包含会重新加载数据的脚本，只保存已渲染的静态HTML
        const reportHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>留学潜力报告</title>
    <link rel="stylesheet" href="/styles/report.css">
    <style>
        @import url('https://fonts.loli.net/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', 'Helvetica Neue', Arial, sans-serif !important;
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
</head>
<body>
    ${reportContent.outerHTML}
    <!-- 不包含 report.js，避免重新从 localStorage 加载数据 -->
    <!-- 只保留导出PDF的功能脚本 -->
    <script>
        // 导出PDF功能（简化版本，用于保存到数据库的HTML）
        function exportToPDF() {
            const element = document.getElementById('report-content');
            if (!element) {
                alert('找不到报告内容，无法导出PDF');
                return;
            }
            
            if (typeof html2pdf === 'undefined') {
                alert('PDF导出功能未加载，请刷新页面后重试');
                return;
            }
            
            const actionButtons = document.querySelector('.action-buttons');
            if (actionButtons) {
                actionButtons.style.display = 'none';
            }
            
            const studentName = document.getElementById('student-name')?.textContent || '学生';
            const dateStr = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-');
            const filename = '留学潜力报告_' + studentName + '_' + dateStr + '.pdf';
            
            setTimeout(() => {
                const opt = {
                    margin: [10, 10, 10, 10],
                    filename: filename,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, logging: false },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                    pagebreak: { mode: ['css', 'legacy'], before: '.page-2' }
                };
                
                html2pdf()
                    .set(opt)
                    .from(element)
                    .save()
                    .then(() => {
                        if (actionButtons) {
                            actionButtons.style.display = 'flex';
                        }
                    })
                    .catch(error => {
                        console.error('PDF导出失败:', error);
                        if (actionButtons) {
                            actionButtons.style.display = 'flex';
                        }
                        alert('PDF导出失败，请重试');
                    });
            }, 300);
        }
    </script>
</body>
</html>`;
        
        // 保存到数据库
        const response = await fetch(`/api/surveys/${surveyId}/report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reportHtml })
        });
        
        const result = await response.json();
        if (response.ok) {
            console.log(`报告已保存到数据库（Survey ID: ${surveyId}），状态已更新为已处理`);
            // 注意：不清除 surveyId，因为可能用户会重新生成报告覆盖之前的
            // 只有在成功保存后才保留，这样如果用户重新生成报告，会覆盖之前的报告
            
            // 如果是在管理后台页面，刷新问卷列表以显示最新状态
            if (window.opener && typeof window.opener.loadSurveys === 'function') {
                window.opener.loadSurveys();
            }
        } else {
            console.error('保存报告失败:', result.error);
        }
    } catch (error) {
        console.error('保存报告到数据库错误:', error);
    }
}

// 填充学生基本信息
function fillStudentInfo() {
    const student = reportData.student;
    
    document.getElementById('student-name').textContent = student.studentName || '未填写';
    document.getElementById('student-gender').textContent = student.gender || '未填写';
    document.getElementById('student-grade').textContent = student.grade || '未填写';
    document.getElementById('student-school').textContent = student.school || '未填写';
    document.getElementById('student-subject-group').textContent = student.subjectGroup || '未填写';
    
    // 填充留学区域意向
    fillStudyRegions(student.studyDestination);
    
    // 填充专业方向意向
    fillMajorPreferences(student.majorPreference);
}

// 创建雷达图
function createRadarChart() {
    const ctx = document.getElementById('radarChart').getContext('2d');
    const radar = reportData.admin.radar;
    
    // 填充能力评分显示
    const academicScoreEl = document.getElementById('academic-score');
    const languageScoreEl = document.getElementById('language-score');
    const artisticScoreEl = document.getElementById('artistic-score');
    const socialScoreEl = document.getElementById('social-score');
    
    if (academicScoreEl) {
        academicScoreEl.textContent = `学术能力：${radar.academicAbility || 0}`;
    }
    if (languageScoreEl) {
        languageScoreEl.textContent = `语言能力：${radar.languageAbility || 0}`;
    }
    if (artisticScoreEl) {
        artisticScoreEl.textContent = `文体素养：${radar.artisticQuality || 0}`;
    }
    if (socialScoreEl) {
        socialScoreEl.textContent = `生活能力：${radar.socialAbility || 0}`;
    }
    
    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['学术能力', '语言能力', '文体素养', '生活能力'],
            datasets: [{
                label: '能力评估',
                data: [
                    radar.academicAbility,
                    radar.languageAbility,
                    radar.artisticQuality,
                    radar.socialAbility
                ],
                backgroundColor: 'rgba(43, 108, 176, 0.2)',
                borderColor: 'rgb(43, 108, 176)',
                borderWidth: 3,
                pointBackgroundColor: 'rgb(43, 108, 176)',
                pointBorderColor: '#fff',
                pointBorderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 800
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed.r + '分';
                        }
                    }
                }
            },
            plugins: [{
                afterDraw: function(chart) {
                    const ctx = chart.ctx;
                    const data = chart.data.datasets[0].data;
                    const labels = chart.data.labels;
                    
                    ctx.save();
                    ctx.font = 'bold 10px Georgia, serif';
                    ctx.fillStyle = '#1a365d';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    // 获取雷达图的中心点和半径
                    const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
                    const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;
                    const radius = Math.min(chart.chartArea.right - chart.chartArea.left, chart.chartArea.bottom - chart.chartArea.top) / 2 * 0.8;
                    
                    // 为每个数据点添加分数标签
                    data.forEach((value, index) => {
                        const angle = (index * 2 * Math.PI / data.length) - Math.PI / 2;
                        const x = centerX + Math.cos(angle) * (radius * value / 100);
                        const y = centerY + Math.sin(angle) * (radius * value / 100);
                        
                        // 在数据点上直接显示分数
                        const text = value + '分';
                        const textWidth = ctx.measureText(text).width;
                        const padding = 3;
                        
                        // 绘制背景
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                        ctx.fillRect(x - textWidth/2 - padding, y - 6, textWidth + padding*2, 10);
                        
                        // 绘制边框
                        ctx.strokeStyle = '#2b6cb0';
                        ctx.lineWidth = 0.5;
                        ctx.strokeRect(x - textWidth/2 - padding, y - 6, textWidth + padding*2, 10);
                        
                        // 绘制文字
                        ctx.fillStyle = '#1a365d';
                        ctx.fillText(text, x, y);
                    });
                    
                    ctx.restore();
                }
            }],
            scales: {
                r: {
                    angleLines: {
                        display: true,
                        color: 'rgba(26, 54, 93, 0.2)',
                        lineWidth: 1
                    },
                    grid: {
                        color: 'rgba(26, 54, 93, 0.15)',
                        lineWidth: 1
                    },
                    pointLabels: {
                        font: {
                            size: 14,
                            weight: '600',
                            family: 'Georgia, serif'
                        },
                        color: '#1a365d'
                    },
                    ticks: {
                        display: true,
                        min: 0,
                        max: 100,
                        stepSize: 20,
                        callback: function(value) {
                            return value;
                        },
                        font: {
                            size: 11,
                            family: 'Georgia, serif'
                        },
                        color: '#4a5568'
                    },
                    min: 0,
                    max: 100,
                    beginAtZero: true,
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            elements: {
                line: {
                    tension: 0
                }
            }
        }
    });
}

// 填充分析和建议
function fillAnalysisAndSuggestions() {
    const detailedAnalysis = reportData.admin.detailedAnalysis;
    const overallSuggestions = reportData.admin.analysis?.suggestions || '暂无整体建议内容';
    
    // 填充四维详细分析（优先使用推荐信息录入的分析内容）
    if (detailedAnalysis) {
        // 学术能力（优先使用fullText，否则使用自动生成）
        let academicText = '';
        if (detailedAnalysis.academic && detailedAnalysis.academic.fullText) {
            academicText = detailedAnalysis.academic.fullText;
        } else {
            academicText = generateAcademicAnalysis();
        }
        document.getElementById('academic-analysis').textContent = academicText;
        
        // 语言能力（优先使用fullText，否则使用自动生成）
        let languageText = '';
        if (detailedAnalysis.language && detailedAnalysis.language.fullText) {
            languageText = detailedAnalysis.language.fullText;
        } else {
            languageText = generateLanguageAnalysis();
        }
        document.getElementById('language-analysis').textContent = languageText;
        
        // 文体素养（优先使用fullText，否则使用自动生成）
        let artisticText = '';
        if (detailedAnalysis.artistic && detailedAnalysis.artistic.fullText) {
            artisticText = detailedAnalysis.artistic.fullText;
        } else {
            artisticText = generateArtisticAnalysis();
        }
        document.getElementById('artistic-analysis').textContent = artisticText;
        
        // 生活能力（优先使用fullText，否则使用自动生成）
        let socialText = '';
        if (detailedAnalysis.social && detailedAnalysis.social.fullText) {
            socialText = detailedAnalysis.social.fullText;
        } else {
            socialText = generateSocialAnalysis();
        }
        document.getElementById('social-analysis').textContent = socialText;
        
    }
    
    // 填充整体建议
    document.getElementById('suggestions-content').textContent = overallSuggestions;
}

// 生成合并的分析文本
function generateMergedAnalysis(strengths, weaknesses, suggestions) {
    let mergedText = '';
    
    // 添加优势部分
    if (strengths && strengths !== '暂无优势内容') {
        mergedText += `在优势方面，${strengths}`;
    }
    
    // 添加不足部分
    if (weaknesses && weaknesses !== '暂无不足内容') {
        if (mergedText) {
            mergedText += '。';
        }
        mergedText += `在需要改进的方面，${weaknesses}`;
    }
    
    // 添加建议部分
    if (suggestions && suggestions !== '暂无建议内容') {
        if (mergedText) {
            mergedText += '。';
        }
        mergedText += `建议${suggestions}`;
    }
    
    // 如果没有内容，返回默认文本
    if (!mergedText) {
        mergedText = '该维度的详细分析内容正在生成中，请稍后查看。';
    }
    
    return mergedText;
}

// 生成学术能力详细分析
function generateAcademicAnalysis() {
    const student = reportData.student;
    const academicAbility = reportData.admin.radar.academicAbility || 75;
    
    // 获取预测成绩数据
    const predictedScores = student.predictedScores || [];
    const subjectNames = ['语文', '数学', '英语', '物理', '生物', '化学', '历史', '政治', '地理'];
    
    // 过滤出学生实际选择的科目（非0分）
    const selectedSubjects = predictedScores
        .map((score, index) => ({ name: subjectNames[index], score: score.score }))
        .filter(subject => subject.score > 0);
    
    // 基于学术能力值的分析
    let abilityAnalysis = '';
    if (academicAbility >= 90) {
        abilityAnalysis = '学术能力卓越，具备顶尖的学习潜力和研究能力';
    } else if (academicAbility >= 80) {
        abilityAnalysis = '学术能力优秀，具备较强的学科思维和问题解决能力';
    } else if (academicAbility >= 70) {
        abilityAnalysis = '学术能力良好，基础知识扎实，具备一定的学习潜力';
    } else if (academicAbility >= 60) {
        abilityAnalysis = '学术能力中等，需要加强基础知识的巩固和提升';
    } else {
        abilityAnalysis = '学术能力有待提升，建议加强基础学科的学习';
    }
    
    // 基于预测成绩的分析
    let scoreAnalysis = '';
    if (selectedSubjects.length > 0) {
        const avgScore = selectedSubjects.reduce((sum, subject) => sum + subject.score, 0) / selectedSubjects.length;
        const highScoreSubjects = selectedSubjects.filter(subject => subject.score >= 130);
        const lowScoreSubjects = selectedSubjects.filter(subject => subject.score < 100);
        
        scoreAnalysis = `在${selectedSubjects.length}门主要科目中，平均成绩为${avgScore.toFixed(1)}分`;
        
        if (highScoreSubjects.length > 0) {
            const highSubjectNames = highScoreSubjects.map(s => s.name).join('、');
            scoreAnalysis += `，其中${highSubjectNames}表现突出`;
        }
        
        if (lowScoreSubjects.length > 0) {
            const lowSubjectNames = lowScoreSubjects.map(s => s.name).join('、');
            scoreAnalysis += `，${lowSubjectNames}需要加强`;
        }
    }
    
    // 生成建议
    let suggestions = '';
    if (academicAbility >= 80) {
        suggestions = '建议挑战更高难度的学术内容，参与学科竞赛和科研项目';
    } else if (academicAbility >= 60) {
        suggestions = '建议加强基础学科学习，多做练习题，可考虑参加补习班';
    } else {
        suggestions = '建议从基础开始系统学习，制定详细的学习计划，寻求专业指导';
    }
    
    // 合并分析文本
    let mergedText = '';
    if (abilityAnalysis) {
        mergedText += abilityAnalysis;
    }
    
    if (scoreAnalysis) {
        if (mergedText) mergedText += '。';
        mergedText += scoreAnalysis;
    }
    
    if (suggestions) {
        if (mergedText) mergedText += '。';
        mergedText += `建议${suggestions}`;
    }
    
    return mergedText || '学术能力分析内容正在生成中，请稍后查看。';
}

// 生成语言能力详细分析
function generateLanguageAnalysis() {
    const student = reportData.student;
    const languageAbility = reportData.admin.radar.languageAbility || 70;
    const englishTestType = student.englishTestType || '';
    const predictedEnglish = student.predictedEnglish || 0;
    const studyDestination = student.studyDestination || '';
    
    let analysis = '';
    
    // 基于语言能力值的总体评价
    if (languageAbility >= 90) {
        analysis = '语言能力出色，英语水平接近母语水平，能够自如应对各种语言场景';
    } else if (languageAbility >= 80) {
        analysis = '语言能力良好，能够流利进行英语交流，具备较强的语言学习能力';
    } else if (languageAbility >= 70) {
        analysis = '英语基础较好，能够进行基本的英语交流，阅读理解能力不错';
    } else if (languageAbility >= 60) {
        analysis = '具备基本的中文表达能力，英语水平有限，需要大幅提升';
    } else {
        analysis = '语言基础薄弱，听说读写能力都需要系统提升';
    }
    
    // 根据不同的英语考试类型进行详细分析
    if (englishTestType === '雅思') {
        const totalScore = parseFloat(student.englishTotalScore) || 0;
        
        if (totalScore > 0) {
            analysis += `。雅思总分${totalScore}分`;
            
            // 按照新的6档标准进行分档
            let levelComment = '';
            if (totalScore >= 8.0) {
                levelComment = '学生能够轻松理解几乎所有听到或读到的内容。能够概括来自不同口头和书面来源的信息，并以连贯的方式重构论点和叙述。能够自如、流利且准确地表达自己，即使在复杂、不清晰的情况下也能区分细微的含义。';
            } else if (totalScore >= 7.0) {
                levelComment = '学生能够理解各种难度较高的长篇文章，并能理解文章的隐含含义。能够流利、自然地表达自己，无需刻意寻找表达方式。能够灵活有效地运用语言进行社交、学术和职业交流。能够就复杂主题撰写清晰、结构良好、内容详尽的文本，并能熟练运用各种语言组织方式、连接词和衔接手段。';
            } else if (totalScore >= 6.0) {
                levelComment = '学生能够理解关于具体和抽象主题的复杂文本的主要思想，包括其专业领域级别的讨论。能够自发地，且以一定的口语流利度进行交流，从而能够与母语者进行日常沟通，且不会给双方带来任何压力。能够就广泛的不同主题撰写清晰、详细的文本，并阐述对某个热门话题的观点，并列举各种方案的优缺点。';
            } else if (totalScore >= 5.0) {
                levelComment = '学生能够理解清晰列出的、速度偏慢的涉及工作、学习、休闲等日常常见话题内容要点。能够就熟悉或个人感兴趣的话题撰写简单连贯的文字。能够简单描述与自我相关的经历、事件、梦想、希望、观点和计划等，并简要给出相关的理由与解释。';
            } else if (totalScore >= 4.0) {
                levelComment = '学生能够理解非常基本的个人和家庭信息、购物、当地地理、就业等相关的句子和常用表达。能够就简单日常的任务进行交流。能够用简单的术语描述自己的背景、周围环境以及急需解决的问题。';
            } else {
                levelComment = '学生能够理解并使用简单的的日常表达和非常基本的短语来满足具体类型的需求。能够自我介绍和他人介绍，并能够询问和回答有关个人信息的问题，例如居住地、认识的人以及拥有的物品。能够进行简单的互动，前提是对方说话缓慢清晰，并愿意提供帮助。';
            }
            
            analysis += `，${levelComment}`;
        }
    } else if (englishTestType === '托福') {
        const totalScore = parseFloat(student.englishTotalScore) || 0;
        
        if (totalScore > 0) {
            analysis += `。托福总分${totalScore}分`;
            
            // 按照新的6档标准进行分档
            let levelComment = '';
            if (totalScore >= 114) {
                levelComment = '学生能够轻松理解几乎所有听到或读到的内容。能够概括来自不同口头和书面来源的信息，并以连贯的方式重构论点和叙述。能够自如、流利且准确地表达自己，即使在复杂、不清晰的情况下也能区分细微的含义。';
            } else if (totalScore >= 95) {
                levelComment = '学生能够理解各种难度较高的长篇文章，并能理解文章的隐含含义。能够流利、自然地表达自己，无需刻意寻找表达方式。能够灵活有效地运用语言进行社交、学术和职业交流。能够就复杂主题撰写清晰、结构良好、内容详尽的文本，并能熟练运用各种语言组织方式、连接词和衔接手段。';
            } else if (totalScore >= 72) {
                levelComment = '学生能够理解关于具体和抽象主题的复杂文本的主要思想，包括其专业领域级别的讨论。能够自发地，且以一定的口语流利度进行交流，从而能够与母语者进行日常沟通，且不会给双方带来任何压力。能够就广泛的不同主题撰写清晰、详细的文本，并阐述对某个热门话题的观点，并列举各种方案的优缺点。';
            } else if (totalScore >= 44) {
                levelComment = '学生能够理解清晰列出的、速度偏慢的涉及工作、学习、休闲等日常常见话题内容要点。能够就熟悉或个人感兴趣的话题撰写简单连贯的文字。能够简单描述与自我相关的经历、事件、梦想、希望、观点和计划等，并简要给出相关的理由与解释。';
            } else if (totalScore >= 24) {
                levelComment = '学生能够理解非常基本的个人和家庭信息、购物、当地地理、就业等相关的句子和常用表达。能够就简单日常的任务进行交流。能够用简单的术语描述自己的背景、周围环境以及急需解决的问题。';
            } else {
                levelComment = '学生能够理解并使用简单的的日常表达和非常基本的短语来满足具体类型的需求。能够自我介绍和他人介绍，并能够询问和回答有关个人信息的问题，例如居住地、认识的人以及拥有的物品。能够进行简单的互动，前提是对方说话缓慢清晰，并愿意提供帮助。';
            }
            
            analysis += `，${levelComment}`;
        }
    } else if (englishTestType === 'PTE') {
        const totalScore = parseFloat(student.englishTotalScore) || 0;
        
        if (totalScore > 0) {
            analysis += `。PTE总分${totalScore}分`;
            
            // 按照新的6档标准进行分档
            let levelComment = '';
            if (totalScore >= 85) {
                levelComment = '学生能够轻松理解几乎所有听到或读到的内容。能够概括来自不同口头和书面来源的信息，并以连贯的方式重构论点和叙述。能够自如、流利且准确地表达自己，即使在复杂、不清晰的情况下也能区分细微的含义。';
            } else if (totalScore >= 76) {
                levelComment = '学生能够理解各种难度较高的长篇文章，并能理解文章的隐含含义。能够流利、自然地表达自己，无需刻意寻找表达方式。能够灵活有效地运用语言进行社交、学术和职业交流。能够就复杂主题撰写清晰、结构良好、内容详尽的文本，并能熟练运用各种语言组织方式、连接词和衔接手段。';
            } else if (totalScore >= 59) {
                levelComment = '学生能够理解关于具体和抽象主题的复杂文本的主要思想，包括其专业领域级别的讨论。能够自发地，且以一定的口语流利度进行交流，从而能够与母语者进行日常沟通，且不会给双方带来任何压力。能够就广泛的不同主题撰写清晰、详细的文本，并阐述对某个热门话题的观点，并列举各种方案的优缺点。';
            } else if (totalScore >= 43) {
                levelComment = '学生能够理解清晰列出的、速度偏慢的涉及工作、学习、休闲等日常常见话题内容要点。能够就熟悉或个人感兴趣的话题撰写简单连贯的文字。能够简单描述与自我相关的经历、事件、梦想、希望、观点和计划等，并简要给出相关的理由与解释。';
            } else if (totalScore >= 30) {
                levelComment = '学生能够理解非常基本的个人和家庭信息、购物、当地地理、就业等相关的句子和常用表达。能够就简单日常的任务进行交流。能够用简单的术语描述自己的背景、周围环境以及急需解决的问题。';
            } else {
                levelComment = '学生能够理解并使用简单的的日常表达和非常基本的短语来满足具体类型的需求。能够自我介绍和他人介绍，并能够询问和回答有关个人信息的问题，例如居住地、认识的人以及拥有的物品。能够进行简单的互动，前提是对方说话缓慢清晰，并愿意提供帮助。';
            }
            
            analysis += `，${levelComment}`;
        }
    } else if (englishTestType === '多邻国') {
        const totalScore = parseFloat(student.englishTotalScore) || 0;
        
        if (totalScore > 0) {
            analysis += `。多邻国总分${totalScore}分`;
            
            // 按照新的6档标准进行分档
            let levelComment = '';
            if (totalScore >= 151) {
                levelComment = '学生能够轻松理解几乎所有听到或读到的内容。能够概括来自不同口头和书面来源的信息，并以连贯的方式重构论点和叙述。能够自如、流利且准确地表达自己，即使在复杂、不清晰的情况下也能区分细微的含义。';
            } else if (totalScore >= 130) {
                levelComment = '学生能够理解各种难度较高的长篇文章，并能理解文章的隐含含义。能够流利、自然地表达自己，无需刻意寻找表达方式。能够灵活有效地运用语言进行社交、学术和职业交流。能够就复杂主题撰写清晰、结构良好、内容详尽的文本，并能熟练运用各种语言组织方式、连接词和衔接手段。';
            } else if (totalScore >= 100) {
                levelComment = '学生能够理解关于具体和抽象主题的复杂文本的主要思想，包括其专业领域级别的讨论。能够自发地，且以一定的口语流利度进行交流，从而能够与母语者进行日常沟通，且不会给双方带来任何压力。能够就广泛的不同主题撰写清晰、详细的文本，并阐述对某个热门话题的观点，并列举各种方案的优缺点。';
            } else if (totalScore >= 60) {
                levelComment = '学生能够理解清晰列出的、速度偏慢的涉及工作、学习、休闲等日常常见话题内容要点。能够就熟悉或个人感兴趣的话题撰写简单连贯的文字。能够简单描述与自我相关的经历、事件、梦想、希望、观点和计划等，并简要给出相关的理由与解释。';
            } else if (totalScore >= 40) {
                levelComment = '学生能够理解非常基本的个人和家庭信息、购物、当地地理、就业等相关的句子和常用表达。能够就简单日常的任务进行交流。能够用简单的术语描述自己的背景、周围环境以及急需解决的问题。';
            } else {
                levelComment = '学生能够理解并使用简单的的日常表达和非常基本的短语来满足具体类型的需求。能够自我介绍和他人介绍，并能够询问和回答有关个人信息的问题，例如居住地、认识的人以及拥有的物品。能够进行简单的互动，前提是对方说话缓慢清晰，并愿意提供帮助。';
            }
            
            analysis += `，${levelComment}`;
        }
    } else if (englishTestType === '暂无') {
        // 根据预测英语成绩分析
        if (predictedEnglish > 0) {
            analysis += `。预测高考英语成绩${predictedEnglish}分`;
            
            if (predictedEnglish >= 140) {
                analysis += '，英语基础扎实，具备良好的语言学习能力';
            } else if (predictedEnglish >= 130) {
                analysis += '，英语基础较好，具备一定的语言学习潜力';
            } else if (predictedEnglish >= 120) {
                analysis += '，英语基础中等，需要加强系统学习';
            } else if (predictedEnglish >= 110) {
                analysis += '，英语基础一般，需要重点提升';
            } else {
                analysis += '，英语基础薄弱，需要从基础开始系统学习';
            }
        }
    }
    
    // 根据留学意向推荐语言考试
    if (studyDestination) {
        const destinations = studyDestination.split(/[,，;；┋]/).map(d => d.trim()).filter(d => d);
        const recommendedTests = [];
        
        destinations.forEach(destination => {
            if (destination.includes('美国') || destination.includes('加拿大')) {
                recommendedTests.push('托福');
            } else if (destination.includes('英国') || destination.includes('澳大利亚') || destination.includes('新西兰')) {
                recommendedTests.push('雅思');
            } else if (destination.includes('新加坡')) {
                recommendedTests.push('雅思或托福');
            } else if (destination.includes('香港') || destination.includes('澳门')) {
                recommendedTests.push('雅思或托福');
            }
        });
        
        if (recommendedTests.length > 0) {
            const uniqueTests = [...new Set(recommendedTests)];
            analysis += `。建议根据意向地区准备${uniqueTests.join('、')}考试`;
        }
    }
    
    return analysis || '语言能力分析内容正在生成中，请稍后查看。';
}

// 生成文体素养详细分析
function generateArtisticAnalysis() {
    const student = reportData.student;
    const artisticQuality = reportData.admin.radar.artisticQuality || 80;
    
    let analysis = '';
    
    // 基于文体素养分数的总体评价
    if (artisticQuality >= 90) {
        analysis = '文体素养卓越，在艺术、体育、文化等方面表现突出，具备丰富的兴趣爱好和才艺特长';
    } else if (artisticQuality >= 80) {
        analysis = '文体素养优秀，具备良好的艺术感知力和体育素养，有稳定的兴趣爱好';
    } else if (artisticQuality >= 70) {
        analysis = '文体素养良好，在文体活动方面有一定参与度，具备基本的艺术和体育基础';
    } else if (artisticQuality >= 60) {
        analysis = '文体素养中等，在文体活动方面参与度一般，需要更多培养和锻炼';
    } else {
        analysis = '文体素养有待提升，在艺术、体育、文化等方面的参与度和兴趣需要加强';
    }
    
    // 针对出国留学的建议
    let suggestions = '';
    if (artisticQuality >= 80) {
        suggestions = '建议在留学申请中突出文体特长，参与国际文化交流活动，申请艺术类或体育类奖学金';
    } else if (artisticQuality >= 70) {
        suggestions = '建议培养1-2项文体特长，参与学校社团活动，为留学申请增加亮点';
    } else if (artisticQuality >= 60) {
        suggestions = '建议积极参加文体活动，培养兴趣爱好，提升综合素质，为留学生活做准备';
    } else {
        suggestions = '建议从基础开始培养文体兴趣，参加学校社团，逐步提升艺术和体育素养';
    }
    
    // 合并分析文本
    if (suggestions) {
        analysis += `。${suggestions}`;
    }
    
    return analysis || '文体素养分析内容正在生成中，请稍后查看。';
}

// 生成生活能力详细分析
function generateSocialAnalysis() {
    const student = reportData.student;
    const socialAbility = reportData.admin.radar.socialAbility || 85;
    
    let analysis = '';
    
    // 基于生活能力分数的总体评价
    if (socialAbility >= 90) {
        analysis = '生活能力卓越，具备出色的自理能力和生活管理技能，能够完全独立应对留学生活';
    } else if (socialAbility >= 80) {
        analysis = '生活能力优秀，具备良好的自理能力和时间管理能力，能够较好地适应独立生活';
    } else if (socialAbility >= 70) {
        analysis = '生活能力良好，具备基本的自理能力，能够应对大部分日常生活需求';
    } else if (socialAbility >= 60) {
        analysis = '生活能力中等，在自理能力方面有一定基础，但需要进一步提升生活技能';
    } else {
        analysis = '生活能力有待提升，在自理能力和生活管理方面需要更多学习和实践';
    }
    
    // 针对出国留学的建议
    let suggestions = '';
    if (socialAbility >= 80) {
        suggestions = '建议继续保持良好的生活习惯，学习财务管理，为独立留学生活做好充分准备';
    } else if (socialAbility >= 70) {
        suggestions = '建议学习基本的生活技能，如烹饪、洗衣、理财等，提升独立生活能力';
    } else if (socialAbility >= 60) {
        suggestions = '建议从基础生活技能开始学习，培养良好的生活习惯，逐步提升自理能力';
    } else {
        suggestions = '建议系统学习生活技能，培养独立意识，为未来的留学生活做好准备';
    }
    
    // 合并分析文本
    if (suggestions) {
        analysis += `。${suggestions}`;
    }
    
    return analysis || '生活能力分析内容正在生成中，请稍后查看。';
}


// 填充院校推荐
function fillUniversityRecommendations() {
    const universities = reportData.admin.universities;
    
    // 冲刺院校
    fillUniversityCategory('reach-universities', universities.reach || []);
    
    // 稳妥院校
    fillUniversityCategory('match-universities', universities.match || []);
    
    // 保底院校
    fillUniversityCategory('safety-universities', universities.safety || []);
}

// 获取国家旗帜emoji
function getCountryFlag(location) {
    const flagMap = {
        '美国': '🇺🇸',
        '英国': '🇬🇧',
        '加拿大': '🇨🇦',
        '澳大利亚': '🇦🇺',
        '德国': '🇩🇪',
        '法国': '🇫🇷',
        '日本': '🇯🇵',
        '韩国': '🇰🇷',
        '新加坡': '🇸🇬',
        '中国香港': '🇭🇰',
        '中国大陆': '🇨🇳',
        '中国台湾': '🇹🇼',
        '荷兰': '🇳🇱',
        '瑞士': '🇨🇭',
        '瑞典': '🇸🇪',
        '丹麦': '🇩🇰',
        '挪威': '🇳🇴',
        '芬兰': '🇫🇮',
        '意大利': '🇮🇹',
        '西班牙': '🇪🇸',
        '爱尔兰': '🇮🇪',
        '新西兰': '🇳🇿',
        '马来西亚': '🇲🇾',
        '泰国': '🇹🇭',
        '印度': '🇮🇳',
        '巴西': '🇧🇷',
        '阿根廷': '🇦🇷',
        '智利': '🇨🇱',
        '墨西哥': '🇲🇽',
        '俄罗斯': '🇷🇺',
        '波兰': '🇵🇱',
        '捷克': '🇨🇿',
        '匈牙利': '🇭🇺',
        '奥地利': '🇦🇹',
        '比利时': '🇧🇪',
        '葡萄牙': '🇵🇹',
        '希腊': '🇬🇷',
        '土耳其': '🇹🇷',
        '以色列': '🇮🇱',
        '阿联酋': '🇦🇪',
        '沙特阿拉伯': '🇸🇦',
        '南非': '🇿🇦',
        '埃及': '🇪🇬',
        '摩洛哥': '🇲🇦',
        '肯尼亚': '🇰🇪',
        '尼日利亚': '🇳🇬',
        '加纳': '🇬🇭',
        '埃塞俄比亚': '🇪🇹',
        '坦桑尼亚': '🇹🇿',
        '乌干达': '🇺🇬',
        '卢旺达': '🇷🇼',
        '塞内加尔': '🇸🇳',
        '科特迪瓦': '🇨🇮',
        '马里': '🇲🇱',
        '布基纳法索': '🇧🇫',
        '尼日尔': '🇳🇪',
        '乍得': '🇹🇩',
        '中非': '🇨🇫',
        '喀麦隆': '🇨🇲',
        '刚果': '🇨🇬',
        '刚果民主共和国': '🇨🇩',
        '加蓬': '🇬🇦',
        '赤道几内亚': '🇬🇶',
        '圣多美和普林西比': '🇸🇹',
        '安哥拉': '🇦🇴',
        '赞比亚': '🇿🇲',
        '津巴布韦': '🇿🇼',
        '博茨瓦纳': '🇧🇼',
        '纳米比亚': '🇳🇦',
        '莱索托': '🇱🇸',
        '斯威士兰': '🇸🇿',
        '马拉维': '🇲🇼',
        '莫桑比克': '🇲🇿',
        '马达加斯加': '🇲🇬',
        '毛里求斯': '🇲🇺',
        '塞舌尔': '🇸🇨',
        '科摩罗': '🇰🇲',
        '马约特': '🇾🇹',
        '留尼汪': '🇷🇪',
        '圣赫勒拿': '🇸🇭',
        '阿森松岛': '🇦🇨',
        '特里斯坦-达库尼亚': '🇹🇦'
    };
    return flagMap[location] || '🌍';
}

// 获取专业方向样式类
function getMajorDirectionClass(majorDirection) {
    const classMap = {
        '建筑': 'architecture',
        '理科': 'science',
        '工科': 'engineering',
        '商科': 'business',
        '文科': 'liberal-arts',
        '医护': 'medical',
        '音乐': 'music',
        '美术': 'art',
        '其他': 'other'
    };
    return classMap[majorDirection] || 'other';
}

// 根据大学名称查找实际的 logo 路径
function findUniversityLogo(universityName, englishName) {
    // 尝试从全局作用域获取 QS_TOP_UNIVERSITIES
    // 优先使用 main.js 中加载的数据，否则使用 window.QS_TOP_UNIVERSITIES
    let universities = null;
    
    // 尝试从 main.js 的全局变量获取（如果已加载）
    if (typeof window !== 'undefined') {
        // 检查是否有从API或JS文件加载的数据
        if (window.QS_TOP_UNIVERSITIES && Array.isArray(window.QS_TOP_UNIVERSITIES) && window.QS_TOP_UNIVERSITIES.length > 0) {
            universities = window.QS_TOP_UNIVERSITIES;
        }
    }
    
    // 如果还是没有，尝试从模块导出获取（Node.js环境）
    if (!universities && typeof QS_TOP_UNIVERSITIES !== 'undefined' && Array.isArray(QS_TOP_UNIVERSITIES)) {
        universities = QS_TOP_UNIVERSITIES;
    }
    
    if (universities && Array.isArray(universities)) {
        // 先尝试用中文名查找
        if (universityName) {
            const foundByChinese = universities.find(u => 
                u.chineseName === universityName || u.name === universityName
            );
            if (foundByChinese && foundByChinese.logo) {
                return getAbsoluteImagePath(foundByChinese.logo);
            }
        }
        
        // 再尝试用英文名查找
        if (englishName) {
            const foundByEnglish = universities.find(u => 
                u.name === englishName || u.chineseName === englishName
            );
            if (foundByEnglish && foundByEnglish.logo) {
                return getAbsoluteImagePath(foundByEnglish.logo);
            }
        }
    }
    return '';
}

// 将相对路径转换为绝对路径
function getAbsoluteImagePath(relativePath) {
    if (!relativePath || typeof relativePath !== 'string') {
        return '';
    }
    
    // 去除首尾空格
    const trimmedPath = relativePath.trim();
    if (!trimmedPath) {
        return '';
    }
    
    // 如果是 placeholder URL，返回空字符串（使用默认显示）
    if (trimmedPath.includes('via.placeholder.com') || trimmedPath.includes('placeholder')) {
        return '';
    }
    
    // 如果已经是绝对路径（以 http:// 或 https:// 或 / 开头），直接返回
    if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://') || trimmedPath.startsWith('/')) {
        return trimmedPath;
    }
    
    // 将相对路径转换为绝对路径（以 / 开头）
    // 确保路径以 / 开头，并且去除开头的 ./ 或 ./
    const cleanPath = trimmedPath.replace(/^\.\//, '').replace(/^\.\\/, '');
    return '/' + cleanPath;
}

// 填充单个院校类别
function fillUniversityCategory(containerId, universityList) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    universityList.forEach(university => {
        const universityItem = document.createElement('div');
        universityItem.className = 'university-item';
        
        // 将图片路径转换为绝对路径
        let logoPath = '';
        if (university.logo && typeof university.logo === 'string' && university.logo.trim() !== '') {
            logoPath = getAbsoluteImagePath(university.logo.trim());
        }
        
        // 如果 logoPath 为空（可能是 placeholder URL 或空值），尝试根据大学名称查找
        if (!logoPath && (university.name || university.englishName)) {
            logoPath = findUniversityLogo(university.name, university.englishName);
        }
        
        // 调试信息（生产环境可删除）
        if (logoPath) {
            console.log(`[Report] 大学: ${university.name}, Logo路径: ${logoPath}, 原始路径: ${university.logo}`);
        } else {
            console.log(`[Report] 大学: ${university.name}, 未找到Logo，将显示默认文本`);
        }
        
        const logoElement = logoPath && logoPath.trim() !== ''
            ? `<img src="${logoPath}" alt="${university.name || ''}" class="university-logo" onerror="console.error('图片加载失败:', '${logoPath}'); this.style.display='none';">`
            : `<div class="university-logo">${university.name ? university.name.substring(0, 2) : ''}</div>`;
        
        const displayName = university.name || '未填写';
        const englishName = university.englishName || '';
        const nameWithEnglish = englishName ? `${displayName} (${englishName})` : displayName;
        
        universityItem.innerHTML = `
            ${logoElement}
            <div class="university-info">
                <h4>${displayName}<span class="english-name">${englishName ? ` (${englishName})` : ''}</span></h4>
                <div class="major">${university.major || '未填写'}</div>
                <div class="university-meta">
                    <div class="meta-item location-meta">
                        <span class="meta-label">国家/地区：</span>
                        <span class="meta-value">${university.location || '未填写'}</span>
                        <span class="country-flag">${getCountryFlag(university.location)}</span>
                    </div>
                    <div class="meta-item direction-meta">
                        <span class="meta-label">专业方向：</span>
                        <span class="meta-value major-direction-tag major-direction-${getMajorDirectionClass(university.majorDirection)}">${university.majorDirection || '未填写'}</span>
                    </div>
                </div>
                <div class="reason">${university.reason || '暂无推荐理由'}</div>
            </div>
        `;
        
        container.appendChild(universityItem);
    });
}

// 填充服务引流内容
function fillServiceContent() {
    const service = reportData.admin.service;
    
    // 设置标题（可配置）
    document.getElementById('service-title').textContent = service.title || '高考成绩锁定海外名校！';
    
    // 设置副标题（可配置）
    document.getElementById('service-subtitle').textContent = service.subtitle || '联系我们获取更多高考海外升学资讯及个性化解决方案';
    
    // 设置二维码图片（可配置，默认使用默认图片）
    const qrCodeImg = document.getElementById('qr-code-image');
    if (service.qrCodeImage) {
        qrCodeImg.src = getAbsoluteImagePath(service.qrCodeImage);
    } else {
        qrCodeImg.src = getAbsoluteImagePath('image/default-qr.png');
    }
    
    // 设置联系邮箱（可配置）
    document.getElementById('contact-email').textContent = service.contactEmail || 'maerzchen@live.com';
    
    // 设置技术支持信息（可配置）
    const techSupport = service.techSupport || '未名教育';
    document.getElementById('tech-support').textContent = `本报告技术支持由 ${techSupport} 提供`;
}

// 导出PDF（重写版本）
function exportToPDF() {
    const element = document.getElementById('report-content');
    if (!element) {
        alert('找不到报告内容，无法导出PDF');
        return;
    }
    
    // 检查html2pdf是否已加载
    if (typeof html2pdf === 'undefined') {
        alert('PDF导出功能未加载，请刷新页面后重试');
        return;
    }
    
    // 隐藏操作按钮
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        actionButtons.style.display = 'none';
    }
    
    // 获取学生姓名用于文件名
    const studentName = reportData?.student?.studentName || '学生';
    const dateStr = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-');
    const filename = `留学潜力报告_${studentName}_${dateStr}.pdf`;
    
    // 等待一小段时间确保页面完全渲染
    setTimeout(() => {
        // 为PDF导出优化样式
        const originalContainerStyle = element.style.cssText;
        element.style.width = '210mm';
        element.style.margin = '0 auto';
        
        // 确保页面元素有正确的分页标记
        const page1 = element.querySelector('.page-1');
        const page2 = element.querySelector('.page-2');
        const page3 = element.querySelector('.page-3');
        const page4 = element.querySelector('.page-4');
        
        if (page1) {
            page1.style.pageBreakAfter = 'always';
            page1.style.breakAfter = 'page';
        }
        if (page2) {
            page2.style.pageBreakBefore = 'always';
            page2.style.pageBreakAfter = 'always';
            page2.style.breakBefore = 'page';
            page2.style.breakAfter = 'page';
        }
        if (page3) {
            page3.style.pageBreakBefore = 'always';
            page3.style.pageBreakAfter = 'always';
            page3.style.breakBefore = 'page';
            page3.style.breakAfter = 'page';
        }
        if (page4) {
            page4.style.pageBreakBefore = 'always';
            page4.style.breakBefore = 'page';
        }
        
        // PDF导出配置
        const opt = {
            margin: [0, 0, 0, 0],
            filename: filename,
            image: { 
                type: 'jpeg', 
                quality: 0.95 
            },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                letterRendering: true,
                scrollX: 0,
                scrollY: 0
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { 
                mode: ['avoid-all', 'css'],
                before: ['.page-2', '.page-3', '.page-4'],
                after: ['.page-1', '.page-2', '.page-3'],
                avoid: ['.page']
            }
        };
        
        // 显示加载提示
        const loadingMsg = document.createElement('div');
        loadingMsg.id = 'pdf-loading';
        loadingMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px 40px; border-radius: 8px; z-index: 10000; font-size: 16px;';
        loadingMsg.textContent = '正在生成PDF，请稍候...';
        document.body.appendChild(loadingMsg);
        
        // 执行PDF导出
        html2pdf()
            .set(opt)
            .from(element)
            .save()
            .then(() => {
                // 恢复原始样式
                element.style.cssText = originalContainerStyle;
                if (page1) {
                    page1.style.pageBreakAfter = '';
                    page1.style.breakAfter = '';
                }
                if (page2) {
                    page2.style.pageBreakBefore = '';
                    page2.style.pageBreakAfter = '';
                    page2.style.breakBefore = '';
                    page2.style.breakAfter = '';
                }
                if (page3) {
                    page3.style.pageBreakBefore = '';
                    page3.style.pageBreakAfter = '';
                    page3.style.breakBefore = '';
                    page3.style.breakAfter = '';
                }
                if (page4) {
                    page4.style.pageBreakBefore = '';
                    page4.style.breakBefore = '';
                }
                
                // 移除加载提示
                const loading = document.getElementById('pdf-loading');
                if (loading) {
                    loading.remove();
                }
                
                // 恢复显示操作按钮
                if (actionButtons) {
                    actionButtons.style.display = 'flex';
                }
                
                console.log('PDF导出成功');
            })
            .catch(error => {
                console.error('PDF导出失败:', error);
                
                // 恢复原始样式
                element.style.cssText = originalContainerStyle;
                if (page1) {
                    page1.style.pageBreakAfter = '';
                    page1.style.breakAfter = '';
                }
                if (page2) {
                    page2.style.pageBreakBefore = '';
                    page2.style.pageBreakAfter = '';
                    page2.style.breakBefore = '';
                    page2.style.breakAfter = '';
                }
                if (page3) {
                    page3.style.pageBreakBefore = '';
                    page3.style.pageBreakAfter = '';
                    page3.style.breakBefore = '';
                    page3.style.breakAfter = '';
                }
                if (page4) {
                    page4.style.pageBreakBefore = '';
                    page4.style.breakBefore = '';
                }
                
                // 移除加载提示
                const loading = document.getElementById('pdf-loading');
                if (loading) {
                    loading.remove();
                }
                
                // 恢复显示操作按钮
                if (actionButtons) {
                    actionButtons.style.display = 'flex';
                }
                
                alert('PDF导出失败：' + (error.message || '未知错误，请重试'));
            });
    }, 500);
}

// 导出4张图片（分别导出每一页）
async function exportToImages() {
    const element = document.getElementById('report-content');
    if (!element) {
        alert('找不到报告内容，无法导出图片');
        return;
    }
    
    // 检查html2canvas是否可用
    if (typeof html2canvas === 'undefined') {
        alert('图片导出功能未加载，请刷新页面后重试');
        return;
    }
    
    // 隐藏操作按钮
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        actionButtons.style.display = 'none';
    }
    
    // 获取学生姓名用于文件名
    const studentName = reportData?.student?.studentName || '学生';
    const dateStr = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-');
    
    // 获取4个页面元素
    const page1 = element.querySelector('.page-1');
    const page2 = element.querySelector('.page-2');
    const page3 = element.querySelector('.page-3');
    const page4 = element.querySelector('.page-4');
    
    if (!page1 || !page2 || !page3 || !page4) {
        alert('找不到页面内容，无法导出图片');
        if (actionButtons) {
            actionButtons.style.display = 'flex';
        }
        return;
    }
    
    // 显示加载提示
    const loadingMsg = document.createElement('div');
    loadingMsg.id = 'image-loading';
    loadingMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px 40px; border-radius: 8px; z-index: 10000; font-size: 16px;';
    loadingMsg.textContent = '正在生成图片，请稍候...';
    document.body.appendChild(loadingMsg);
    
    try {
        const pages = [
            { element: page1, name: '第1页', pageNum: 1 },
            { element: page2, name: '第2页', pageNum: 2 },
            { element: page3, name: '第3页', pageNum: 3 },
            { element: page4, name: '第4页', pageNum: 4 }
        ];
        
        // 保存原始样式
        const originalContainerStyle = element.style.cssText;
        element.style.width = '210mm';
        element.style.margin = '0 auto';
        
        // 依次导出每一页
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            loadingMsg.textContent = `正在生成${page.name}... (${i + 1}/4)`;
            
            // 等待一小段时间确保渲染完成
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // 使用html2canvas生成图片
            const canvas = await html2canvas(page.element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                letterRendering: true,
                scrollX: 0,
                scrollY: 0,
                backgroundColor: '#ffffff'
            });
            
            // 将canvas转换为图片并下载
            const imgData = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.download = `留学潜力报告_${studentName}_${dateStr}_${page.name}.png`;
            link.href = imgData;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 等待一小段时间再处理下一页
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // 恢复原始样式
        element.style.cssText = originalContainerStyle;
        
        // 移除加载提示
        loadingMsg.remove();
        
        // 恢复显示操作按钮
        if (actionButtons) {
            actionButtons.style.display = 'flex';
        }
        
        alert('4张图片已全部导出完成！');
    } catch (error) {
        console.error('图片导出失败:', error);
        
        // 恢复原始样式
        element.style.cssText = originalContainerStyle;
        
        // 移除加载提示
        const loading = document.getElementById('image-loading');
        if (loading) {
            loading.remove();
        }
        
        // 恢复显示操作按钮
        if (actionButtons) {
            actionButtons.style.display = 'flex';
        }
        
        alert('图片导出失败：' + (error.message || '未知错误，请重试'));
    }
}

// 将4张图片拼接成PDF
async function combineImagesToPDF() {
    const element = document.getElementById('report-content');
    if (!element) {
        alert('找不到报告内容，无法生成PDF');
        return;
    }
    
    // 检查html2canvas和jsPDF是否可用
    if (typeof html2canvas === 'undefined') {
        alert('图片导出功能未加载，请刷新页面后重试');
        return;
    }
    
    // 检查jsPDF（html2pdf包含jsPDF）
    if (typeof html2pdf === 'undefined') {
        alert('PDF生成功能未加载，请刷新页面后重试');
        return;
    }
    
    // 隐藏操作按钮
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        actionButtons.style.display = 'none';
    }
    
    // 获取学生姓名用于文件名
    const studentName = reportData?.student?.studentName || '学生';
    const dateStr = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-');
    
    // 获取4个页面元素
    const page1 = element.querySelector('.page-1');
    const page2 = element.querySelector('.page-2');
    const page3 = element.querySelector('.page-3');
    const page4 = element.querySelector('.page-4');
    
    if (!page1 || !page2 || !page3 || !page4) {
        alert('找不到页面内容，无法生成PDF');
        if (actionButtons) {
            actionButtons.style.display = 'flex';
        }
        return;
    }
    
    // 显示加载提示
    const loadingMsg = document.createElement('div');
    loadingMsg.id = 'pdf-combine-loading';
    loadingMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px 40px; border-radius: 8px; z-index: 10000; font-size: 16px;';
    loadingMsg.textContent = '正在生成图片并合成PDF，请稍候...';
    document.body.appendChild(loadingMsg);
    
    try {
        const pages = [
            { element: page1, name: '第1页', pageNum: 1 },
            { element: page2, name: '第2页', pageNum: 2 },
            { element: page3, name: '第3页', pageNum: 3 },
            { element: page4, name: '第4页', pageNum: 4 }
        ];
        
        // 保存原始样式
        const originalContainerStyle = element.style.cssText;
        element.style.width = '210mm';
        element.style.margin = '0 auto';
        
        // 生成所有页面的图片
        const imageDataUrls = [];
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            loadingMsg.textContent = `正在生成${page.name}图片... (${i + 1}/4)`;
            
            // 等待一小段时间确保渲染完成
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // 使用html2canvas生成图片
            const canvas = await html2canvas(page.element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                letterRendering: true,
                scrollX: 0,
                scrollY: 0,
                backgroundColor: '#ffffff'
            });
            
            // 将canvas转换为图片数据
            const imgData = canvas.toDataURL('image/png', 1.0);
            imageDataUrls.push(imgData);
        }
        
        // 使用jsPDF创建PDF并添加图片
        loadingMsg.textContent = '正在合成PDF...';
        
        // 获取jsPDF（优先使用全局jsPDF，否则尝试从html2pdf获取）
        let jsPDF;
        if (window.jspdf && window.jspdf.jsPDF) {
            jsPDF = window.jspdf.jsPDF;
        } else if (window.jspdf) {
            jsPDF = window.jspdf;
        } else {
            // 尝试从html2pdf的workflow中获取
            try {
                const worker = html2pdf().set({});
                if (worker.jsPDF) {
                    jsPDF = worker.jsPDF;
                }
            } catch (e) {
                console.error('无法从html2pdf获取jsPDF:', e);
            }
        }
        
        if (!jsPDF) {
            throw new Error('无法访问jsPDF库，请确保jsPDF已正确加载');
        }
        
        // 创建PDF文档
        const pdf = new jsPDF({
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        });
        
        // A4尺寸：210mm x 297mm
        const pageWidth = 210;
        const pageHeight = 297;
        
        // 固定图片宽度和顶部距离
        const fixedImageWidth = 200; // 固定宽度200mm（留出左右各5mm边距）
        const fixedTopMargin = 10; // 固定距离顶部10mm
        
        // 添加每一张图片到PDF
        for (let i = 0; i < imageDataUrls.length; i++) {
            if (i > 0) {
                pdf.addPage();
            }
            
            // 计算图片尺寸（固定宽度，高度按比例）
            const img = new Image();
            img.src = imageDataUrls[i];
            
            await new Promise((resolve) => {
                img.onload = () => {
                    const imgWidth = img.width;
                    const imgHeight = img.height;
                    
                    // 固定宽度，高度按比例计算
                    const width = fixedImageWidth;
                    const height = (imgHeight / imgWidth) * width;
                    
                    // 固定位置：固定宽度，固定距离顶部
                    const x = (pageWidth - width) / 2; // 水平居中（因为固定宽度）
                    const y = fixedTopMargin; // 固定距离顶部
                    
                    pdf.addImage(imageDataUrls[i], 'PNG', x, y, width, height);
                    resolve();
                };
                img.onerror = () => {
                    console.error(`加载第${i + 1}张图片失败`);
                    resolve();
                };
            });
        }
        
        // 保存PDF
        const filename = `留学潜力报告_${studentName}_${dateStr}_图片合成.pdf`;
        pdf.save(filename);
        
        // 恢复原始样式
        element.style.cssText = originalContainerStyle;
        
        // 移除加载提示
        loadingMsg.remove();
        
        // 恢复显示操作按钮
        if (actionButtons) {
            actionButtons.style.display = 'flex';
        }
        
        alert('PDF合成完成！');
    } catch (error) {
        console.error('PDF合成失败:', error);
        
        // 恢复原始样式
        element.style.cssText = originalContainerStyle;
        
        // 移除加载提示
        const loading = document.getElementById('pdf-combine-loading');
        if (loading) {
            loading.remove();
        }
        
        // 恢复显示操作按钮
        if (actionButtons) {
            actionButtons.style.display = 'flex';
        }
        
        alert('PDF合成失败：' + (error.message || '未知错误，请重试'));
    }
}

// 打印报告
function printReport() {
    window.print();
}

// 格式化分数显示
function formatScore(score) {
    return score ? `${score}分` : '未填写';
}

// 获取能力等级描述
function getAbilityLevel(score) {
    if (score >= 90) return '优秀';
    if (score >= 80) return '良好';
    if (score >= 70) return '中等';
    if (score >= 60) return '一般';
    return '待提升';
}

// 窗口关闭前确认
window.addEventListener('beforeunload', function(e) {
    // 注意：现代浏览器已经不支持自定义确认消息
    e.preventDefault();
    e.returnValue = '';
});

// 填充留学区域意向
function fillStudyRegions(studyDestination) {
    const container = document.getElementById('student-regions');
    if (!container) return;
    
    if (!studyDestination || studyDestination === '未填写') {
        container.innerHTML = '<span class="no-data">未填写</span>';
        return;
    }
    
    // 解析留学意向（可能包含多个地区，用逗号、分号或┋分隔）
    const regions = studyDestination.split(/[,，;；┋]/).map(r => r.trim()).filter(r => r);
    
    const regionFlags = {
        '美国': '🇺🇸',
        '英国': '🇬🇧',
        '加拿大': '🇨🇦',
        '澳大利亚': '🇦🇺',
        '新西兰': '🇳🇿',
        '新加坡': '🇸🇬',
        '中国香港': '🇭🇰',
        '香港': '🇭🇰',
        '中国澳门': '🇲🇴',
        '澳门': '🇲🇴',
        '台湾': '🇹🇼',
        '日本': '🇯🇵',
        '韩国': '🇰🇷',
        '德国': '🇩🇪',
        '法国': '🇫🇷',
        '荷兰': '🇳🇱',
        '瑞士': '🇨🇭',
        '意大利': '🇮🇹',
        '西班牙': '🇪🇸',
        '加拿大': '🇨🇦',
        '马来西亚': '🇲🇾',
        '北欧': '🇳🇴',
        '欧洲': '🇪🇺'
    };
    
    const regionItems = regions.map(region => {
        const flag = regionFlags[region] || '🌍';
        return `<span class="region-item"><span class="flag">${flag}</span><span class="region-name">${region}</span></span>`;
    });
    
    container.innerHTML = regionItems.join('');
}

// 填充专业方向意向
function fillMajorPreferences(majorPreference) {
    const container = document.getElementById('student-majors');
    if (!container) return;
    
    if (!majorPreference || majorPreference === '未填写') {
        container.innerHTML = '<span class="no-data">未填写</span>';
        return;
    }
    
    // 解析专业意向（可能包含多个专业，用逗号、分号或┋分隔）
    const majors = majorPreference.split(/[,，;；┋]/).map(m => m.trim()).filter(m => m);
    
    const majorIcons = {
        '建筑': '🏗️',
        '理科': '🔬',
        '工科': '⚙️',
        '商科': '💼',
        '文科': '📚',
        '医护': '🏥',
        '音乐': '🎵',
        '美术': '🎨',
        '计算机': '💻',
        '人工智能': '🤖',
        '数据科学': '📊',
        '金融': '💰',
        '经济': '📈',
        '管理': '📋',
        '法律': '⚖️',
        '教育': '🎓',
        '传媒': '📺',
        '设计': '🎨',
        '环境': '🌱',
        '生物': '🧬',
        '化学': '🧪',
        '物理': '⚛️',
        '数学': '📐',
        '心理学': '🧠',
        '社会学': '👥',
        '历史': '📜',
        '哲学': '🤔',
        '语言学': '🗣️',
        '翻译': '🌐',
        '旅游': '✈️',
        '酒店管理': '🏨',
        '体育': '⚽',
        '农业': '🌾',
        '其他': '📝'
    };
    
    const majorItems = majors.map(major => {
        const icon = majorIcons[major] || '📚';
        return `<span class="major-item"><span class="icon">${icon}</span><span class="major-name">${major}</span></span>`;
    });
    
    container.innerHTML = majorItems.join('');
} 