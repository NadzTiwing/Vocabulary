import { ObjectId } from 'mongodb';

export interface IResponse {
    status: string,
    result?: any
}

export interface IPost {
    _id: ObjectId | undefined,
    datePosted: Date | "",
    dateStr?: string,
    url: string,
    caption: string,
    isEdit?: boolean
}

export interface ILoader {
    size: string
}