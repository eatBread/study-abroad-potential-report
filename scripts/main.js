// 全局变量
let studentData = {};
let adminSettings = {};

// 五维能力评价数据库
const abilityEvaluations = {
    academic: {
        name: '学术能力',
        ranges: [
            {
                min: 0, max: 60,
                strengths: '基础知识有一定积累，具备学习潜力。',
                weaknesses: '学术基础相对薄弱，理论知识掌握不够扎实，解决复杂问题的能力有待提升。',
                suggestions: '建议加强基础学科学习，多做练习题巩固知识点，可考虑参加补习班或找学科导师指导。'
            },
            {
                min: 60, max: 80,
                strengths: '学术基础较为扎实，理论知识掌握良好，具备一定的学科思维能力。',
                weaknesses: '在深层次理解和创新思维方面还有提升空间，缺乏跨学科整合能力。',
                suggestions: '建议参与更多学术挑战项目，如数学竞赛、科学实验等，培养批判性思维和创新能力。'
            },
            {
                min: 80, max: 90,
                strengths: '学术水平优秀，知识结构完整，具备强的逻辑思维和分析能力，能够独立解决复杂问题。',
                weaknesses: '在某些前沿领域的探索深度可能不够，需要更多实践应用经验。',
                suggestions: '建议参与科研项目或学术竞赛，发表学术论文，申请参加高校夏令营等学术活动。'
            },
            {
                min: 90, max: 100,
                strengths: '学术能力卓越，知识面广博且深入，具备强大的研究能力和创新思维，在学科领域表现突出。',
                weaknesses: '需要注意保持学习的广度，避免过分专精而忽视其他重要能力的发展。',
                suggestions: '建议申请顶尖大学，参与国际学术交流，考虑提前接触大学级别的研究项目。'
            }
        ]
    },
    potential: {
        name: '学术潜力',
        ranges: [
            {
                min: 0, max: 60,
                strengths: '对学习保持一定兴趣，具备基本的学习动力。',
                weaknesses: '学习方法有待改进，自主学习能力较弱，对新知识的接受和消化速度相对较慢。',
                suggestions: '建议培养良好的学习习惯，多尝试不同的学习方法，设立阶段性学习目标。'
            },
            {
                min: 60, max: 80,
                strengths: '学习能力较强，能够适应不同学科的学习要求，具备一定的自主学习能力。',
                weaknesses: '在面对挫折时的坚持力有待增强，创新思维和批判性思维需要进一步培养。',
                suggestions: '建议挑战更有难度的学习内容，培养解决问题的多元化思维，多参与讨论和辩论。'
            },
            {
                min: 80, max: 90,
                strengths: '学习潜力出色，能够快速掌握新知识，具备强的适应能力和成长性，学习效率高。',
                weaknesses: '可能在某些特定领域的深度挖掘上需要更多时间和精力投入。',
                suggestions: '建议选择具有挑战性的课程或项目，培养长期学习规划能力，探索个人兴趣领域。'
            },
            {
                min: 90, max: 100,
                strengths: '学习潜力极强，具备卓越的理解力和创新能力，能够在各个学科领域都表现出色。',
                weaknesses: '需要注意平衡各方面发展，避免学术过度压力影响身心健康。',
                suggestions: '建议申请最具挑战性的学术项目，考虑跨学科学习，为未来学术发展制定长远规划。'
            }
        ]
    },
    language: {
        name: '语言能力',
        ranges: [
            {
                min: 0, max: 60,
                strengths: '具备基本的中文表达能力，在母语环境下沟通无障碍。',
                weaknesses: '英语水平有限，听说读写能力都需要大幅提升，国际化交流存在较大障碍。',
                suggestions: '建议报读英语培训班，加强基础语法和词汇学习，多看英语原版材料，练习日常口语对话。'
            },
            {
                min: 60, max: 80,
                strengths: '英语基础较好，能够进行基本的英语交流，阅读理解能力不错。',
                weaknesses: '口语表达的流利度和准确性有待提升，学术英语写作能力需要加强。',
                suggestions: '建议参加雅思/托福培训，多进行英语口语练习，阅读英文学术文章，练习学术写作。'
            },
            {
                min: 80, max: 90,
                strengths: '英语水平良好，能够流利进行英语交流，具备较强的语言学习能力。',
                weaknesses: '在专业学术交流和复杂话题讨论方面还需要进一步提升。',
                suggestions: '建议参加高级英语课程，多参与英语辩论和演讲活动，考虑学习第二外语。'
            },
            {
                min: 90, max: 100,
                strengths: '语言能力出色，英语接近母语水平，能够自如应对各种语言场景。',
                weaknesses: '需要保持语言技能的持续练习，避免在特定环境下出现退化。',
                suggestions: '建议考虑语言类相关专业或国际化程度高的专业，充分发挥语言优势。'
            }
        ]
    },
    quality: {
        name: '综合素养',
        ranges: [
            {
                min: 0, max: 60,
                strengths: '具备基本的生活自理能力和社交意识。',
                weaknesses: '领导力、团队协作能力和创新思维有待发展，课外活动参与度较低。',
                suggestions: '建议积极参加学校社团活动，培养兴趣爱好，多参与团队项目，锻炼沟通协调能力。'
            },
            {
                min: 60, max: 80,
                strengths: '综合素质较好，具备一定的组织协调能力，有稳定的兴趣爱好和社交圈。',
                weaknesses: '在领导力展示和创新项目参与方面还有提升空间。',
                suggestions: '建议在社团中承担更多责任，参与志愿服务活动，尝试组织或领导小型项目。'
            },
            {
                min: 80, max: 90,
                strengths: '综合素养出色，具备良好的领导力和团队协作能力，在多个领域都有不错的表现。',
                weaknesses: '需要在某些特定领域进一步深化发展，增强个人特色。',
                suggestions: '建议选择1-2个重点发展领域深入投入，申请参加高质量的夏令营或交流项目。'
            },
            {
                min: 90, max: 100,
                strengths: '综合素养卓越，具备强大的领导力、创新能力和社会责任感，是全面发展的优秀学生。',
                weaknesses: '需要注意时间管理，避免活动过多影响学术表现。',
                suggestions: '建议申请顶尖大学，充分展示综合能力，考虑在感兴趣的领域进行深度探索。'
            }
        ]
    },
    matching: {
        name: '目标匹配度',
        ranges: [
            {
                min: 0, max: 60,
                strengths: '对留学有基本认知和兴趣，具备出国留学的基本动机。',
                weaknesses: '留学预算与目标不太匹配，成绩与理想院校存在较大差距，缺乏明确的专业规划。',
                suggestions: '建议重新评估留学预算和目标院校，制定切实可行的成绩提升计划，探索更多专业选择。'
            },
            {
                min: 60, max: 80,
                strengths: '留学目标相对明确，预算规划较为合理，具备一定的留学准备基础。',
                weaknesses: '部分条件与目标院校要求还有差距，需要在特定方面加强准备。',
                suggestions: '建议细化留学时间规划，针对薄弱环节制定具体提升方案，多了解目标地区的文化和教育体系。'
            },
            {
                min: 80, max: 90,
                strengths: '留学规划清晰合理，个人条件与目标院校要求匹配度较高，具备良好的申请竞争力。',
                weaknesses: '在一些细节准备或背景提升方面还可以进一步完善。',
                suggestions: '建议优化申请材料，增加相关实习或项目经历，考虑申请多个层次的院校确保录取。'
            },
            {
                min: 90, max: 100,
                strengths: '留学目标与个人条件高度匹配，具备冲击顶尖院校的实力，规划完善且执行力强。',
                weaknesses: '需要保持持续的努力和状态，避免过度自信影响最终结果。',
                suggestions: '建议申请最理想的院校，同时准备充分的备选方案，保持学习和活动的高水准。'
            }
        ]
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadAdminSettings();
});

// 初始化应用
function initializeApp() {
    // 绑定表单提交事件
    const studentForm = document.getElementById('student-form');
    if (studentForm) {
        studentForm.addEventListener('submit', handleFormSubmit);
    }
    
    // 加载保存的设置
    loadAdminSettings();
    
    // 初始化状态提示
    updateAdminStatus();
}

// 显示不同的标签页
function showTab(tabName) {
    // 隐藏所有标签内容
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // 移除所有标签按钮的活动状态
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    // 显示选中的标签内容
    const targetTab = document.getElementById(`${tabName}-tab`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // 激活对应的标签按钮
    const activeBtn = event?.target || document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // 如果切换到后台管理页面，更新状态提示
    if (tabName === 'admin') {
        updateAdminStatus();
    }
}

// 更新后台管理状态提示
function updateAdminStatus() {
    const statusText = document.getElementById('status-text');
    const savedStudentData = localStorage.getItem('studentData');
    
    if (!statusText) return;
    
    if (savedStudentData) {
        try {
            const studentData = JSON.parse(savedStudentData);
            const studentName = studentData.studentName || '未知学生';
            statusText.textContent = `✅ 已有学生数据（${studentName}）。可以调整下方设置后直接生成报告。`;
        } catch (error) {
            statusText.textContent = '⚠️ 学生数据格式异常，请重新填写学生信息。';
        }
    } else {
        statusText.textContent = '⚠️ 还没有学生数据。请先到"学生信息录入"页面填写学生信息。';
    }
}

// 处理学生表单提交
function handleFormSubmit(event) {
    event.preventDefault();
    
    // 收集表单数据
    const formData = new FormData(event.target);
    studentData = {};
    
    for (let [key, value] of formData.entries()) {
        studentData[key] = value;
    }
    
    // 验证必填字段
    if (!validateRequiredFields()) {
        alert('请填写所有必填字段！');
        return;
    }
    
    // 保存学生数据到localStorage
    localStorage.setItem('studentData', JSON.stringify(studentData));
    
    // 生成报告
    generateReport();
}

// 验证必填字段
function validateRequiredFields() {
    const requiredFields = ['studentName', 'gender', 'grade', 'school', 'subjectGroup'];
    
    for (let field of requiredFields) {
        if (!studentData[field] || studentData[field].trim() === '') {
            return false;
        }
    }
    
    return true;
}

// 生成报告
function generateReport() {
    // 获取当前管理设置
    saveAdminSettings();
    
    // 将数据传递给报告页面
    const reportData = {
        student: studentData,
        admin: adminSettings
    };
    
    localStorage.setItem('reportData', JSON.stringify(reportData));
    
    // 打开报告页面
    window.open('report.html', '_blank');
}

// 根据分数获取能力评价
function getAbilityEvaluation(abilityType, score) {
    const ability = abilityEvaluations[abilityType];
    if (!ability) return null;
    
    for (let range of ability.ranges) {
        if (score >= range.min && score <= range.max) {
            return range;
        }
    }
    return ability.ranges[0]; // 默认返回第一个范围
}

// 生成智能分析
function generateIntelligentAnalysis() {
    // 安全获取元素值的函数
    function safeGetValue(id, defaultValue = '') {
        const element = document.getElementById(id);
        return element ? element.value : defaultValue;
    }
    
    const radar = {
        academicAbility: parseInt(safeGetValue('academicAbility', '75')) || 75,
        academicPotential: parseInt(safeGetValue('academicPotential', '80')) || 80,
        languageAbility: parseInt(safeGetValue('languageAbility', '70')) || 70,
        comprehensiveQuality: parseInt(safeGetValue('comprehensiveQuality', '85')) || 85,
        goalMatching: parseInt(safeGetValue('goalMatching', '78')) || 78
    };

    const analysis = {
        academic: {
            strengths: safeGetValue('academicStrengths') || getAbilityEvaluation('academic', radar.academicAbility).strengths,
            weaknesses: safeGetValue('academicWeaknesses') || getAbilityEvaluation('academic', radar.academicAbility).weaknesses,
            suggestions: safeGetValue('academicSuggestions') || getAbilityEvaluation('academic', radar.academicAbility).suggestions
        },
        potential: {
            strengths: safeGetValue('potentialStrengths') || getAbilityEvaluation('potential', radar.academicPotential).strengths,
            weaknesses: safeGetValue('potentialWeaknesses') || getAbilityEvaluation('potential', radar.academicPotential).weaknesses,
            suggestions: safeGetValue('potentialSuggestions') || getAbilityEvaluation('potential', radar.academicPotential).suggestions
        },
        language: {
            strengths: safeGetValue('languageStrengths') || getAbilityEvaluation('language', radar.languageAbility).strengths,
            weaknesses: safeGetValue('languageWeaknesses') || getAbilityEvaluation('language', radar.languageAbility).weaknesses,
            suggestions: safeGetValue('languageSuggestions') || getAbilityEvaluation('language', radar.languageAbility).suggestions
        },
        quality: {
            strengths: safeGetValue('qualityStrengths') || getAbilityEvaluation('quality', radar.comprehensiveQuality).strengths,
            weaknesses: safeGetValue('qualityWeaknesses') || getAbilityEvaluation('quality', radar.comprehensiveQuality).weaknesses,
            suggestions: safeGetValue('qualitySuggestions') || getAbilityEvaluation('quality', radar.comprehensiveQuality).suggestions
        },
        matching: {
            strengths: safeGetValue('matchingStrengths') || getAbilityEvaluation('matching', radar.goalMatching).strengths,
            weaknesses: safeGetValue('matchingWeaknesses') || getAbilityEvaluation('matching', radar.goalMatching).weaknesses,
            suggestions: safeGetValue('matchingSuggestions') || getAbilityEvaluation('matching', radar.goalMatching).suggestions
        }
    };

    return analysis;
}

// 生成整体建议
function generateOverallSuggestions(detailedAnalysis) {
    const suggestions = [];
    
    // 从各维度建议中提取关键建议
    if (detailedAnalysis.academic.suggestions.includes('补习') || detailedAnalysis.academic.suggestions.includes('基础')) {
        suggestions.push('1. 加强学术基础建设，巩固核心学科知识体系');
    } else if (detailedAnalysis.academic.suggestions.includes('科研') || detailedAnalysis.academic.suggestions.includes('竞赛')) {
        suggestions.push('1. 积极参与学术研究项目和学科竞赛，提升学术影响力');
    } else {
        suggestions.push('1. 保持学术优势，扩展知识面和研究深度');
    }
    
    if (detailedAnalysis.language.suggestions.includes('培训') || detailedAnalysis.language.suggestions.includes('基础')) {
        suggestions.push('2. 重点提升英语能力，报名专业语言培训课程');
    } else if (detailedAnalysis.language.suggestions.includes('雅思') || detailedAnalysis.language.suggestions.includes('托福')) {
        suggestions.push('2. 准备标准化英语考试，争取理想语言成绩');
    } else {
        suggestions.push('2. 维持语言优势，考虑学习第二外语拓展国际视野');
    }
    
    if (detailedAnalysis.quality.suggestions.includes('社团') || detailedAnalysis.quality.suggestions.includes('活动')) {
        suggestions.push('3. 积极参与课外活动和社团组织，培养领导力和团队协作能力');
    } else {
        suggestions.push('3. 深化个人特长发展，在优势领域建立突出表现');
    }
    
    if (detailedAnalysis.matching.suggestions.includes('重新评估') || detailedAnalysis.matching.suggestions.includes('差距')) {
        suggestions.push('4. 调整留学规划，选择更匹配的目标院校和专业方向');
    } else {
        suggestions.push('4. 完善申请材料，增强申请竞争力和成功率');
    }
    
    return suggestions.join('\n');
}

// 保存管理设置
function saveAdminSettings() {
    // 安全获取元素值的函数
    function safeGetValue(id, defaultValue = '') {
        const element = document.getElementById(id);
        return element ? element.value : defaultValue;
    }
    
    const detailedAnalysis = generateIntelligentAnalysis();
    
    adminSettings = {
        radar: {
            academicAbility: parseInt(safeGetValue('academicAbility', '75')) || 75,
            academicPotential: parseInt(safeGetValue('academicPotential', '80')) || 80,
            languageAbility: parseInt(safeGetValue('languageAbility', '70')) || 70,
            comprehensiveQuality: parseInt(safeGetValue('comprehensiveQuality', '85')) || 85,
            goalMatching: parseInt(safeGetValue('goalMatching', '78')) || 78
        },
        detailedAnalysis: detailedAnalysis,
        analysis: {
            suggestions: safeGetValue('overallSuggestions') || generateOverallSuggestions(detailedAnalysis)
        },
        universities: {
            reach: [
                {
                    name: safeGetValue('reach1Name'),
                    major: safeGetValue('reach1Major'),
                    location: safeGetValue('reach1Location'),
                    logo: safeGetValue('reach1Logo')
                },
                {
                    name: safeGetValue('reach2Name'),
                    major: safeGetValue('reach2Major'),
                    location: safeGetValue('reach2Location'),
                    logo: safeGetValue('reach2Logo')
                }
            ],
            match: [
                {
                    name: safeGetValue('match1Name'),
                    major: safeGetValue('match1Major'),
                    location: safeGetValue('match1Location'),
                    logo: safeGetValue('match1Logo')
                },
                {
                    name: safeGetValue('match2Name'),
                    major: safeGetValue('match2Major'),
                    location: safeGetValue('match2Location'),
                    logo: safeGetValue('match2Logo')
                }
            ],
            safety: [
                {
                    name: safeGetValue('safety1Name'),
                    major: safeGetValue('safety1Major'),
                    location: safeGetValue('safety1Location'),
                    logo: safeGetValue('safety1Logo')
                },
                {
                    name: safeGetValue('safety2Name'),
                    major: safeGetValue('safety2Major'),
                    location: safeGetValue('safety2Location'),
                    logo: safeGetValue('safety2Logo')
                }
            ]
        },
        service: {
            slogan: safeGetValue('serviceSlogan'),
            successCases: safeGetValue('successCases')
        }
    };
    
    // 保存到localStorage
    localStorage.setItem('adminSettings', JSON.stringify(adminSettings));
    
    alert('设置已保存！');
}

// 加载管理设置
function loadAdminSettings() {
    const saved = localStorage.getItem('adminSettings');
    if (saved) {
        adminSettings = JSON.parse(saved);
        
        // 填充表单字段
        if (adminSettings.radar) {
            document.getElementById('academicAbility').value = adminSettings.radar.academicAbility || 75;
            document.getElementById('academicPotential').value = adminSettings.radar.academicPotential || 80;
            document.getElementById('languageAbility').value = adminSettings.radar.languageAbility || 70;
            document.getElementById('comprehensiveQuality').value = adminSettings.radar.comprehensiveQuality || 85;
            document.getElementById('goalMatching').value = adminSettings.radar.goalMatching || 78;
        }
        
        // 填充五维详细分析
        if (adminSettings.detailedAnalysis) {
            // 学术能力
            if (adminSettings.detailedAnalysis.academic) {
                const academicStrengths = document.getElementById('academicStrengths');
                const academicWeaknesses = document.getElementById('academicWeaknesses');
                const academicSuggestions = document.getElementById('academicSuggestions');
                if (academicStrengths) academicStrengths.value = adminSettings.detailedAnalysis.academic.strengths || '';
                if (academicWeaknesses) academicWeaknesses.value = adminSettings.detailedAnalysis.academic.weaknesses || '';
                if (academicSuggestions) academicSuggestions.value = adminSettings.detailedAnalysis.academic.suggestions || '';
            }
            
            // 学术潜力
            if (adminSettings.detailedAnalysis.potential) {
                const potentialStrengths = document.getElementById('potentialStrengths');
                const potentialWeaknesses = document.getElementById('potentialWeaknesses');
                const potentialSuggestions = document.getElementById('potentialSuggestions');
                if (potentialStrengths) potentialStrengths.value = adminSettings.detailedAnalysis.potential.strengths || '';
                if (potentialWeaknesses) potentialWeaknesses.value = adminSettings.detailedAnalysis.potential.weaknesses || '';
                if (potentialSuggestions) potentialSuggestions.value = adminSettings.detailedAnalysis.potential.suggestions || '';
            }
            
            // 语言能力
            if (adminSettings.detailedAnalysis.language) {
                const languageStrengths = document.getElementById('languageStrengths');
                const languageWeaknesses = document.getElementById('languageWeaknesses');
                const languageSuggestions = document.getElementById('languageSuggestions');
                if (languageStrengths) languageStrengths.value = adminSettings.detailedAnalysis.language.strengths || '';
                if (languageWeaknesses) languageWeaknesses.value = adminSettings.detailedAnalysis.language.weaknesses || '';
                if (languageSuggestions) languageSuggestions.value = adminSettings.detailedAnalysis.language.suggestions || '';
            }
            
            // 综合素养
            if (adminSettings.detailedAnalysis.quality) {
                const qualityStrengths = document.getElementById('qualityStrengths');
                const qualityWeaknesses = document.getElementById('qualityWeaknesses');
                const qualitySuggestions = document.getElementById('qualitySuggestions');
                if (qualityStrengths) qualityStrengths.value = adminSettings.detailedAnalysis.quality.strengths || '';
                if (qualityWeaknesses) qualityWeaknesses.value = adminSettings.detailedAnalysis.quality.weaknesses || '';
                if (qualitySuggestions) qualitySuggestions.value = adminSettings.detailedAnalysis.quality.suggestions || '';
            }
            
            // 目标匹配度
            if (adminSettings.detailedAnalysis.matching) {
                const matchingStrengths = document.getElementById('matchingStrengths');
                const matchingWeaknesses = document.getElementById('matchingWeaknesses');
                const matchingSuggestions = document.getElementById('matchingSuggestions');
                if (matchingStrengths) matchingStrengths.value = adminSettings.detailedAnalysis.matching.strengths || '';
                if (matchingWeaknesses) matchingWeaknesses.value = adminSettings.detailedAnalysis.matching.weaknesses || '';
                if (matchingSuggestions) matchingSuggestions.value = adminSettings.detailedAnalysis.matching.suggestions || '';
            }
        }
        
        // 填充整体建议
        if (adminSettings.analysis) {
            const overallSuggestions = document.getElementById('overallSuggestions');
            if (overallSuggestions) overallSuggestions.value = adminSettings.analysis.suggestions || '';
        }
        
        // 安全设置元素值的函数
        function safeSetValue(id, value) {
            const element = document.getElementById(id);
            if (element) element.value = value || '';
        }
        
        if (adminSettings.universities) {
            // 冲刺院校
            if (adminSettings.universities.reach && adminSettings.universities.reach.length >= 2) {
                safeSetValue('reach1Name', adminSettings.universities.reach[0].name);
                safeSetValue('reach1Major', adminSettings.universities.reach[0].major);
                safeSetValue('reach1Location', adminSettings.universities.reach[0].location);
                safeSetValue('reach1Logo', adminSettings.universities.reach[0].logo);
                
                safeSetValue('reach2Name', adminSettings.universities.reach[1].name);
                safeSetValue('reach2Major', adminSettings.universities.reach[1].major);
                safeSetValue('reach2Location', adminSettings.universities.reach[1].location);
                safeSetValue('reach2Logo', adminSettings.universities.reach[1].logo);
            }
            
            // 稳妥院校
            if (adminSettings.universities.match && adminSettings.universities.match.length >= 2) {
                safeSetValue('match1Name', adminSettings.universities.match[0].name);
                safeSetValue('match1Major', adminSettings.universities.match[0].major);
                safeSetValue('match1Location', adminSettings.universities.match[0].location);
                safeSetValue('match1Logo', adminSettings.universities.match[0].logo);
                
                safeSetValue('match2Name', adminSettings.universities.match[1].name);
                safeSetValue('match2Major', adminSettings.universities.match[1].major);
                safeSetValue('match2Location', adminSettings.universities.match[1].location);
                safeSetValue('match2Logo', adminSettings.universities.match[1].logo);
            }
            
            // 保底院校
            if (adminSettings.universities.safety && adminSettings.universities.safety.length >= 2) {
                safeSetValue('safety1Name', adminSettings.universities.safety[0].name);
                safeSetValue('safety1Major', adminSettings.universities.safety[0].major);
                safeSetValue('safety1Location', adminSettings.universities.safety[0].location);
                safeSetValue('safety1Logo', adminSettings.universities.safety[0].logo);
                
                safeSetValue('safety2Name', adminSettings.universities.safety[1].name);
                safeSetValue('safety2Major', adminSettings.universities.safety[1].major);
                safeSetValue('safety2Location', adminSettings.universities.safety[1].location);
                safeSetValue('safety2Logo', adminSettings.universities.safety[1].logo);
            }
        }
        
        if (adminSettings.service) {
            safeSetValue('serviceSlogan', adminSettings.service.slogan);
            safeSetValue('successCases', adminSettings.service.successCases);
        }
    }
}

// 辅助函数：格式化数据
function formatStudentInfo(data) {
    let info = `姓名：${data.studentName || '未填写'}\n`;
    info += `性别：${data.gender || '未填写'}\n`;
    info += `年级：${data.grade || '未填写'}\n`;
    info += `学校：${data.school || '未填写'}\n`;
    info += `学科分组：${data.subjectGroup || '未填写'}\n`;
    
    if (data.majorPreference) {
        info += `专业倾向：${data.majorPreference}\n`;
    }
    
    if (data.studyDestination) {
        info += `留学意向：${data.studyDestination}\n`;
    }
    
    if (data.englishTestType && data.englishTestType !== '暂无') {
        info += `英语成绩：${data.englishTestType} ${data.englishScore || ''}\n`;
    }
    
    return info;
}

// 从后台管理页面生成报告
function generateReportFromAdmin() {
    // 首先保存当前的管理设置
    saveAdminSettings();
    
    // 检查是否有学生数据
    const savedStudentData = localStorage.getItem('studentData');
    if (!savedStudentData) {
        // 如果没有学生数据，提示用户并切换到学生信息录入页面
        if (confirm('还没有学生信息数据。是否要切换到"学生信息录入"页面填写学生信息？')) {
            showTab('input');
        }
        return;
    }
    
    // 如果有学生数据，直接生成报告
    try {
        const parsedStudentData = JSON.parse(savedStudentData);
        
        // 将数据传递给报告页面
        const reportData = {
            student: parsedStudentData,
            admin: adminSettings
        };
        
        localStorage.setItem('reportData', JSON.stringify(reportData));
        
        // 打开报告页面
        window.open('report.html', '_blank');
    } catch (error) {
        console.error('生成报告失败:', error);
        alert('生成报告失败，请检查数据格式或重新填写学生信息。');
    }
}

// 清除所有数据
function clearAllData() {
    if (confirm('确认要清除所有数据吗？此操作不可恢复。')) {
        localStorage.removeItem('studentData');
        localStorage.removeItem('adminSettings');
        localStorage.removeItem('reportData');
        location.reload();
    }
} 