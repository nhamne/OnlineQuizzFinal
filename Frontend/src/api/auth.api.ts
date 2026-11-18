export const loginApi = async (email: string, password: string) =>{
    const respone = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        // hàm fetch không thể gửi trực tiếp 1 obj qua mạng internet nên phải ép kiểu (stringify) thành 1 chuỗi string
        body: JSON.stringify({email, password})
    });
    // json(): hàm convert dữ liệu JSON thành object
    const data = await respone.json();
    if(!respone.ok) {
        throw new Error(data.message || 'Login failed');
    }

    return data;
}

export const registerApi = async (email: string, password: string, fullName: string, role: string) => {
    const respone = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password, fullName, role})
    });

    const data = await respone.json();
    if(!respone.ok){
        throw new Error(data.message || 'Register failed') ;
    }
    return data;
}