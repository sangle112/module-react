import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/shared/lib/http";
import { postKeys } from "./postKeys";

export type CreatePostPayload = {
  caption?: string;
  files: File[];
};

// ✅ Thử các field name phổ biến (backend khác nhau sẽ dùng khác nhau)
const UPLOAD_FIELDS = ["media", "files", "file", "image", "images"] as const;

function unwrap(res: any) {
  return res?.data?.data ?? res?.data ?? res;
}

function getErrorMessage(err: any) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Create post failed"
  );
}

export function useCreatePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePostPayload) => {
      if (!payload.files?.length)
        throw new Error("Please select at least 1 file");

      // (Optional) chặn webp vì hay gây 500 ở backend
      const bad = payload.files.find(
        (f) =>
          f.type === "image/webp" || f.name.toLowerCase().endsWith(".webp"),
      );
      if (bad) {
        throw new Error(
          "File .webp hiện đang gây lỗi upload. Vui lòng dùng .jpg/.png",
        );
      }

      const trySend = async (field: string) => {
        const form = new FormData();
        if (payload.caption) form.append("caption", payload.caption);
        payload.files.forEach((f) => form.append(field, f));

        // ✅ KHÔNG set Content-Type
        const res = await http.post("/posts", form);
        return unwrap(res);
      };

      let lastErr: any = null;

      for (const field of UPLOAD_FIELDS) {
        try {
          return await trySend(field);
        } catch (err: any) {
          lastErr = err;

          // Nếu 401/403 thì khỏi thử tiếp (lỗi auth)
          const status = err?.response?.status;
          if (status === 401 || status === 403) {
            throw new Error(getErrorMessage(err));
          }

          // Nếu lỗi khác (400/415/500) thì thử field tiếp theo
          continue;
        }
      }

      throw new Error(getErrorMessage(lastErr));
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postKeys.feed() });
    },
  });
}
