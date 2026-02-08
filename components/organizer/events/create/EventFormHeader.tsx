import React from 'react';

interface EventFormHeaderProps {
  title: string;
  description: string;
}

export default function EventFormHeader({ title, description }: EventFormHeaderProps) {
  return (
    <div className="mb-6 lg:mb-8">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-1 text-sm lg:text-base">
        {description}
      </p>
    </div>
  );
}
