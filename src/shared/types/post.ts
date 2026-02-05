// src/shared/types/post.ts

export type PostUser = {
  _id: string;
  username: string;
};

export type Post = {
  _id: string;

  userId: PostUser;

  caption?: string | null;

  image?: string | null;
  video?: string | null;
  mediaType?: "image" | "video";

  likes: number;
  comments: number;

  likedBy: string[];

  createdAt: string;
  updatedAt?: string;
};
