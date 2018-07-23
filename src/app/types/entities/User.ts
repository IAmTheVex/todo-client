import { Task } from './Task';
import { Stats } from './Stats';

export class User {
    public id: string;
    public created: Date;
    public email: string;
    public fullName: string;
    public tasks: Task[];
    public stats: Stats;
}