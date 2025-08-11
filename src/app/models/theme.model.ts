import { User } from "./user.model";
import { Comment } from "./comment";

export interface Theme {
    _id: string;
    themeName: string;
    userId: User;
    subscribers: string[];
    created_at: Date;
    comments?: Comment[];
}