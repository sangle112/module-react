// src/features/profile/components/EditProfileDialog.tsx
import { useMemo, useState } from "react";
import type { PublicUser } from "../api/profile.api";

type FormState = {
  fullName: string;
  bio: string;
  website: string;
  gender: "" | "male" | "female" | "other";
  profilePicture?: File;
};

type Props = {
  open: boolean;
  onClose: () => void;
  me: PublicUser;
  onSubmit: (payload: {
    fullName?: string;
    bio?: string;
    website?: string;
    gender?: "male" | "female" | "other";
    profilePicture?: File;
  }) => void;
  isSaving?: boolean;
};

export function EditProfileDialog({
  open,
  onClose,
  me,
  onSubmit,
  isSaving,
}: Props) {
  const initial = useMemo<FormState>(
    () => ({
      fullName: me.fullName ?? "",
      bio: me.bio ?? "",
      website: me.website ?? "",
      gender: me.gender ?? "",
      profilePicture: undefined,
    }),
    [me],
  );

  const [form, setForm] = useState<FormState>(initial);

  // reset khi mở lại
  if (open && form !== initial) {
    setForm(initial);
  }

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      fullName: form.fullName || undefined,
      bio: form.bio || undefined,
      website: form.website || undefined,
      gender: (form.gender || undefined) as any,
      profilePicture: form.profilePicture,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-[min(560px,92vw)] rounded-xl bg-white p-4 shadow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Edit profile</h2>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded hover:bg-black/5"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div className="grid gap-1">
            <label className="text-sm font-medium">Full name</label>
            <input
              value={form.fullName}
              onChange={(e) =>
                setForm((s) => ({ ...s, fullName: e.target.value }))
              }
              className="border rounded px-3 py-2"
              placeholder="Your name"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-medium">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((s) => ({ ...s, bio: e.target.value }))}
              className="border rounded px-3 py-2 min-h-[90px]"
              placeholder="Tell something..."
            />
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-medium">Website</label>
            <input
              value={form.website}
              onChange={(e) =>
                setForm((s) => ({ ...s, website: e.target.value }))
              }
              className="border rounded px-3 py-2"
              placeholder="https://..."
            />
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-medium">Gender</label>
            <select
              value={form.gender}
              onChange={(e) =>
                setForm((s) => ({ ...s, gender: e.target.value as any }))
              }
              className="border rounded px-3 py-2"
            >
              <option value="">—</option>
              <option value="male">male</option>
              <option value="female">female</option>
              <option value="other">other</option>
            </select>
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-medium">Profile picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((s) => ({ ...s, profilePicture: e.target.files?.[0] }))
              }
              className="border rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded border hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              disabled={isSaving}
              className="px-3 py-2 rounded bg-black text-white disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
