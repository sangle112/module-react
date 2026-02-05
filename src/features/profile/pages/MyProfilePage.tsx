import { useState } from "react";
import { useMyProfile } from "../hooks/useMyProfile";
import { useUpdateMyProfile } from "../hooks/useUpdateMyProfile";
import { useDeleteProfilePicture } from "../hooks/useDeleteProfilePicture";
import { ProfileHeader } from "../components/ProfileHeader";
import { EditProfileDialog } from "../components/EditProfileDialog";
import { ProfilePostsSection } from "../components/ProfilePostsSection";

export default function MyProfilePage() {
  const { data: me, isLoading, isError, error, refetch } = useMyProfile();
  const update = useUpdateMyProfile();
  const delPic = useDeleteProfilePicture();
  const [open, setOpen] = useState(false);

  if (isLoading) return <div className="p-4">Loading...</div>;

  if (isError)
    return (
      <div className="p-4">
        <div className="mb-2">Load profile failed.</div>
        <pre className="text-xs opacity-70">
          {String((error as any)?.message ?? error)}
        </pre>
        <button
          className="mt-3 px-3 py-2 rounded border"
          onClick={() => refetch()}
        >
          Retry
        </button>
      </div>
    );

  if (!me) return <div className="p-4">No profile data.</div>;

  const myId = (me as any)?._id ?? (me as any)?.id ?? (me as any)?.userId;

  return (
    <div className="max-w-3xl mx-auto">
      <ProfileHeader user={me} isMe onEdit={() => setOpen(true)} />

      <div className="px-4 pb-4">
        <button
          onClick={() => delPic.mutate()}
          disabled={delPic.isPending}
          className="text-sm underline disabled:opacity-60"
        >
          {delPic.isPending ? "Deleting..." : "Delete profile picture"}
        </button>
      </div>

      <EditProfileDialog
        open={open}
        onClose={() => setOpen(false)}
        me={me}
        isSaving={update.isPending}
        onSubmit={(payload) =>
          update.mutate(payload, {
            onSuccess: () => setOpen(false),
          })
        }
      />

      <ProfilePostsSection userId={myId} defaultFilter="all" />
    </div>
  );
}
