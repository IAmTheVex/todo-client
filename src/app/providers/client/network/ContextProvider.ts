export class ContextProvider {
    private headers: any = {};

    public compile(): Object {
        return this.headers;
    }

    public header(name: string, value: string): ContextProvider {
        this.headers[name] = value;
        return this;
    }

    public authorize(token: string): ContextProvider {
        this.headers["x-access-token"] = token;
        return this;
    }

    public resource(name: string, value: string): ContextProvider {
        this.headers["x-resource-" + name] = value;
        return this;
    }

    public refresh(token: string): ContextProvider {
        this.headers["x-refresh-token"] = token;
        return this;
    }
}