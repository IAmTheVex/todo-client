import { User } from './User';

export interface Task {
    id: string;
    created: Date;
    text: string;
    state: Boolean;
    user: User;
}