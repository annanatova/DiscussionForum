import { Comment } from "./comment";

export interface Theme {
    _id: string;
    themeName: string;
    userId: any;
    subscribers: string[];
    created_at: Date;
    comments?: Comment[];
}