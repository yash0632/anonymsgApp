import { Message } from "@/model/User"

export interface ApiResponse {
    Message?:string,
    Success:boolean,
    isAcceptingMessages?:boolean,
    messages?:Array<Message>,
    Error?:string
}