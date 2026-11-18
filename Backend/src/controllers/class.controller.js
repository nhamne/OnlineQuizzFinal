const classService = require("../services/class.service");
const ApiError = require("../helpers/apiError");

const createClass = async (req, res) => {
    try {
        const { name, teacher_id } = req.body;
        const newClass = await classService.createClass(name, teacher_id);
        res.status(201).json({ success: true, data: newClass });
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
};

module.exports = { createClass };
