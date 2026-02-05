// src/features/profile/api/profile.api.ts
import http from "@/shared/lib/http";
import type { User } from "@/shared/types/user";

type ServerResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PublicUser = User & {
  fullName?: string;
  bio?: string;
  website?: string;
  gender?: "male" | "female" | "other";
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  postsCount?: number;
  isVerified?: boolean;
  createdAt?: string;
  profilePicture?: string;
};

export const profileApi = {
  async getMyProfile() {
    const res = await http.get<ServerResponse<PublicUser>>("/users/profile");
    return res.data.data;
  },

  async updateMyProfile(payload: {
    fullName?: string;
    bio?: string;
    website?: string;
    gender?: "male" | "female" | "other";
    profilePicture?: File;
  }) {
    const form = new FormData();
    if (payload.fullName) form.append("fullName", payload.fullName);
    if (payload.bio) form.append("bio", payload.bio);
    if (payload.website) form.append("website", payload.website);
    if (payload.gender) form.append("gender", payload.gender);
    if (payload.profilePicture)
      form.append("profilePicture", payload.profilePicture);

    const res = await http.patch<ServerResponse<PublicUser>>(
      "/users/profile",
      form,
    );
    return res.data.data;
  },

  async deleteProfilePicture() {
    const res = await http.delete<ServerResponse<null>>(
      "/users/profile/picture",
    );
    return res.data.data; // null
  },

  async getUserById(userId: string) {
    const res = await http.get<ServerResponse<PublicUser>>(`/users/${userId}`);
    return res.data.data;
  },

  async searchUsers(q: string) {
    const res = await http.get<ServerResponse<PublicUser[]>>("/users/search", {
      params: { q },
    });
    return res.data.data;
  },

  async getSuggestedUsers(limit?: number) {
    const res = await http.get<ServerResponse<PublicUser[]>>(
      "/users/suggested",
      {
        params: limit ? { limit } : undefined,
      },
    );
    return res.data.data;
  },

  // follow system (tiện gom vào profile)
  async followUser(userId: string) {
    const res = await http.post<ServerResponse<null>>(
      `/follow/${userId}/follow`,
    );
    return res.data.data; // null
  },

  async unfollowUser(userId: string) {
    const res = await http.delete<ServerResponse<null>>(
      `/follow/${userId}/follow`,
    );
    return res.data.data; // null
  },
};
