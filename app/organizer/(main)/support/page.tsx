"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrganizerSupport } from '@/hooks/organizer/useOrganizerSupport';
import { useOrganizerEvents } from '@/hooks/organizer/useOrganizerEvents';
import { CreateSupportRequestFormData, validateFile } from '@/lib/validations/support.validation';
import { Event } from '@/types/event.types';
import SupportForm from '@/components/organizer/support/SupportForm';
import SuccessMessage from '@/components/organizer/support/SuccessMessage';
import SupportHeader from '@/components/organizer/support/SupportHeader';
import SupportInfo from '@/components/organizer/support/SupportInfo';

export default function SupportPage() {
  const router = useRouter();
  const { createSupportRequest, isLoading, error, clearError } = useOrganizerSupport();
  const { getMyEvents } = useOrganizerEvents();
  
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketCode, setTicketCode] = useState('');
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  useEffect(() => {
    // Load organizer's events for selection
    const loadEvents = async () => {
      try {
        const response = await getMyEvents({ limit: 100 });
        if (response?.success && response.data?.requests) {
          setEvents(response.data.requests);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      }
    };
    
    loadEvents();
  }, [getMyEvents]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newErrors: string[] = [];
    const validFiles: File[] = [];
    
    // Check total file limit
    if (attachedFiles.length + files.length > 5) {
      newErrors.push('Chỉ được đính kèm tối đa 5 file.');
      setFileErrors(newErrors);
      return;
    }
    
    // Validate each file
    files.forEach(file => {
      const validation = validateFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        newErrors.push(validation.error || 'File không hợp lệ');
      }
    });
    
    setFileErrors(newErrors);
    if (validFiles.length > 0) {
      setAttachedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateSupportRequestFormData) => {
    clearError();
    setFileErrors([]);
    
    const response = await createSupportRequest(data, attachedFiles);
    
    if (response?.success) {
      setIsSuccess(true);
      setTicketCode(response.data?.ticketCode || '');
      setAttachedFiles([]);
      
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleNewRequest = () => {
    setIsSuccess(false);
    setTicketCode('');
    clearError();
    setFileErrors([]);
  };

  if (isSuccess) {
    return <SuccessMessage ticketCode={ticketCode} onNewRequest={handleNewRequest} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <SupportHeader />
        <SupportForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          events={events}
          attachedFiles={attachedFiles}
          fileErrors={fileErrors}
          onFileChange={handleFileChange}
          onRemoveFile={removeFile}
          apiError={error}
        />
        <SupportInfo />
      </div>
    </div>
  );
}
