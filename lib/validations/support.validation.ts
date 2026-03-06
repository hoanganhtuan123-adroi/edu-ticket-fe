import { z } from 'zod';

export const createSupportRequestSchema = z.object({
  title: z
    .string()
    .min(1, 'Tiêu đề không được để trống')
    .max(255, 'Tiêu đề không được vượt quá 255 ký tự')
    .trim(),
  description: z
    .string()
    .min(1, 'Mô tả không được để trống')
    .min(10, 'Mô tả phải có ít nhất 10 ký tự')
    .trim(),
  eventId: z
    .string()
    .uuid('ID sự kiện không hợp lệ')
    .optional()
    .or(z.literal('')),
});

export type CreateSupportRequestFormData = z.infer<typeof createSupportRequestSchema>;

export const fileUploadSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .max(5, 'Chỉ được đính kèm tối đa 5 file')
    .optional(),
});

export const supportedFileTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/gif',
  'image/webp',
];

export const maxFileSize = 10 * 1024 * 1024; // 10MB

export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  if (!supportedFileTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File ${file.name} không được hỗ trợ. Chỉ chấp nhận PDF, Word, và các định dạng ảnh.`
    };
  }
  
  if (file.size > maxFileSize) {
    return {
      isValid: false,
      error: `File ${file.name} quá lớn. Tối đa 10MB mỗi file.`
    };
  }
  
  return { isValid: true };
};
