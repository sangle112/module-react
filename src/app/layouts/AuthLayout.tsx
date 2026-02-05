import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[380px] space-y-4">
        {/* Card */}
        <div className="bg-white border rounded-xl shadow-sm px-6 py-8">
          {/* Brand */}
          <div className="mb-6 text-center">
            <div className="text-3xl font-semibold tracking-tight">
              Instagram
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Kết nối và chia sẻ khoảnh khắc của bạn
            </p>
          </div>

          {/* Pages render here */}
          <Outlet />
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          Bằng việc tiếp tục, bạn đồng ý với Điều khoản &amp; Chính sách.
        </div>
      </div>
    </div>
  );
}
