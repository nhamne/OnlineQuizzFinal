// khởi tạo PrismaClient để kết nối với db
const { PrismaClient } = require("@prisma/client");
// nhúng class ApiResponse để ném ra các lỗi có đính kèm mã http status
const ApiError = require("../helpers/apiError");

const prisma = new PrismaClient();

// Math.random(): tạo ra 1 chuỗi số ngẫu nhiên từ 0 đến dưới 1
// .toString(36): chuyển số đó sang hệ cơ số 36 (bao gồm cả số từ 0-9 và 26 chữ cái tiếng anh)
// -> biến số thập phân sang hệ 36 (ví dụ 0.133 -> 0.3894abc)
// .substring(2, 8): cắt chuỗi từ index 2 đến index 8 (bỏ số 0 và dấu chấm)
// .toUpperCase(): chuyển chuỗi sang viết hoa
const generateClassCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const createClass = async (name, teacherId) => {
  if (!name) {
    throw new ApiError(400, "Tên lớp không được để trống");
  }
  if (!teacherId) {
    throw new ApiError(400, "Không xác định được giáo viên");
  }
  let newCode = generateClassCode();
  return await prisma.classes.create({
    data: {
      name: name,
      teacher_id: Number(teacherId),
      class_code: newCode,
    },
  });
};

const updateClass = async (classID, newName) => {
  if (!newName) throw new ApiError(400, "Tên lớp học không được để trống");
  const exisingClass = await prisma.classes.findUnique({
    where: { id: Number(classID) },
  });
  if (!exisingClass) throw new ApiError(404, "Không tìm thấy lớp học này");
  return await prisma.classes.update({
    where: { id: Number(classID) },
    data: { name: newName },
  });
};

const deleteClass = async (classId) => {
  const exisingClass = await prisma.classes.findUnique({
    where: { id: Number(classId) },
  });
  if (!exisingClass) {
    throw new ApiError(404, "Không tìm thấy lớp");
  }
  await prisma.classes.delete({ where: { id: Number(classId) } });
  return { message: "Đã xóa lớp học thành công" };
};

module.exports = { createClass, updateClass, deleteClass };
