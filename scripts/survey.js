// 问卷逻辑
let currentQuestion = 1;
const totalQuestions = 30;
let currentSection = 1;
const totalSections = 4;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 清除可能存在的旧数据
    clearOldData();
    
    initializeSurvey();
    updateProgress();
    // 显示第一部分
    showSection(1);
    // 显示机构信息
    displayInstitutionInfo();
});

// 初始化问卷
function initializeSurvey() {
    // 为所有输入字段添加事件监听器
    const form = document.getElementById('surveyForm');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            // 处理条件显示
            handleConditionalDisplay(this);
            
            // 自动计算相关分数
            if (this.name === 'englishTestType' || this.name === 'englishTotalScore') {
                calculateLanguageAbility();
            }
            if (this.name === 'predictedTotal' || this.name === 'subjectGroup') {
                calculateAcademicAbility();
            }
            if (this.name === 'hasClub' || this.name === 'hasLongTermHobby' || this.name === 'readingTime' || this.name === 'talents') {
                calculateArtisticQuality();
            }
            if (this.name === 'hasClub' || this.name === 'friendsCount' || this.name === 'organizationFrequency' || this.name === 'canCook') {
                calculateSocialAbility();
            }
            
            // 实时更新进度
            updateProgress();
        });
    });
    
    // 为滑块添加特殊处理
    const readingTimeSlider = document.getElementById('readingTime');
    if (readingTimeSlider) {
        readingTimeSlider.addEventListener('input', function() {
            const value = this.value / 2; // 转换为0.5小时为单位
            document.getElementById('readingTimeValue').textContent = value + '小时';
            calculateArtisticQuality();
            updateProgress();
        });
    }
    
    // 表单提交处理
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitSurvey();
    });
    
    // 为radio-item添加点击事件监听器
    const radioItems = form.querySelectorAll('.radio-item');
    radioItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 如果点击的不是input或label，则触发input的点击
            if (e.target === this) {
                const radioInput = this.querySelector('input[type="radio"]');
                if (radioInput && !radioInput.disabled) {
                    radioInput.checked = true;
                    radioInput.dispatchEvent(new Event('change'));
                }
            }
        });
    });
}

// 显示所有问题
function showAllQuestions() {
    const questions = document.querySelectorAll('.question-section');
    
    questions.forEach((question, index) => {
        // 检查是否是条件显示的问题
        const questionId = question.id;
        if (questionId === 'question-9' || questionId === 'question-11' || 
            questionId === 'question-14' || questionId === 'question-18' || 
            questionId === 'question-20') {
            // 这些是条件显示的问题，保持隐藏状态
            question.style.display = 'none';
        } else {
            // 其他问题正常显示
            question.style.display = 'block';
        }
    });
    
    currentQuestion = totalQuestions;
    updateProgress();
    updateNavigationButtons();
}

// 显示指定问题（保留用于兼容性）
function showQuestion(questionNum) {
    showAllQuestions();
}

// 更新进度条
function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    // 计算当前部分已完成的题目数量
    const completedQuestions = getCompletedQuestionsCount();
    
    // 计算当前部分的总题目数量
    const currentSectionElement = document.getElementById(`section-${currentSection}`);
    let currentSectionTotal = 0;
    if (currentSectionElement) {
        const visibleQuestions = currentSectionElement.querySelectorAll('.question-section:not([style*="display: none"])');
        currentSectionTotal = visibleQuestions.length;
    }
    
    // 计算进度百分比
    const progress = currentSectionTotal > 0 ? (completedQuestions / currentSectionTotal) * 100 : 0;
    progressFill.style.width = progress + '%';
    
    // 更新进度文本
    const sectionNames = ['', '基本信息', '学业成绩', '留学意向', '个人素养'];
    const sectionName = sectionNames[currentSection] || `第${currentSection}部分`;
    progressText.textContent = `${sectionName}：已完成 ${completedQuestions} 题，共 ${currentSectionTotal} 题`;
}

// 获取已完成的题目数量
function getCompletedQuestionsCount() {
    let completed = 0;
    
    // 只计算当前显示部分的问题
    const currentSectionElement = document.getElementById(`section-${currentSection}`);
    if (!currentSectionElement) return 0;
    
    const questions = currentSectionElement.querySelectorAll('.question-section');
    
    questions.forEach(question => {
        // 跳过隐藏的问题
        if (question.style.display === 'none') return;
        
        const requiredInputs = question.querySelectorAll('[required]');
        let isCompleted = true;
        
        for (let input of requiredInputs) {
            if (input.type === 'radio') {
                const radioGroup = question.querySelectorAll(`input[name="${input.name}"]`);
                let isChecked = false;
                radioGroup.forEach(radio => {
                    if (radio.checked) isChecked = true;
                });
                if (!isChecked) {
                    isCompleted = false;
                    break;
                }
            } else if (input.type === 'text' || input.type === 'number' || input.type === 'textarea') {
                if (!input.value.trim()) {
                    isCompleted = false;
                    break;
                }
            }
        }
        
        if (isCompleted) completed++;
    });
    
    return completed;
}

// 更新导航按钮
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // 隐藏上一题和下一题按钮，只显示提交按钮
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (submitBtn) submitBtn.style.display = 'inline-block';
}

// 下一题
function nextQuestion() {
    if (validateCurrentQuestion()) {
        if (currentQuestion < totalQuestions) {
            showQuestion(currentQuestion + 1);
        }
    }
}

// 上一题
function previousQuestion() {
    if (currentQuestion > 1) {
        showQuestion(currentQuestion - 1);
    }
}

// 验证整个表单
function validateCurrentQuestion() {
    return validateAllQuestions();
}

// 验证所有问题
function validateAllQuestions() {
    const questions = document.querySelectorAll('.question-section');
    let firstInvalidQuestion = null;
    
    questions.forEach((question, index) => {
        const requiredInputs = question.querySelectorAll('[required]');
        let isQuestionValid = true;
        
        for (let input of requiredInputs) {
            if (input.type === 'radio') {
                const radioGroup = question.querySelectorAll(`input[name="${input.name}"]`);
                let isChecked = false;
                radioGroup.forEach(radio => {
                    if (radio.checked) isChecked = true;
                });
                if (!isChecked) {
                    isQuestionValid = false;
                    break;
                }
            } else if (input.type === 'text' || input.type === 'number' || input.type === 'textarea') {
                if (!input.value.trim()) {
                    isQuestionValid = false;
                    break;
                }
            }
        }
        
        if (!isQuestionValid && !firstInvalidQuestion) {
            firstInvalidQuestion = index + 1;
        }
    });
    
    if (firstInvalidQuestion) {
        alert(`请完成第${firstInvalidQuestion}题的所有必填项`);
        // 滚动到第一个未完成的问题
        const questionElement = document.querySelector(`[data-question="${firstInvalidQuestion}"]`);
        if (questionElement) {
            questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return false;
    }
    
    return true;
}

// API基础URL
const API_BASE_URL = '/api';

// 提交问卷
async function submitSurvey() {
    if (!validateCurrentQuestion()) {
        return;
    }
    
    // 收集所有表单数据
    const formData = collectFormData();
    
    // 显示提交中状态
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '提交中...';
    }
    
    try {
        // 提交到API
        const response = await fetch(`${API_BASE_URL}/surveys`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            alert(data.error || '提交失败，请稍后重试');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = '提交问卷';
            }
            return;
        }
        
        // 保存到localStorage（作为备份）
        localStorage.setItem('surveyData', JSON.stringify(formData));
        
        // 清除机构码和学生姓名（防止重复提交）
        localStorage.removeItem('institutionCode');
        localStorage.removeItem('studentName');
        localStorage.removeItem('surveyStartTime');
        
        // 跳转到感谢页面
        window.location.href = 'thankyou.html';
    } catch (error) {
        console.error('提交问卷错误:', error);
        alert('网络错误，请稍后重试');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '提交问卷';
        }
    }
}

// 收集表单数据
function collectFormData() {
    const form = document.getElementById('surveyForm');
    const formData = new FormData(form);
    const data = {};
    
    // 处理单选按钮
    const radioGroups = form.querySelectorAll('input[type="radio"]');
    radioGroups.forEach(radio => {
        if (radio.checked) {
            data[radio.name] = radio.value;
        }
    });
    
    // 处理复选框
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    const checkboxGroups = {};
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            if (!checkboxGroups[checkbox.name]) {
                checkboxGroups[checkbox.name] = [];
            }
            checkboxGroups[checkbox.name].push(checkbox.value);
        }
    });
    
    // 合并复选框数据
    Object.assign(data, checkboxGroups);
    
    // 处理文本输入
    const textInputs = form.querySelectorAll('input[type="text"], input[type="number"], textarea');
    textInputs.forEach(input => {
        if (input.disabled) {
            // 禁用的字段设为0
            data[input.name] = '0';
        } else if (input.value.trim()) {
            data[input.name] = input.value.trim();
        }
    });
    
    // 处理滑块输入
    const slider = document.getElementById('readingTime');
    if (slider) {
        data.readingTime = (slider.value / 2).toString(); // 转换为0.5小时为单位
    }
    
    // 特殊处理第22题的多选数据，用┋分隔
    if (data.talents && Array.isArray(data.talents)) {
        data.talents = data.talents.join('┋');
    }
    
    // 添加机构信息
    data.institutionCode = localStorage.getItem('institutionCode') || '';
    data.studentName = localStorage.getItem('studentName') || data.studentName || '';
    data.surveyStartTime = localStorage.getItem('surveyStartTime') || '';
    data.surveyEndTime = new Date().toISOString();
    
    return data;
}

// 计算语言能力
function calculateLanguageAbility() {
    const englishTestType = document.querySelector('input[name="englishTestType"]:checked')?.value;
    const englishTotalScore = document.getElementById('englishTotalScore')?.value;
    const predictedEnglish = document.getElementById('predictedEnglish')?.value;
    
    if (!englishTestType) return;
    
    let languageAbility = 0;
    
    if (englishTestType === '雅思' && englishTotalScore) {
        languageAbility = (parseFloat(englishTotalScore) / 9) * 100;
    } else if (englishTestType === '托福' && englishTotalScore) {
        languageAbility = (parseFloat(englishTotalScore) / 120) * 100;
    } else if (englishTestType === 'PTE' && englishTotalScore) {
        languageAbility = (parseFloat(englishTotalScore) / 90) * 100;
    } else if (englishTestType === '多邻国' && englishTotalScore) {
        languageAbility = (parseFloat(englishTotalScore) / 160) * 100;
    } else if (englishTestType === '暂无' && predictedEnglish) {
        // 根据预测英语成绩估算雅思分数
        const predictedScore = parseFloat(predictedEnglish);
        let ieltsScore = 0;
        
        if (predictedScore >= 130) ieltsScore = 7.0;
        else if (predictedScore >= 120) ieltsScore = 6.5;
        else if (predictedScore >= 110) ieltsScore = 6.0;
        else if (predictedScore >= 100) ieltsScore = 5.5;
        else if (predictedScore >= 90) ieltsScore = 5.0;
        else if (predictedScore >= 80) ieltsScore = 4.5;
        else ieltsScore = 4.0;
        
        languageAbility = (ieltsScore / 9) * 100;
    }
    
    // 显示计算结果（如果有显示区域）
    const scoreDisplay = document.querySelector('.score-display');
    if (scoreDisplay) {
        scoreDisplay.innerHTML = `
            <div class="score-label">语言能力评分</div>
            <div class="score-value">${Math.round(languageAbility)}分</div>
        `;
    }
}

// 计算学术能力
function calculateAcademicAbility() {
    const predictedTotal = document.getElementById('predictedTotal')?.value;
    const subjectGroup = document.querySelector('input[name="subjectGroup"]:checked')?.value;
    
    if (!predictedTotal || !subjectGroup) return;
    
    const totalScore = parseFloat(predictedTotal);
    let academicAbility = 0;
    
    if (subjectGroup === '物理组') {
        // 物理组：750分制
        academicAbility = (totalScore / 750) * 100;
    } else if (subjectGroup === '历史组') {
        // 历史组：750分制
        academicAbility = (totalScore / 750) * 100;
    }
    
    // 显示计算结果
    const scoreDisplay = document.querySelector('.score-display');
    if (scoreDisplay) {
        scoreDisplay.innerHTML = `
            <div class="score-label">学术能力评分</div>
            <div class="score-value">${Math.round(academicAbility)}分</div>
        `;
    }
}

// 计算文体素养
function calculateArtisticQuality() {
    let rawScore = 0;
    
    // 1. 社团活动（10分）
    const hasClub = document.querySelector('input[name="hasClub"]:checked')?.value;
    if (hasClub === '是') {
        rawScore += 10;
    }
    
    // 2. 持续兴趣（10分）
    const hasLongTermHobby = document.querySelector('input[name="hasLongTermHobby"]:checked')?.value;
    if (hasLongTermHobby === '是') {
        rawScore += 10;
    }
    
    // 3. 才艺（20分）
    const talents = document.getElementById('talents')?.value;
    if (talents && talents.trim()) {
        const talentCount = talents.split('┋').filter(t => t.trim()).length;
        rawScore += Math.min(talentCount * 5, 20);
    }
    
    // 4. 阅读时间（10分）
    const readingTime = parseFloat(document.getElementById('readingTime')?.value) || 0;
    if (readingTime >= 2) {
        rawScore += 10;
    } else if (readingTime >= 1) {
        rawScore += 5;
    }
    
    // 转换为100分制
    const artisticQuality = Math.round((rawScore / 50) * 100);
    
    // 显示计算结果
    const scoreDisplay = document.querySelector('.score-display');
    if (scoreDisplay) {
        scoreDisplay.innerHTML = `
            <div class="score-label">文体素养评分</div>
            <div class="score-value">${artisticQuality}分</div>
        `;
    }
}

// 计算社交能力
function calculateSocialAbility() {
    let rawScore = 0;
    
    // 1. 社团活动（10分）
    const hasClub = document.querySelector('input[name="hasClub"]:checked')?.value;
    if (hasClub === '是') {
        rawScore += 10;
    }
    
    // 2. 朋友数量（10分）
    const friendsCount = document.querySelector('input[name="friendsCount"]:checked')?.value;
    if (friendsCount === '5个以上') {
        rawScore += 10;
    } else if (friendsCount === '3-5个') {
        rawScore += 6;
    } else if (friendsCount === '1-3个') {
        rawScore += 3;
    }
    
    // 3. 整理频率（10分）
    const organizationFrequency = document.querySelector('input[name="organizationFrequency"]:checked')?.value;
    if (organizationFrequency === '每天至少一次') {
        rawScore += 10;
    } else if (organizationFrequency === '每周至少一次') {
        rawScore += 6;
    } else if (organizationFrequency === '每月至少一次') {
        rawScore += 3;
    }
    
    // 4. 国外经历（10-20分）
    const internationalExperience = document.querySelector('input[name="internationalExperience"]:checked')?.value;
    if (internationalExperience === '一年以上') {
        rawScore += 20;
    } else if (internationalExperience === '一年以内') {
        rawScore += 15;
    } else if (internationalExperience === '6个月以内') {
        rawScore += 10;
    } else if (internationalExperience === '一个月以内') {
        rawScore += 5;
    }
    
    // 5. 夏令营经历（10分）
    const campExperience = document.querySelector('input[name="campExperience"]:checked')?.value;
    if (campExperience === '是') {
        rawScore += 10;
    }
    
    // 6. 料理水平（0-20分）
    const canCook = document.getElementById('canCook')?.value;
    if (canCook && canCook.includes('会采购并处理')) {
        rawScore += 20;
    } else if (canCook && canCook.includes('明火炉灶加热预制食物')) {
        rawScore += 15;
    } else if (canCook && canCook.includes('微波炉')) {
        rawScore += 10;
    }
    
    // 转换为100分制
    const socialAbility = Math.round((rawScore / 80) * 100);
    
    // 显示计算结果
    const scoreDisplay = document.querySelector('.score-display');
    if (scoreDisplay) {
        scoreDisplay.innerHTML = `
            <div class="score-label">生活能力评分</div>
            <div class="score-value">${socialAbility}分</div>
        `;
    }
}

// 键盘导航
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        nextQuestion();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousQuestion();
    }
});

// 自动保存功能
function autoSave() {
    const formData = collectFormData();
    const currentInstitutionCode = localStorage.getItem('institutionCode') || '';
    localStorage.setItem('surveyAutoSave', JSON.stringify({
        data: formData,
        currentQuestion: currentQuestion,
        institutionCode: currentInstitutionCode, // 保存当前机构码
        timestamp: new Date().toISOString()
    }));
}

// 恢复自动保存的数据
function restoreAutoSave() {
    const saved = localStorage.getItem('surveyAutoSave');
    if (saved) {
        try {
            const { data, currentQuestion: savedQuestion, institutionCode: savedInstitutionCode } = JSON.parse(saved);
            
            // 获取当前机构码
            const currentInstitutionCode = localStorage.getItem('institutionCode') || '';
            
            // 检查机构码是否匹配
            // 如果保存的数据有机构码，但当前机构码不匹配，则清除旧的自动保存数据
            if (savedInstitutionCode) {
                if (savedInstitutionCode !== currentInstitutionCode) {
                    console.log('机构码不匹配，清除旧的自动保存数据');
                    localStorage.removeItem('surveyAutoSave');
                    return; // 不恢复数据
                }
            } else {
                // 如果保存的数据没有机构码（旧数据），但有当前机构码，也清除旧数据
                if (currentInstitutionCode) {
                    console.log('检测到旧格式的自动保存数据，但当前有机构码，清除旧数据');
                    localStorage.removeItem('surveyAutoSave');
                    return; // 不恢复数据
                }
            }
            
            // 机构码匹配，恢复表单数据
            Object.keys(data).forEach(key => {
                if (Array.isArray(data[key])) {
                    // 处理复选框数组
                    data[key].forEach(value => {
                        const checkbox = document.querySelector(`input[name="${key}"][value="${value}"]`);
                        if (checkbox) checkbox.checked = true;
                    });
                } else {
                    // 处理单选和文本输入
                    const input = document.querySelector(`input[name="${key}"][value="${data[key]}"]`) || 
                                 document.getElementById(key);
                    if (input) {
                        if (input.type === 'radio') {
                            input.checked = true;
                        } else {
                            input.value = data[key];
                        }
                    }
                }
            });
            
            // 询问是否恢复进度
            if (confirm('检测到未完成的问卷，是否继续？')) {
                showQuestion(savedQuestion);
            }
        } catch (e) {
            console.error('恢复自动保存数据失败:', e);
        }
    }
}

// 页面加载时尝试恢复数据
document.addEventListener('DOMContentLoaded', function() {
    restoreAutoSave();
    
    // 定期自动保存
    setInterval(autoSave, 30000); // 每30秒自动保存一次
});

// 页面卸载时保存数据
window.addEventListener('beforeunload', function() {
    autoSave();
});

// 回到顶部功能
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 处理条件显示
function handleConditionalDisplay(input) {
    const name = input.name;
    const value = input.value;
    
    // 第9题：仅当第8题选"是"时显示
    if (name === 'academicLevelPass') {
        const question9 = document.getElementById('question-9');
        if (question9) {
            question9.style.display = value === '是' ? 'block' : 'none';
        }
    }
    
    // 第11题：仅当第10题选"是"时显示
    if (name === 'hasTutoring') {
        const question11 = document.getElementById('question-11');
        if (question11) {
            question11.style.display = value === '是' ? 'block' : 'none';
        }
    }
    
    // 第14题：仅当第13题选择"暂无"之外的选项时显示
    if (name === 'englishTestType') {
        const question14 = document.getElementById('question-14');
        if (question14) {
            question14.style.display = value !== '暂无' ? 'block' : 'none';
        }
    }
    
    // 第18题：仅当第17题选"是"时显示
    if (name === 'hasClub') {
        const question18 = document.getElementById('question-18');
        if (question18) {
            question18.style.display = value === '是' ? 'block' : 'none';
        }
    }
    
    // 第20题：仅当第19题选"是"时显示
    if (name === 'hasLongTermHobby') {
        const question20 = document.getElementById('question-20');
        if (question20) {
            question20.style.display = value === '是' ? 'block' : 'none';
        }
    }
    
    // 第6题：根据第5题的学科分组控制物理/历史成绩的必填和禁用
    if (name === 'subjectGroup') {
        handleSubjectGroupChange(value);
    }
}

// 处理学科分组变化
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

// 显示机构信息
function displayInstitutionInfo() {
    const institutionCode = localStorage.getItem('institutionCode');
    const studentName = localStorage.getItem('studentName');
    
    if (institutionCode && studentName) {
        // 显示机构信息
        document.getElementById('institutionCodeDisplay').textContent = institutionCode;
        document.getElementById('studentNameDisplay').textContent = studentName;
        document.getElementById('surveyInfo').style.display = 'flex';
        
        // 如果学生姓名已填写，自动填入第1题
        const nameInput = document.getElementById('studentName');
        if (nameInput && !nameInput.value) {
            nameInput.value = studentName;
        }
    } else {
        // 如果没有机构信息，显示提示并跳转回首页
        alert('请先输入机构码和学生姓名');
        window.location.href = 'home.html';
    }
}

// 显示指定部分
function showSection(sectionNumber) {
    // 隐藏所有部分
    for (let i = 1; i <= totalSections; i++) {
        const section = document.getElementById(`section-${i}`);
        if (section) {
            section.style.display = 'none';
        }
    }
    
    // 显示指定部分
    const currentSectionElement = document.getElementById(`section-${sectionNumber}`);
    if (currentSectionElement) {
        currentSectionElement.style.display = 'block';
    }
    
    currentSection = sectionNumber;
    updateProgress();
}

// 下一步
function nextSection() {
    if (currentSection < totalSections) {
        // 验证当前部分
        if (validateCurrentSection()) {
            showSection(currentSection + 1);
        }
    }
}

// 上一步
function prevSection() {
    if (currentSection > 1) {
        showSection(currentSection - 1);
    }
}

// 验证当前部分
function validateCurrentSection() {
    const currentSectionElement = document.getElementById(`section-${currentSection}`);
    if (!currentSectionElement) return true;
    
    const requiredInputs = currentSectionElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#e53e3e';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });
    
    if (!isValid) {
        alert('请填写当前部分的所有必填项');
    }
    
    return isValid;
}

// 清除旧数据
function clearOldData() {
    // 清除可能存在的旧问卷数据
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('survey_')) {
            keysToRemove.push(key);
        }
    }
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
    });
    
    // 重置表单
    const form = document.getElementById('surveyForm');
    if (form) {
        form.reset();
    }
    
    // 重置所有输入字段的样式
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });
}
