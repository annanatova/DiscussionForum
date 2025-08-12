import { User } from './user.model';

export interface Post {
  _id: string;
  text: string;
  userId: User;
  created_at: Date;
}
