const prisma = require('../config/db');

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.users.findMany();
        res.json(users);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách user:", error);
        res.status(500).json({ error: "Lỗi Server" });
    }
};

module.exports = {
    getAllUsers
};