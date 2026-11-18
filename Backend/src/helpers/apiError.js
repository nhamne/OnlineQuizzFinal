// Error: là 1 lớp có sẵn đại diện cho các lỗi của hệ thống, cung cấp sẵn các thuộc tính messgae và stack
// extends: cho phép ApiError kể thừa toàn bộ đặc tính của lớp Error
class ApiError extends Error {
  // hàm khởi tạo . khi dừng từu khóa new ApiError(): hàm này sẽ chạy để nhận đầu vào là mã trạng thái http statusCode và thông báo lỗi message
  constructor(statusCode, message) {
    super(message);
    // đính kèm thêm 1 mã http vào obj lỗi để tầng controller có thể đọc được
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;
