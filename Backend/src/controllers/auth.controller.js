// các file tỏng folder controller này để tiếp nhận các http request ( yêu cầu ) từ client ( trình duyệt, mobile app ) ,
// sau đó gọi tầng service để xử lý logic nghiệp vụ và trả về http response ( phản hồi)
// kèm theo mã trạng thái http (http status code) phù hợp

// import service auth
const ApiError = require("../helpers/apiError");
const authService = require("../services/auth.service");

//req = request (yêu cầu): đại diện cho luồng dữ liệu từ client gửi lên server
const register = async (req, res) => {
  try {
    await authService.register(req.body);
    res.status(201).json({ success: true, message: "Đăng ký thành công" });
  } catch (error) {
    // toán tử instanceof kiểm tra xem một đối tượng có phải được khởi tạo từ một Lớp (Class) cụ thể nào đó hay không.
    // kiểm tra xem biến error có đúng là bản sao được tạo ra từ class ApiError hay không
    // nếu đúng là ApiError: => lỗi dự tính trước
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    console.error("Lỗi hệ thống:", error);
    res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    console.error("Lỗi hệ thống:", error);
    res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
};

module.exports = { register, login };
