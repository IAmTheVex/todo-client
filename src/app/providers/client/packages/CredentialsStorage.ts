import { Credentials } from "./Credentials";
import { Injectable } from "@angular/core";

@Injectable()
export class CredentialsStorage {
    public store(credentials: Credentials) {
        localStorage.setItem("atk", credentials.apiAuthToken + "|" + credentials.apiRefreshToken);
    }

    public export(): Credentials {
        let value = localStorage.getItem("atk");
        if(!value) return null;
        let components = value.split("|");
        if(components.length != 2) return null;
        
        return new Credentials(components[0], components[1]);
    }
}