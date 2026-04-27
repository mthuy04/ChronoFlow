"use client";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { sendGAEvent } from '@next/third-parties/google'; // Import thư viện GA4

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className,
  onClick, 
  ...props
}: ButtonProps) {
  
  const handleInternalClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 1. Tự động xác định tên nút bấm (Nhãn dữ liệu)
    // Nếu nút là chữ thì lấy chữ, nếu là icon thì đặt tên là "icon_button"
    const label = typeof children === "string" ? children : "icon_button";
    
    // 2. Bắn sự kiện về Google Analytics
    sendGAEvent({ 
      event: 'button_click', 
      button_name: label,
      page_path: window.location.pathname // Biết nút đó được bấm ở trang nào
    });

    // 3. Thực hiện chức năng gốc của nút (nếu có)
    if (onClick) onClick(e);
  };

  return (
    <button
      onClick={handleInternalClick}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-6 py-3 transition-colors font-light",
        fullWidth && "w-full",
        variant === "primary" && "bg-[#3A3836] text-white hover:bg-[#2C2A28]",
        variant === "secondary" && "border border-[#DCD6CC] text-[#6B655E] hover:border-[#3A3836] hover:text-[#3A3836]",
        variant === "ghost" && "text-[#8C7A6B] hover:text-[#3A3836]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}