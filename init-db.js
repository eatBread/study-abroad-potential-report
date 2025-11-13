const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('数据库连接错误:', err.message);
        process.exit(1);
    }
    console.log('已连接到SQLite数据库');
});

// 创建表
db.serialize(() => {
    // 机构码表
    db.run(`CREATE TABLE IF NOT EXISTS institutions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT,
        is_completed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('创建机构码表错误:', err.message);
        } else {
            console.log('机构码表创建成功');
        }
    });

    // 用户表
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        institution_code TEXT NOT NULL,
        student_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (institution_code) REFERENCES institutions(code)
    )`, (err) => {
        if (err) {
            console.error('创建用户表错误:', err.message);
        } else {
            console.log('用户表创建成功');
        }
    });

    // 问卷表
    db.run(`CREATE TABLE IF NOT EXISTS surveys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        institution_code TEXT NOT NULL,
        student_name TEXT NOT NULL,
        survey_data TEXT NOT NULL,
        survey_start_time TEXT,
        survey_end_time TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`, (err) => {
        if (err) {
            console.error('创建问卷表错误:', err.message);
        } else {
            console.log('问卷表创建成功');
            
            // 插入示例机构码（可选）
            db.run(`INSERT OR IGNORE INTO institutions (code, name) VALUES 
                ('DEMO001', '示例机构1'),
                ('DEMO002', '示例机构2'),
                ('TEST001', '测试机构')
            `, (err) => {
                if (err) {
                    console.error('插入示例数据错误:', err.message);
                } else {
                    console.log('示例机构码已创建');
                }
                db.close();
            });
        }
    });
});

