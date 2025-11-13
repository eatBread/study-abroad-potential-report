const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const {
    initDatabase,
    validateInstitutionCode,
    checkInstitutionCompleted,
    createInstitution,
    updateInstitution,
    deleteInstitution,
    submitSurvey,
    getAllSurveys,
    getSurveyById,
    updateSurveyStatus,
    getAllInstitutions,
    saveReportHtml
} = require('./database');

const app = express();
const PORT = 3000; // 服务器端口（同时提供前端和后端API）

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 初始化数据库
initDatabase().then(() => {
    console.log('数据库初始化完成');
}).catch(err => {
    console.error('数据库初始化失败:', err);
});

// API路由（必须在静态文件服务之前）

// 验证机构码
app.post('/api/institutions/validate', async (req, res) => {
    try {
        const { code } = req.body;
        
        if (!code) {
            return res.status(400).json({ error: '机构码不能为空' });
        }
        
        const institution = await validateInstitutionCode(code);
        
        if (!institution) {
            return res.status(404).json({ error: '机构码不存在' });
        }
        
        // 检查是否已填写
        const isCompleted = await checkInstitutionCompleted(code);
        
        res.json({
            valid: true,
            code: institution.code,
            name: institution.name,
            isCompleted: isCompleted === true
        });
    } catch (error) {
        console.error('验证机构码错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 创建机构码（管理员功能）
app.post('/api/institutions', async (req, res) => {
    try {
        const { code, name } = req.body;
        
        if (!code) {
            return res.status(400).json({ error: '机构码不能为空' });
        }
        
        const institution = await createInstitution(code, name);
        res.json(institution);
    } catch (error) {
        if (error.message.includes('UNIQUE constraint')) {
            res.status(409).json({ error: '机构码已存在' });
        } else {
            console.error('创建机构码错误:', error);
            res.status(500).json({ error: '服务器错误' });
        }
    }
});

// 获取所有机构码
app.get('/api/institutions', async (req, res) => {
    try {
        const institutions = await getAllInstitutions();
        res.json(institutions);
    } catch (error) {
        console.error('获取机构码列表错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 更新机构码
app.put('/api/institutions/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { code, name } = req.body;
        
        if (!code) {
            return res.status(400).json({ error: '机构码不能为空' });
        }
        
        const result = await updateInstitution(id, code, name);
        res.json(result);
    } catch (error) {
        if (error.message.includes('UNIQUE constraint')) {
            res.status(409).json({ error: '机构码已存在' });
        } else {
            console.error('更新机构码错误:', error);
            res.status(500).json({ error: '服务器错误' });
        }
    }
});

// 删除机构码
app.delete('/api/institutions/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await deleteInstitution(id);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: '机构码不存在' });
        }
        
        res.json({ success: true, id });
    } catch (error) {
        console.error('删除机构码错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 提交问卷
app.post('/api/surveys', async (req, res) => {
    try {
        const surveyData = req.body;
        
        if (!surveyData.institutionCode) {
            return res.status(400).json({ error: '机构码不能为空' });
        }
        
        if (!surveyData.studentName && !surveyData.student_name) {
            return res.status(400).json({ error: '学生姓名不能为空' });
        }
        
        // 验证机构码是否存在
        const institution = await validateInstitutionCode(surveyData.institutionCode);
        if (!institution) {
            return res.status(404).json({ error: '机构码不存在' });
        }
        
        // 检查是否已填写
        const isCompleted = await checkInstitutionCompleted(surveyData.institutionCode);
        if (isCompleted) {
            return res.status(409).json({ error: '该机构码已填写过问卷' });
        }
        
        const result = await submitSurvey(surveyData);
        res.json({ success: true, id: result.id });
    } catch (error) {
        console.error('提交问卷错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 获取所有问卷（管理员）
app.get('/api/surveys', async (req, res) => {
    try {
        const surveys = await getAllSurveys();
        res.json(surveys);
    } catch (error) {
        console.error('获取问卷列表错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 获取单个问卷
app.get('/api/surveys/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const survey = await getSurveyById(id);
        
        if (!survey) {
            return res.status(404).json({ error: '问卷不存在' });
        }
        
        res.json(survey);
    } catch (error) {
        console.error('获取问卷错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 更新问卷状态
app.put('/api/surveys/:id/status', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ error: '状态不能为空' });
        }
        
        const result = await updateSurveyStatus(id, status);
        res.json(result);
    } catch (error) {
        console.error('更新问卷状态错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 保存报告HTML
app.post('/api/surveys/:id/report', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { reportHtml } = req.body;
        
        if (!reportHtml) {
            return res.status(400).json({ error: '报告HTML不能为空' });
        }
        
        const result = await saveReportHtml(id, reportHtml);
        res.json({ success: true, id: result.id });
    } catch (error) {
        console.error('保存报告错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 获取报告HTML
app.get('/api/surveys/:id/report', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const survey = await getSurveyById(id);
        
        if (!survey) {
            return res.status(404).json({ error: '问卷不存在' });
        }
        
        if (!survey.report_html) {
            return res.status(404).json({ error: '报告尚未生成' });
        }
        
        res.json({ success: true, reportHtml: survey.report_html });
    } catch (error) {
        console.error('获取报告错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 静态文件服务（前端文件，必须在API路由之后）
app.use(express.static(__dirname));

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`前端访问地址: http://localhost:${PORT}/home.html`);
    console.log(`API接口地址: http://localhost:${PORT}/api`);
});
