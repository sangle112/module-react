export type CommentUser = {
  _id: string;
  username: string;
};

export type Comment = {
  _id: string;

  postId: string;

  userId: CommentUser;

  content: string;

  parentCommentId?: string | null;

  repliesCount?: number;

  createdAt: string;
  updatedAt?: string;
};
