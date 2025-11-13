// 全局变量
let studentData = {};
let adminSettings = {};
let excelData = []; // 存储Excel数据
let excelHeaders = []; // 存储Excel表头

// Excel表头映射表 - 根据新的表头格式
const EXCEL_HEADER_MAPPING = {
    // 基本信息列
    studentName: '1. 学生姓名:  ',
    gender: '2. 学生性别:  ',
    grade: '3. 所在年级:  ',
    school: '4. 学生所在的学校名称:  ',
    subjectGroup: '5. 学生的学科分组（或意向分组）是?  ',
    
    // 当前成绩列
    currentChinese: '6.请填写最后一次联考或期末考试成绩（如无相关科目成绩，则输入0）—语文',
    currentMath: '数学',
    currentEnglish: '英语',
    currentPhysics: '物理',
    currentBiology: '生物',
    currentChemistry: '化学',
    currentHistory: '历史',
    currentGeography: '地理',
    currentPolitics: '政治',
    
    // 预测成绩列
    predictedChinese: '7.请填写预计的高考成绩（如无相关科目成绩，则输入0）—语文',
    predictedMath: '数学',
    predictedEnglish: '英语',
    predictedPhysics: '物理',
    predictedBiology: '生物',
    predictedChemistry: '化学',
    predictedHistory: '历史',
    predictedGeography: '地理',
    predictedPolitics: '政治',
    
    // 学业水平考试列
    academicLevelPass: '8. 是否通过学业水平考试',
    academicSubject1: '9. 请填写学业水平成绩—科目1(科目)',
    academicScore1: '科目1(分数)',
    academicSubject2: '科目2(科目)',
    academicScore2: '科目2(分数)',
    academicSubject3: '科目3(科目)',
    academicScore3: '科目3(分数)',
    
    // 补习情况
    hasTutoring: '10. 是否有进行学科补习  ',
    tutoringSubjects: '11.请选择有补过或正在补习的科目',
    
    // 专业和英语
    majorPreference: '12. 请选择学生大学倾向就读的专业方向  ',
    englishTestType: '13. 请选择学生目前已有成绩的国际英语考试  ',
    englishTotalScore: '请填写其中一项国际英语考试的成绩—总分',
    englishListening: '听力',
    englishSpeaking: '口语',
    englishReading: '阅读',
    englishWriting: '写作',
    
    // 留学意向
    studyDestination: '15. 请选择学生有留学意愿的国家或地区  ',
    budget: '16. 预期留学投入费用（含学费和生活费）  ',
    
    // 社团和兴趣
    hasClub: '17. 学生是否有在学校参加社团?  ',
    clubActivities: '18. 请填写学生参加的社团  ',
    hasLongTermHobby: '19. 学生是否有一项持续3年以上的兴趣爱好?  ',
    hobbies: '20. 请填写学生持续3年以上的兴趣或爱好  ',
    friendsCount: '21. 除了同学，学生在外有多少个经常来往的朋友?  ',
    
    // 才艺相关
    talents: '22. 学生是否有持续学习3年以上音乐、舞蹈、体育、艺术等各方面的才艺?  ',
    certificates: '23. 请填写学生有在才艺相关的领域获得的证书、资质或奖项?  ',
    organizationFrequency: '24. 学生多久会整理一次自己的生活与工作空间?  ',
    
    // 新增评估维度
    askForHelp: '25. 学生在生活中遇到困难时会选择如何应对？',
    studyPersistence: '26.在学习中遇到阻碍时，学生会面对并坚持解决吗？',
    internationalExperience: '27.学生自小学之后有多长时间的国外生活经历？',
    campExperience: '28.学生自初中之后是否有参加过任何类型的夏令营/冬令营？',
    canCook: '29.学生的做饭水平符合以下哪个描述？',
    readingTime: '30. 学生平均每天花多少小时进行课外阅读？'
};

// 辅助函数：安全地获取Excel列值
function getExcelValue(rowData, headerKey) {
    const headerName = EXCEL_HEADER_MAPPING[headerKey];
    if (!headerName) {
        console.warn(`未找到表头映射: ${headerKey}`);
        return '';
    }
    
    // 预处理：去除表头的前后空格
    const trimmedHeaderName = headerName.trim();
    
    // 尝试多种匹配方式
    let value = rowData[headerName] || rowData[trimmedHeaderName];
    
    // 如果还是找不到，尝试模糊匹配（去除所有空格）
    if (value === undefined || value === null || value === '') {
        const normalizedHeaderName = headerName.replace(/\s+/g, '');
        const matchingKey = Object.keys(rowData).find(key => 
            key.replace(/\s+/g, '') === normalizedHeaderName
        );
        if (matchingKey) {
            value = rowData[matchingKey];
            console.log(`模糊匹配成功: "${headerName}" -> "${matchingKey}"`);
        }
    }
    
    // 为英语总分字段添加特殊调试
    if (headerKey === 'englishTotalScore') {
        console.log(`getExcelValue调试 - ${headerKey}:`, {
            'headerKey': headerKey,
            'headerName': headerName,
            'trimmedHeaderName': trimmedHeaderName,
            'rowData中是否有原始键': headerName in rowData,
            'rowData中是否有trimmed键': trimmedHeaderName in rowData,
            'rowData中所有键': Object.keys(rowData),
            '匹配的键': Object.keys(rowData).find(key => key === headerName),
            'trimmed匹配的键': Object.keys(rowData).find(key => key === trimmedHeaderName),
            '最终值': value,
            '值的类型': typeof value,
            '是否为空': value === '' || value === null || value === undefined
        });
    }
    
    return value || '';
}

// 四维能力评价数据库
const abilityEvaluations = {
    academic: {
        name: '学术能力',
        ranges: [
            {
                min: 0, max: 60,
                description: '基础知识有一定积累，具备学习潜力。学术基础相对薄弱，理论知识掌握不够扎实，解决复杂问题的能力有待提升。建议加强基础学科学习，多做练习题巩固知识点，可考虑参加补习班或找学科导师指导。'
            },
            {
                min: 60, max: 80,
                description: '学术基础较为扎实，理论知识掌握良好，具备一定的学科思维能力。在深层次理解和创新思维方面还有提升空间，缺乏跨学科整合能力。建议参与更多学术挑战项目，如数学竞赛、科学实验等，培养批判性思维和创新能力。'
            },
            {
                min: 80, max: 90,
                description: '学术水平优秀，知识结构完整，具备强的逻辑思维和分析能力，能够独立解决复杂问题。在某些前沿领域的探索深度可能不够，需要更多实践应用经验。建议参与科研项目或学术竞赛，发表学术论文，申请参加高校夏令营等学术活动。'
            },
            {
                min: 90, max: 100,
                description: '学术能力卓越，知识面广博且深入，具备强大的研究能力和创新思维，在学科领域表现突出。需要注意保持学习的广度，避免过分专精而忽视其他重要能力的发展。建议申请顶尖大学，参与国际学术交流，考虑提前接触大学级别的研究项目。'
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
                description: '在此级别，考生能够理解并使用熟悉的日常表达和非常基本的短语来满足具体类型的需求。能够自我介绍和他人介绍，并能够询问和回答有关个人信息的问题，例如居住地、认识的人以及拥有的物品。能够进行简单的互动，前提是对方说话缓慢清晰，并愿意提供帮助。'
            },
            {
                min: 60, max: 65,
                description: '这个水平的考生能够理解与最直接相关领域（例如，非常基本的个人和家庭信息、购物、当地地理、就业）相关的句子和常用表达。能够就简单日常的任务进行交流，这些任务需要就熟悉的日常事务进行简单直接的信息交换。能够用简单的术语描述自己的背景、周围环境以及急需解决的问题。'
            },
            {
                min: 65, max: 70,
                description: '该级别的考生应具备以下素质：能够理解清晰标准输入的要点，这些输入内容通常涉及工作、学习、休闲等日常常见话题。能够应对使用该语言的地区可能遇到的大多数情况。能够就熟悉或个人感兴趣的话题撰写简单连贯的文字。能够描述经历和事件、梦想、希望和抱负，并简要阐述观点和计划的理由和解释。'
            },
            {
                min: 70, max: 80,
                description: '这个级别的考生能够理解关于具体和抽象主题的复杂文本的主要思想，包括其专业领域的技术讨论。能够以一定的口语流利度和自发性进行交流，从而能够与流利的说话者进行日常交流，且不会给双方带来任何压力。能够就广泛的主题撰写清晰、详细的文本，并阐述对某个热门话题的观点，并列举各种方案的优缺点。'
            },
            {
                min: 80, max: 90,
                description: '这是非常高的英语水平。本科课程通常不要求达到这一水平。达到这一水平的考生：能够理解各种难度较高的长篇文章，并能理解文章的隐含含义。能够流利、自然地表达自己，无需刻意寻找表达方式。能够灵活有效地运用语言进行社交、学术和职业交流。能够就复杂主题撰写清晰、结构良好、内容详尽的文本，并能熟练运用组织模式、连接词和衔接手段。'
            },
            {
                min: 90, max: 100,
                description: '达到这一水平的考生：能够轻松理解几乎所有听到或读到的内容。能够概括来自不同口头和书面来源的信息，并以连贯的方式重构论点和叙述。能够自如、流利且准确地表达自己，即使在更复杂的情况下也能区分细微的含义。'
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
                description: '学生的文体相关的活动比较有限。在这个阶段，学生的兴趣爱好更多的是停留在喜欢的层面上，并没有把兴趣爱好、才艺或知识转化成实际的产出。因此不利于申请对学生综合素质要求高的院校。'
            },
            {
                min: 60, max: 80,
                description: '学生有一定程度的文体活动和素养。这个阶段的学生专注于其中一项或者两项爱好或特长，并有参与与之相关的活动。'
            },
            {
                min: 80, max: 100,
                description: '学生有丰富的文体活动，且家庭能够提供很好的氛围和经济支持。这个阶段的学生通常才艺和兴趣广泛，有一定程度的生活见识或海外生活。'
            }
        ]
    },
    social: {
        name: '生活能力',
        ranges: [
            {
                min: 0, max: 60,
                description: '学生的生活技能和社交能力都比较匮乏。这意味着学生海外求学时在需要多人协作的场合会遭遇一些的困难，同时生活上暂时无法节约太多，需要经过一定时间的适应。'
            },
            {
                min: 60, max: 70,
                description: '学生的生活技能和社交能力的其中一项能力还不错。这表示学生可能在生活上可以依靠自己的能力节约一部分生活费用，或者能够在学校中通过社交较快地融入身边的社群。'
            },
            {
                min: 70, max: 90,
                description: '学生的生活技能和社交能力均达到一定程度，且其中一项比较突出。这样的学生通常拥有较好的独立生活能力，在生活或学习上陷入困境时具备较好的自我调节能力。'
            },
            {
                min: 90, max: 100,
                description: '学生的生活技能和社交能力出类拔萃。这样的学生通常能够自主解决生活中的方方面面，能够在陌生环境中认识并筛选适合自己的朋友。'
            }
        ]
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadAdminSettings();
    initUniversityData();
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
    
    // 如果切换到推荐信息录入页面，更新状态提示并填充推荐数据
    if (tabName === 'admin') {
        updateAdminStatus();
        // 检查是否有推荐数据需要填充
        setTimeout(() => {
            fillRecommendationFields();
        }, 300);
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
    
    // 处理才艺（现在是文本输入，直接获取值）
    const talentsField = document.getElementById('talents');
    if (talentsField && talentsField.value.trim()) {
        studentData.talents = talentsField.value.trim();
    }
    
    // 验证必填字段
    if (!validateRequiredFields()) {
        alert('请填写所有必填字段！');
        return;
    }
    
    // 保存学生数据到localStorage
    localStorage.setItem('studentData', JSON.stringify(studentData));
    
    // 先计算四维能力分数
    calculateAcademicAbility();
    calculateLanguageAbility();
    calculateArtisticQuality();
    calculateSocialAbility();
    
    // 跳转到推荐信息录入页面并填充数据
    fillRecommendationPage();
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

// 填充推荐信息录入页面
function fillRecommendationPage() {
    // 验证必填字段（但不阻止执行）
    const studentName = document.getElementById('studentName')?.value;
    const gender = document.getElementById('gender')?.value;
    const grade = document.getElementById('grade')?.value;
    const school = document.getElementById('school')?.value;
    const subjectGroup = document.getElementById('subjectGroup')?.value;
    
    if (!studentName || !gender || !grade || !school || !subjectGroup) {
        const confirmFill = confirm('部分必填字段未填写，是否继续计算并填入推荐信息？\n（未填写的字段将使用默认值或空值）');
        if (!confirmFill) {
            return;
        }
    }
    
    // 确保预测总分已计算（如果用户没有手动填写）
    const predictedTotalField = document.getElementById('predictedTotal');
    if (predictedTotalField && (!predictedTotalField.value || predictedTotalField.value === '0')) {
        // 如果预测总分为空或0，尝试自动计算
        calculatePredictedTotalScore();
        console.log('自动计算预测总分:', predictedTotalField.value);
    }
    
    // 直接计算四维能力分数（不依赖DOM元素）
    const academicAbility = calculateAcademicAbilityValue();
    const languageAbility = calculateLanguageAbilityValue();
    const artisticQuality = calculateArtisticQualityValue();
    const socialAbility = calculateSocialAbilityValue();
    
    console.log('计算出的能力值:', { 
        academicAbility, 
        languageAbility, 
        artisticQuality, 
        socialAbility,
        predictedTotal: predictedTotalField?.value,
        subjectGroup: document.getElementById('subjectGroup')?.value
    });
    
    // 生成合并的分析内容
    const academicAnalysis = generateMergedAnalysis('academic', academicAbility);
    const languageAnalysis = generateMergedAnalysis('language', languageAbility);
    const artisticAnalysis = generateMergedAnalysis('artistic', artisticQuality);
    const socialAnalysis = generateMergedAnalysis('social', socialAbility);
    
    // 生成综合提升建议（根据四维分析自动生成）
    // 从描述文本中提取建议部分（兼容新旧格式）
    const getSuggestionFromEvaluation = (evaluation) => {
        if (evaluation?.suggestions) {
            return evaluation.suggestions;
        }
        if (evaluation?.description) {
            // 尝试从描述中提取建议部分（以"建议"开头的内容）
            const match = evaluation.description.match(/建议[^。]+[。]/g);
            return match ? match.join(' ') : '';
        }
        return '';
    };
    
    const detailedAnalysis = {
        academic: { suggestions: getSuggestionFromEvaluation(getAbilityEvaluation('academic', academicAbility)) },
        language: { suggestions: getSuggestionFromEvaluation(getAbilityEvaluation('language', languageAbility)) },
        artistic: { suggestions: getSuggestionFromEvaluation(getAbilityEvaluation('artistic', artisticQuality)) },
        social: { suggestions: getSuggestionFromEvaluation(getAbilityEvaluation('social', socialAbility)) }
    };
    const overallSuggestions = generateOverallSuggestions(detailedAnalysis);
    
    console.log('生成的分析内容:', { academicAnalysis, languageAnalysis, artisticAnalysis, socialAnalysis });
    console.log('生成的综合建议:', overallSuggestions);
    
    // 保存到localStorage，供推荐信息录入页面使用
    localStorage.setItem('recommendationData', JSON.stringify({
        academicAbility,
        languageAbility,
        artisticQuality,
        socialAbility,
        academicAnalysis,
        languageAnalysis,
        artisticAnalysis,
        socialAnalysis,
        overallSuggestions
    }));
    
    // 跳转到推荐信息录入页面
    showTab('admin');
    
    // 使用多次尝试确保填充成功
    let attempts = 0;
    const maxAttempts = 10;
    
    const tryFillFields = () => {
        attempts++;
        const filled = fillRecommendationFields();
        
        // 如果填充失败且还有尝试次数，继续尝试
        if (!filled && attempts < maxAttempts) {
            setTimeout(tryFillFields, 100);
        } else if (filled) {
            console.log(`填充成功，尝试了 ${attempts} 次`);
        } else {
            console.warn(`填充失败，已尝试 ${attempts} 次`);
        }
    };
    
    // 延迟后开始尝试填充
    setTimeout(tryFillFields, 300);
}

// 生成合并的分析内容（直接返回描述文本）
function generateMergedAnalysis(abilityType, score) {
    const evaluation = getAbilityEvaluation(abilityType, score);
    if (!evaluation) {
        return '';
    }
    
    // 直接返回描述文本（新格式）或合并旧格式（兼容性）
    if (evaluation.description) {
        return evaluation.description;
    }
    
    // 兼容旧格式：合并优势、不足和建议为一个完整的分析文本
    let analysis = '';
    if (evaluation.strengths) {
        analysis += `${evaluation.strengths} `;
    }
    if (evaluation.weaknesses) {
        analysis += `${evaluation.weaknesses} `;
    }
    if (evaluation.suggestions) {
        analysis += evaluation.suggestions;
    }
    
    return analysis.trim();
}

// 填充推荐信息录入页面的字段
function fillRecommendationFields() {
    const data = localStorage.getItem('recommendationData');
    if (!data) {
        console.log('没有找到推荐数据');
        return false;
    }
    
    try {
        const recommendationData = JSON.parse(data);
        console.log('准备填充推荐数据:', recommendationData);
        
        // 填充四维能力分数
        const academicAbilityField = document.getElementById('academicAbility');
        const languageAbilityField = document.getElementById('languageAbility');
        const artisticQualityField = document.getElementById('artisticQuality');
        const socialAbilityField = document.getElementById('socialAbility');
        
        let filledCount = 0;
        const totalFields = 4;
        
        if (academicAbilityField) {
            // 确保数值正确填充，包括0值
            const academicValue = recommendationData.academicAbility !== undefined && recommendationData.academicAbility !== null 
                ? recommendationData.academicAbility 
                : '';
            academicAbilityField.value = academicValue;
            // 触发input事件，确保值被正确设置
            academicAbilityField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('已填充学术能力:', academicValue, '(原始值:', recommendationData.academicAbility, ')');
            filledCount++;
        } else {
            console.warn('未找到学术能力字段');
        }
        
        if (languageAbilityField) {
            const languageValue = recommendationData.languageAbility !== undefined && recommendationData.languageAbility !== null 
                ? recommendationData.languageAbility 
                : '';
            languageAbilityField.value = languageValue;
            languageAbilityField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('已填充语言能力:', languageValue);
            filledCount++;
        } else {
            console.warn('未找到语言能力字段');
        }
        
        if (artisticQualityField) {
            const artisticValue = recommendationData.artisticQuality !== undefined && recommendationData.artisticQuality !== null 
                ? recommendationData.artisticQuality 
                : '';
            artisticQualityField.value = artisticValue;
            artisticQualityField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('已填充文体素养:', artisticValue);
            filledCount++;
        } else {
            console.warn('未找到文体素养字段');
        }
        
        if (socialAbilityField) {
            const socialValue = recommendationData.socialAbility !== undefined && recommendationData.socialAbility !== null 
                ? recommendationData.socialAbility 
                : '';
            socialAbilityField.value = socialValue;
            socialAbilityField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('已填充生活能力:', socialValue);
            filledCount++;
        } else {
            console.warn('未找到生活能力字段');
        }
        
        // 填充分析内容
        const academicAnalysisField = document.getElementById('academicAnalysis');
        const languageAnalysisField = document.getElementById('languageAnalysis');
        const artisticAnalysisField = document.getElementById('artisticAnalysis');
        const socialAnalysisField = document.getElementById('socialAnalysis');
        
        if (academicAnalysisField) {
            academicAnalysisField.value = recommendationData.academicAnalysis || '';
            academicAnalysisField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('已填充学术分析');
        }
        if (languageAnalysisField) {
            languageAnalysisField.value = recommendationData.languageAnalysis || '';
            languageAnalysisField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('已填充语言分析');
        }
        if (artisticAnalysisField) {
            artisticAnalysisField.value = recommendationData.artisticAnalysis || '';
            artisticAnalysisField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('已填充文体分析');
        }
        if (socialAnalysisField) {
            socialAnalysisField.value = recommendationData.socialAnalysis || '';
            socialAnalysisField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('已填充生活分析');
        }
        
        // 填充综合提升建议
        const overallSuggestionsField = document.getElementById('overallSuggestions');
        if (overallSuggestionsField && recommendationData.overallSuggestions) {
            overallSuggestionsField.value = recommendationData.overallSuggestions;
            overallSuggestionsField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('已填充综合建议');
        }
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // 如果所有四维能力字段都填充成功，返回true
        const success = filledCount === totalFields;
        if (success) {
            console.log('推荐信息填充完成，所有字段已填充');
        } else {
            console.warn(`推荐信息部分填充完成，成功填充 ${filledCount}/${totalFields} 个能力字段`);
        }
        
        return success;
    } catch (error) {
        console.error('填充推荐信息失败:', error);
        return false;
    }
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
    
    const radar = {
        academicAbility: parseInt(safeGetValue('academicAbility', '75')) || 75,
        languageAbility: parseInt(safeGetValue('languageAbility', '70')) || 70,
        artisticQuality: parseInt(safeGetValue('artisticQuality', '80')) || 80,
        socialAbility: parseInt(safeGetValue('socialAbility', '85')) || 85
    };

    // 从新的单文本框读取分析内容，如果没有则根据分数生成
    const academicAnalysis = safeGetValue('academicAnalysis') || generateMergedAnalysis('academic', radar.academicAbility);
    const languageAnalysis = safeGetValue('languageAnalysis') || generateMergedAnalysis('language', radar.languageAbility);
    const artisticAnalysis = safeGetValue('artisticAnalysis') || generateMergedAnalysis('artistic', radar.artisticQuality);
    const socialAnalysis = safeGetValue('socialAnalysis') || generateMergedAnalysis('social', radar.socialAbility);
    
    // 解析分析内容，提取优势、不足和建议（为了兼容旧格式）
    function parseAnalysis(analysisText) {
        if (!analysisText) {
            return { strengths: '', weaknesses: '', suggestions: '' };
        }
        
        const strengthsMatch = analysisText.match(/【优势】([^\n]+)/);
        const weaknessesMatch = analysisText.match(/【不足】([^\n]+)/);
        const suggestionsMatch = analysisText.match(/【建议】([^\n]+)/);
        
        return {
            strengths: strengthsMatch ? strengthsMatch[1].trim() : '',
            weaknesses: weaknessesMatch ? weaknessesMatch[1].trim() : '',
            suggestions: suggestionsMatch ? suggestionsMatch[1].trim() : '',
            fullText: analysisText // 保存完整文本
        };
    }

    const analysis = {
        academic: parseAnalysis(academicAnalysis),
        language: parseAnalysis(languageAnalysis),
        artistic: parseAnalysis(artisticAnalysis),
        social: parseAnalysis(socialAnalysis)
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
    
    if (detailedAnalysis.social.suggestions.includes('生活') || detailedAnalysis.social.suggestions.includes('独立')) {
        suggestions.push('4. 加强生活能力培养，学习独立生活技能');
    } else {
        suggestions.push('4. 维持良好的生活习惯，提升自理能力');
    }
    
    suggestions.push('5. 培养综合能力，全面提升个人素质');
    
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
    
    // 保存新的单文本框分析内容到fullText字段
    const academicAnalysisText = safeGetValue('academicAnalysis');
    const languageAnalysisText = safeGetValue('languageAnalysis');
    const artisticAnalysisText = safeGetValue('artisticAnalysis');
    const socialAnalysisText = safeGetValue('socialAnalysis');
    
    if (academicAnalysisText) detailedAnalysis.academic.fullText = academicAnalysisText;
    if (languageAnalysisText) detailedAnalysis.language.fullText = languageAnalysisText;
    if (artisticAnalysisText) detailedAnalysis.artistic.fullText = artisticAnalysisText;
    if (socialAnalysisText) detailedAnalysis.social.fullText = socialAnalysisText;
    
    adminSettings = {
        radar: {
            academicAbility: parseInt(safeGetValue('academicAbility', '75')) || 75,
            languageAbility: parseInt(safeGetValue('languageAbility', '70')) || 70,
            artisticQuality: parseInt(safeGetValue('artisticQuality', '80')) || 80,
            socialAbility: parseInt(safeGetValue('socialAbility', '85')) || 85
        },
        detailedAnalysis: detailedAnalysis,
        analysis: {
            suggestions: safeGetValue('overallSuggestions') || generateOverallSuggestions(detailedAnalysis)
        },
        universities: {
            reach: [
                {
                    name: safeGetValue('reach1Name'),
                    englishName: safeGetValue('reach1EnglishName'),
                    majorDirection: safeGetValue('reach1MajorDirection'),
                    major: safeGetValue('reach1Major'),
                    location: safeGetValue('reach1Location'),
                    logo: safeGetValue('reach1Logo'),
                    reason: safeGetValue('reach1Reason')
                },
                {
                    name: safeGetValue('reach2Name'),
                    englishName: safeGetValue('reach2EnglishName'),
                    majorDirection: safeGetValue('reach2MajorDirection'),
                    major: safeGetValue('reach2Major'),
                    location: safeGetValue('reach2Location'),
                    logo: safeGetValue('reach2Logo'),
                    reason: safeGetValue('reach2Reason')
                }
            ],
            match: [
                {
                    name: safeGetValue('match1Name'),
                    englishName: safeGetValue('match1EnglishName'),
                    majorDirection: safeGetValue('match1MajorDirection'),
                    major: safeGetValue('match1Major'),
                    location: safeGetValue('match1Location'),
                    logo: safeGetValue('match1Logo'),
                    reason: safeGetValue('match1Reason')
                },
                {
                    name: safeGetValue('match2Name'),
                    englishName: safeGetValue('match2EnglishName'),
                    majorDirection: safeGetValue('match2MajorDirection'),
                    major: safeGetValue('match2Major'),
                    location: safeGetValue('match2Location'),
                    logo: safeGetValue('match2Logo'),
                    reason: safeGetValue('match2Reason')
                }
            ],
            safety: [
                {
                    name: safeGetValue('safety1Name'),
                    englishName: safeGetValue('safety1EnglishName'),
                    majorDirection: safeGetValue('safety1MajorDirection'),
                    major: safeGetValue('safety1Major'),
                    location: safeGetValue('safety1Location'),
                    logo: safeGetValue('safety1Logo'),
                    reason: safeGetValue('safety1Reason')
                },
                {
                    name: safeGetValue('safety2Name'),
                    englishName: safeGetValue('safety2EnglishName'),
                    majorDirection: safeGetValue('safety2MajorDirection'),
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
            const academicAbilityEl = document.getElementById('academicAbility');
            const languageAbilityEl = document.getElementById('languageAbility');
            const artisticQualityEl = document.getElementById('artisticQuality');
            const socialAbilityEl = document.getElementById('socialAbility');
            
            if (academicAbilityEl) academicAbilityEl.value = adminSettings.radar.academicAbility || 75;
            if (languageAbilityEl) languageAbilityEl.value = adminSettings.radar.languageAbility || 70;
            if (artisticQualityEl) artisticQualityEl.value = adminSettings.radar.artisticQuality || 80;
            if (socialAbilityEl) socialAbilityEl.value = adminSettings.radar.socialAbility || 85;
        }
        
        // 填充四维详细分析（支持新旧两种格式）
        if (adminSettings.detailedAnalysis) {
            // 优先使用新的单文本框格式
            const academicAnalysisField = document.getElementById('academicAnalysis');
            const languageAnalysisField = document.getElementById('languageAnalysis');
            const artisticAnalysisField = document.getElementById('artisticAnalysis');
            const socialAnalysisField = document.getElementById('socialAnalysis');
            
            // 如果有新的单文本框，使用fullText或合并旧格式
            if (academicAnalysisField && adminSettings.detailedAnalysis.academic) {
                if (adminSettings.detailedAnalysis.academic.fullText) {
                    academicAnalysisField.value = adminSettings.detailedAnalysis.academic.fullText;
                } else if (adminSettings.detailedAnalysis.academic.strengths || adminSettings.detailedAnalysis.academic.weaknesses || adminSettings.detailedAnalysis.academic.suggestions) {
                    // 合并旧格式的三个字段
                    let merged = '';
                    if (adminSettings.detailedAnalysis.academic.strengths) merged += `【优势】${adminSettings.detailedAnalysis.academic.strengths}\n\n`;
                    if (adminSettings.detailedAnalysis.academic.weaknesses) merged += `【不足】${adminSettings.detailedAnalysis.academic.weaknesses}\n\n`;
                    if (adminSettings.detailedAnalysis.academic.suggestions) merged += `【建议】${adminSettings.detailedAnalysis.academic.suggestions}`;
                    academicAnalysisField.value = merged.trim();
                }
            }
            
            if (languageAnalysisField && adminSettings.detailedAnalysis.language) {
                if (adminSettings.detailedAnalysis.language.fullText) {
                    languageAnalysisField.value = adminSettings.detailedAnalysis.language.fullText;
                } else if (adminSettings.detailedAnalysis.language.strengths || adminSettings.detailedAnalysis.language.weaknesses || adminSettings.detailedAnalysis.language.suggestions) {
                    let merged = '';
                    if (adminSettings.detailedAnalysis.language.strengths) merged += `【优势】${adminSettings.detailedAnalysis.language.strengths}\n\n`;
                    if (adminSettings.detailedAnalysis.language.weaknesses) merged += `【不足】${adminSettings.detailedAnalysis.language.weaknesses}\n\n`;
                    if (adminSettings.detailedAnalysis.language.suggestions) merged += `【建议】${adminSettings.detailedAnalysis.language.suggestions}`;
                    languageAnalysisField.value = merged.trim();
                }
            }
            
            if (artisticAnalysisField && adminSettings.detailedAnalysis.artistic) {
                if (adminSettings.detailedAnalysis.artistic.fullText) {
                    artisticAnalysisField.value = adminSettings.detailedAnalysis.artistic.fullText;
                } else if (adminSettings.detailedAnalysis.artistic.strengths || adminSettings.detailedAnalysis.artistic.weaknesses || adminSettings.detailedAnalysis.artistic.suggestions) {
                    let merged = '';
                    if (adminSettings.detailedAnalysis.artistic.strengths) merged += `【优势】${adminSettings.detailedAnalysis.artistic.strengths}\n\n`;
                    if (adminSettings.detailedAnalysis.artistic.weaknesses) merged += `【不足】${adminSettings.detailedAnalysis.artistic.weaknesses}\n\n`;
                    if (adminSettings.detailedAnalysis.artistic.suggestions) merged += `【建议】${adminSettings.detailedAnalysis.artistic.suggestions}`;
                    artisticAnalysisField.value = merged.trim();
                }
            }
            
            if (socialAnalysisField && adminSettings.detailedAnalysis.social) {
                if (adminSettings.detailedAnalysis.social.fullText) {
                    socialAnalysisField.value = adminSettings.detailedAnalysis.social.fullText;
                } else if (adminSettings.detailedAnalysis.social.strengths || adminSettings.detailedAnalysis.social.weaknesses || adminSettings.detailedAnalysis.social.suggestions) {
                    let merged = '';
                    if (adminSettings.detailedAnalysis.social.strengths) merged += `【优势】${adminSettings.detailedAnalysis.social.strengths}\n\n`;
                    if (adminSettings.detailedAnalysis.social.weaknesses) merged += `【不足】${adminSettings.detailedAnalysis.social.weaknesses}\n\n`;
                    if (adminSettings.detailedAnalysis.social.suggestions) merged += `【建议】${adminSettings.detailedAnalysis.social.suggestions}`;
                    socialAnalysisField.value = merged.trim();
                }
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
                safeSetValue('reach1EnglishName', adminSettings.universities.reach[0].englishName);
                safeSetValue('reach1MajorDirection', adminSettings.universities.reach[0].majorDirection);
                safeSetValue('reach1Major', adminSettings.universities.reach[0].major);
                safeSetValue('reach1Location', adminSettings.universities.reach[0].location);
                safeSetValue('reach1Logo', adminSettings.universities.reach[0].logo);
                safeSetValue('reach1Reason', adminSettings.universities.reach[0].reason);
                
                safeSetValue('reach2Name', adminSettings.universities.reach[1].name);
                safeSetValue('reach2EnglishName', adminSettings.universities.reach[1].englishName);
                safeSetValue('reach2MajorDirection', adminSettings.universities.reach[1].majorDirection);
                safeSetValue('reach2Major', adminSettings.universities.reach[1].major);
                safeSetValue('reach2Location', adminSettings.universities.reach[1].location);
                safeSetValue('reach2Logo', adminSettings.universities.reach[1].logo);
                safeSetValue('reach2Reason', adminSettings.universities.reach[1].reason);
            }
            
            // 稳妥院校
            if (adminSettings.universities.match && adminSettings.universities.match.length >= 2) {
                safeSetValue('match1Name', adminSettings.universities.match[0].name);
                safeSetValue('match1EnglishName', adminSettings.universities.match[0].englishName);
                safeSetValue('match1MajorDirection', adminSettings.universities.match[0].majorDirection);
                safeSetValue('match1Major', adminSettings.universities.match[0].major);
                safeSetValue('match1Location', adminSettings.universities.match[0].location);
                safeSetValue('match1Logo', adminSettings.universities.match[0].logo);
                safeSetValue('match1Reason', adminSettings.universities.match[0].reason);
                
                safeSetValue('match2Name', adminSettings.universities.match[1].name);
                safeSetValue('match2EnglishName', adminSettings.universities.match[1].englishName);
                safeSetValue('match2MajorDirection', adminSettings.universities.match[1].majorDirection);
                safeSetValue('match2Major', adminSettings.universities.match[1].major);
                safeSetValue('match2Location', adminSettings.universities.match[1].location);
                safeSetValue('match2Logo', adminSettings.universities.match[1].logo);
                safeSetValue('match2Reason', adminSettings.universities.match[1].reason);
            }
            
            // 保底院校
            if (adminSettings.universities.safety && adminSettings.universities.safety.length >= 2) {
                safeSetValue('safety1Name', adminSettings.universities.safety[0].name);
                safeSetValue('safety1EnglishName', adminSettings.universities.safety[0].englishName);
                safeSetValue('safety1MajorDirection', adminSettings.universities.safety[0].majorDirection);
                safeSetValue('safety1Major', adminSettings.universities.safety[0].major);
                safeSetValue('safety1Location', adminSettings.universities.safety[0].location);
                safeSetValue('safety1Logo', adminSettings.universities.safety[0].logo);
                safeSetValue('safety1Reason', adminSettings.universities.safety[0].reason);
                
                safeSetValue('safety2Name', adminSettings.universities.safety[1].name);
                safeSetValue('safety2EnglishName', adminSettings.universities.safety[1].englishName);
                safeSetValue('safety2MajorDirection', adminSettings.universities.safety[1].majorDirection);
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
            const studentName = getExcelValue(row, 'studentName') || `学生${index + 1}`;
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
    
    // 使用表头映射填充基本信息
    const studentNameField = document.getElementById('studentName');
    if (studentNameField) {
        studentNameField.value = getExcelValue(rowData, 'studentName');
    }
    
    const genderField = document.getElementById('gender');
    if (genderField) {
        genderField.value = getExcelValue(rowData, 'gender');
    }
    
    const gradeField = document.getElementById('grade');
    if (gradeField) {
        gradeField.value = getExcelValue(rowData, 'grade');
    }
    
    const schoolField = document.getElementById('school');
    if (schoolField) {
        schoolField.value = getExcelValue(rowData, 'school');
    }
    
    const subjectGroupField = document.getElementById('subjectGroup');
    if (subjectGroupField) {
        subjectGroupField.value = getExcelValue(rowData, 'subjectGroup');
    }
    
    // 填充当前成绩字段
    const currentScoreFields = [
        'currentChinese', 'currentMath', 'currentEnglish', 'currentPhysics', 
        'currentBiology', 'currentChemistry', 'currentHistory', 'currentGeography', 'currentPolitics'
    ];
    
    let totalScore = 0;
    
    currentScoreFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            const score = parseFloat(getExcelValue(rowData, fieldName)) || 0;
            field.value = score;
            totalScore += score;
        }
    });
    
    // 自动计算并填充当前成绩总分
    const currentTotalField = document.getElementById('currentTotal');
    if (currentTotalField) {
        currentTotalField.value = totalScore;
    }
    
    // 填充预测成绩字段
    const predictedScoreFields = [
        'predictedChinese', 'predictedMath', 'predictedEnglish', 'predictedPhysics', 
        'predictedBiology', 'predictedChemistry', 'predictedHistory', 'predictedGeography', 'predictedPolitics'
    ];
    
    let predictedTotalScore = 0;
    
    predictedScoreFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            const score = parseFloat(getExcelValue(rowData, fieldName)) || 0;
            field.value = score;
            predictedTotalScore += score;
        }
    });
    
    // 自动计算并填充预测成绩总分
    const predictedTotalField = document.getElementById('predictedTotal');
    if (predictedTotalField) {
        predictedTotalField.value = predictedTotalScore;
    }
    
    // 填充学业水平考试字段
    const academicLevelPassField = document.getElementById('academicLevelPass');
    if (academicLevelPassField) {
        academicLevelPassField.value = getExcelValue(rowData, 'academicLevelPass');
    }
    
    const academicSubject1Field = document.getElementById('academicSubject1');
    if (academicSubject1Field) {
        academicSubject1Field.value = getExcelValue(rowData, 'academicSubject1');
    }
    
    const academicScore1Field = document.getElementById('academicScore1');
    if (academicScore1Field) {
        academicScore1Field.value = getExcelValue(rowData, 'academicScore1');
    }
    
    const academicSubject2Field = document.getElementById('academicSubject2');
    if (academicSubject2Field) {
        academicSubject2Field.value = getExcelValue(rowData, 'academicSubject2');
    }
    
    const academicScore2Field = document.getElementById('academicScore2');
    if (academicScore2Field) {
        academicScore2Field.value = getExcelValue(rowData, 'academicScore2');
    }
    
    const academicSubject3Field = document.getElementById('academicSubject3');
    if (academicSubject3Field) {
        academicSubject3Field.value = getExcelValue(rowData, 'academicSubject3');
    }
    
    const academicScore3Field = document.getElementById('academicScore3');
    if (academicScore3Field) {
        academicScore3Field.value = getExcelValue(rowData, 'academicScore3');
    }
    
    // 填充补习情况字段
    const hasTutoringField = document.getElementById('hasTutoring');
    if (hasTutoringField) {
        hasTutoringField.value = getExcelValue(rowData, 'hasTutoring');
    }
    
    const tutoringSubjectsField = document.getElementById('tutoringSubjects');
    if (tutoringSubjectsField) {
        tutoringSubjectsField.value = getExcelValue(rowData, 'tutoringSubjects');
    }
    
    // 填充专业倾向（多选，用"┋"分隔）
    const majorPreferenceData = getExcelValue(rowData, 'majorPreference');
    if (majorPreferenceData) {
        const majorPreferences = majorPreferenceData.split('┋').map(p => p.trim()).filter(p => p);
        setMajorPreferences(majorPreferences);
    }
    
    // 填充英语成绩字段
    const englishScoreFields = [
        'englishTotalScore', 'englishListening', 'englishSpeaking', 'englishReading', 'englishWriting'
    ];
    
    console.log('英语成绩字段映射检查:');
    englishScoreFields.forEach(fieldName => {
        const headerMapping = EXCEL_HEADER_MAPPING[fieldName];
        console.log(`${fieldName} -> "${headerMapping}"`);
    });
    
    const englishTestTypeField = document.getElementById('englishTestType');
    if (englishTestTypeField) {
        const testType = getExcelValue(rowData, 'englishTestType');
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
    
    console.log('=== 英语考试数据读取调试 ===');
    console.log('rowData的所有键:', Object.keys(rowData));
    console.log('查找包含"总分"的键:', Object.keys(rowData).filter(key => key.includes('总分')));
    console.log('查找包含"英语"的键:', Object.keys(rowData).filter(key => key.includes('英语')));
    console.log('查找包含"考试"的键:', Object.keys(rowData).filter(key => key.includes('考试')));
    
    console.log('原始rowData中的英语相关字段:', {
        '请填写其中一项国际英语考试的成绩—总分': rowData['请填写其中一项国际英语考试的成绩—总分'],
        '听力': rowData['听力'],
        '口语': rowData['口语'],
        '阅读': rowData['阅读'],
        '写作': rowData['写作']
    });
    
    // 检查所有可能的总分字段
    const possibleTotalKeys = Object.keys(rowData).filter(key => 
        key.includes('总分') || key.includes('英语') || key.includes('考试')
    );
    console.log('可能的总分相关字段:', possibleTotalKeys.map(key => ({
        key: key,
        value: rowData[key],
        type: typeof rowData[key]
    })));
    
    englishScoreFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            const score = getExcelValue(rowData, fieldName);
            console.log(`英语成绩字段 ${fieldName}:`, {
                '字段名': fieldName,
                '映射的表头': EXCEL_HEADER_MAPPING[fieldName],
                '读取到的值': score,
                '值的类型': typeof score,
                '是否为空': score === '' || score === null || score === undefined
            });
            if (score === '（跳过）') {
                field.value = '';
            } else {
                field.value = score;
            }
        }
    });
    
    console.log('=== 英语考试数据读取调试结束 ===');
    
    // 填充留学意向（多选，用"┋"分隔）
    const studyDestinationData = getExcelValue(rowData, 'studyDestination');
    console.log('留学意向原始数据:', studyDestinationData);
    if (studyDestinationData) {
        const destinations = studyDestinationData.split('┋').map(d => d.trim()).filter(d => d);
        console.log('解析后的留学意向:', destinations);
        setStudyDestinations(destinations);
    }
    
    // 填充其他字段
    const budgetField = document.getElementById('budget');
    if (budgetField) {
        budgetField.value = getExcelValue(rowData, 'budget');
    }
    
    const hasClubField = document.getElementById('hasClub');
    if (hasClubField) {
        hasClubField.value = getExcelValue(rowData, 'hasClub');
    }
    
    const clubActivitiesField = document.getElementById('clubActivities');
    if (clubActivitiesField) {
        clubActivitiesField.value = getExcelValue(rowData, 'clubActivities');
    }
    
    const hasLongTermHobbyField = document.getElementById('hasLongTermHobby');
    if (hasLongTermHobbyField) {
        hasLongTermHobbyField.value = getExcelValue(rowData, 'hasLongTermHobby');
    }
    
    const hobbiesField = document.getElementById('hobbies');
    if (hobbiesField) {
        hobbiesField.value = getExcelValue(rowData, 'hobbies');
    }
    
    const friendsCountField = document.getElementById('friendsCount');
    if (friendsCountField) {
        friendsCountField.value = getExcelValue(rowData, 'friendsCount');
    }
    
    // 填充才艺（多选，用"┋"分隔）
    const talentsData = getExcelValue(rowData, 'talents');
    console.log('才艺原始数据:', talentsData);
    if (talentsData) {
        const talents = talentsData.split('┋').map(t => t.trim()).filter(t => t);
        console.log('解析后的才艺:', talents);
        setTalents(talents);
    }
    
    const certificatesField = document.getElementById('certificates');
    if (certificatesField) {
        certificatesField.value = getExcelValue(rowData, 'certificates');
    }
    
    const organizationFrequencyField = document.getElementById('organizationFrequency');
    if (organizationFrequencyField) {
        organizationFrequencyField.value = getExcelValue(rowData, 'organizationFrequency');
    }
    
    const askForHelpField = document.getElementById('askForHelp');
    if (askForHelpField) {
        askForHelpField.value = getExcelValue(rowData, 'askForHelp');
    }
    
    // 填充新增字段
    const studyPersistenceField = document.getElementById('studyPersistence');
    if (studyPersistenceField) {
        studyPersistenceField.value = getExcelValue(rowData, 'studyPersistence');
    }
    
    const internationalExperienceField = document.getElementById('internationalExperience');
    if (internationalExperienceField) {
        internationalExperienceField.value = getExcelValue(rowData, 'internationalExperience');
    }
    
    const campExperienceField = document.getElementById('campExperience');
    if (campExperienceField) {
        campExperienceField.value = getExcelValue(rowData, 'campExperience');
    }
    
    const canCookField = document.getElementById('canCook');
    if (canCookField) {
        canCookField.value = getExcelValue(rowData, 'canCook');
    }
    
    const readingTimeField = document.getElementById('readingTime');
    if (readingTimeField) {
        readingTimeField.value = getExcelValue(rowData, 'readingTime');
    }
    
    console.log(`已填充第${rowIndex + 1}行数据到学生信息表单`);
    console.log('填充的数据:', {
        studentName: getExcelValue(rowData, 'studentName'),
        gender: getExcelValue(rowData, 'gender'),
        grade: getExcelValue(rowData, 'grade'),
        school: getExcelValue(rowData, 'school'),
        subjectGroup: getExcelValue(rowData, 'subjectGroup'),
        currentScores: currentScoreFields.map(field => ({
            field: field,
            value: getExcelValue(rowData, field)
        })),
        currentTotalScore: totalScore,
        predictedScores: predictedScoreFields.map(field => ({
            field: field,
            value: getExcelValue(rowData, field)
        })),
        predictedTotalScore: predictedTotalScore,
        hasTutoring: getExcelValue(rowData, 'hasTutoring'),
        tutoringSubjects: getExcelValue(rowData, 'tutoringSubjects'),
        majorPreference: getExcelValue(rowData, 'majorPreference'),
        englishTestType: getExcelValue(rowData, 'englishTestType'),
        englishScores: englishScoreFields.map(field => ({
            field: field,
            value: getExcelValue(rowData, field)
        })),
        studyDestination: getExcelValue(rowData, 'studyDestination'),
        budget: getExcelValue(rowData, 'budget'),
        hasClub: getExcelValue(rowData, 'hasClub'),
        clubActivities: getExcelValue(rowData, 'clubActivities'),
        hasLongTermHobby: getExcelValue(rowData, 'hasLongTermHobby'),
        hobbies: getExcelValue(rowData, 'hobbies'),
        friendsCount: getExcelValue(rowData, 'friendsCount'),
        talents: getExcelValue(rowData, 'talents'),
        certificates: getExcelValue(rowData, 'certificates'),
        organizationFrequency: getExcelValue(rowData, 'organizationFrequency'),
        askForHelp: getExcelValue(rowData, 'askForHelp'),
        studyPersistence: getExcelValue(rowData, 'studyPersistence'),
        internationalExperience: getExcelValue(rowData, 'internationalExperience'),
        campExperience: getExcelValue(rowData, 'campExperience'),
        canCook: getExcelValue(rowData, 'canCook'),
        readingTime: getExcelValue(rowData, 'readingTime')
    });
    
    // 计算并更新学术能力
    calculateAcademicAbility();
    
    // 计算并更新语言能力
    calculateLanguageAbility();
    
    // 计算并更新文体素养
    calculateArtisticQuality();
    
    // 计算并更新社交能力
    calculateSocialAbility();
    
    
    alert(`已成功将第${rowIndex + 1}行数据填入学生信息录入表单！\n\n学生姓名: ${getExcelValue(rowData, 'studentName') || '未填写'}\n当前总分: ${totalScore}分\n预测总分: ${predictedTotalScore}分`);
}

// 转换Excel数据为学生数据格式
function convertExcelToStudentData(rowData) {
    return {
        studentName: getExcelValue(rowData, 'studentName'),
        gender: getExcelValue(rowData, 'gender'),
        grade: getExcelValue(rowData, 'grade'),
        school: getExcelValue(rowData, 'school'),
        subjectGroup: getExcelValue(rowData, 'subjectGroup'),
        studyDestination: getExcelValue(rowData, 'studyDestination'),
        majorPreference: getExcelValue(rowData, 'majorPreference'),
        englishTestType: getExcelValue(rowData, 'englishTestType'),
        englishScore: getExcelValue(rowData, 'englishTotalScore'),
        englishListening: getExcelValue(rowData, 'englishListening'),
        englishSpeaking: getExcelValue(rowData, 'englishSpeaking'),
        englishReading: getExcelValue(rowData, 'englishReading'),
        englishWriting: getExcelValue(rowData, 'englishWriting'),
        budget: getExcelValue(rowData, 'budget'),
        hasClub: getExcelValue(rowData, 'hasClub'),
        clubActivities: getExcelValue(rowData, 'clubActivities'),
        hasLongTermHobby: getExcelValue(rowData, 'hasLongTermHobby'),
        hobbies: getExcelValue(rowData, 'hobbies'),
        friendsCount: getExcelValue(rowData, 'friendsCount'),
        talents: getExcelValue(rowData, 'talents'),
        certificates: getExcelValue(rowData, 'certificates'),
        organizationFrequency: getExcelValue(rowData, 'organizationFrequency'),
        askForHelp: getExcelValue(rowData, 'askForHelp'),
        canCook: getExcelValue(rowData, 'canCook'),
        readingTime: getExcelValue(rowData, 'readingTime'),
        // 学业水平考试
        academicLevelPass: getExcelValue(rowData, 'academicLevelPass'),
        academicSubject1: getExcelValue(rowData, 'academicSubject1'),
        academicScore1: getExcelValue(rowData, 'academicScore1'),
        academicSubject2: getExcelValue(rowData, 'academicSubject2'),
        academicScore2: getExcelValue(rowData, 'academicScore2'),
        academicSubject3: getExcelValue(rowData, 'academicSubject3'),
        academicScore3: getExcelValue(rowData, 'academicScore3'),
        // 新增列
        studyPersistence: getExcelValue(rowData, 'studyPersistence'),
        internationalExperience: getExcelValue(rowData, 'internationalExperience'),
        campExperience: getExcelValue(rowData, 'campExperience'),
        currentTotal: calculateCurrentTotal(rowData),
        predictedTotal: calculatePredictedTotal(rowData),
        // 保存原始Excel数据用于后续分析
        rawData: rowData
    };
}

// 计算当前总分
function calculateCurrentTotal(rowData) {
    const currentScoreKeys = [
        'currentChinese', 'currentMath', 'currentEnglish', 'currentPhysics', 
        'currentBiology', 'currentChemistry', 'currentHistory', 'currentGeography', 'currentPolitics'
    ];
    let total = 0;
    
    currentScoreKeys.forEach(key => {
        const score = parseFloat(getExcelValue(rowData, key)) || 0;
        total += score;
    });
    
    return total.toString();
}

// 计算预测总分
function calculatePredictedTotal(rowData) {
    const predictedScoreKeys = [
        'predictedChinese', 'predictedMath', 'predictedEnglish', 'predictedPhysics', 
        'predictedBiology', 'predictedChemistry', 'predictedHistory', 'predictedGeography', 'predictedPolitics'
    ];
    let total = 0;
    
    predictedScoreKeys.forEach(key => {
        const score = parseFloat(getExcelValue(rowData, key)) || 0;
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
            strengths: '生活能力有待提升',
            weaknesses: '生活基础需要加强',
            suggestions: '建议加强生活能力'
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
    
    
    return totalScore;
}

// 计算学术能力（返回值，不依赖DOM）
function calculateAcademicAbilityValue() {
    const predictedTotalField = document.getElementById('predictedTotal');
    const subjectGroupField = document.getElementById('subjectGroup');
    
    if (!predictedTotalField || !subjectGroupField) {
        return 75; // 默认值
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
        // 如果未选择学科分组，返回默认值
        return 75;
    }
    
    // 计算公式：60 + 0.2 * (预测总分 - 基准分)
    let academicAbility = 60 + 0.2 * (predictedTotal - baseScore);
    
    // 限制在0-100范围内
    academicAbility = Math.max(0, Math.min(100, academicAbility));
    
    return Math.round(academicAbility);
}

// 计算学术能力（更新DOM）
function calculateAcademicAbility() {
    const academicAbilityField = document.getElementById('academicAbility');
    const value = calculateAcademicAbilityValue();
    
    if (academicAbilityField) {
        academicAbilityField.value = value;
    }
    
    return value;
}

// 计算语言能力（返回值，不依赖DOM）
function calculateLanguageAbilityValue() {
    const englishTestTypeField = document.getElementById('englishTestType');
    const englishTotalScoreField = document.getElementById('englishTotalScore');
    const predictedEnglishField = document.getElementById('predictedEnglish');
    
    if (!englishTestTypeField) {
        return 70; // 默认值
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
    return Math.round(languageAbility);
}

// 计算语言能力（更新DOM）
function calculateLanguageAbility() {
    const languageAbilityField = document.getElementById('languageAbility');
    const value = calculateLanguageAbilityValue();
    
    if (languageAbilityField) {
        languageAbilityField.value = value;
    }
    
    return value;
}

// 计算文体素养（返回值，不依赖DOM）
function calculateArtisticQualityValue() {
    const hasClubField = document.getElementById('hasClub');
    const hasLongTermHobbyField = document.getElementById('hasLongTermHobby');
    const talentsField = document.getElementById('talents');
    const certificatesField = document.getElementById('certificates');
    const internationalExperienceField = document.getElementById('internationalExperience');
    const campExperienceField = document.getElementById('campExperience');
    const readingTimeField = document.getElementById('readingTime');
    
    let rawScore = 0; // 原始分，满分90
    
    // 1. 社团活动（10分）
    const hasClub = hasClubField?.value;
    if (hasClub === '是') {
        rawScore += 10;
    }
    
    // 2. 持续兴趣（10分）
    const hasLongTermHobby = hasLongTermHobbyField?.value;
    if (hasLongTermHobby === '是') {
        rawScore += 10;
    }
    
    // 3. 才艺学习（5-15分）
    const talents = talentsField?.value;
    if (talents && !talents.includes('没有正在学习的才艺') && talents.trim() !== '') {
        const talentCount = talents.split('┋').length;
        if (talentCount === 1) {
            rawScore += 5;
        } else if (talentCount === 2) {
            rawScore += 10;
        } else if (talentCount >= 3) {
            rawScore += 15;
        }
    }
    
    // 4. 证书奖项（10分）
    const certificates = certificatesField?.value;
    if (certificates && !certificates.includes('无') && !certificates.includes('没有')) {
        rawScore += 10;
    }
    
    // 5. 国外经历（10-20分）
    const internationalExperience = internationalExperienceField?.value;
    if (internationalExperience === '从来没有') {
        rawScore += 0;
    } else if (internationalExperience === '一个月以内') {
        rawScore += 10;
    } else if (internationalExperience === '6个月以内') {
        rawScore += 15;
    } else if (internationalExperience && internationalExperience !== '从来没有') {
        rawScore += 20;
    }
    
    // 6. 夏令营经历（10分）
    const campExperience = campExperienceField?.value;
    if (campExperience === '是') {
        rawScore += 10;
    }
    
    // 7. 阅读时间（0-15分）
    const readingTime = parseFloat(readingTimeField?.value) || 0;
    const readingScore = Math.round((readingTime / 8) * 15); // 按15分制计算
    rawScore += Math.min(15, readingScore);
    
    // 转换为100分制
    const finalScore = Math.round((rawScore / 90) * 100);
    return Math.max(0, Math.min(100, finalScore));
}

// 计算文体素养（更新DOM）
function calculateArtisticQuality() {
    const artisticQualityField = document.getElementById('artisticQuality');
    const value = calculateArtisticQualityValue();
    
    if (artisticQualityField) {
        artisticQualityField.value = value;
    }
    
    return value;
}

// 计算生活能力（返回值，不依赖DOM）
function calculateSocialAbilityValue() {
    const hasClubField = document.getElementById('hasClub');
    const friendsCountField = document.getElementById('friendsCount');
    const organizationFrequencyField = document.getElementById('organizationFrequency');
    const askForHelpField = document.getElementById('askForHelp');
    const studyPersistenceField = document.getElementById('studyPersistence');
    const canCookField = document.getElementById('canCook');
    
    let rawScore = 0; // 原始分，满分90
    
    // 1. 社团活动（10分）
    const hasClub = hasClubField?.value;
    if (hasClub === '是') {
        rawScore += 10;
    }
    
    // 2. 朋友数量（0-20分）
    const friendsCount = friendsCountField?.value;
    if (friendsCount === '没有') {
        rawScore += 0;
    } else if (friendsCount === '1-3个') {
        rawScore += 8;
    } else if (friendsCount === '3-5个') {
        rawScore += 12;
    } else if (friendsCount === '5个以上') {
        rawScore += 20;
    }
    
    // 3. 整理频率（0-20分）
    const organizationFrequency = organizationFrequencyField?.value;
    if (organizationFrequency && organizationFrequency.includes('每天')) {
        rawScore += 20;
    } else if (organizationFrequency && organizationFrequency.includes('每周')) {
        rawScore += 15;
    } else if (organizationFrequency && organizationFrequency.includes('每月')) {
        rawScore += 10;
    } else if (organizationFrequency && organizationFrequency.includes('半年')) {
        rawScore += 5;
    } else if (organizationFrequency && organizationFrequency.includes('从不整理')) {
        rawScore += 0;
    }
    
    // 4. 困难应对（0-10分）
    const askForHelp = askForHelpField?.value;
    if (askForHelp && askForHelp.includes('大部分情况下')) {
        rawScore += 10;
    } else if (askForHelp && askForHelp.includes('有时会选择')) {
        rawScore += 5;
    }
    
    // 5. 学习坚持（0-10分）
    const studyPersistence = studyPersistenceField?.value;
    if (studyPersistence && studyPersistence.includes('直至解决问题')) {
        rawScore += 10;
    } else if (studyPersistence && studyPersistence.includes('大部分时间')) {
        rawScore += 8;
    } else if (studyPersistence && studyPersistence.includes('有时会')) {
        rawScore += 6;
    }
    
    // 6. 料理水平（0-20分）
    const canCook = canCookField?.value;
    if (canCook && canCook.includes('会采购并处理')) {
        rawScore += 20;
    } else if (canCook && canCook.includes('明火炉灶加热预制食物')) {
        rawScore += 15;
    } else if (canCook && canCook.includes('微波炉')) {
        rawScore += 10;
    }
    
    // 转换为100分制
    const finalScore = Math.round((rawScore / 90) * 100);
    return Math.max(0, Math.min(100, finalScore));
}

// 计算生活能力（更新DOM）
function calculateSocialAbility() {
    const socialAbilityField = document.getElementById('socialAbility');
    const value = calculateSocialAbilityValue();
    
    if (socialAbilityField) {
        socialAbilityField.value = value;
    }
    
    return value;
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

// 获取选中的才艺（现在是文本输入，不需要这个函数）
// function getSelectedTalents() {
//     const checkboxes = document.querySelectorAll('input[name="talents"]:checked');
//     return Array.from(checkboxes).map(checkbox => checkbox.value);
// }

// 设置才艺文本输入
function setTalents(talents) {
    console.log('设置才艺:', talents);
    
    const talentsField = document.getElementById('talents');
    if (talentsField && Array.isArray(talents)) {
        talentsField.value = talents.join('┋');
    }
    
    // 计算文体素养
    calculateArtisticQuality();
    
    // 计算社交能力
    calculateSocialAbility();
}

// 检查是否有问卷数据需要导入
function checkSurveyData() {
    const surveyData = localStorage.getItem('surveyData');
    if (surveyData) {
        try {
            const data = JSON.parse(surveyData);
            fillFormFromSurveyData(data);
            // 清除问卷数据，避免重复导入
            localStorage.removeItem('surveyData');
        } catch (e) {
            console.error('导入问卷数据失败:', e);
        }
    }
}

// 从问卷数据填充表单
function fillFormFromSurveyData(data) {
    console.log('开始导入问卷数据:', data);
    
    // 基本信息
    if (data.studentName) document.getElementById('studentName').value = data.studentName;
    if (data.gender) {
        const genderSelect = document.getElementById('gender');
        if (genderSelect) {
            genderSelect.value = data.gender;
            console.log('设置性别:', data.gender);
        } else {
            console.error('未找到性别选择框');
        }
    }
    if (data.grade) {
        const gradeSelect = document.getElementById('grade');
        if (gradeSelect) {
            gradeSelect.value = data.grade;
            console.log('设置年级:', data.grade);
        } else {
            console.error('未找到年级选择框');
        }
    }
    if (data.school) document.getElementById('school').value = data.school;
    if (data.subjectGroup) {
        const subjectSelect = document.getElementById('subjectGroup');
        if (subjectSelect) {
            subjectSelect.value = data.subjectGroup;
            console.log('设置学科分组:', data.subjectGroup);
        } else {
            console.error('未找到学科分组选择框');
        }
    }
    
    // 学业成绩
    if (data.currentChinese) document.getElementById('currentChinese').value = data.currentChinese;
    if (data.currentMath) document.getElementById('currentMath').value = data.currentMath;
    if (data.currentEnglish) document.getElementById('currentEnglish').value = data.currentEnglish;
    if (data.currentPhysics) document.getElementById('currentPhysics').value = data.currentPhysics;
    if (data.currentBiology) document.getElementById('currentBiology').value = data.currentBiology;
    if (data.currentChemistry) document.getElementById('currentChemistry').value = data.currentChemistry;
    if (data.currentHistory) document.getElementById('currentHistory').value = data.currentHistory;
    if (data.currentPolitics) document.getElementById('currentPolitics').value = data.currentPolitics;
    if (data.currentGeography) document.getElementById('currentGeography').value = data.currentGeography;
    
    if (data.predictedChinese) document.getElementById('predictedChinese').value = data.predictedChinese;
    if (data.predictedMath) document.getElementById('predictedMath').value = data.predictedMath;
    if (data.predictedEnglish) document.getElementById('predictedEnglish').value = data.predictedEnglish;
    if (data.predictedPhysics) document.getElementById('predictedPhysics').value = data.predictedPhysics;
    if (data.predictedBiology) document.getElementById('predictedBiology').value = data.predictedBiology;
    if (data.predictedChemistry) document.getElementById('predictedChemistry').value = data.predictedChemistry;
    if (data.predictedHistory) document.getElementById('predictedHistory').value = data.predictedHistory;
    if (data.predictedPolitics) document.getElementById('predictedPolitics').value = data.predictedPolitics;
    if (data.predictedGeography) document.getElementById('predictedGeography').value = data.predictedGeography;
    
    // 学业水平考试
    if (data.academicLevelPass) {
        const academicSelect = document.getElementById('academicLevelPass');
        if (academicSelect) academicSelect.value = data.academicLevelPass;
    }
    
    // 学科分组
    if (data.subjectGroup) {
        const subjectSelect = document.getElementById('subjectGroup');
        if (subjectSelect) {
            subjectSelect.value = data.subjectGroup;
            console.log('设置学科分组:', data.subjectGroup);
            // 触发学科分组变化处理
            handleSubjectGroupChange(data.subjectGroup);
        } else {
            console.error('未找到学科分组选择框');
        }
    }
    if (data.academicSubject1) document.getElementById('academicSubject1').value = data.academicSubject1;
    if (data.academicScore1) document.getElementById('academicScore1').value = data.academicScore1;
    if (data.academicSubject2) document.getElementById('academicSubject2').value = data.academicSubject2;
    if (data.academicScore2) document.getElementById('academicScore2').value = data.academicScore2;
    if (data.academicSubject3) document.getElementById('academicSubject3').value = data.academicSubject3;
    if (data.academicScore3) document.getElementById('academicScore3').value = data.academicScore3;
    
    // 补习情况
    if (data.hasTutoring) {
        const tutoringSelect = document.getElementById('hasTutoring');
        if (tutoringSelect) tutoringSelect.value = data.hasTutoring;
    }
    if (data.tutoringSubjects) document.getElementById('tutoringSubjects').value = data.tutoringSubjects;
    
    // 专业倾向
    if (data.majorPreference && Array.isArray(data.majorPreference)) {
        data.majorPreference.forEach(preference => {
            const checkbox = document.querySelector(`input[name="majorPreference"][value="${preference}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    
    // 英语成绩
    if (data.englishTestType) {
        const englishSelect = document.getElementById('englishTestType');
        if (englishSelect) englishSelect.value = data.englishTestType;
    }
    if (data.englishTotalScore) document.getElementById('englishTotalScore').value = data.englishTotalScore;
    if (data.englishListening) document.getElementById('englishListening').value = data.englishListening;
    if (data.englishReading) document.getElementById('englishReading').value = data.englishReading;
    if (data.englishSpeaking) document.getElementById('englishSpeaking').value = data.englishSpeaking;
    if (data.englishWriting) document.getElementById('englishWriting').value = data.englishWriting;
    
    // 留学意向
    if (data.studyDestination && Array.isArray(data.studyDestination)) {
        data.studyDestination.forEach(destination => {
            const checkbox = document.querySelector(`input[name="studyDestination"][value="${destination}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    if (data.budget) {
        const budgetSelect = document.getElementById('budget');
        if (budgetSelect) budgetSelect.value = data.budget;
    }
    
    // 社团和兴趣
    if (data.hasClub) {
        const clubSelect = document.getElementById('hasClub');
        if (clubSelect) clubSelect.value = data.hasClub;
    }
    if (data.clubActivities) document.getElementById('clubActivities').value = data.clubActivities;
    if (data.hasLongTermHobby) {
        const hobbySelect = document.getElementById('hasLongTermHobby');
        if (hobbySelect) hobbySelect.value = data.hasLongTermHobby;
    }
    if (data.hobbies) document.getElementById('hobbies').value = data.hobbies;
    if (data.friendsCount) {
        const friendsSelect = document.getElementById('friendsCount');
        if (friendsSelect) friendsSelect.value = data.friendsCount;
    }
    
    // 才艺相关 - 处理多选数据
    if (data.talents) {
        const talentsInput = document.getElementById('talents');
        if (talentsInput) {
            // 如果数据包含┋分隔符，直接使用；否则尝试处理
            if (data.talents.includes('┋')) {
                talentsInput.value = data.talents;
            } else {
                talentsInput.value = data.talents;
            }
            console.log('设置才艺:', data.talents);
        } else {
            console.error('未找到才艺输入框');
        }
    }
    if (data.certificates) document.getElementById('certificates').value = data.certificates;
    if (data.organizationFrequency) {
        const orgSelect = document.getElementById('organizationFrequency');
        if (orgSelect) orgSelect.value = data.organizationFrequency;
    }
    
    // 其他评估维度
    if (data.askForHelp) document.getElementById('askForHelp').value = data.askForHelp;
    if (data.studyPersistence) document.getElementById('studyPersistence').value = data.studyPersistence;
    if (data.internationalExperience) {
        const intlSelect = document.getElementById('internationalExperience');
        if (intlSelect) intlSelect.value = data.internationalExperience;
    }
    if (data.campExperience) {
        const campSelect = document.getElementById('campExperience');
        if (campSelect) campSelect.value = data.campExperience;
    }
    if (data.canCook) document.getElementById('canCook').value = data.canCook;
    if (data.readingTime) document.getElementById('readingTime').value = data.readingTime;
    
    // 重新计算各项分数
    calculateAcademicAbility();
    calculateLanguageAbility();
    calculateArtisticQuality();
    calculateSocialAbility();
    
    // 显示成功提示
    alert('问卷数据已成功导入！');
}

// 文件选择事件处理
document.addEventListener('DOMContentLoaded', function() {
    // 检查并导入问卷数据
    checkSurveyData();
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
    
    // 为才艺文本输入添加监听器
    const talentsField = document.getElementById('talents');
    if (talentsField) {
        talentsField.addEventListener('input', calculateArtisticQuality);
    }
    
    // 为社交能力相关字段添加监听器
    const friendsCountField = document.getElementById('friendsCount');
    if (friendsCountField) {
        friendsCountField.addEventListener('change', calculateSocialAbility);
    }
    
    const askForHelpField = document.getElementById('askForHelp');
    if (askForHelpField) {
        askForHelpField.addEventListener('change', function() {
            calculateSocialAbility();
        });
    }
    
    const studyPersistenceField = document.getElementById('studyPersistence');
    if (studyPersistenceField) {
        studyPersistenceField.addEventListener('change', function() {
            calculateSocialAbility();
        });
    }
    
    const canCookField = document.getElementById('canCook');
    if (canCookField) {
        canCookField.addEventListener('change', function() {
            calculateSocialAbility();
        });
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

// 大学选择器功能
let currentUniversityField = '';
let filteredUniversities = [];

// 初始化大学数据
function initUniversityData() {
    if (typeof QS_TOP_UNIVERSITIES !== 'undefined') {
        filteredUniversities = QS_TOP_UNIVERSITIES;
    } else {
        // 如果数据未加载，等待加载完成
        setTimeout(initUniversityData, 100);
    }
}

// 打开大学选择器
function openUniversitySelector(fieldId) {
    currentUniversityField = fieldId;
    const modal = document.getElementById('universitySelectorModal');
    modal.style.display = 'block';
    
    // 重置搜索和筛选
    document.getElementById('universitySearch').value = '';
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn[onclick="filterByCountry(\'all\')"]').classList.add('active');
    
    // 显示所有大学
    filteredUniversities = QS_TOP_UNIVERSITIES;
    renderUniversities();
}

// 关闭大学选择器
function closeUniversitySelector() {
    const modal = document.getElementById('universitySelectorModal');
    modal.style.display = 'none';
    currentUniversityField = '';
}

// 渲染大学列表
function renderUniversities() {
    const container = document.getElementById('universitiesList');
    container.innerHTML = '';
    
    if (filteredUniversities.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">没有找到匹配的大学</div>';
        return;
    }
    
    filteredUniversities.forEach(university => {
        const item = document.createElement('div');
        item.className = 'university-item-selector';
        item.onclick = () => selectUniversity(university);
        
        // 将图片路径转换为绝对路径
        const logoPath = university.logo ? (university.logo.startsWith('/') || university.logo.startsWith('http') ? university.logo : '/' + university.logo) : '';
        
        item.innerHTML = `
            <img src="${logoPath}" alt="${university.name}" class="university-logo-small" 
                 onerror="this.style.display='none'; this.parentElement.querySelector('.university-info').style.marginLeft='0';">
            <div class="university-info">
                <h4>${university.chineseName}</h4>
                <p>${university.name} • ${university.country}</p>
            </div>
            <div class="university-rank">QS ${university.rank}</div>
        `;
        
        container.appendChild(item);
    });
}

// 选择大学
function selectUniversity(university) {
    if (!currentUniversityField) return;
    
    // 更新表单字段
    document.getElementById(currentUniversityField + 'Name').value = university.chineseName;
    document.getElementById(currentUniversityField + 'EnglishName').value = university.name;
    document.getElementById(currentUniversityField + 'Location').value = university.country;
    document.getElementById(currentUniversityField + 'Logo').value = university.logo;
    
    // 关闭模态框
    closeUniversitySelector();
}

// 搜索大学
function filterUniversities() {
    const searchTerm = document.getElementById('universitySearch').value.toLowerCase();
    
    filteredUniversities = QS_TOP_UNIVERSITIES.filter(university => {
        return university.chineseName.toLowerCase().includes(searchTerm) ||
               university.name.toLowerCase().includes(searchTerm) ||
               university.country.toLowerCase().includes(searchTerm);
    });
    
    renderUniversities();
}

// 按国家筛选
function filterByCountry(country) {
    // 更新按钮状态
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (country === 'all') {
        filteredUniversities = QS_TOP_UNIVERSITIES;
    } else if (country === '其他') {
        const commonCountries = ['美国', '英国', '中国', '澳大利亚', '加拿大', '德国', '日本', '韩国', '新加坡'];
        filteredUniversities = QS_TOP_UNIVERSITIES.filter(uni => !commonCountries.includes(uni.country));
    } else {
        filteredUniversities = QS_TOP_UNIVERSITIES.filter(uni => uni.country === country);
    }
    
    // 保持搜索条件
    const searchTerm = document.getElementById('universitySearch').value.toLowerCase();
    if (searchTerm) {
        filteredUniversities = filteredUniversities.filter(university => {
            return university.chineseName.toLowerCase().includes(searchTerm) ||
                   university.name.toLowerCase().includes(searchTerm) ||
                   university.country.toLowerCase().includes(searchTerm);
        });
    }
    
    renderUniversities();
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('universitySelectorModal');
    if (event.target === modal) {
        closeUniversitySelector();
    }
}

// 处理学科分组变化（从survey.js复制过来）
function handleSubjectGroupChange(subjectGroup) {
    const physicsInput = document.getElementById('predictedPhysics');
    const historyInput = document.getElementById('predictedHistory');
    const physicsRequired = document.getElementById('physicsRequired');
    const historyRequired = document.getElementById('historyRequired');
    const physicsHelp = document.getElementById('physicsHelp');
    const historyHelp = document.getElementById('historyHelp');
    
    if (subjectGroup === '物理组') {
        // 物理组：物理必填，历史禁用
        if (physicsInput) {
            physicsInput.required = true;
            physicsInput.disabled = false;
            physicsInput.value = physicsInput.value || '';
        }
        if (historyInput) {
            historyInput.required = false;
            historyInput.disabled = true;
            historyInput.value = '0'; // 禁用时设为0
        }
        if (physicsRequired) physicsRequired.style.display = 'inline';
        if (historyRequired) historyRequired.style.display = 'none';
        if (physicsHelp) physicsHelp.style.display = 'block';
        if (historyHelp) historyHelp.style.display = 'none';
        
    } else if (subjectGroup === '历史组') {
        // 历史组：历史必填，物理禁用
        if (physicsInput) {
            physicsInput.required = false;
            physicsInput.disabled = true;
            physicsInput.value = '0'; // 禁用时设为0
        }
        if (historyInput) {
            historyInput.required = true;
            historyInput.disabled = false;
            historyInput.value = historyInput.value || '';
        }
        if (physicsRequired) physicsRequired.style.display = 'none';
        if (historyRequired) historyRequired.style.display = 'inline';
        if (physicsHelp) physicsHelp.style.display = 'none';
        if (historyHelp) historyHelp.style.display = 'block';
        
    } else {
        // 未选择：都设为可选
        if (physicsInput) {
            physicsInput.required = false;
            physicsInput.disabled = false;
        }
        if (historyInput) {
            historyInput.required = false;
            historyInput.disabled = false;
        }
        if (physicsRequired) physicsRequired.style.display = 'none';
        if (historyRequired) historyRequired.style.display = 'none';
        if (physicsHelp) physicsHelp.style.display = 'none';
        if (historyHelp) historyHelp.style.display = 'none';
    }
} 