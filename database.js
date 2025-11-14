const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.sqlite');

// 创建数据库连接
function getDatabase() {
    return new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('数据库连接错误:', err.message);
        } else {
            console.log('已连接到SQLite数据库');
        }
    });
}

// 初始化数据库表
function initDatabase() {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // 创建机构码表
            db.run(`
                CREATE TABLE IF NOT EXISTS institutions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    code TEXT UNIQUE NOT NULL,
                    name TEXT,
                    is_completed INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.error('创建机构码表错误:', err.message);
                    reject(err);
                } else {
                    console.log('机构码表已创建或已存在');
                }
            });
            
            // 创建问卷表
            db.run(`
                CREATE TABLE IF NOT EXISTS surveys (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    institution_code TEXT NOT NULL,
                    student_name TEXT NOT NULL,
                    survey_data TEXT NOT NULL,
                    status TEXT DEFAULT 'pending',
                    report_html TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    survey_start_time TEXT,
                    survey_end_time TEXT,
                    FOREIGN KEY (institution_code) REFERENCES institutions(code)
                )
            `, (err) => {
                if (err) {
                    console.error('创建问卷表错误:', err.message);
                    reject(err);
                } else {
                    console.log('问卷表已创建或已存在');
                }
            });
            
            // 为现有表添加 report_html 字段（如果不存在）
            db.run(`
                ALTER TABLE surveys ADD COLUMN report_html TEXT
            `, (err) => {
                // 忽略错误，因为字段可能已存在
                if (err && !err.message.includes('duplicate column name')) {
                    console.error('添加report_html字段错误:', err.message);
                }
            });
            
            // 创建索引
            db.run(`CREATE INDEX IF NOT EXISTS idx_institution_code ON surveys(institution_code)`, (err) => {
                if (err) {
                    console.error('创建索引错误:', err.message);
                }
            });
            
            db.run(`CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status)`, (err) => {
                if (err) {
                    console.error('创建索引错误:', err.message);
                }
            });
            
            // 创建大学表
            db.run(`
                CREATE TABLE IF NOT EXISTS universities (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    rank INTEGER,
                    name TEXT NOT NULL,
                    chinese_name TEXT,
                    country TEXT,
                    logo TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.error('创建大学表错误:', err.message);
                    reject(err);
                } else {
                    console.log('大学表已创建或已存在');
                }
            });
            
            // 为大学表创建索引
            db.run(`CREATE INDEX IF NOT EXISTS idx_universities_rank ON universities(rank)`, (err) => {
                if (err) {
                    console.error('创建大学排名索引错误:', err.message);
                }
            });
            
            db.run(`CREATE INDEX IF NOT EXISTS idx_universities_country ON universities(country)`, (err) => {
                if (err) {
                    console.error('创建大学国家索引错误:', err.message);
                }
            });
            
            db.run(`CREATE INDEX IF NOT EXISTS idx_universities_name ON universities(name)`, (err) => {
                if (err) {
                    console.error('创建大学名称索引错误:', err.message);
                }
                // 在最后一个操作完成后resolve
                resolve();
            });
        });
    });
}

// 验证机构码
function validateInstitutionCode(code) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM institutions WHERE code = ?',
            [code],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            }
        );
    });
}

// 检查机构码是否已填写
function checkInstitutionCompleted(code) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT is_completed FROM institutions WHERE code = ?',
            [code],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row ? row.is_completed === 1 : null);
                }
            }
        );
    });
}

// 创建机构码
function createInstitution(code, name = null) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO institutions (code, name) VALUES (?, ?)',
            [code, name],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, code, name });
                }
            }
        );
    });
}

// 提交问卷
function submitSurvey(surveyData) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            
            // 获取学生姓名
            const studentName = surveyData.studentName || surveyData.student_name || '';
            
            if (!studentName) {
                db.run('ROLLBACK');
                reject(new Error('学生姓名不能为空'));
                return;
            }
            
            // 插入问卷数据
            db.run(
                `INSERT INTO surveys (institution_code, student_name, survey_data, survey_start_time, survey_end_time)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    surveyData.institutionCode,
                    studentName,
                    JSON.stringify(surveyData),
                    surveyData.surveyStartTime || surveyData.survey_start_time,
                    surveyData.surveyEndTime || surveyData.survey_end_time || new Date().toISOString()
                ],
                function(err) {
                    if (err) {
                        db.run('ROLLBACK');
                        reject(err);
                        return;
                    }
                    
                    const surveyId = this.lastID;
                    
                    // 更新机构码的完成状态
                    db.run(
                        'UPDATE institutions SET is_completed = 1, updated_at = CURRENT_TIMESTAMP WHERE code = ?',
                        [surveyData.institutionCode],
                        (err) => {
                            if (err) {
                                db.run('ROLLBACK');
                                reject(err);
                            } else {
                                db.run('COMMIT');
                                resolve({ id: surveyId });
                            }
                        }
                    );
                }
            );
        });
    });
}

// 获取所有问卷
function getAllSurveys() {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
            db.all(
                `SELECT 
                    s.id,
                    s.institution_code,
                    s.student_name,
                    s.survey_data,
                    s.status,
                    s.report_html,
                    s.created_at,
                    s.updated_at,
                    s.survey_start_time,
                    s.survey_end_time,
                    i.name as institution_name
                 FROM surveys s
                 LEFT JOIN institutions i ON s.institution_code = i.code
                 ORDER BY s.created_at DESC`,
            [],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    // 解析JSON数据
                    const surveys = rows.map(row => ({
                        ...row,
                        survey_data: JSON.parse(row.survey_data)
                    }));
                    resolve(surveys);
                }
            }
        );
    });
}

// 获取单个问卷
function getSurveyById(id) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT 
                s.*,
                i.name as institution_name
             FROM surveys s
             LEFT JOIN institutions i ON s.institution_code = i.code
             WHERE s.id = ?`,
            [id],
            (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    row.survey_data = JSON.parse(row.survey_data);
                    resolve(row);
                } else {
                    resolve(null);
                }
            }
        );
    });
}

// 更新问卷状态
function updateSurveyStatus(id, status) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE surveys SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, id],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, status, changes: this.changes });
                }
            }
        );
    });
}

// 保存报告HTML到数据库（同时更新状态为已处理）
function saveReportHtml(surveyId, reportHtml) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        // 同时更新报告HTML和状态为completed（已处理）
        db.run(
            'UPDATE surveys SET report_html = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [reportHtml, 'completed', surveyId],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: surveyId, changes: this.changes });
                }
            }
        );
    });
}

// 获取所有机构码
function getAllInstitutions() {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM institutions ORDER BY created_at DESC',
            [],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

// 更新机构码
function updateInstitution(id, code, name = null) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE institutions SET code = ?, name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [code, name, id],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, code, name, changes: this.changes });
                }
            }
        );
    });
}

// 删除机构码
function deleteInstitution(id) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        db.run(
            'DELETE FROM institutions WHERE id = ?',
            [id],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, changes: this.changes });
                }
            }
        );
    });
}

// ==================== 大学数据相关函数 ====================

// 获取所有大学
function getAllUniversities() {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM universities ORDER BY rank ASC, id ASC',
            [],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    // 转换为前端需要的格式
                    const universities = rows.map(row => ({
                        id: row.id,
                        rank: row.rank,
                        name: row.name,
                        chineseName: row.chinese_name,
                        chinese_name: row.chinese_name, // 保留原始字段名以兼容
                        country: row.country,
                        logo: row.logo
                    }));
                    resolve(universities);
                }
            }
        );
    });
}

// 根据ID获取大学
function getUniversityById(id) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM universities WHERE id = ?',
            [id],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (row) {
                        resolve({
                            id: row.id,
                            rank: row.rank,
                            name: row.name,
                            chineseName: row.chinese_name,
                            chinese_name: row.chinese_name, // 保留原始字段名以兼容
                            country: row.country,
                            logo: row.logo
                        });
                    } else {
                        resolve(null);
                    }
                }
            }
        );
    });
}

// 根据名称获取大学
function getUniversityByName(name) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM universities WHERE name = ? OR chinese_name = ?',
            [name, name],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (row) {
                        resolve({
                            rank: row.rank,
                            name: row.name,
                            chineseName: row.chinese_name,
                            country: row.country,
                            logo: row.logo
                        });
                    } else {
                        resolve(null);
                    }
                }
            }
        );
    });
}

// 根据国家获取大学列表
function getUniversitiesByCountry(country) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM universities WHERE country = ? ORDER BY rank ASC',
            [country],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const universities = rows.map(row => ({
                        rank: row.rank,
                        name: row.name,
                        chineseName: row.chinese_name,
                        country: row.country,
                        logo: row.logo
                    }));
                    resolve(universities);
                }
            }
        );
    });
}

// 添加大学
function createUniversity(rank, name, chineseName, country, logo) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO universities (rank, name, chinese_name, country, logo) VALUES (?, ?, ?, ?, ?)',
            [rank, name, chineseName, country, logo],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, rank, name, chineseName, country, logo });
                }
            }
        );
    });
}

// 批量添加大学
function batchCreateUniversities(universities) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            
            const stmt = db.prepare('INSERT INTO universities (rank, name, chinese_name, country, logo) VALUES (?, ?, ?, ?, ?)');
            
            let successCount = 0;
            let errorCount = 0;
            
            universities.forEach(uni => {
                stmt.run([uni.rank, uni.name, uni.chineseName, uni.country, uni.logo], (err) => {
                    if (err) {
                        errorCount++;
                        console.error(`添加大学失败: ${uni.name}`, err.message);
                    } else {
                        successCount++;
                    }
                });
            });
            
            stmt.finalize((err) => {
                if (err) {
                    db.run('ROLLBACK');
                    reject(err);
                } else {
                    db.run('COMMIT', (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ successCount, errorCount, total: universities.length });
                        }
                    });
                }
            });
        });
    });
}

// 更新大学
function updateUniversity(id, rank, name, chineseName, country, logo) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE universities SET rank = ?, name = ?, chinese_name = ?, country = ?, logo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [rank, name, chineseName, country, logo, id],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, rank, name, chineseName, country, logo, changes: this.changes });
                }
            }
        );
    });
}

// 删除大学
function deleteUniversity(id) {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        db.run(
            'DELETE FROM universities WHERE id = ?',
            [id],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, changes: this.changes });
                }
            }
        );
    });
}

// 清空大学表（用于重新导入）
function clearUniversities() {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM universities', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({ success: true });
            }
        });
    });
}

module.exports = {
    getDatabase,
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
};

