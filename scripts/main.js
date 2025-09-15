// 全局变量
let studentData = {};
let adminSettings = {};
let excelData = []; // 存储Excel数据
let excelHeaders = []; // 存储Excel表头

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
    },
    artistic: {
        name: '文体素养',
        ranges: [
            {
                min: 0, max: 60,
                strengths: '具备基本的文体活动参与意识。',
                weaknesses: '文体特长发展不足，缺乏持续的兴趣爱好，在艺术和体育方面表现平平。',
                suggestions: '建议培养1-2项文体兴趣爱好，参加相关培训班或社团活动，提升文体素养。'
            },
            {
                min: 60, max: 80,
                strengths: '具备一定的文体特长，有稳定的兴趣爱好，在某个领域表现不错。',
                weaknesses: '文体技能还需要进一步提升，缺乏相关证书或奖项，在专业水平上还有发展空间。',
                suggestions: '建议深化文体特长发展，参加相关比赛和考级，争取获得证书或奖项。'
            },
            {
                min: 80, max: 90,
                strengths: '文体素养优秀，具备突出的特长，在相关领域有良好表现和认可。',
                weaknesses: '可能在某些文体项目上还可以进一步拓展，增加多样化的文体技能。',
                suggestions: '建议在优势领域继续精进，同时尝试新的文体项目，丰富个人才艺。'
            },
            {
                min: 90, max: 100,
                strengths: '文体素养卓越，具备多项文体特长，在相关领域有突出成就和影响力。',
                weaknesses: '需要注意平衡文体活动与学术学习，避免过度投入影响其他方面发展。',
                suggestions: '建议在文体领域建立个人品牌，考虑相关专业发展，充分发挥文体优势。'
            }
        ]
    },
    social: {
        name: '社交能力',
        ranges: [
            {
                min: 0, max: 60,
                strengths: '具备基本的社交意识，能够进行日常交流。',
                weaknesses: '社交能力相对薄弱，人际交往范围有限，团队协作能力有待提升。',
                suggestions: '建议多参与社交活动，加入社团组织，练习与人沟通交流，培养团队合作精神。'
            },
            {
                min: 60, max: 80,
                strengths: '社交能力较好，人际关系和谐，具备一定的团队协作能力。',
                weaknesses: '在领导力和公众表达方面还有提升空间，社交圈相对固定。',
                suggestions: '建议在团队中承担更多责任，练习公众演讲，拓展社交圈，提升领导力。'
            },
            {
                min: 80, max: 90,
                strengths: '社交能力出色，人际关系广泛，具备良好的领导力和团队协作能力。',
                weaknesses: '可能在某些特定社交场景下还需要进一步提升应变能力。',
                suggestions: '建议参与更多跨文化交流活动，提升国际化社交能力，建立更广泛的人脉网络。'
            },
            {
                min: 90, max: 100,
                strengths: '社交能力卓越，具备强大的领导力和人际影响力，在团队中发挥核心作用。',
                weaknesses: '需要注意保持真诚的社交态度，避免过度社交影响个人发展。',
                suggestions: '建议在社交领域建立个人影响力，考虑相关专业发展，充分发挥社交优势。'
            }
        ]
    },
    living: {
        name: '独立生活能力',
        ranges: [
            {
                min: 0, max: 60,
                strengths: '具备基本的生活自理能力。',
                weaknesses: '独立生活能力较弱，时间管理能力不足，自我管理意识有待提升。',
                suggestions: '建议培养独立生活技能，学习时间管理，提升自我管理能力，为留学做好准备。'
            },
            {
                min: 60, max: 80,
                strengths: '独立生活能力较好，具备基本的时间管理和自我管理能力。',
                weaknesses: '在某些生活技能方面还需要进一步提升，适应新环境的能力有待加强。',
                suggestions: '建议学习更多生活技能，提升适应能力，培养独立解决问题的能力。'
            },
            {
                min: 80, max: 90,
                strengths: '独立生活能力出色，具备良好的时间管理和自我管理能力，适应能力强。',
                weaknesses: '可能在某些特定生活场景下还需要进一步提升应变能力。',
                suggestions: '建议参与更多独立生活实践，提升跨文化适应能力，为海外生活做好充分准备。'
            },
            {
                min: 90, max: 100,
                strengths: '独立生活能力卓越，具备强大的自我管理能力和适应能力，能够快速适应新环境。',
                weaknesses: '需要注意保持独立生活技能，避免过度依赖他人。',
                suggestions: '建议在独立生活方面建立个人优势，考虑相关专业发展，充分发挥独立生活能力。'
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
    
    // 手动处理checkbox数据（FormData只保留最后一个同名checkbox的值）
    // 处理留学意向
    const selectedDestinations = getSelectedStudyDestinations();
    if (selectedDestinations.length > 0) {
        studentData.studyDestination = selectedDestinations.join('┋');
    }
    
    // 处理专业意向
    const selectedMajors = getSelectedMajorPreferences();
    if (selectedMajors.length > 0) {
        studentData.majorPreference = selectedMajors.join('┋');
    }
    
    // 处理才艺
    const selectedTalents = getSelectedTalents();
    if (selectedTalents.length > 0) {
        studentData.talents = selectedTalents.join('┋');
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
    
    // 先计算学术能力
    calculateAcademicAbility();
    
    // 计算语言能力
    calculateLanguageAbility();
    
    // 计算文体素养
    calculateArtisticQuality();
    
    // 计算社交能力
    calculateSocialAbility();
    
    // 计算独立生活能力
    calculateIndependentLiving();
    
    const radar = {
        academicAbility: parseInt(safeGetValue('academicAbility', '75')) || 75,
        languageAbility: parseInt(safeGetValue('languageAbility', '70')) || 70,
        artisticQuality: parseInt(safeGetValue('artisticQuality', '80')) || 80,
        socialAbility: parseInt(safeGetValue('socialAbility', '85')) || 85,
        independentLiving: parseInt(safeGetValue('independentLiving', '78')) || 78
    };

    const analysis = {
        academic: {
            strengths: safeGetValue('academicStrengths') || (getAbilityEvaluation('academic', radar.academicAbility)?.strengths || '学术能力有待提升'),
            weaknesses: safeGetValue('academicWeaknesses') || (getAbilityEvaluation('academic', radar.academicAbility)?.weaknesses || '学术基础需要加强'),
            suggestions: safeGetValue('academicSuggestions') || (getAbilityEvaluation('academic', radar.academicAbility)?.suggestions || '建议加强学术学习')
        },
        language: {
            strengths: safeGetValue('languageStrengths') || (getAbilityEvaluation('language', radar.languageAbility)?.strengths || '语言能力有待提升'),
            weaknesses: safeGetValue('languageWeaknesses') || (getAbilityEvaluation('language', radar.languageAbility)?.weaknesses || '语言基础需要加强'),
            suggestions: safeGetValue('languageSuggestions') || (getAbilityEvaluation('language', radar.languageAbility)?.suggestions || '建议加强语言学习')
        },
        artistic: {
            strengths: safeGetValue('artisticStrengths') || (getAbilityEvaluation('artistic', radar.artisticQuality)?.strengths || '文体素养有待提升'),
            weaknesses: safeGetValue('artisticWeaknesses') || (getAbilityEvaluation('artistic', radar.artisticQuality)?.weaknesses || '文体基础需要加强'),
            suggestions: safeGetValue('artisticSuggestions') || (getAbilityEvaluation('artistic', radar.artisticQuality)?.suggestions || '建议加强文体素养')
        },
        social: {
            strengths: safeGetValue('socialStrengths') || (getAbilityEvaluation('social', radar.socialAbility)?.strengths || '社交能力有待提升'),
            weaknesses: safeGetValue('socialWeaknesses') || (getAbilityEvaluation('social', radar.socialAbility)?.weaknesses || '社交基础需要加强'),
            suggestions: safeGetValue('socialSuggestions') || (getAbilityEvaluation('social', radar.socialAbility)?.suggestions || '建议加强社交能力')
        },
        living: {
            strengths: safeGetValue('livingStrengths') || (getAbilityEvaluation('living', radar.independentLiving)?.strengths || '独立生活能力有待提升'),
            weaknesses: safeGetValue('livingWeaknesses') || (getAbilityEvaluation('living', radar.independentLiving)?.weaknesses || '独立生活基础需要加强'),
            suggestions: safeGetValue('livingSuggestions') || (getAbilityEvaluation('living', radar.independentLiving)?.suggestions || '建议加强独立生活能力')
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
    
    if (detailedAnalysis.artistic.suggestions.includes('才艺') || detailedAnalysis.artistic.suggestions.includes('特长')) {
        suggestions.push('3. 发展文体特长，参与相关比赛和活动，提升综合素质');
    } else {
        suggestions.push('3. 深化文体素养，在优势领域建立突出表现');
    }
    
    if (detailedAnalysis.social.suggestions.includes('社交') || detailedAnalysis.social.suggestions.includes('沟通')) {
        suggestions.push('4. 加强社交能力培养，参与团队活动和志愿服务');
    } else {
        suggestions.push('4. 维持良好的社交关系，拓展人际网络');
    }
    
    if (detailedAnalysis.living.suggestions.includes('生活') || detailedAnalysis.living.suggestions.includes('独立')) {
        suggestions.push('5. 培养独立生活能力，学习时间管理和自我管理');
    } else {
        suggestions.push('5. 保持独立生活优势，为留学做好充分准备');
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
            languageAbility: parseInt(safeGetValue('languageAbility', '70')) || 70,
            artisticQuality: parseInt(safeGetValue('artisticQuality', '80')) || 80,
            socialAbility: parseInt(safeGetValue('socialAbility', '85')) || 85,
            independentLiving: parseInt(safeGetValue('independentLiving', '78')) || 78
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
                    logo: safeGetValue('reach1Logo'),
                    reason: safeGetValue('reach1Reason')
                },
                {
                    name: safeGetValue('reach2Name'),
                    major: safeGetValue('reach2Major'),
                    location: safeGetValue('reach2Location'),
                    logo: safeGetValue('reach2Logo'),
                    reason: safeGetValue('reach2Reason')
                }
            ],
            match: [
                {
                    name: safeGetValue('match1Name'),
                    major: safeGetValue('match1Major'),
                    location: safeGetValue('match1Location'),
                    logo: safeGetValue('match1Logo'),
                    reason: safeGetValue('match1Reason')
                },
                {
                    name: safeGetValue('match2Name'),
                    major: safeGetValue('match2Major'),
                    location: safeGetValue('match2Location'),
                    logo: safeGetValue('match2Logo'),
                    reason: safeGetValue('match2Reason')
                }
            ],
            safety: [
                {
                    name: safeGetValue('safety1Name'),
                    major: safeGetValue('safety1Major'),
                    location: safeGetValue('safety1Location'),
                    logo: safeGetValue('safety1Logo'),
                    reason: safeGetValue('safety1Reason')
                },
                {
                    name: safeGetValue('safety2Name'),
                    major: safeGetValue('safety2Major'),
                    location: safeGetValue('safety2Location'),
                    logo: safeGetValue('safety2Logo'),
                    reason: safeGetValue('safety2Reason')
                }
            ]
        },
        service: {
            title: safeGetValue('serviceTitle'),
            subtitle: safeGetValue('serviceSubtitle'),
            qrCodeImage: safeGetValue('qrCodeImage'),
            contactEmail: safeGetValue('contactEmail'),
            techSupport: safeGetValue('techSupport')
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
            document.getElementById('languageAbility').value = adminSettings.radar.languageAbility || 70;
            document.getElementById('artisticQuality').value = adminSettings.radar.artisticQuality || 80;
            document.getElementById('socialAbility').value = adminSettings.radar.socialAbility || 85;
            document.getElementById('independentLiving').value = adminSettings.radar.independentLiving || 78;
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
            
            // 语言能力
            if (adminSettings.detailedAnalysis.language) {
                const languageStrengths = document.getElementById('languageStrengths');
                const languageWeaknesses = document.getElementById('languageWeaknesses');
                const languageSuggestions = document.getElementById('languageSuggestions');
                if (languageStrengths) languageStrengths.value = adminSettings.detailedAnalysis.language.strengths || '';
                if (languageWeaknesses) languageWeaknesses.value = adminSettings.detailedAnalysis.language.weaknesses || '';
                if (languageSuggestions) languageSuggestions.value = adminSettings.detailedAnalysis.language.suggestions || '';
            }
            
            // 文体素养
            if (adminSettings.detailedAnalysis.artistic) {
                const artisticStrengths = document.getElementById('artisticStrengths');
                const artisticWeaknesses = document.getElementById('artisticWeaknesses');
                const artisticSuggestions = document.getElementById('artisticSuggestions');
                if (artisticStrengths) artisticStrengths.value = adminSettings.detailedAnalysis.artistic.strengths || '';
                if (artisticWeaknesses) artisticWeaknesses.value = adminSettings.detailedAnalysis.artistic.weaknesses || '';
                if (artisticSuggestions) artisticSuggestions.value = adminSettings.detailedAnalysis.artistic.suggestions || '';
            }
            
            // 社交能力
            if (adminSettings.detailedAnalysis.social) {
                const socialStrengths = document.getElementById('socialStrengths');
                const socialWeaknesses = document.getElementById('socialWeaknesses');
                const socialSuggestions = document.getElementById('socialSuggestions');
                if (socialStrengths) socialStrengths.value = adminSettings.detailedAnalysis.social.strengths || '';
                if (socialWeaknesses) socialWeaknesses.value = adminSettings.detailedAnalysis.social.weaknesses || '';
                if (socialSuggestions) socialSuggestions.value = adminSettings.detailedAnalysis.social.suggestions || '';
            }
            
            // 独立生活能力
            if (adminSettings.detailedAnalysis.living) {
                const livingStrengths = document.getElementById('livingStrengths');
                const livingWeaknesses = document.getElementById('livingWeaknesses');
                const livingSuggestions = document.getElementById('livingSuggestions');
                if (livingStrengths) livingStrengths.value = adminSettings.detailedAnalysis.living.strengths || '';
                if (livingWeaknesses) livingWeaknesses.value = adminSettings.detailedAnalysis.living.weaknesses || '';
                if (livingSuggestions) livingSuggestions.value = adminSettings.detailedAnalysis.living.suggestions || '';
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
                safeSetValue('reach1Reason', adminSettings.universities.reach[0].reason);
                
                safeSetValue('reach2Name', adminSettings.universities.reach[1].name);
                safeSetValue('reach2Major', adminSettings.universities.reach[1].major);
                safeSetValue('reach2Location', adminSettings.universities.reach[1].location);
                safeSetValue('reach2Logo', adminSettings.universities.reach[1].logo);
                safeSetValue('reach2Reason', adminSettings.universities.reach[1].reason);
            }
            
            // 稳妥院校
            if (adminSettings.universities.match && adminSettings.universities.match.length >= 2) {
                safeSetValue('match1Name', adminSettings.universities.match[0].name);
                safeSetValue('match1Major', adminSettings.universities.match[0].major);
                safeSetValue('match1Location', adminSettings.universities.match[0].location);
                safeSetValue('match1Logo', adminSettings.universities.match[0].logo);
                safeSetValue('match1Reason', adminSettings.universities.match[0].reason);
                
                safeSetValue('match2Name', adminSettings.universities.match[1].name);
                safeSetValue('match2Major', adminSettings.universities.match[1].major);
                safeSetValue('match2Location', adminSettings.universities.match[1].location);
                safeSetValue('match2Logo', adminSettings.universities.match[1].logo);
                safeSetValue('match2Reason', adminSettings.universities.match[1].reason);
            }
            
            // 保底院校
            if (adminSettings.universities.safety && adminSettings.universities.safety.length >= 2) {
                safeSetValue('safety1Name', adminSettings.universities.safety[0].name);
                safeSetValue('safety1Major', adminSettings.universities.safety[0].major);
                safeSetValue('safety1Location', adminSettings.universities.safety[0].location);
                safeSetValue('safety1Logo', adminSettings.universities.safety[0].logo);
                safeSetValue('safety1Reason', adminSettings.universities.safety[0].reason);
                
                safeSetValue('safety2Name', adminSettings.universities.safety[1].name);
                safeSetValue('safety2Major', adminSettings.universities.safety[1].major);
                safeSetValue('safety2Location', adminSettings.universities.safety[1].location);
                safeSetValue('safety2Logo', adminSettings.universities.safety[1].logo);
                safeSetValue('safety2Reason', adminSettings.universities.safety[1].reason);
            }
        }
        
        if (adminSettings.service) {
            safeSetValue('serviceTitle', adminSettings.service.title);
            safeSetValue('serviceSubtitle', adminSettings.service.subtitle);
            safeSetValue('qrCodeImage', adminSettings.service.qrCodeImage);
            safeSetValue('contactEmail', adminSettings.service.contactEmail);
            safeSetValue('techSupport', adminSettings.service.techSupport);
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

// ==================== Excel文件处理功能 ====================

// 处理Excel文件
function processXlsxFile() {
    const fileInput = document.getElementById('xlsxFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('请选择Excel文件');
        return;
    }
    
    // 显示加载状态
    const processBtn = document.getElementById('processBtn');
    processBtn.disabled = true;
    processBtn.textContent = '处理中...';
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            
            // 获取第一个工作表
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // 转换为JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
            
            // 处理数据
            processExcelData(jsonData);
            
        } catch (error) {
            console.error('Excel处理错误:', error);
            alert('Excel文件处理失败，请检查文件格式是否正确');
        } finally {
            // 恢复按钮状态
            processBtn.disabled = false;
            processBtn.textContent = '处理Excel文件';
        }
    };
    
    reader.onerror = function() {
        alert('文件读取失败');
        processBtn.disabled = false;
        processBtn.textContent = '处理Excel文件';
    };
    
    reader.readAsArrayBuffer(file);
}

// 处理Excel数据
function processExcelData(jsonData) {
    if (!jsonData || jsonData.length < 2) {
        alert('Excel文件数据不足，至少需要标题行和一行数据');
        return;
    }
    
    // 第一行是标题
    excelHeaders = jsonData[0];
    
    // 从第二行开始是数据
    excelData = jsonData.slice(1).map((row, index) => {
        const rowData = {};
        excelHeaders.forEach((header, colIndex) => {
            rowData[header] = row[colIndex] || '';
        });
        rowData._rowIndex = index + 1; // 添加行号
        return rowData;
    });
    
    // 显示文件信息
    showFileInfo();
    
    // 显示数据预览
    showDataPreview();
    
    // 显示相关按钮
    const fillFormBtn = document.getElementById('fillFormBtn');
    if (fillFormBtn) {
        fillFormBtn.style.display = 'inline-block';
    }
    
    console.log('Excel数据已加载:', excelData.length, '行数据');
    
    // 显示成功提示
    const fileInfo = document.getElementById('fileInfo');
    if (fileInfo) {
        fileInfo.innerHTML = `
            <div style="background-color: #e8f5e8; border: 1px solid #4caf50; color: #2e7d32; padding: 12px; border-radius: 8px; margin: 12px 0;">
                <strong>✅ Excel文件处理成功！</strong><br>
                共加载 ${excelData.length} 行数据，${excelHeaders.length} 列
            </div>
        `;
    }
}

// 显示文件信息
function showFileInfo() {
    const fileInfo = document.getElementById('fileInfo');
    const fileDetails = document.getElementById('fileDetails');
    
    // 生成带序号的列名列表
    const numberedHeaders = excelHeaders.map((header, index) => 
        `${index + 1}. ${header}`
    ).join('<br>');
    
    fileDetails.innerHTML = `
        <p><strong>总行数：</strong>${excelData.length}</p>
        <p><strong>总列数：</strong>${excelHeaders.length}</p>
        <p><strong>列名（带序号）：</strong></p>
        <div style="max-height: 200px; overflow-y: auto; background: #f8f9fa; padding: 10px; border-radius: 6px; font-size: 0.9rem; line-height: 1.4;">
            ${numberedHeaders}
        </div>
    `;
    
    fileInfo.style.display = 'block';
}

// 显示数据预览
function showDataPreview() {
    const dataPreview = document.getElementById('dataPreview');
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');
    
    // 创建表头（包含列序号）
    tableHeader.innerHTML = '';
    excelHeaders.forEach((header, index) => {
        const th = document.createElement('th');
        th.innerHTML = `
            <span class="column-number" title="点击复制列序号" onclick="copyColumnNumber(${index + 1})">${index + 1}</span>
            <span class="column-name">${header}</span>
        `;
        tableHeader.appendChild(th);
    });
    
    // 创建表格内容（只显示前5行作为预览）
    tableBody.innerHTML = '';
    const previewRows = excelData.slice(0, 5);
    
    previewRows.forEach((row, index) => {
        const tr = document.createElement('tr');
        excelHeaders.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header] || '';
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
    
    if (excelData.length > 5) {
        const moreRow = document.createElement('tr');
        const moreCell = document.createElement('td');
        moreCell.colSpan = excelHeaders.length;
        moreCell.textContent = `... 还有 ${excelData.length - 5} 行数据`;
        moreCell.style.textAlign = 'center';
        moreCell.style.color = '#666';
        moreRow.appendChild(moreCell);
        tableBody.appendChild(moreRow);
    }
    
    dataPreview.style.display = 'block';
}

// 导出为JSON
function exportToJson() {
    const dataStr = JSON.stringify(excelData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'excel_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('JSON文件已导出');
}

// 从Excel数据生成报告
function generateReportsFromExcel() {
    if (!excelData || excelData.length === 0) {
        alert('没有可用的Excel数据');
        return;
    }
    
    // 获取当前管理设置
    const savedAdminSettings = localStorage.getItem('adminSettings');
    const adminSettings = savedAdminSettings ? JSON.parse(savedAdminSettings) : {};
    
    let successCount = 0;
    let errorCount = 0;
    
    excelData.forEach((rowData, index) => {
        try {
            // 转换Excel数据为系统格式
            const studentData = convertExcelToStudentData(rowData);
            
            // 生成雷达图数据（这里可以根据具体规则计算）
            const radarData = generateRadarDataFromExcel(rowData);
            
            // 构建报告数据
            const reportData = {
                student: studentData,
                admin: {
                    ...adminSettings,
                    radar: radarData,
                    detailedAnalysis: generateAnalysisFromRadar(radarData)
                }
            };
            
            // 保存报告数据
            localStorage.setItem(`reportData_${index}`, JSON.stringify(reportData));
            
            successCount++;
            
        } catch (error) {
            console.error(`第${index + 1}行数据处理失败:`, error);
            errorCount++;
        }
    });
    
    alert(`报告生成完成！\n成功：${successCount}个\n失败：${errorCount}个\n\n请点击"查看所有报告"查看生成的报告。`);
    
    // 显示查看报告按钮
    const viewReportsBtn = document.getElementById('viewReportsBtn');
    if (viewReportsBtn) {
        viewReportsBtn.style.display = 'inline-block';
    }
}

// 将Excel数据填入学生信息录入表单
function fillStudentFormFromExcel(rowIndex = 0) {
    if (!excelData || excelData.length === 0) {
        alert('没有可用的Excel数据');
        return;
    }
    
    // 如果只传入一个参数且为0，让用户选择行
    if (arguments.length === 1 && rowIndex === 0) {
        let rowList = '请选择要填入表单的数据行：\n\n';
        excelData.forEach((row, index) => {
            const studentName = row[excelHeaders[7]] || `学生${index + 1}`; // 第8列是学生姓名
            rowList += `${index + 1}. ${studentName}\n`;
        });
        
        const choice = prompt(rowList);
        if (choice && !isNaN(choice)) {
            rowIndex = parseInt(choice) - 1;
        } else {
            return; // 用户取消
        }
    }
    
    if (rowIndex >= excelData.length || rowIndex < 0) {
        alert('行索引超出范围');
        return;
    }
    
    const rowData = excelData[rowIndex];
    
    // 根据你提供的映射关系填充表单
    // 列8对应studentName
    const studentNameField = document.getElementById('studentName');
    if (studentNameField) {
        studentNameField.value = rowData[excelHeaders[7]] || ''; // 第8列（索引7）
    }
    
    // 列9对应gender
    const genderField = document.getElementById('gender');
    if (genderField) {
        genderField.value = rowData[excelHeaders[8]] || ''; // 第9列（索引8）
    }
    
    // 列10对应grade
    const gradeField = document.getElementById('grade');
    if (gradeField) {
        gradeField.value = rowData[excelHeaders[9]] || ''; // 第10列（索引9）
    }
    
    // 列11对应school
    const schoolField = document.getElementById('school');
    if (schoolField) {
        schoolField.value = rowData[excelHeaders[10]] || ''; // 第11列（索引10）
    }
    
    // 列12对应subjectGroup
    const subjectGroupField = document.getElementById('subjectGroup');
    if (subjectGroupField) {
        subjectGroupField.value = rowData[excelHeaders[11]] || ''; // 第12列（索引11）
    }
    
    // 填充成绩字段（Excel的13-21列对应前9个成绩字段）
    const scoreFields = [
        'currentChinese',   // 语文
        'currentMath',      // 数学
        'currentEnglish',   // 英语
        'currentPhysics',   // 物理
        'currentBiology',   // 生物
        'currentChemistry', // 化学
        'currentHistory',   // 历史
        'currentPolitics',  // 政治
        'currentGeography'  // 地理
    ];
    
    let totalScore = 0;
    
    scoreFields.forEach((fieldName, index) => {
        const field = document.getElementById(fieldName);
        if (field) {
            const score = parseFloat(rowData[excelHeaders[12 + index]]) || 0; // 第13-21列（索引12-20）
            field.value = score;
            totalScore += score;
        }
    });
    
    // 自动计算并填充当前成绩总分
    const currentTotalField = document.getElementById('currentTotal');
    if (currentTotalField) {
        currentTotalField.value = totalScore;
    }
    
    // 填充预测成绩字段（Excel的22-30列对应预测成绩）
    const predictedScoreFields = [
        'predictedChinese',   // 语文
        'predictedMath',      // 数学
        'predictedEnglish',   // 英语
        'predictedPhysics',   // 物理
        'predictedBiology',   // 生物
        'predictedChemistry', // 化学
        'predictedHistory',   // 历史
        'predictedPolitics',  // 政治
        'predictedGeography'  // 地理
    ];
    
    let predictedTotalScore = 0;
    
    predictedScoreFields.forEach((fieldName, index) => {
        const field = document.getElementById(fieldName);
        if (field) {
            const score = parseFloat(rowData[excelHeaders[21 + index]]) || 0; // 第22-30列（索引21-29）
            field.value = score;
            predictedTotalScore += score;
        }
    });
    
    // 自动计算并填充预测成绩总分
    const predictedTotalField = document.getElementById('predictedTotal');
    if (predictedTotalField) {
        predictedTotalField.value = predictedTotalScore;
    }
    
    // 填充补习情况字段（Excel的35-36列对应补习情况）
    // 列35对应是否进行学科补习
    const hasTutoringField = document.getElementById('hasTutoring');
    if (hasTutoringField) {
        hasTutoringField.value = rowData[excelHeaders[34]] || ''; // 第35列（索引34）
    }
    
    // 列36对应正在补习的科目
    const tutoringSubjectsField = document.getElementById('tutoringSubjects');
    if (tutoringSubjectsField) {
        tutoringSubjectsField.value = rowData[excelHeaders[35]] || ''; // 第36列（索引35）
    }
    
    // 列37对应专业倾向（多选，用"┋"分隔）
    const majorPreferenceData = rowData[excelHeaders[36]] || ''; // 第37列（索引36）
    if (majorPreferenceData) {
        const majorPreferences = majorPreferenceData.split('┋').map(p => p.trim()).filter(p => p);
        setMajorPreferences(majorPreferences);
    }
    
    // 列39-43对应英语成绩详细分数
    const englishScoreFields = [
        'englishTotalScore',  // 总分
        'englishListening',   // 听力
        'englishReading',     // 阅读
        'englishSpeaking',    // 口语
        'englishWriting'      // 写作
    ];
    
    // 列38对应国际英语成绩类型
    const englishTestTypeField = document.getElementById('englishTestType');
    if (englishTestTypeField) {
        const testType = rowData[excelHeaders[37]] || ''; // 第38列（索引37）
        if (testType === '没有任何国际英语考试成绩') {
            englishTestTypeField.value = '暂无';
            // 当选择"暂无"时，清空所有成绩字段
            englishScoreFields.forEach(fieldName => {
                const field = document.getElementById(fieldName);
                if (field) {
                    field.value = '';
                    field.disabled = true;
                }
            });
        } else {
            englishTestTypeField.value = testType;
            // 当选择其他类型时，启用成绩字段
            englishScoreFields.forEach(fieldName => {
                const field = document.getElementById(fieldName);
                if (field) {
                    field.disabled = false;
                }
            });
        }
    }
    
    englishScoreFields.forEach((fieldName, index) => {
        const field = document.getElementById(fieldName);
        if (field) {
            const score = rowData[excelHeaders[38 + index]] || ''; // 第39-43列（索引38-42）
            if (score === '（跳过）') {
                field.value = '';
            } else {
                field.value = score;
            }
        }
    });
    
    // 列44对应留学意向国家/地区（多选，用"┋"分隔）
    const studyDestinationData = rowData[excelHeaders[43]] || ''; // 第44列（索引43）
    console.log('Excel第44列原始数据:', studyDestinationData);
    if (studyDestinationData) {
        const destinations = studyDestinationData.split('┋').map(d => d.trim()).filter(d => d);
        console.log('解析后的留学意向:', destinations);
        setStudyDestinations(destinations);
    }
    
    // 列45对应预期留学投入费用
    const budgetField = document.getElementById('budget');
    if (budgetField) {
        budgetField.value = rowData[excelHeaders[44]] || ''; // 第45列（索引44）
    }
    
    // 列46对应是否参加学校社团
    const hasClubField = document.getElementById('hasClub');
    if (hasClubField) {
        hasClubField.value = rowData[excelHeaders[45]] || ''; // 第46列（索引45）
    }
    
    // 列47对应参加的社团
    const clubActivitiesField = document.getElementById('clubActivities');
    if (clubActivitiesField) {
        clubActivitiesField.value = rowData[excelHeaders[46]] || ''; // 第47列（索引46）
    }
    
    // 列48对应是否有维持3年以上的兴趣爱好
    const hasLongTermHobbyField = document.getElementById('hasLongTermHobby');
    if (hasLongTermHobbyField) {
        hasLongTermHobbyField.value = rowData[excelHeaders[47]] || ''; // 第48列（索引47）
    }
    
    // 列49对应兴趣爱好
    const hobbiesField = document.getElementById('hobbies');
    if (hobbiesField) {
        hobbiesField.value = rowData[excelHeaders[48]] || ''; // 第49列（索引48）
    }
    
    // 列50对应经常来往的好友数量
    const friendsCountField = document.getElementById('friendsCount');
    if (friendsCountField) {
        friendsCountField.value = rowData[excelHeaders[49]] || ''; // 第50列（索引49）
    }
    
    // 列51对应才艺（多选，用"┋"分隔）
    const talentsData = rowData[excelHeaders[50]] || ''; // 第51列（索引50）
    console.log('Excel第51列原始数据:', talentsData);
    if (talentsData) {
        const talents = talentsData.split('┋').map(t => t.trim()).filter(t => t);
        console.log('解析后的才艺:', talents);
        setTalents(talents);
    }
    
    // 列52对应才艺证书资质或奖项
    const certificatesField = document.getElementById('certificates');
    if (certificatesField) {
        certificatesField.value = rowData[excelHeaders[51]] || ''; // 第52列（索引51）
    }
    
    // 列53对应整理生活和工作空间频率
    const organizationFrequencyField = document.getElementById('organizationFrequency');
    if (organizationFrequencyField) {
        organizationFrequencyField.value = rowData[excelHeaders[52]] || ''; // 第53列（索引52）
    }
    
    // 列54对应遇到困难是否向周围的人求助
    const askForHelpField = document.getElementById('askForHelp');
    if (askForHelpField) {
        askForHelpField.value = rowData[excelHeaders[53]] || ''; // 第54列（索引53）
    }
    
    // 列55对应是否会自己做饭
    const canCookField = document.getElementById('canCook');
    if (canCookField) {
        canCookField.value = rowData[excelHeaders[54]] || ''; // 第55列（索引54）
    }
    
    // 列56对应每天课外阅读时间
    const readingTimeField = document.getElementById('readingTime');
    if (readingTimeField) {
        readingTimeField.value = rowData[excelHeaders[55]] || ''; // 第56列（索引55）
    }
    
    console.log(`已填充第${rowIndex + 1}行数据到学生信息表单`);
    console.log('填充的数据:', {
        studentName: rowData[excelHeaders[7]],
        gender: rowData[excelHeaders[8]],
        grade: rowData[excelHeaders[9]],
        school: rowData[excelHeaders[10]],
        subjectGroup: rowData[excelHeaders[11]],
        currentScores: scoreFields.map((field, index) => ({
            field: field,
            value: rowData[excelHeaders[12 + index]]
        })),
        currentTotalScore: totalScore,
        predictedScores: predictedScoreFields.map((field, index) => ({
            field: field,
            value: rowData[excelHeaders[21 + index]]
        })),
        predictedTotalScore: predictedTotalScore,
        hasTutoring: rowData[excelHeaders[34]],
        tutoringSubjects: rowData[excelHeaders[35]],
        majorPreference: rowData[excelHeaders[36]],
        englishTestType: rowData[excelHeaders[37]],
        englishScores: englishScoreFields.map((field, index) => ({
            field: field,
            value: rowData[excelHeaders[38 + index]]
        })),
        studyDestination: rowData[excelHeaders[43]],
        budget: rowData[excelHeaders[44]],
        hasClub: rowData[excelHeaders[45]],
        clubActivities: rowData[excelHeaders[46]],
        hasLongTermHobby: rowData[excelHeaders[47]],
        hobbies: rowData[excelHeaders[48]],
        friendsCount: rowData[excelHeaders[49]],
        talents: rowData[excelHeaders[50]],
        certificates: rowData[excelHeaders[51]],
        organizationFrequency: rowData[excelHeaders[52]],
        askForHelp: rowData[excelHeaders[53]],
        canCook: rowData[excelHeaders[54]],
        readingTime: rowData[excelHeaders[55]]
    });
    
    // 计算并更新学术能力
    calculateAcademicAbility();
    
    // 计算并更新语言能力
    calculateLanguageAbility();
    
    // 计算并更新文体素养
    calculateArtisticQuality();
    
    // 计算并更新社交能力
    calculateSocialAbility();
    
    // 计算并更新独立生活能力
    calculateIndependentLiving();
    
    alert(`已成功将第${rowIndex + 1}行数据填入学生信息录入表单！\n\n学生姓名: ${rowData[excelHeaders[7]] || '未填写'}\n当前总分: ${totalScore}分\n预测总分: ${predictedTotalScore}分`);
}

// 转换Excel数据为学生数据格式
function convertExcelToStudentData(rowData) {
    return {
        studentName: rowData['1、学生姓名：'] || '',
        gender: rowData['2、学生性别：'] || '',
        grade: rowData['3、所在年级：'] || '',
        school: rowData['4、您所在的学校名称：'] || '',
        subjectGroup: rowData['5、学生的学科分组是？'] || '',
        studyDestination: rowData['15、请选择学生有留学意愿的国家或地区'] || '',
        majorPreference: rowData['12、请选择学生大学倾向就读的专业方向'] || '',
        englishTestType: rowData['13、请选择学生目前已有成绩的国际英语考试'] || '',
        englishScore: rowData['14、请填写其中一项国际英语考试的成绩—总分'] || '',
        budget: rowData['16、预期留学投入费用（含学费和生活费）'] || '',
        hasClub: rowData['17、学生是否有在学校参加社团？'] || '',
        clubActivities: rowData['18、请填写学生参加的社团'] || '',
        hasLongTermHobby: rowData['19、学生是否有一项持续3年以上的兴趣爱好？'] || '',
        hobbies: rowData['20、请填写学生持续3年以上的兴趣或爱好'] || '',
        friendsCount: rowData['21、除了同学，学生在外有多少个经常来往的朋友？'] || '',
        talents: rowData['22、学生是否有持续学习3年以上音乐、舞蹈、体育、艺术等各方面的才艺？'] || '',
        certificates: rowData['23、请填写学生有在才艺相关的领域获得的证书、资质或奖项？'] || '',
        organizationFrequency: rowData['24、学生多久会整理一次自己的生活与工作空间？'] || '',
        askForHelp: rowData['25、学生在遇到困难时，是否会主动向身边的人进行求助？'] || '',
        canCook: rowData['26、学生是否会自己做饭？'] || '',
        readingTime: rowData['27、学生平均每天课外阅读的时间'] || '',
        currentTotal: calculateCurrentTotal(rowData),
        predictedTotal: calculatePredictedTotal(rowData),
        // 保存原始Excel数据用于后续分析
        rawData: rowData
    };
}

// 计算当前总分
function calculateCurrentTotal(rowData) {
    const subjects = ['语文', '数学', '英语', '物理', '生物', '化学', '历史', '政治', '地理'];
    let total = 0;
    
    subjects.forEach(subject => {
        const score = parseFloat(rowData[`6、${subject}`]) || 0;
        total += score;
    });
    
    return total.toString();
}

// 计算预测总分
function calculatePredictedTotal(rowData) {
    const subjects = ['语文', '数学', '英语', '物理', '生物', '化学', '历史', '政治', '地理'];
    let total = 0;
    
    subjects.forEach(subject => {
        const score = parseFloat(rowData[`7、${subject}`]) || 0;
        total += score;
    });
    
    return total.toString();
}

// 根据Excel数据生成雷达图数据
function generateRadarDataFromExcel(rowData) {
    // 这里可以根据具体的计算规则来生成雷达图数据
    // 暂时使用默认值，后续可以根据你的规则进行调整
    return {
        academicAbility: 75,
        languageAbility: 70,
        artisticQuality: 80,
        socialAbility: 85,
        independentLiving: 78
    };
}

// 根据雷达图数据生成分析
function generateAnalysisFromRadar(radarData) {
    return {
        academic: getAbilityEvaluation('academic', radarData.academicAbility) || {
            strengths: '学术能力有待提升',
            weaknesses: '学术基础需要加强',
            suggestions: '建议加强学术学习'
        },
        language: getAbilityEvaluation('language', radarData.languageAbility) || {
            strengths: '语言能力有待提升',
            weaknesses: '语言基础需要加强',
            suggestions: '建议加强语言学习'
        },
        artistic: getAbilityEvaluation('artistic', radarData.artisticQuality) || {
            strengths: '文体素养有待提升',
            weaknesses: '文体基础需要加强',
            suggestions: '建议加强文体素养'
        },
        social: getAbilityEvaluation('social', radarData.socialAbility) || {
            strengths: '社交能力有待提升',
            weaknesses: '社交基础需要加强',
            suggestions: '建议加强社交能力'
        },
        living: getAbilityEvaluation('living', radarData.independentLiving) || {
            strengths: '独立生活能力有待提升',
            weaknesses: '独立生活基础需要加强',
            suggestions: '建议加强独立生活能力'
        }
    };
}

// 复制列序号到剪贴板
function copyColumnNumber(columnNumber) {
    navigator.clipboard.writeText(columnNumber.toString()).then(() => {
        // 显示临时提示
        const tooltip = document.createElement('div');
        tooltip.textContent = `列序号 ${columnNumber} 已复制`;
        tooltip.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--primary-color);
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 0.9rem;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(tooltip);
        
        setTimeout(() => {
            document.body.removeChild(tooltip);
        }, 1500);
    }).catch(err => {
        console.error('复制失败:', err);
        alert(`列序号 ${columnNumber}`);
    });
}

// 查看所有报告
function viewAllReports() {
    // 检查有多少个报告
    const reportKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('reportData_')) {
            reportKeys.push(key);
        }
    }
    
    if (reportKeys.length === 0) {
        alert('没有找到生成的报告');
        return;
    }
    
    // 创建报告列表
    let reportList = '已生成的报告列表：\n\n';
    reportKeys.forEach((key, index) => {
        try {
            const reportData = JSON.parse(localStorage.getItem(key));
            const studentName = reportData.student?.studentName || `学生${index + 1}`;
            reportList += `${index + 1}. ${studentName}\n`;
        } catch (error) {
            reportList += `${index + 1}. 报告${index + 1}（数据格式错误）\n`;
        }
    });
    
    reportList += '\n请选择要查看的报告：';
    
    const choice = prompt(reportList);
    if (choice && !isNaN(choice)) {
        const index = parseInt(choice) - 1;
        if (index >= 0 && index < reportKeys.length) {
            const key = reportKeys[index];
            const studentIndex = key.replace('reportData_', '');
            window.open(`report.html?student=${studentIndex}`, '_blank');
        }
    }
}

// 自动计算当前成绩总分
function calculateCurrentTotalScore() {
    const scoreFields = [
        'currentChinese',   // 语文
        'currentMath',      // 数学
        'currentEnglish',   // 英语
        'currentPhysics',   // 物理
        'currentBiology',   // 生物
        'currentChemistry', // 化学
        'currentHistory',   // 历史
        'currentPolitics',  // 政治
        'currentGeography'  // 地理
    ];
    
    let totalScore = 0;
    
    scoreFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            const score = parseFloat(field.value) || 0;
            totalScore += score;
        }
    });
    
    const currentTotalField = document.getElementById('currentTotal');
    if (currentTotalField) {
        currentTotalField.value = totalScore;
    }
    
    return totalScore;
}

// 自动计算预测成绩总分
function calculatePredictedTotalScore() {
    const scoreFields = [
        'predictedChinese',   // 语文
        'predictedMath',      // 数学
        'predictedEnglish',   // 英语
        'predictedPhysics',   // 物理
        'predictedBiology',   // 生物
        'predictedChemistry', // 化学
        'predictedHistory',   // 历史
        'predictedPolitics',  // 政治
        'predictedGeography'  // 地理
    ];
    
    let totalScore = 0;
    
    scoreFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            const score = parseFloat(field.value) || 0;
            totalScore += score;
        }
    });
    
    const predictedTotalField = document.getElementById('predictedTotal');
    if (predictedTotalField) {
        predictedTotalField.value = totalScore;
    }
    
    // 计算并更新学术能力
    calculateAcademicAbility();
    
    // 计算并更新语言能力
    calculateLanguageAbility();
    
    // 计算并更新文体素养
    calculateArtisticQuality();
    
    // 计算并更新社交能力
    calculateSocialAbility();
    
    // 计算并更新独立生活能力
    calculateIndependentLiving();
    
    return totalScore;
}

// 计算学术能力
function calculateAcademicAbility() {
    const predictedTotalField = document.getElementById('predictedTotal');
    const subjectGroupField = document.getElementById('subjectGroup');
    const academicAbilityField = document.getElementById('academicAbility');
    
    if (!predictedTotalField || !subjectGroupField || !academicAbilityField) {
        return;
    }
    
    const predictedTotal = parseFloat(predictedTotalField.value) || 0;
    const subjectGroup = subjectGroupField.value;
    
    // 根据学科分组确定基准分
    let baseScore;
    if (subjectGroup === '物理组') {
        baseScore = 430;
    } else if (subjectGroup === '历史组') {
        baseScore = 460;
    } else {
        // 如果未选择学科分组，不计算学术能力
        return;
    }
    
    // 计算公式：60 + 0.2 * (预测总分 - 基准分)
    let academicAbility = 60 + 0.2 * (predictedTotal - baseScore);
    
    // 限制在0-100范围内
    academicAbility = Math.max(0, Math.min(100, academicAbility));
    
    // 更新学术能力字段
    academicAbilityField.value = Math.round(academicAbility);
}

// 计算语言能力
function calculateLanguageAbility() {
    const englishTestTypeField = document.getElementById('englishTestType');
    const englishTotalScoreField = document.getElementById('englishTotalScore');
    const predictedEnglishField = document.getElementById('predictedEnglish');
    const languageAbilityField = document.getElementById('languageAbility');
    
    if (!englishTestTypeField || !languageAbilityField) {
        return;
    }
    
    const englishTestType = englishTestTypeField.value;
    let languageAbility = 0;
    
    if (englishTestType === '雅思') {
        const totalScore = parseFloat(englishTotalScoreField?.value) || 0;
        languageAbility = (totalScore / 9) * 100;
    } else if (englishTestType === '托福') {
        const totalScore = parseFloat(englishTotalScoreField?.value) || 0;
        languageAbility = (totalScore / 120) * 100;
    } else if (englishTestType === 'PTE') {
        const totalScore = parseFloat(englishTotalScoreField?.value) || 0;
        languageAbility = (totalScore / 90) * 100;
    } else if (englishTestType === '多邻国') {
        const totalScore = parseFloat(englishTotalScoreField?.value) || 0;
        languageAbility = (totalScore / 160) * 100;
    } else if (englishTestType === '暂无') {
        const predictedEnglish = parseFloat(predictedEnglishField?.value) || 0;
        let ieltsScore = 0;
        
        if (predictedEnglish >= 140) {
            ieltsScore = 6.5;
        } else if (predictedEnglish >= 130) {
            ieltsScore = 6.0;
        } else if (predictedEnglish >= 120) {
            ieltsScore = 5.5;
        } else if (predictedEnglish >= 110) {
            ieltsScore = 5.0;
        } else {
            // 小于110分的情况：按分数/110 * 5 计算，然后向下取整到0.5的倍数
            const rawScore = (predictedEnglish / 110) * 5;
            ieltsScore = Math.floor(rawScore * 2) / 2; // 向下取整到0.5的倍数
        }
        
        languageAbility = (ieltsScore / 9) * 100;
    }
    
    // 限制在0-100范围内并取整
    languageAbility = Math.max(0, Math.min(100, languageAbility));
    languageAbilityField.value = Math.round(languageAbility);
}

// 计算文体素养
function calculateArtisticQuality() {
    const hasClubField = document.getElementById('hasClub');
    const hasLongTermHobbyField = document.getElementById('hasLongTermHobby');
    const talentsGroup = document.querySelectorAll('input[name="talents"]');
    const readingTimeField = document.getElementById('readingTime');
    const artisticQualityField = document.getElementById('artisticQuality');
    
    if (!artisticQualityField) {
        return;
    }
    
    let totalScore = 0;
    
    // 第一项：hasClub（25分）
    const hasClub = hasClubField?.value;
    if (hasClub === '是') {
        totalScore += 25;
    }
    
    // 第二项：hasLongTermHobby（25分）
    const hasLongTermHobby = hasLongTermHobbyField?.value;
    if (hasLongTermHobby === '是') {
        totalScore += 25;
    }
    
    // 第三项：talentsGroup（25分）
    let hasTalents = true;
    talentsGroup.forEach(checkbox => {
        if (checkbox.value === '否' && checkbox.checked) {
            hasTalents = false;
        }
    });
    if (hasTalents) {
        totalScore += 25;
    }
    
    // 第四项：readingTime（25分，按比例计算）
    const readingTime = parseFloat(readingTimeField?.value) || 0;
    const readingScore = Math.min(25, (readingTime / 8) * 25);
    totalScore += readingScore;
    
    // 限制在0-100范围内并取整
    totalScore = Math.max(0, Math.min(100, totalScore));
    artisticQualityField.value = Math.round(totalScore);
}

// 计算社交能力
function calculateSocialAbility() {
    const hasClubField = document.getElementById('hasClub');
    const friendsCountField = document.getElementById('friendsCount');
    const askForHelpField = document.getElementById('askForHelp');
    const socialAbilityField = document.getElementById('socialAbility');
    
    if (!socialAbilityField) {
        return;
    }
    
    let totalScore = 0;
    
    // 第一项：hasClub（25分）
    const hasClub = hasClubField?.value;
    if (hasClub === '是') {
        totalScore += 25;
    }
    
    // 第二项：friendsCount（50分）
    const friendsCount = friendsCountField?.value;
    if (friendsCount === '没有') {
        totalScore += 0;
    } else if (friendsCount === '1-3个') {
        totalScore += 25;
    } else if (friendsCount === '3-5个') {
        totalScore += 35;
    } else if (friendsCount === '5个以上') {
        totalScore += 50;
    }
    
    // 第三项：askForHelp（25分）
    const askForHelp = askForHelpField?.value;
    if (askForHelp === '会马上向身边的人求助') {
        totalScore += 25;
    } else if (askForHelp === '先自己尝试努力，无法解决时再求助') {
        totalScore += 12.5;
    } else if (askForHelp === '无论如何都要靠自己，不希望麻烦别人') {
        totalScore += 0;
    }
    
    // 限制在0-100范围内并取整
    totalScore = Math.max(0, Math.min(100, totalScore));
    socialAbilityField.value = Math.round(totalScore);
}

// 计算独立生活能力
function calculateIndependentLiving() {
    const organizationFrequencyField = document.getElementById('organizationFrequency');
    const askForHelpField = document.getElementById('askForHelp');
    const canCookField = document.getElementById('canCook');
    const independentLivingField = document.getElementById('independentLiving');
    
    if (!independentLivingField) {
        return;
    }
    
    let totalScore = 0;
    
    // 第一项：organizationFrequency（50分）
    const organizationFrequency = organizationFrequencyField?.value;
    if (organizationFrequency === '从不整理') {
        totalScore += 0;
    } else if (organizationFrequency === '半年至少一次') {
        totalScore += 12;
    } else if (organizationFrequency === '每月至少一次') {
        totalScore += 25;
    } else if (organizationFrequency === '每周至少一次') {
        totalScore += 40;
    } else if (organizationFrequency === '每天至少一次') {
        totalScore += 50;
    }
    
    // 第二项：askForHelp（25分）
    const askForHelp = askForHelpField?.value;
    if (askForHelp === '会马上向身边的人求助') {
        totalScore += 12;
    } else if (askForHelp === '先自己尝试努力，无法解决时再求助') {
        totalScore += 25;
    } else if (askForHelp === '无论如何都要靠自己，不希望麻烦别人') {
        totalScore += 12;
    }
    
    // 第三项：canCook（25分）
    const canCook = canCookField?.value;
    if (canCook === '是') {
        totalScore += 25;
    }
    
    // 限制在0-100范围内并取整
    totalScore = Math.max(0, Math.min(100, totalScore));
    independentLivingField.value = Math.round(totalScore);
}

// 自动计算总分（兼容旧版本）
function calculateTotalScore() {
    calculateCurrentTotalScore();
}

// 获取选中的专业倾向值
function getSelectedMajorPreferences() {
    const checkboxes = document.querySelectorAll('input[name="majorPreference"]:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// 设置专业倾向复选框
function setMajorPreferences(preferences) {
    // 清除所有复选框的选中状态
    const checkboxes = document.querySelectorAll('input[name="majorPreference"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // 选中指定的复选框
    if (Array.isArray(preferences)) {
        preferences.forEach(preference => {
            const checkbox = document.querySelector(`input[name="majorPreference"][value="${preference}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }
}

// 获取选中的留学意向
function getSelectedStudyDestinations() {
    const checkboxes = document.querySelectorAll('input[name="studyDestination"]:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// 设置留学意向复选框
function setStudyDestinations(destinations) {
    console.log('设置留学意向:', destinations);
    
    // 清除所有复选框的选中状态
    const checkboxes = document.querySelectorAll('input[name="studyDestination"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // 选中指定的复选框
    if (Array.isArray(destinations)) {
        destinations.forEach(destination => {
            console.log('尝试选中:', destination);
            const checkbox = document.querySelector(`input[name="studyDestination"][value="${destination}"]`);
            if (checkbox) {
                checkbox.checked = true;
                console.log('成功选中:', destination);
            } else {
                console.log('未找到复选框:', destination);
            }
        });
    }
    
    // 显示所有可用的复选框值
    const allCheckboxes = document.querySelectorAll('input[name="studyDestination"]');
    console.log('所有可用的复选框值:');
    allCheckboxes.forEach(checkbox => {
        console.log('-', checkbox.value);
    });
}

// 获取选中的才艺
function getSelectedTalents() {
    const checkboxes = document.querySelectorAll('input[name="talents"]:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// 设置才艺复选框
function setTalents(talents) {
    console.log('设置才艺:', talents);
    
    // 清除所有复选框的选中状态
    const checkboxes = document.querySelectorAll('input[name="talents"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // 选中指定的复选框
    if (Array.isArray(talents)) {
        talents.forEach(talent => {
            console.log('尝试选中才艺:', talent);
            const checkbox = document.querySelector(`input[name="talents"][value="${talent}"]`);
            if (checkbox) {
                checkbox.checked = true;
                console.log('成功选中才艺:', talent);
            } else {
                console.log('未找到才艺复选框:', talent);
            }
        });
    }
    
    // 显示所有可用的复选框值
    const allCheckboxes = document.querySelectorAll('input[name="talents"]');
    console.log('所有可用的才艺复选框值:');
    allCheckboxes.forEach(checkbox => {
        console.log('-', checkbox.value);
    });
    
    // 计算文体素养
    calculateArtisticQuality();
    
    // 计算社交能力
    calculateSocialAbility();
}

// 文件选择事件处理
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('xlsxFile');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const processBtn = document.getElementById('processBtn');
            
            if (file) {
                processBtn.disabled = false;
                console.log('已选择文件:', file.name);
            } else {
                processBtn.disabled = true;
            }
        });
    }
    
    // 为当前成绩字段添加自动计算总分的监听器
    const currentScoreFields = [
        'currentChinese', 'currentMath', 'currentEnglish', 'currentPhysics', 
        'currentBiology', 'currentChemistry', 'currentHistory', 'currentPolitics', 'currentGeography'
    ];
    
    currentScoreFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('input', calculateCurrentTotalScore);
        }
    });
    
    // 为预测成绩字段添加自动计算总分的监听器
    const predictedScoreFields = [
        'predictedChinese', 'predictedMath', 'predictedEnglish', 'predictedPhysics', 
        'predictedBiology', 'predictedChemistry', 'predictedHistory', 'predictedPolitics', 'predictedGeography'
    ];
    
    predictedScoreFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('input', calculatePredictedTotalScore);
        }
    });
    
    // 为学科分组添加监听器，当变化时重新计算学术能力
    const subjectGroupField = document.getElementById('subjectGroup');
    if (subjectGroupField) {
        subjectGroupField.addEventListener('change', calculateAcademicAbility);
    }
    
    // 为预测总分字段添加监听器，当直接修改时重新计算学术能力
    const predictedTotalField = document.getElementById('predictedTotal');
    if (predictedTotalField) {
        predictedTotalField.addEventListener('input', calculateAcademicAbility);
    }
    
    // 为英语总分添加监听器，当变化时重新计算语言能力
    const englishTotalScoreField = document.getElementById('englishTotalScore');
    if (englishTotalScoreField) {
        englishTotalScoreField.addEventListener('input', calculateLanguageAbility);
    }
    
    // 为预测英语成绩添加监听器，当变化时重新计算语言能力
    const predictedEnglishField = document.getElementById('predictedEnglish');
    if (predictedEnglishField) {
        predictedEnglishField.addEventListener('input', calculateLanguageAbility);
    }
    
    // 为文体素养相关字段添加监听器
    const hasClubField = document.getElementById('hasClub');
    if (hasClubField) {
        hasClubField.addEventListener('change', function() {
            calculateArtisticQuality();
            calculateSocialAbility();
        });
    }
    
    const hasLongTermHobbyField = document.getElementById('hasLongTermHobby');
    if (hasLongTermHobbyField) {
        hasLongTermHobbyField.addEventListener('change', calculateArtisticQuality);
    }
    
    const readingTimeField = document.getElementById('readingTime');
    if (readingTimeField) {
        readingTimeField.addEventListener('input', calculateArtisticQuality);
    }
    
    // 为才艺复选框添加监听器
    const talentsCheckboxes = document.querySelectorAll('input[name="talents"]');
    talentsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculateArtisticQuality);
    });
    
    // 为社交能力相关字段添加监听器
    const friendsCountField = document.getElementById('friendsCount');
    if (friendsCountField) {
        friendsCountField.addEventListener('change', calculateSocialAbility);
    }
    
    const askForHelpField = document.getElementById('askForHelp');
    if (askForHelpField) {
        askForHelpField.addEventListener('change', function() {
            calculateSocialAbility();
            calculateIndependentLiving();
        });
    }
    
    // 为独立生活能力相关字段添加监听器
    const organizationFrequencyField = document.getElementById('organizationFrequency');
    if (organizationFrequencyField) {
        organizationFrequencyField.addEventListener('change', calculateIndependentLiving);
    }
    
    const canCookField = document.getElementById('canCook');
    if (canCookField) {
        canCookField.addEventListener('change', calculateIndependentLiving);
    }
    
    // 为英语成绩类型添加监听器
    const englishTestTypeField = document.getElementById('englishTestType');
    if (englishTestTypeField) {
        englishTestTypeField.addEventListener('change', function() {
            const englishScoreFields = [
                'englishTotalScore', 'englishListening', 'englishReading', 'englishSpeaking', 'englishWriting'
            ];
            
            if (this.value === '暂无') {
                // 当选择"暂无"时，清空并禁用所有成绩字段
                englishScoreFields.forEach(fieldName => {
                    const field = document.getElementById(fieldName);
                    if (field) {
                        field.value = '';
                        field.disabled = true;
                    }
                });
            } else {
                // 当选择其他类型时，启用成绩字段
                englishScoreFields.forEach(fieldName => {
                    const field = document.getElementById(fieldName);
                    if (field) {
                        field.disabled = false;
                    }
                });
            }
            
            // 计算语言能力
            calculateLanguageAbility();
        });
    }
    
    // 检查是否有已生成的报告
    const reportKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('reportData_')) {
            reportKeys.push(key);
        }
    }
    
    if (reportKeys.length > 0) {
        const viewReportsBtn = document.getElementById('viewReportsBtn');
        if (viewReportsBtn) {
            viewReportsBtn.style.display = 'inline-block';
        }
    }
}); 