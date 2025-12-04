import { fetchAPI } from "./base";

// Hàm Đăng nhập
export async function login(identifier: any, password: any) {
    try {
        const data = await fetchAPI("/auth/local", {
            method: "POST",
            body: JSON.stringify({
                identifier, // Strapi chấp nhận cả username hoặc email
                password,
            }),
        });
        return data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

// Hàm Đăng ký
export async function register(username: any, email: any, password: any) {
    try {
        const data = await fetchAPI("/auth/local/register", {
            method: "POST",
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        });
        return data;
    } catch (error) {
        console.error("Register Error:", error);
        throw error;
    }
}

// Hàm cập nhật thông tin User
export async function updateProfile(userId: number, data: any, token: string) {
    try {
        // Endpoint cập nhật user trong Strapi là: PUT /api/users/{id}
        // Lưu ý: Endpoint này KHÔNG cần bọc data trong object { data: ... } như các Content-Type khác
        // Nó nhận trực tiếp payload phẳng: { fullName: "A", address: "B" }

        const updatedUser = await fetchAPI(`/users/${userId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`, // Bắt buộc phải có Token
            },
            body: JSON.stringify(data), // Gửi thẳng data, không bọc { data: ... }
        });

        return updatedUser;
    } catch (error) {
        console.error("Update Profile Error:", error);
        throw error;
    }
}