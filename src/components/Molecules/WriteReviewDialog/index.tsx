"use client"

import Button from "@components/Atoms/Button";
import { renderStars } from "@components/Atoms/Star";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/Atoms/ui/dialog";
import { Textarea } from "@components/Atoms/ui/textarea";
import { ICreateReviewModel } from "@models/review/request.model";
import reviewService from "@services/review";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";

type WriteReviewDialogProps = {
    showReviewDialog: boolean;
    setShowReviewDialog: (showReviewDialog: boolean) => void;
    objectReview: {
        userId: string;
        vendorId: string;
        bookingId: string;
    };
    onReviewSuccess: () => void;
};

const WriteReviewDialog = ({ showReviewDialog, setShowReviewDialog, objectReview, onReviewSuccess }: WriteReviewDialogProps) => {

    /**
     * This function is used to handle the form
     */
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { control, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<ICreateReviewModel>({
        defaultValues: {
            userId: objectReview?.userId || '',
            rating: 0,
            comment: '',
            vendorId: objectReview?.vendorId || '',
            bookingId: objectReview?.bookingId || '',
        }
    });

    useEffect(() => {
        const newPreviews = uploadedFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(newPreviews);

        return () => {
            newPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [uploadedFiles]);


    const onSubmit = async (data: Omit<ICreateReviewModel, 'images'>) => {
        setIsSubmitting(true);

        const formData = new FormData();

        formData.append('userId', objectReview.userId);
        formData.append('vendorId', objectReview.vendorId);
        formData.append('bookingId', objectReview.bookingId);
        formData.append('rating', data.rating.toString());
        if (data.comment) {
            formData.append('comment', data.comment);
        }

        uploadedFiles.forEach(file => {
            formData.append('images', file);
        });

        try {
            const response = await reviewService.createReview(formData) as any;

            if (response.statusCode === 200 || response.statusCode === 201) {
                toast.success(response.message);
                setShowReviewDialog(false);
                reset();
                setUploadedFiles([]);
                onReviewSuccess();
            } else {
                const errorMessage = response.data?.message || 'Đánh giá thất bại';
                toast.error(errorMessage);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };
    //------------------------End------------------------//

    /**
     * This function is used to handle the star click
     */
    const currentRating = watch('rating');

    const handleStarClick = (starIndex: number) => {
        setValue('rating', starIndex);
    };
    //------------------------End------------------------//

    /**
     * This function is used to handle the image upload
     */
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        if (uploadedFiles.length + files.length > 3) {
            toast.error('Chỉ được upload tối đa 3 hình ảnh');
            return;
        }

        const newFiles = Array.from(files);
        setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
        toast.success(`Đã thêm ${files.length} hình ảnh`);
    };

    const removeImage = (indexToRemove: number) => {
        setUploadedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
        toast.success('Đã xóa hình ảnh');
    };
    //------------------------End------------------------//

    /**
     * This function is used to handle the cancel
     */
    const handleCancel = () => {
        setShowReviewDialog(false);
        reset();
        setUploadedFiles([]);
    };
    //------------------------End------------------------//

    return (
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-green-600 hover:bg-green-700 hover:text-white text-white">
                    Đánh giá
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Đánh giá</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Rating Section - No changes needed here */}
                    <div>
                        <label className="block text-sm font-medium mb-2 sm:mb-3">Đánh giá sao</label>
                        <Controller
                            name="rating"
                            control={control}
                            rules={{
                                required: 'Vui lòng chọn số sao đánh giá',
                                min: { value: 1, message: 'Vui lòng chọn ít nhất 1 sao' },
                            }}
                            render={({ field }) => (
                                <div>
                                    <div className="flex space-x-1">
                                        {renderStars(currentRating, true, "w-6 h-6 sm:w-8 sm:h-8", handleStarClick)}
                                    </div>
                                    {errors.rating && (
                                        <span className="text-red-500 text-xs mt-1">{errors.rating.message}</span>
                                    )}
                                </div>
                            )}
                        />
                    </div>

                    {/* Comment Section - No changes needed here */}
                    <div>
                        <label className="block text-sm font-medium mb-2 sm:mb-3">Nội dung đánh giá</label>
                        <Controller
                            name="comment"
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    className="w-full h-48"
                                    placeholder="Nhập đánh giá của bạn"
                                    {...field}
                                />
                            )}
                        />
                    </div>

                    {/* Image Upload Section */}
                    <div>
                        <label className="block text-sm font-medium mb-2 sm:mb-3">
                            Hình ảnh ({uploadedFiles.length}/3)
                        </label>
                        <div className="space-y-3">
                            {uploadedFiles.length < 3 && (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                        disabled={isSubmitting}
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">
                                            {isSubmitting ? 'Đang xử lý...' : 'Click để upload hình ảnh'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            PNG, JPG, JPEG tối đa 3 hình
                                        </p>
                                    </label>
                                </div>
                            )}

                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-3 gap-3">
                                    {imagePreviews.map((previewUrl, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={previewUrl}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="cursor-pointer absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-transparent hover:bg-transparent hover:text-black text-white"
                        >
                            Hủy
                        </button>
                        <Button
                            type="submit"
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default WriteReviewDialog;

