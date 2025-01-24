const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// 连接字符串，请替换为你的实际连接信息
const uri = 'mongodb://localhost:27017/your-database-name';

// 用户模型定义
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

async function updatePassword() {
    try {
        // 连接到 MongoDB
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const plainPassword = '222'; // 明文密码
        const saltRounds = 10;

        // 生成 bcrypt 哈希
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        // 使用 findOneAndUpdate 直接更新，无需额外加载文档
        // const result = await User.findOneAndUpdate(
        //     { username: '111' }, // 替换为你要更新的用户名
        //     { password: hashedPassword },
        //     { new: true, runValidators: true } // 返回更新后的文档，并运行验证器
        // );
        console.log('生成的密码', hashedPassword)
        // if (result) {
        //     console.log('Password updated successfully for user:', result.username);
        // } else {
        //     console.error('User not found or update failed.');
        // }

    } catch (error) {
        console.error('Error during password update:', error);
    } finally {
        // 关闭连接
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
}

updatePassword().catch(console.error);