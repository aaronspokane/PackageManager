export default interface IApi {
    Get: (url: string) => Promise<any>;
    Post: (url: string, body: object) => Promise<any>;
}