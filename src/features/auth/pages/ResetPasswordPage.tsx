import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useResetPassword } from "../hooks/useResetPassword";

export default function ResetPasswordPage() {
  const nav = useNavigate();
  const { token } = useParams();
  const resetMutation = useResetPassword();

  const resetToken = useMemo(() => token ?? "", [token]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const tokenMissing = !resetToken;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-center">Đặt lại mật khẩu</h1>

      {tokenMissing ? (
        <div className="space-y-3 text-center">
          <p className="text-sm text-red-500">
            Token không hợp lệ hoặc bị thiếu.
          </p>
          <Link to="/forgot-password" className="underline text-sm">
            Gửi lại link reset
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Mật khẩu mới"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Nhập lại mật khẩu mới"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              className="w-full bg-black text-white py-2 rounded disabled:opacity-60"
              disabled={resetMutation.isPending}
              onClick={async () => {
                await resetMutation.mutateAsync({
                  token: resetToken,
                  password,
                  confirmPassword,
                });
                nav("/login", { replace: true });
              }}
            >
              {resetMutation.isPending
                ? "Đang cập nhật..."
                : "Cập nhật mật khẩu"}
            </button>

            {resetMutation.isError && (
              <p className="text-sm text-red-500 text-center">
                {(resetMutation.error as any)?.response?.data?.message ??
                  "Reset mật khẩu thất bại"}
              </p>
            )}
          </div>

          <p className="text-center text-sm">
            <Link to="/login" className="underline">
              Quay lại đăng nhập
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
