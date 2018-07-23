import ApolloClient from "apollo-client";
import { split, ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { setContext } from 'apollo-link-context';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';

export abstract class NetworkLayer {
    private httpLink: HttpLink;
    private wsLink: WebSocketLink;
    private splitedLink: ApolloLink;
    private contextLink: ApolloLink;
    private _client: ApolloClient<NormalizedCacheObject>;

    public graph(): ApolloClient<NormalizedCacheObject> {
        return this._client;
    }


    constructor(protected uri: string, protected graphUri: string, protected subscriptionsUri: string) {
        this.httpLink = new HttpLink({ uri: this.uri + this.graphUri });
        this.wsLink = new WebSocketLink({
            uri: this.uri.replace(/http/g, "ws") + this.subscriptionsUri, options: {
                reconnect: true,
                connectionParams: this.provideHeaders.bind(this)
            }
        });
        this.splitedLink = split(
            ({ query }) => {
                const { kind, operation } = <any>getMainDefinition(query);
                return kind === 'OperationDefinition' && operation === 'subscription';
            },
            this.wsLink,
            this.httpLink
        );
        this.contextLink = setContext((_, { headers }) => {            
            let values = {
                headers: {
                    ...headers,
                    ...this.provideHeaders()
                },
                ...this.provideAditionalContext()
            };
            return values;
        });
        this._client = new ApolloClient({
            link: this.contextLink.concat(this.splitedLink),
            cache: new InMemoryCache()
        });
    }

    protected abstract provideHeaders(): Object;
    protected provideAditionalContext(): Object { return {}; }
}