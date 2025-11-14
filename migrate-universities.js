/**
 * 数据迁移脚本：将 university-data.js 中的数据导入到数据库
 * 使用方法：node migrate-universities.js
 */

const { 
    initDatabase, 
    batchCreateUniversities, 
    getAllUniversities,
    clearUniversities 
} = require('./database');

// 导入大学数据
const { QS_TOP_UNIVERSITIES } = require('./scripts/university-data.js');

async function migrateUniversities() {
    try {
        console.log('开始迁移大学数据...');
        
        // 初始化数据库
        await initDatabase();
        console.log('数据库初始化完成');
        
        // 检查数据库中是否已有数据
        const existing = await getAllUniversities();
        if (existing.length > 0) {
            console.log(`数据库中已有 ${existing.length} 条大学数据`);
            console.log('是否要清空现有数据并重新导入？(y/n)');
            // 这里可以添加交互式确认，但为了自动化，我们直接清空
            // 如果需要保留数据，可以注释掉下面这行
            await clearUniversities();
            console.log('已清空现有数据');
        }
        
        // 转换数据格式
        const universities = QS_TOP_UNIVERSITIES.map(uni => ({
            rank: uni.rank,
            name: uni.name,
            chineseName: uni.chineseName,
            country: uni.country,
            logo: uni.logo || ''
        }));
        
        console.log(`准备导入 ${universities.length} 条大学数据...`);
        
        // 批量导入
        const result = await batchCreateUniversities(universities);
        
        console.log('='.repeat(50));
        console.log('迁移完成！');
        console.log(`成功导入: ${result.successCount} 条`);
        console.log(`失败: ${result.errorCount} 条`);
        console.log(`总计: ${result.total} 条`);
        console.log('='.repeat(50));
        
        // 验证数据
        const verify = await getAllUniversities();
        console.log(`验证：数据库中现有 ${verify.length} 条大学数据`);
        
        process.exit(0);
    } catch (error) {
        console.error('迁移失败:', error);
        process.exit(1);
    }
}

// 执行迁移
migrateUniversities();

