import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPassword } from "../hooks/useForgotPassword";

export default function ForgotPasswordPage() {
  const mutation = useForgotPassword();
  const [email, setEmail] = useState("");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-center">Quên mật khẩu</h1>

      <p className="text-sm text-muted-foreground text-center">
        Nhập email để nhận link đặt lại mật khẩu.
      </p>

      <div className="space-y-3">
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="w-full bg-black text-white py-2 rounded disabled:opacity-60"
          disabled={!email || mutation.isPending}
          onClick={async () => {
            await mutation.mutateAsync(email.trim());
          }}
        >
          {mutation.isPending ? "Đang gửi..." : "Gửi link reset mật khẩu"}
        </button>

        {mutation.isSuccess && (
          <p className="text-sm text-green-600 text-center">
            Nếu email tồn tại, hệ thống đã gửi link reset. Hãy kiểm tra
            inbox/spam.
          </p>
        )}

        {mutation.isError && (
          <p className="text-sm text-red-500 text-center">
            {(mutation.error as any)?.response?.data?.message ?? "Gửi thất bại"}
          </p>
        )}
      </div>

      <p className="text-center text-sm">
        <Link to="/login" className="underline">
          Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
}
