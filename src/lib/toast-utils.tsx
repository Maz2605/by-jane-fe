import toast from "react-hot-toast";
import ToastNotification from "@/components/ui/ToastNotification";

export const showSuccessToast = (message: string) => {
    toast.custom((t) => (
        <ToastNotification
            visible={t.visible}
            message={message}
            type="success"
            id={t.id}
        />
    ));
};

export const showErrorToast = (message: string) => {
    toast.custom((t) => (
        <ToastNotification
            visible={t.visible}
            message={message}
            type="error"
            id={t.id}
        />
    ));
};

export const dismissToast = () => {
    toast.dismiss();
};
