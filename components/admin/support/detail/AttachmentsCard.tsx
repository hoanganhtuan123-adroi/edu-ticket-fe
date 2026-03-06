import { Download, Paperclip } from 'lucide-react';
import { SupportRequestDetailResponseDto } from '@/types/support.types';

interface AttachmentsCardProps {
  attachments: SupportRequestDetailResponseDto['attachments'];
}

export function AttachmentsCard({ attachments }: AttachmentsCardProps) {
  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return Math.round(size / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('docx')) return '📝';
    if (mimeType.includes('image')) return '🖼️';
    return '📎';
  };

  const handleDownload = async (attachment: any) => {
    try {
      // Fix double extension issue
      let fixedUrl = attachment.fileUrl;
      if (fixedUrl.includes('.pdf.pdf')) {
        fixedUrl = fixedUrl.replace('.pdf.pdf', '.pdf');
      }
      if (fixedUrl.includes('.docx.docx')) {
        fixedUrl = fixedUrl.replace('.docx.docx', '.docx');
      }
      if (fixedUrl.includes('.png.png')) {
        fixedUrl = fixedUrl.replace('.png.png', '.png');
      }
      
      // Option 1: Try direct download first
      const link = document.createElement('a');
      link.href = fixedUrl;
      link.download = attachment.fileName.replace('.pdf.pdf', '.pdf').replace('.docx.docx', '.docx').replace('.png.png', '.png');
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      // Option 2: Try opening in new tab
      let fixedUrl = attachment.fileUrl;
      if (fixedUrl.includes('.pdf.pdf')) {
        fixedUrl = fixedUrl.replace('.pdf.pdf', '.pdf');
      }
      window.open(fixedUrl, '_blank');
    }
  };

  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          <Paperclip className="w-5 h-5 inline mr-2" />
          Tệp đính kèm ({attachments.length})
        </h2>
        
        <div className="space-y-3">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getFileIcon(attachment.mimeType)}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {attachment.fileName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(attachment.fileSize)} • {attachment.mimeType}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDownload(attachment)}
                className="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50"
                title="Tải xuống"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
