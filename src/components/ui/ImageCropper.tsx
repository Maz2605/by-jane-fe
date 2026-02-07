"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, Check, Loader2, ZoomIn, ZoomOut } from "lucide-react";
import { getCroppedImg } from "@/lib/cropImage"; // Helper function we'll create

interface ImageCropperProps {
    image: string;
    onCropComplete: (croppedImageBlob: Blob) => void;
    onCancel: () => void;
}

export default function ImageCropper({ image, onCropComplete, onCancel }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        try {
            setLoading(true);
            if (croppedAreaPixels) {
                const croppedImage = await getCroppedImg(image, croppedAreaPixels);
                if (croppedImage) {
                    onCropComplete(croppedImage);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Chỉnh sửa ảnh</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 p-1">
                        <X size={20} />
                    </button>
                </div>

                {/* CROP AREA */}
                <div className="relative w-full h-80 bg-gray-900">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1} // Avatar thường vuông
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteHandler}
                        onZoomChange={onZoomChange}
                        showGrid={true}
                        cropShape="round" // Hiển thị khung tròn cho đẹp (optional)
                    />
                </div>

                {/* CONTROLS */}
                <div className="p-6 space-y-6">
                    {/* Zoom Slider */}
                    <div className="flex items-center gap-3">
                        <ZoomOut size={16} className="text-gray-400" />
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF5E4D]"
                        />
                        <ZoomIn size={16} className="text-gray-400" />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-lg font-bold text-white bg-[#FF5E4D] hover:bg-orange-600 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                            Lưu ảnh
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
