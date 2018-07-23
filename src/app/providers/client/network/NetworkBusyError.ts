export class NetworkBusyError extends Error {
    constructor() {
        super("The network layer is busy!");
    }
}