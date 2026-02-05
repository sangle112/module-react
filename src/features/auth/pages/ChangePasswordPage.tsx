import { useState } from "react";
import { useChangePassword } from "../hooks/useChangePassword";

export default function ChangePasswordPage() {
  const mutation = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-center">Đổi mật khẩu</h1>

      <div className="space-y-3">
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Mật khẩu hiện tại"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Mật khẩu mới"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
          disabled={mutation.isPending}
          onClick={async () => {
            await mutation.mutateAsync({
              currentPassword,
              newPassword,
              confirmPassword,
            });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }}
        >
          {mutation.isPending ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
        </button>

        {mutation.isSuccess && (
          <p className="text-sm text-green-600 text-center">
            Đổi mật khẩu thành công.
          </p>
        )}

        {mutation.isError && (
          <p className="text-sm text-red-500 text-center">
            {(mutation.error as any)?.response?.data?.message ??
              "Đổi mật khẩu thất bại"}
          </p>
        )}
      </div>
    </div>
  );
}
