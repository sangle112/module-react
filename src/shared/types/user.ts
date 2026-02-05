export type User = {
  // API có thể trả id hoặc _id
  id?: string;
  _id?: string;

  username?: string;
  email?: string;

  // avatar có nhiều tên
  avatar?: string;
  profilePicture?: string;
  avatarUrl?: string;
};
