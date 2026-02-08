"use client";

import { useState } from "react";

export default function PasswordInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <i className="fas fa-lock text-gray-400"></i>
      </div>
      <input
        id="password"
        type={show ? "text" : "password"}
        className="w-full pl-12 pr-14 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-gray-300"
        placeholder="Nhập mật khẩu"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:text-blue-500 transition-colors duration-200"
        onClick={() => setShow(!show)}
        aria-label={show ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
      >
        <div className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors focus:outline-none">
          {show ? (
            <i className="fas fa-eye-slash text-lg"></i>
          ) : (
            <i className="fas fa-eye text-lg"></i>
          )}
        </div>
      </button>
    </div>
  );
}
