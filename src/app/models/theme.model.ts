import { Comment } from "./comment";

export interface Theme {
    _id: string;
    themeName: string;
    userId: string;
    subscribers: string[];
    created_at: Date;
    comments?: Comment[];
}