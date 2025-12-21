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

// --- MỚI THÊM: Hàm Đổi mật khẩu ---
export async function changePassword(
    currentPassword: any, 
    password: any, 
    passwordConfirmation: any, 
    token: string
) {
    try {
        // Endpoint mặc định của Strapi để đổi pass
        const data = await fetchAPI("/auth/change-password", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`, // Bắt buộc: Phải đăng nhập mới đổi được
            },
            body: JSON.stringify({
                currentPassword,
                password,
                passwordConfirmation,
            }),
        });

        return data;
    } catch (error) {
        console.error("Change Password Error:", error);
        throw error;
    }
}