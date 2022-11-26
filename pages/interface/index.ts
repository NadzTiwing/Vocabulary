import { ObjectId } from 'mongodb';

export interface IResponse {
    status: string,
    result?: any
}

export interface IResult {
    _id: ObjectId | undefined,
    datePosted: Date | "",
    url: string,
    caption: string
}