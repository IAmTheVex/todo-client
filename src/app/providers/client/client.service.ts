import { Injectable } from '@angular/core';
import { Credentials } from './packages/Credentials';
import { ContextProvider } from './network/ContextProvider';
import { ContextifiedNetworkLayer } from './network/ContextifiedNetworkLayer';
import { Observable } from 'apollo-link';

@Injectable()
export class ClientService {
  private static _instance: ClientService = null;
  private credentials: Credentials;
  private network: ContextifiedNetworkLayer;

  public constructor() {
    if(ClientService._instance != null) return ClientService._instance;

    this.network = new ContextifiedNetworkLayer(
      "http://localhost:4100/api/", "graph", "graph/subscriptions"
    );

    ClientService._instance = this;
  }

  public installCredentials(credentials: Credentials) {
    this.credentials = credentials;
  }

  public async scope<T>(
    execute: (executor: ContextifiedNetworkLayer) => Promise<any>,
    contextify: (context: ContextProvider, credentials: Credentials) => ContextProvider = (ctx => ctx),
  ): Promise<{ data: T, meta: any }> {
    let context = contextify(new ContextProvider(), this.credentials);
    this.network.allocate(context);
    let result = await execute(this.network);
    this.network.free();
    return result; 
  }

  public async authedScope<T>(
    execute: (executor: ContextifiedNetworkLayer) => Promise<any>,
    contextify: (context: ContextProvider) => ContextProvider = (ctx => ctx)
  ): Promise<{ data: T, meta: any }> {
    let context = contextify(new ContextProvider());
    context.authorize(this.credentials.apiAuthToken);
    this.network.allocate(context);
    let result = await execute(this.network);
    this.network.free();
    return result; 
  }

  public async subscription<T>(
    execute: (executor: ContextifiedNetworkLayer) => Observable<any>,
    contextify: (context: ContextProvider, credentials: Credentials) => ContextProvider = (ctx => ctx),
  ): Promise<Observable<{ data: T, meta: any }>> {
    let context = contextify(new ContextProvider(), this.credentials);
    this.network.allocate(context);
    let result = await execute(this.network);
    this.network.free();
    return result; 
  }

  public async authedSubscription<T>(
    execute: (executor: ContextifiedNetworkLayer) => Observable<any>,
    contextify: (context: ContextProvider) => ContextProvider = (ctx => ctx)
  ): Promise<Observable<{ data: T, meta: any }>> {
    let context = contextify(new ContextProvider());
    context.authorize(this.credentials.apiAuthToken);
    this.network.allocate(context);
    let result = await execute(this.network);
    this.network.free();
    return result; 
  }
}
