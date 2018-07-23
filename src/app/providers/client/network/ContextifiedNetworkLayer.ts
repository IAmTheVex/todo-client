import { NetworkLayer } from "./NetworkLayer";
import { NetworkBusyError } from "./NetworkBusyError";
import { ContextProvider } from "./ContextProvider";
import 'rxjs/add/observable/fromPromise';
import { fromPromise } from "rxjs/observable/fromPromise";
import { Observable } from "rxjs/Observable";

export class ContextifiedNetworkLayer extends NetworkLayer {
    private busy: boolean = false;
    private context: ContextProvider = null;

    public isFree(): boolean {
        return !this.busy;
    }

    public allocate(context: ContextProvider) {
        if (this.busy) throw new NetworkBusyError();
        this.context = context;
        this.busy = true;
    }

    public free() {
        this.context = null;
        this.busy = false;
    }

    protected provideHeaders(): Object {
        if (!this.context) return {};
        return this.context.compile();
    }


    public async post(url: string, data: Object, headers: any = {}): Promise<any> {
        headers['user-agent'] = "Concreto/4 Mink Client";
        headers['content-type'] = "application/json";

        let response = await fetch(url, {
            body: JSON.stringify(data),
            cache: 'no-cache',
            credentials: 'same-origin',
            headers,
            method: 'POST',
            mode: 'cors',
            redirect: 'follow',
            referrer: 'no-referrer'
        });
        if (!response.ok) {
            throw await response.json();
        }
        return await response.json();
    }

    public async get(url: string, headers: any = {}): Promise<any> {
        headers['user-agent'] = "Concreto/4 Mink Client";
        headers['content-type'] = "application/json";

        let response = await fetch(url, {
            cache: 'no-cache',
            credentials: 'same-origin',
            headers,
            method: 'GET',
            mode: 'cors',
            redirect: 'follow',
            referrer: 'no-referrer'
        });
        if (!response.ok) {
            throw await response.json();
        }
        return await response.json();
    }

    public async call(method: string, data: Object = null): Promise<any> {
        let headers: any = {};

        if (this.context != null) headers = this.context.compile();

        if (typeof data == "undefined" || data == null)
            return this.get(this.uri + method, headers);
        return this.post(this.uri + method, data, headers);
    }
}