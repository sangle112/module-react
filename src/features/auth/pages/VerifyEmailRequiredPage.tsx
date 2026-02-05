import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useResendVerifyEmail } from "../hooks/useResendVerifyEmail";

export function VerifyEmailRequiredPage() {
  const location = useLocation();
  const resendMutation = useResendVerifyEmail();

  // lấy email từ state nếu có (đi từ Login sang)
  const initialEmail = (location.state as any)?.email ?? "";
  const [email, setEmail] = useState(initialEmail);

  return (
    <div className="space-y-6 text-center">
      <h1 className="text-2xl font-semibold">Xác thực email</h1>

      <p className="text-sm text-muted-foreground">
        Tài khoản của bạn cần được xác thực email <br />
        trước khi có thể sử dụng đầy đủ tính năng.
      </p>

      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="Nhập email đã đăng ký"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="w-full bg-black text-white py-2 rounded disabled:opacity-60"
        disabled={!email || resendMutation.isPending}
        onClick={() => resendMutation.mutate(email.trim())}
      >
        {resendMutation.isPending
          ? "Đang gửi lại email..."
          : "Gửi lại email xác thực"}
      </button>

      {resendMutation.isSuccess && (
        <p className="text-sm text-green-600">
          Đã gửi lại email xác thực. Vui lòng kiểm tra inbox hoặc spam.
        </p>
      )}

      {resendMutation.isError && (
        <p className="text-sm text-red-500">
          {(resendMutation.error as any)?.response?.data?.message ??
            "Không thể gửi email xác thực. Vui lòng thử lại."}
        </p>
      )}

      <p className="text-sm">
        <Link to="/login" className="underline">
          Quay lại trang đăng nhập
        </Link>
      </p>
    </div>
  );
}
