import { User } from "../entities/User";

export class LoginSuccessResponse {
    public email: string;
    public id: string;
    public token: string;
    public refresh: string;
}