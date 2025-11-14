const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
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
    saveReportHtml,
    // 大学数据相关
    getAllUniversities,
    getUniversityById,
    getUniversityByName,
    getUniversitiesByCountry,
    createUniversity,
    batchCreateUniversities,
    updateUniversity,
    deleteUniversity,
    clearUniversities
} = require('./database');

const app = express();
const PORT = 3000; // 服务器端口（同时提供前端和后端API）

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // 增加JSON大小限制以支持base64图片
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

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

// ==================== 大学数据API ====================

// 获取所有大学
app.get('/api/universities', async (req, res) => {
    try {
        const universities = await getAllUniversities();
        res.json(universities);
    } catch (error) {
        console.error('获取大学列表错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 根据ID获取大学
app.get('/api/universities/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const university = await getUniversityById(id);
        
        if (!university) {
            return res.status(404).json({ error: '大学不存在' });
        }
        
        res.json(university);
    } catch (error) {
        console.error('获取大学错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 根据名称获取大学
app.get('/api/universities/search/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const university = await getUniversityByName(name);
        
        if (!university) {
            return res.status(404).json({ error: '大学不存在' });
        }
        
        res.json(university);
    } catch (error) {
        console.error('搜索大学错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 根据国家获取大学列表
app.get('/api/universities/country/:country', async (req, res) => {
    try {
        const country = req.params.country;
        const universities = await getUniversitiesByCountry(country);
        res.json(universities);
    } catch (error) {
        console.error('获取国家大学列表错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 处理base64图片，保存为文件并返回路径
function saveBase64Image(base64Data, universityName) {
    try {
        // 检查是否是base64数据
        if (!base64Data || typeof base64Data !== 'string' || !base64Data.startsWith('data:image/')) {
            return base64Data; // 如果不是base64，直接返回（可能是URL）
        }

        // 解析base64数据
        const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            return base64Data; // 格式不正确，返回原值
        }

        const imageType = matches[1]; // png, jpeg, etc.
        const imageData = matches[2];
        const buffer = Buffer.from(imageData, 'base64');

        // 创建目录（如果不存在）
        const uploadDir = path.join(__dirname, 'image', 'global-universities');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // 生成文件名
        const safeName = universityName.replace(/[^\w\s-]/g, '').trim().replace(/[-\s]+/g, '_');
        const timestamp = Date.now();
        const filename = `${safeName}_${timestamp}.${imageType}`;
        const filepath = path.join(uploadDir, filename);

        // 保存文件
        fs.writeFileSync(filepath, buffer);

        // 返回相对路径
        return `image/global-universities/${filename}`;
    } catch (error) {
        console.error('保存图片错误:', error);
        return base64Data; // 出错时返回原值
    }
}

// 创建大学（管理员功能）
app.post('/api/universities', async (req, res) => {
    try {
        let { rank, name, chineseName, country, logo } = req.body;
        
        console.log('收到创建大学请求:', { rank, name, chineseName, country, logo: logo ? (logo.substring(0, 50) + '...') : null });
        
        if (!name) {
            return res.status(400).json({ error: '大学名称不能为空' });
        }

        // 如果logo是base64，保存为文件
        if (logo && typeof logo === 'string' && logo.startsWith('data:image/')) {
            logo = saveBase64Image(logo, name);
        }
        
        const university = await createUniversity(rank, name, chineseName, country, logo);
        
        // 确保返回的数据包含id字段
        const result = {
            id: university.id,
            rank: university.rank,
            name: university.name,
            chineseName: university.chineseName || university.chinese_name,
            chinese_name: university.chineseName || university.chinese_name,
            country: university.country,
            logo: university.logo
        };
        
        console.log('创建大学成功:', result);
        res.json(result);
    } catch (error) {
        console.error('创建大学错误:', error);
        res.status(500).json({ error: '服务器错误', message: error.message });
    }
});

// 批量创建大学（管理员功能，用于数据迁移）
app.post('/api/universities/batch', async (req, res) => {
    try {
        const { universities } = req.body;
        
        if (!universities || !Array.isArray(universities)) {
            return res.status(400).json({ error: '大学数据格式错误' });
        }
        
        const result = await batchCreateUniversities(universities);
        res.json(result);
    } catch (error) {
        console.error('批量创建大学错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 更新大学（管理员功能）
app.put('/api/universities/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let { rank, name, chineseName, country, logo } = req.body;
        
        if (!name) {
            return res.status(400).json({ error: '大学名称不能为空' });
        }

        // 如果logo是base64，保存为文件
        if (logo && logo.startsWith('data:image/')) {
            logo = saveBase64Image(logo, name);
        }
        
        const result = await updateUniversity(id, rank, name, chineseName, country, logo);
        res.json(result);
    } catch (error) {
        console.error('更新大学错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 删除大学（管理员功能）
app.delete('/api/universities/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await deleteUniversity(id);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: '大学不存在' });
        }
        
        res.json({ success: true, id });
    } catch (error) {
        console.error('删除大学错误:', error);
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
