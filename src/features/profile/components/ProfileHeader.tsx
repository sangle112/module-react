// src/features/profile/components/ProfileHeader.tsx
import { useRef } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

import type { PublicUser } from "../api/profile.api";
import { useCreateConversation } from "@/features/chat/hooks/useCreateConversation";

type Props = {
  user: PublicUser;
  isMe?: boolean;

  // Edit profile
  onEdit?: () => void;

  // Follow / Unfollow (khi xem user khác)
  onFollow?: () => void;
  onUnfollow?: () => void;
  isFollowLoading?: boolean;

  // Avatar actions (khi là me)
  onChangeAvatar?: (file: File) => void;
  isAvatarUploading?: boolean;

  onDeleteAvatar?: () => void;
  isAvatarDeleting?: boolean;
};

export function ProfileHeader({
  user,
  isMe,
  onEdit,
  onFollow,
  onUnfollow,
  isFollowLoading,
  onChangeAvatar,
  isAvatarUploading,
  onDeleteAvatar,
  isAvatarDeleting,
}: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();
  const createConversation = useCreateConversation();

  const avatar =
    user.profilePicture || "https://placehold.co/200x200?text=Avatar";
  const pickFile = () => fileRef.current?.click();

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // reset input để chọn lại cùng 1 file vẫn trigger
    e.target.value = "";
    onChangeAvatar?.(file);
  };

  const onMessage = async () => {
    const targetUserId = (user as any)._id ?? (user as any).id;
    if (!targetUserId) return;

    try {
      const convo = await createConversation.mutateAsync({
        userId: targetUserId,
      });
      const conversationId = (convo as any)?._id ?? (convo as any)?.id;

      if (!conversationId) return;

      navigate("/chats", { state: { conversationId } });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-10 items-start">
        {/* Avatar */}
        <div className="relative">
          <button
            type="button"
            onClick={isMe ? pickFile : undefined}
            className={[
              "relative block rounded-full",
              isMe ? "cursor-pointer" : "cursor-default",
            ].join(" ")}
            aria-label="avatar"
          >
            <img
              src={avatar}
              alt="avatar"
              className="h-36 w-36 rounded-full object-cover border"
            />

            {/* overlay khi hover (chỉ me) */}
            {isMe && (
              <div
                className={[
                  "absolute inset-0 rounded-full",
                  "bg-black/40 text-white",
                  "flex items-center justify-center",
                  "text-sm font-medium",
                  "opacity-0 hover:opacity-100 transition",
                ].join(" ")}
              >
                {isAvatarUploading ? "Uploading..." : "Change photo"}
              </div>
            )}
          </button>

          {/* input file hidden */}
          {isMe && (
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
              disabled={Boolean(isAvatarUploading)}
            />
          )}

          {/* delete avatar link */}
          {isMe && user.profilePicture && (
            <button
              type="button"
              onClick={onDeleteAvatar}
              disabled={Boolean(isAvatarDeleting)}
              className="mt-2 text-xs underline opacity-70 hover:opacity-100 disabled:opacity-50"
            >
              {isAvatarDeleting ? "Deleting..." : "Delete photo"}
            </button>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Row 1 */}
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-2xl font-light truncate">{user.username}</h1>

            {isMe ? (
              <button
                type="button"
                onClick={onEdit}
                className="px-4 py-1.5 border rounded-md text-sm font-medium hover:bg-black/5"
              >
                Edit profile
              </button>
            ) : user.isFollowing ? (
              <button
                type="button"
                onClick={onUnfollow}
                disabled={Boolean(isFollowLoading)}
                className="px-4 py-1.5 border rounded-md text-sm hover:bg-black/5 disabled:opacity-60"
              >
                Following
              </button>
            ) : (
              <button
                type="button"
                onClick={onFollow}
                disabled={Boolean(isFollowLoading)}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:opacity-95 disabled:opacity-60"
              >
                Follow
              </button>
            )}

            {!isMe && (
              <button
                type="button"
                onClick={onMessage}
                disabled={createConversation.isPending}
                className="px-4 py-1.5 rounded-md border text-sm hover:bg-black/5 disabled:opacity-60"
              >
                {createConversation.isPending ? "Opening..." : "Message"}
              </button>
            )}
          </div>

          {/* Row 2 */}
          <div className="flex gap-6 mt-5 text-sm">
            <span>
              <b>{user.postsCount ?? 0}</b> posts
            </span>
            <span className="cursor-pointer hover:underline">
              <b>{user.followersCount ?? 0}</b> followers
            </span>
            <span className="cursor-pointer hover:underline">
              <b>{user.followingCount ?? 0}</b> following
            </span>
          </div>

          {/* Row 3 */}
          <div className="mt-4 space-y-1">
            {user.fullName && (
              <div className="font-semibold">{user.fullName}</div>
            )}
            {user.bio && (
              <div className="text-sm whitespace-pre-line">{user.bio}</div>
            )}
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-700 hover:underline break-all"
              >
                {user.website}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
