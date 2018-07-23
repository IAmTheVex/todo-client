import { User } from "../entities/User";
import { ConnectResponse } from "./ConnectResponse";

export class RegisterSuccessResponse {
    public info: ConnectResponse;
    public token: string;
    public refresh: string;
}