// Controller chỉ lo giao tiếp HTTP, Service chỉ lo xử lý dữ liệu.

// gọi đến class PrismaClient trong thư viện prisma để tương tác với database ( thêm, sửa, xóa, tìm kiếm)
const { PrismaClient } = require("@prisma/client");

// gọi đến thư viện bcrypt để mã hóa mật khẩu ( hash )
const bcrypt = require("bcrypt");

// gọi đến thư viện jsonwebtoken để tạo và xác thực token khi người dùng đăng nhập
const jwt = require("jsonwebtoken");
const ApiError = require("../helpers/apiError");

// khởi tạo đối tượng prisma để tương tác với database
const prisma = new PrismaClient();
// biến này giống như 1 "con dấu", khi người dùng đăng nhập thành công, bạn cấp cho họ 1 cái token ( kèm "đánh dấu" cái token đó để chứng minh token này do chính server của bạn cấp )
const jwt_secret = process.env.JWT_SECRET || "123123";

const register = async (userData) => {
  const { fullName, email, password, role } = userData;

  const existingUser = await prisma.users.findUnique({ where: { email } });
  if (existingUser) throw new ApiError(400, "Email đã được sử dụng");

  // trim(): loại bỏ khoảng trắng ở đầu và cuối chuỗi
  // split(): tách chuỗi
  // /\s+/ : ký hiệu đại diện cho 1 hoặc nhiều dấu cách
  const namePart = fullName.trim().split(/\s+/);
  // hàm pop(): cắt lấy phần tử cuối cùng của mảng
  const first_name = namePart.pop();
  // nối các phần tử còn lại thành 1 chuỗi duy nhất cách nhau bởi dấu cách
  // xử lý ngoại lệ TH người dùng nhập mỗi 1 từ vào phần fullname
  const last_name = namePart.join(" ") || "";

  //mã hóa mật khẩu người dùng nhập vào . số 10 là độ phức tạp của thuật toán mã hóa , số càng lớn thì càng bảo mật nhưng chạy càng chậm
  const hashedPassword = await bcrypt.hash(password, 10);

  // gọi hàm mới tạo 1 bản ghi người dùng vào db và trả về kết quả
  return await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
      first_name,
      last_name: last_name || "",
      role: role,
    },
  });
};

const login = async (email, password) => {
  // gọi prisma vào db bảng Users tìm xem đã tồn tại mail này chưa , kết quả tìm được sẽ gán vào biến user
  // nếu có tồn tại thì user lúc này là 1 obj chứ toàn bộ thông tin của người dùng nằm trong db ( bao gồm cả id, email, pass, name....)
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) throw new ApiError(400, "Tài khoản không tồn tại");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(400, "Sai mật khẩu");

  // hàm jwt.sign(): gồm 3 tham số
  // payload: là 1 object chứa các thông tin đóng gói vào token. Mà là obj nên phải tuân thủ theo định dạng key: value (Tên_thuộc_tính: Giá_trị).
  const token = jwt.sign({ userID: user.id, role: user.role }, jwt_secret, {
    expiresIn: "1d",
  });

  // trả về token : duy trì trạng thái đăng nhập
  // user : dùng để vẽ giao diện UI và phân quyền truy c
  // thật ra id và role đã được giấu bên trong token, những việc giải mã token này ở FE khá rườm rà nên BE gửi luôn cả id và role để FE lấy dùng cho tiện
  return { token, user: { id: user.id, email: user.email, role: user.role } };
};

module.exports = { register, login };
