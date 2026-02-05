import { useParams } from "react-router-dom";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfilePostsSection } from "../components/ProfilePostsSection";
import { useUserProfile } from "../hooks/useUserProfile";
import { useFollowUser } from "../hooks/useFollowUser";
import { useUnfollowUser } from "../hooks/useUnfollowUser";

export default function UserProfilePage() {
  const { userId } = useParams();

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useUserProfile(userId);
  const follow = useFollowUser();
  const unfollow = useUnfollowUser();

  if (isLoading) return <div className="p-4">Loading...</div>;

  if (isError)
    return (
      <div className="p-4">
        <div className="mb-2">Load user failed.</div>
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

  if (!user) return <div className="p-4">No user.</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <ProfileHeader
        user={user}
        isMe={false}
        isFollowLoading={follow.isPending || unfollow.isPending}
        onFollow={() => userId && follow.mutate(userId)}
        onUnfollow={() => userId && unfollow.mutate(userId)}
      />

      {/* ✅ posts của user theo param */}
      <ProfilePostsSection userId={userId} defaultFilter="all" />
    </div>
  );
}
