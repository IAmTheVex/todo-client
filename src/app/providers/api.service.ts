import { Injectable } from '@angular/core';
import { ClientService } from './client/client.service';
import { CredentialsStorage } from './client/packages/CredentialsStorage';
import { Credentials } from './client/packages/Credentials';
import { RegisterSuccessResponse } from '../types/responses/RegisterSuccessResponse';
import { LoginSuccessResponse } from '../types/responses/LoginSuccessResponse';
import { Task } from '../types/entities/Task';

import gql from "graphql-tag";
import { User } from '../types/entities/User';

export interface Current {
  me: User
};

@Injectable()
export class ApiService {
  private credentials: Credentials = null;

  constructor(
    private client: ClientService,
    private credentialsStorage: CredentialsStorage
  ) {
    this.tryConnect();
  }

  public tryConnect() {
    this.credentials = this.credentialsStorage.export();
    if(this.credentials != null) {
      this.client.installCredentials(this.credentials);
    }
  }

  private copy<T>(object: T): T {
    return <T>JSON.parse(JSON.stringify(object));
  }

  public async login(email: string, password: string): Promise<Credentials> {
    password = btoa(password); // encode password in base64
    let { data } = await this.client.scope<LoginSuccessResponse>(
      request => request.call("auth/login", { email, password })
    );
    this.credentials = new Credentials(data.token, data.refresh);
    this.credentialsStorage.store(this.credentials);

    return this.credentials;
  }

  public async register(email: string, password: string): Promise<Credentials> {
    password = btoa(password); // encode password in base64
    let { data } = await this.client.scope<RegisterSuccessResponse>(
      request => request.call("auth/register", { email, password })
    );
    this.credentials = new Credentials(data.token, data.refresh);
    this.credentialsStorage.store(this.credentials);

    return this.credentials;
  }

  public isConnected(): boolean {
    return this.credentials != null;
  }

  public async current(): Promise<Current> {
    let { data } = await this.client.authedScope<Current>(
      request => request.graph().query({query: gql`
        query {
          me {
            email,
            tasks {
              id,
              created,
              text,
              state
            },
            stats {
              done
              remaining
              total
            }
          }
        }
      `})
    );

    return this.copy(data);
  }

  public async mark(id: string, state: Boolean): Promise<Task> {
    let { data } = await this.client.authedScope<{markTask: Task}>(
      request => request.graph().mutate({mutation: gql`
        mutation($state: Boolean!) {
          markTask(state: $state) {
            id, created, text, state
          }
        }
      `, variables: { state } }),
      context => context.resource("task", id)
    );

    return this.copy(data.markTask);
  }

  public async newTask(text: string): Promise<Task> {
    let { data } = await this.client.authedScope<{createTask: Task}>(
      request => request.graph().mutate({mutation: gql`
        mutation($text: String!) {
          createTask(text: $text) {
            id, created, text, state
          }
        }
      `, variables: { text } })
    );

    return this.copy(data.createTask);
  }

  public async removeTask(id: string): Promise<boolean> {
    let { data } = await this.client.authedScope<{removeTask: boolean}>(
      request => request.graph().mutate({mutation: gql`
        mutation {
          removeTask
        }
      `}),
      context => context.resource("task", id)
    );

    return data.removeTask;
  }

  public async editTask(id: string, text: string): Promise<Task> {
    let { data } = await this.client.authedScope<{editTask: Task}>(
      request => request.graph().mutate({mutation: gql`
        mutation($text: String!) {
          editTask(text: $text) {
            id, created, text, state
          }
        }
      `, variables: { text } }),
      context => context.resource("task", id)
    );
    
    return this.copy(data.editTask);
  }
}
