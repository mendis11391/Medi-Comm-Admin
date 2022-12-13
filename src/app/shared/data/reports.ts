export interface UrlLogs {
    id:number,
    session_id:string,
    customer_id:number,
    url:string,
    tag:string,
    conversion:boolean,
    created_at:Date
}