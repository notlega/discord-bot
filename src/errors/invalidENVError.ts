export class InvalidENVError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidENVError';
    }
}
