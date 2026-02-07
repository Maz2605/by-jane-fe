import { STRAPI_URL } from "./base";

export async function uploadFile(file: Blob, token: string) {
    try {
        const formData = new FormData();
        formData.append("files", file, "avatar.jpg"); // Force name as avatar.jpg for blob

        const res = await fetch(`${STRAPI_URL}/api/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!res.ok) {
            throw new Error(`Upload failed: ${res.statusText}`);
        }

        const data = await res.json();
        return data[0]; // Strapi upload returns an array, we take the first item
    } catch (error) {
        console.error("Upload Error:", error);
        throw error;
    }
}
