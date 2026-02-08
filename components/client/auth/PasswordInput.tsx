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
        className="w-full pl-11 pr-12 py-3 sm:py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-gray-300 text-sm sm:text-base"
        placeholder="Nhập mật khẩu của bạn"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute inset-y-0 right-0 pr-4 flex items-center"
      >
        <i
          className={`fas ${show ? "fa-eye-slash" : "fa-eye"} text-gray-400 hover:text-gray-600 transition-colors`}
        ></i>
      </button>
    </div>
  );
}
