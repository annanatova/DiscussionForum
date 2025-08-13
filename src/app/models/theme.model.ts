import { Comment } from "./comment";
import { User } from "./user.model";

export interface Theme {
    _id: string;
    themeName: string;
    userId: any;
    subscribers: string[];
    created_at: Date;
    comments?: Comment[];
}