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
                academicAbility: 40,
                academicPotential: 50,
                languageAbility: 60,
                comprehensiveQuality: 80,
                goalMatching: 90
            },
            detailedAnalysis: {
                academic: {
                    strengths: '学术基础较为扎实，理论知识掌握良好，具备一定的学科思维能力。',
                    weaknesses: '在深层次理解和创新思维方面还有提升空间，缺乏跨学科整合能力。',
                    suggestions: '建议参与更多学术挑战项目，如数学竞赛、科学实验等，培养批判性思维和创新能力。'
                },
                potential: {
                    strengths: '学习潜力出色，能够快速掌握新知识，具备强的适应能力和成长性，学习效率高。',
                    weaknesses: '可能在某些特定领域的深度挖掘上需要更多时间和精力投入。',
                    suggestions: '建议选择具有挑战性的课程或项目，培养长期学习规划能力，探索个人兴趣领域。'
                },
                language: {
                    strengths: '英语基础较好，能够进行基本的英语交流，阅读理解能力不错。',
                    weaknesses: '口语表达的流利度和准确性有待提升，学术英语写作能力需要加强。',
                    suggestions: '建议参加雅思/托福培训，多进行英语口语练习，阅读英文学术文章，练习学术写作。'
                },
                quality: {
                    strengths: '综合素养出色，具备良好的领导力和团队协作能力，在多个领域都有不错的表现。',
                    weaknesses: '需要在某些特定领域进一步深化发展，增强个人特色。',
                    suggestions: '建议选择1-2个重点发展领域深入投入，申请参加高质量的夏令营或交流项目。'
                },
                matching: {
                    strengths: '留学规划清晰合理，个人条件与目标院校要求匹配度较高，具备良好的申请竞争力。',
                    weaknesses: '在一些细节准备或背景提升方面还可以进一步完善。',
                    suggestions: '建议优化申请材料，增加相关实习或项目经历，考虑申请多个层次的院校确保录取。'
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
    
    let destination = student.studyDestination || '未填写';
    if (student.majorPreference) {
        destination += ` (${student.majorPreference})`;
    }
    document.getElementById('student-destination').textContent = destination;
}

// 创建雷达图
function createRadarChart() {
    const ctx = document.getElementById('radarChart').getContext('2d');
    const radar = reportData.admin.radar;
    
    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['学术能力', '学术潜力', '语言能力', '综合素养', '目标匹配度'],
            datasets: [{
                label: '能力评估',
                data: [
                    radar.academicAbility,
                    radar.academicPotential,
                    radar.languageAbility,
                    radar.comprehensiveQuality,
                    radar.goalMatching
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
    
    // 填充五维详细分析
    if (detailedAnalysis) {
        // 学术能力
        document.getElementById('academic-strengths').textContent = detailedAnalysis.academic?.strengths || '暂无内容';
        document.getElementById('academic-weaknesses').textContent = detailedAnalysis.academic?.weaknesses || '暂无内容';
        document.getElementById('academic-suggestions').textContent = detailedAnalysis.academic?.suggestions || '暂无内容';
        
        // 学术潜力
        document.getElementById('potential-strengths').textContent = detailedAnalysis.potential?.strengths || '暂无内容';
        document.getElementById('potential-weaknesses').textContent = detailedAnalysis.potential?.weaknesses || '暂无内容';
        document.getElementById('potential-suggestions').textContent = detailedAnalysis.potential?.suggestions || '暂无内容';
        
        // 语言能力
        document.getElementById('language-strengths').textContent = detailedAnalysis.language?.strengths || '暂无内容';
        document.getElementById('language-weaknesses').textContent = detailedAnalysis.language?.weaknesses || '暂无内容';
        document.getElementById('language-suggestions').textContent = detailedAnalysis.language?.suggestions || '暂无内容';
        
        // 综合素养
        document.getElementById('quality-strengths').textContent = detailedAnalysis.quality?.strengths || '暂无内容';
        document.getElementById('quality-weaknesses').textContent = detailedAnalysis.quality?.weaknesses || '暂无内容';
        document.getElementById('quality-suggestions').textContent = detailedAnalysis.quality?.suggestions || '暂无内容';
        
        // 目标匹配度
        document.getElementById('matching-strengths').textContent = detailedAnalysis.matching?.strengths || '暂无内容';
        document.getElementById('matching-weaknesses').textContent = detailedAnalysis.matching?.weaknesses || '暂无内容';
        document.getElementById('matching-suggestions').textContent = detailedAnalysis.matching?.suggestions || '暂无内容';
    }
    
    // 填充整体建议
    document.getElementById('suggestions-content').textContent = overallSuggestions;
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