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
    // 检查URL参数，看是否有指定的学生索引
    const urlParams = new URLSearchParams(window.location.search);
    const studentIndex = urlParams.get('student');
    
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
                    strengths: '社交能力较好，人际关系和谐，具备一定的团队协作能力。',
                    weaknesses: '在领导力和公众表达方面还有提升空间，社交圈相对固定。',
                    suggestions: '建议在团队中承担更多责任，练习公众演讲，拓展社交圈，提升领导力。'
                },
                living: {
                    strengths: '独立生活能力较好，具备基本的时间管理和自我管理能力。',
                    weaknesses: '在某些生活技能方面还需要进一步提升，适应新环境的能力有待加强。',
                    suggestions: '建议学习更多生活技能，提升适应能力，培养独立解决问题的能力。'
                }
            },
            analysis: {
                suggestions: '1. 参与更多学术挑战项目，培养创新思维和批判性思维\n2. 重点提升英语能力，准备标准化语言考试\n3. 深化个人特长发展，在优势领域建立突出表现\n4. 完善申请材料，增强申请竞争力和成功率'
            },
            universities: {
                reach: [
                    { name: '剑桥大学', major: '工程学', location: '英国', logo: 'https://via.placeholder.com/60x60?text=剑桥' },
                    { name: '帝国理工学院', major: '计算机科学', location: '英国', logo: 'https://via.placeholder.com/60x60?text=帝国' }
                ],
                match: [
                    { name: '曼彻斯特大学', major: '电子工程', location: '英国', logo: 'https://via.placeholder.com/60x60?text=曼大' },
                    { name: '伯明翰大学', major: '机械工程', location: '英国', logo: 'https://via.placeholder.com/60x60?text=伯明翰' }
                ],
                safety: [
                    { name: '利兹大学', major: '土木工程', location: '英国', logo: 'https://via.placeholder.com/60x60?text=利兹' },
                    { name: '谢菲尔德大学', major: '材料科学', location: '英国', logo: 'https://via.placeholder.com/60x60?text=谢菲' }
                ]
            },
            service: {
                slogan: '专业留学规划 · 成就海外梦想\n我们拥有10年+留学服务经验，已帮助2000+学生成功留学世界名校',
                successCases: '• 张同学：高考580分 → 剑桥大学工程学院\n• 李同学：雅思6.5分 → 帝国理工计算机科学\n• 王同学：高中理科生 → 牛津大学物理系\n• 陈同学：艺术特长生 → 伦敦艺术大学'
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
    
    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['学术能力', '语言能力', '文体素养', '社交能力', '独立生活能力'],
            datasets: [{
                label: '能力评估',
                data: [
                    radar.academicAbility,
                    radar.languageAbility,
                    radar.artisticQuality,
                    radar.socialAbility,
                    radar.independentLiving
                ],
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 2,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
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
                    ctx.font = '12px Arial';
                    ctx.fillStyle = '#1e293b';
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
                        
                        // 在数据点上方显示分数
                        ctx.fillText(value + '分', x, y - 15);
                    });
                    
                    ctx.restore();
                }
            }],
            scales: {
                r: {
                    angleLines: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        lineWidth: 1
                    },
                    pointLabels: {
                        font: {
                            size: 14,
                            weight: '500'
                        },
                        color: '#1e293b'
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
                            size: 10
                        },
                        color: '#64748b'
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
                    tension: 0.3
                }
            }
        }
    });
}

// 填充分析和建议
function fillAnalysisAndSuggestions() {
    const detailedAnalysis = reportData.admin.detailedAnalysis;
    const overallSuggestions = reportData.admin.analysis?.suggestions || '暂无整体建议内容';
    
    // 填充五维详细分析（合并为一段话）
    if (detailedAnalysis) {
        // 学术能力（使用新的分析函数）
        const academicText = generateAcademicAnalysis();
        document.getElementById('academic-analysis').textContent = academicText;
        
        // 语言能力（使用新的分析函数）
        const languageText = generateLanguageAnalysis();
        document.getElementById('language-analysis').textContent = languageText;
        
        // 文体素养（使用新的分析函数）
        const artisticText = generateArtisticAnalysis();
        document.getElementById('artistic-analysis').textContent = artisticText;
        
        // 社交能力（使用新的分析函数）
        const socialText = generateSocialAnalysis();
        document.getElementById('social-analysis').textContent = socialText;
        
        // 独立生活能力（使用新的分析函数）
        const livingText = generateLivingAnalysis();
        document.getElementById('living-analysis').textContent = livingText;
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
        const listening = parseFloat(student.englishListening) || 0;
        const reading = parseFloat(student.englishReading) || 0;
        const speaking = parseFloat(student.englishSpeaking) || 0;
        const writing = parseFloat(student.englishWriting) || 0;
        
        if (totalScore > 0) {
            analysis += `。雅思总分${totalScore}分`;
            
            // 总分评价
            if (totalScore >= 7.5) {
                analysis += '，成绩优秀，达到顶尖大学要求';
            } else if (totalScore >= 7.0) {
                analysis += '，成绩良好，满足大部分大学要求';
            } else if (totalScore >= 6.5) {
                analysis += '，成绩中等，基本满足大学要求';
            } else if (totalScore >= 6.0) {
                analysis += '，成绩一般，需要进一步提升';
            } else {
                analysis += '，成绩偏低，需要系统备考';
            }
            
            // 分项分析
            const skills = [];
            if (listening >= 7.0) skills.push('听力优秀');
            else if (listening >= 6.0) skills.push('听力良好');
            else skills.push('听力需加强');
            
            if (reading >= 7.0) skills.push('阅读优秀');
            else if (reading >= 6.0) skills.push('阅读良好');
            else skills.push('阅读需加强');
            
            if (speaking >= 7.0) skills.push('口语优秀');
            else if (speaking >= 6.0) skills.push('口语良好');
            else skills.push('口语需加强');
            
            if (writing >= 7.0) skills.push('写作优秀');
            else if (writing >= 6.0) skills.push('写作良好');
            else skills.push('写作需加强');
            
            if (skills.length > 0) {
                analysis += `，${skills.join('、')}`;
            }
        }
    } else if (englishTestType === '托福') {
        const totalScore = parseFloat(student.englishTotalScore) || 0;
        const listening = parseFloat(student.englishListening) || 0;
        const reading = parseFloat(student.englishReading) || 0;
        const speaking = parseFloat(student.englishSpeaking) || 0;
        const writing = parseFloat(student.englishWriting) || 0;
        
        if (totalScore > 0) {
            analysis += `。托福总分${totalScore}分`;
            
            // 总分评价
            if (totalScore >= 100) {
                analysis += '，成绩优秀，达到顶尖大学要求';
            } else if (totalScore >= 90) {
                analysis += '，成绩良好，满足大部分大学要求';
            } else if (totalScore >= 80) {
                analysis += '，成绩中等，基本满足大学要求';
            } else if (totalScore >= 70) {
                analysis += '，成绩一般，需要进一步提升';
            } else {
                analysis += '，成绩偏低，需要系统备考';
            }
            
            // 分项分析
            const skills = [];
            if (listening >= 25) skills.push('听力优秀');
            else if (listening >= 20) skills.push('听力良好');
            else skills.push('听力需加强');
            
            if (reading >= 25) skills.push('阅读优秀');
            else if (reading >= 20) skills.push('阅读良好');
            else skills.push('阅读需加强');
            
            if (speaking >= 25) skills.push('口语优秀');
            else if (speaking >= 20) skills.push('口语良好');
            else skills.push('口语需加强');
            
            if (writing >= 25) skills.push('写作优秀');
            else if (writing >= 20) skills.push('写作良好');
            else skills.push('写作需加强');
            
            if (skills.length > 0) {
                analysis += `，${skills.join('、')}`;
            }
        }
    } else if (englishTestType === 'PTE') {
        const totalScore = parseFloat(student.englishTotalScore) || 0;
        const listening = parseFloat(student.englishListening) || 0;
        const reading = parseFloat(student.englishReading) || 0;
        const speaking = parseFloat(student.englishSpeaking) || 0;
        const writing = parseFloat(student.englishWriting) || 0;
        
        if (totalScore > 0) {
            analysis += `。PTE总分${totalScore}分`;
            
            // 总分评价
            if (totalScore >= 70) {
                analysis += '，成绩优秀，达到顶尖大学要求';
            } else if (totalScore >= 65) {
                analysis += '，成绩良好，满足大部分大学要求';
            } else if (totalScore >= 58) {
                analysis += '，成绩中等，基本满足大学要求';
            } else if (totalScore >= 50) {
                analysis += '，成绩一般，需要进一步提升';
            } else {
                analysis += '，成绩偏低，需要系统备考';
            }
            
            // 分项分析
            const skills = [];
            if (listening >= 65) skills.push('听力优秀');
            else if (listening >= 58) skills.push('听力良好');
            else skills.push('听力需加强');
            
            if (reading >= 65) skills.push('阅读优秀');
            else if (reading >= 58) skills.push('阅读良好');
            else skills.push('阅读需加强');
            
            if (speaking >= 65) skills.push('口语优秀');
            else if (speaking >= 58) skills.push('口语良好');
            else skills.push('口语需加强');
            
            if (writing >= 65) skills.push('写作优秀');
            else if (writing >= 58) skills.push('写作良好');
            else skills.push('写作需加强');
            
            if (skills.length > 0) {
                analysis += `，${skills.join('、')}`;
            }
        }
    } else if (englishTestType === '多邻国') {
        const totalScore = parseFloat(student.englishTotalScore) || 0;
        const listening = parseFloat(student.englishListening) || 0;
        const reading = parseFloat(student.englishReading) || 0;
        const speaking = parseFloat(student.englishSpeaking) || 0;
        const writing = parseFloat(student.englishWriting) || 0;
        
        if (totalScore > 0) {
            analysis += `。多邻国总分${totalScore}分`;
            
            // 总分评价
            if (totalScore >= 130) {
                analysis += '，成绩优秀，达到顶尖大学要求';
            } else if (totalScore >= 120) {
                analysis += '，成绩良好，满足大部分大学要求';
            } else if (totalScore >= 110) {
                analysis += '，成绩中等，基本满足大学要求';
            } else if (totalScore >= 100) {
                analysis += '，成绩一般，需要进一步提升';
            } else {
                analysis += '，成绩偏低，需要系统备考';
            }
            
            // 分项分析
            const skills = [];
            if (listening >= 120) skills.push('听力优秀');
            else if (listening >= 110) skills.push('听力良好');
            else skills.push('听力需加强');
            
            if (reading >= 120) skills.push('阅读优秀');
            else if (reading >= 110) skills.push('阅读良好');
            else skills.push('阅读需加强');
            
            if (speaking >= 120) skills.push('口语优秀');
            else if (speaking >= 110) skills.push('口语良好');
            else skills.push('口语需加强');
            
            if (writing >= 120) skills.push('写作优秀');
            else if (writing >= 110) skills.push('写作良好');
            else skills.push('写作需加强');
            
            if (skills.length > 0) {
                analysis += `，${skills.join('、')}`;
            }
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

// 生成社交能力详细分析
function generateSocialAnalysis() {
    const student = reportData.student;
    const socialAbility = reportData.admin.radar.socialAbility || 85;
    
    let analysis = '';
    
    // 基于社交能力分数的总体评价
    if (socialAbility >= 90) {
        analysis = '社交能力出色，具备优秀的沟通技巧和人际交往能力，能够快速融入新环境';
    } else if (socialAbility >= 80) {
        analysis = '社交能力优秀，具备良好的沟通能力和团队合作精神，能够有效处理人际关系';
    } else if (socialAbility >= 70) {
        analysis = '社交能力良好，具备基本的沟通技巧，能够与同学和老师进行有效交流';
    } else if (socialAbility >= 60) {
        analysis = '社交能力中等，在人际交往方面有一定基础，但需要进一步提升沟通技巧';
    } else {
        analysis = '社交能力有待提升，在人际交往和沟通方面需要更多锻炼和实践';
    }
    
    // 针对出国留学的建议
    let suggestions = '';
    if (socialAbility >= 80) {
        suggestions = '建议充分利用社交优势，积极参与国际学生组织，建立跨文化友谊，为未来职业发展积累人脉';
    } else if (socialAbility >= 70) {
        suggestions = '建议主动参与社交活动，练习英语口语交流，培养跨文化沟通能力';
    } else if (socialAbility >= 60) {
        suggestions = '建议多参加团队活动，练习主动沟通，提升英语口语表达能力';
    } else {
        suggestions = '建议从小组活动开始练习社交技能，参加英语角等活动，逐步提升沟通能力';
    }
    
    // 合并分析文本
    if (suggestions) {
        analysis += `。${suggestions}`;
    }
    
    return analysis || '社交能力分析内容正在生成中，请稍后查看。';
}

// 生成独立生活能力详细分析
function generateLivingAnalysis() {
    const student = reportData.student;
    const independentLiving = reportData.admin.radar.independentLiving || 78;
    
    let analysis = '';
    
    // 基于独立生活能力分数的总体评价
    if (independentLiving >= 90) {
        analysis = '独立生活能力卓越，具备出色的自理能力和生活管理技能，能够完全独立应对留学生活';
    } else if (independentLiving >= 80) {
        analysis = '独立生活能力优秀，具备良好的自理能力和时间管理能力，能够较好地适应独立生活';
    } else if (independentLiving >= 70) {
        analysis = '独立生活能力良好，具备基本的自理能力，能够应对大部分日常生活需求';
    } else if (independentLiving >= 60) {
        analysis = '独立生活能力中等，在自理能力方面有一定基础，但需要进一步提升生活技能';
    } else {
        analysis = '独立生活能力有待提升，在自理能力和生活管理方面需要更多学习和实践';
    }
    
    // 针对出国留学的建议
    let suggestions = '';
    if (independentLiving >= 80) {
        suggestions = '建议继续保持良好的生活习惯，学习财务管理，为独立留学生活做好充分准备';
    } else if (independentLiving >= 70) {
        suggestions = '建议学习基本的生活技能，如烹饪、洗衣、理财等，提升独立生活能力';
    } else if (independentLiving >= 60) {
        suggestions = '建议从基础生活技能开始学习，培养良好的生活习惯，逐步提升自理能力';
    } else {
        suggestions = '建议系统学习生活技能，培养独立意识，为未来的留学生活做好准备';
    }
    
    // 合并分析文本
    if (suggestions) {
        analysis += `。${suggestions}`;
    }
    
    return analysis || '独立生活能力分析内容正在生成中，请稍后查看。';
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

// 填充单个院校类别
function fillUniversityCategory(containerId, universityList) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    universityList.forEach(university => {
        const universityItem = document.createElement('div');
        universityItem.className = 'university-item';
        
        const logoElement = university.logo && university.logo.startsWith('http') 
            ? `<img src="${university.logo}" alt="${university.name}" class="university-logo" onerror="this.style.display='none';">`
            : `<div class="university-logo">${university.name ? university.name.substring(0, 2) : ''}</div>`;
        
        universityItem.innerHTML = `
            ${logoElement}
            <div class="university-info">
                <h4>${university.name || '未填写'}</h4>
                <div class="major">${university.major || '未填写'}</div>
                <div class="location">${university.location || '未填写'}</div>
            </div>
        `;
        
        container.appendChild(universityItem);
    });
}

// 填充服务引流内容
function fillServiceContent() {
    const service = reportData.admin.service;
    
    document.getElementById('service-slogan').textContent = service.slogan || '';
    document.getElementById('success-cases').textContent = service.successCases || '';
}

// 导出PDF
function exportToPDF() {
    const element = document.getElementById('report-content');
    const actionButtons = document.querySelector('.action-buttons');
    
    // 临时隐藏操作按钮
    if (actionButtons) {
        actionButtons.style.display = 'none';
    }
    
    // 临时调整样式以优化PDF输出
    const originalStyles = {
        maxWidth: element.style.maxWidth,
        boxShadow: element.style.boxShadow
    };
    
    // 为PDF导出优化样式
    element.style.maxWidth = '210mm';
    element.style.boxShadow = 'none';
    
    // 等待图表完全渲染
    setTimeout(() => {
        const opt = {
            margin: [10, 10, 10, 10], // 设置小边距
            filename: `留学潜力报告_${reportData.student.studentName || '学生'}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '')}.pdf`,
            image: { 
                type: 'jpeg', 
                quality: 0.95 
            },
            html2canvas: { 
                scale: 1.5, // 降低scale以减少渲染问题
                useCORS: true,
                allowTaint: true,
                logging: false,
                letterRendering: true,
                scrollX: 0,
                scrollY: 0,
                width: 794, // A4宽度像素 (210mm * 3.78)
                height: 1123, // A4高度像素 (297mm * 3.78)
                windowWidth: 794,
                windowHeight: 1123
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' 
            },
            pagebreak: { 
                mode: ['css', 'legacy'],
                before: '.page-2'
            }
        };
        
        html2pdf().set(opt).from(element).save().then(() => {
            // 恢复原始样式
            element.style.maxWidth = originalStyles.maxWidth;
            element.style.boxShadow = originalStyles.boxShadow;
            
            // 恢复显示操作按钮
            if (actionButtons) {
                actionButtons.style.display = 'flex';
            }
            
            alert('PDF报告已成功导出！');
        }).catch(error => {
            console.error('PDF导出失败:', error);
            alert('PDF导出失败，请重试。');
            
            // 恢复原始样式
            element.style.maxWidth = originalStyles.maxWidth;
            element.style.boxShadow = originalStyles.boxShadow;
            
            // 恢复显示操作按钮
            if (actionButtons) {
                actionButtons.style.display = 'flex';
            }
        });
    }, 500); // 给图表渲染留出时间
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
        '爱尔兰': '🇮🇪',
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