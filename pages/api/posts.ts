import type { NextApiRequest, NextApiResponse } from 'next';
import { IResponse, IResult } from '../interface';
import clientPromise from "../config/mongodb";
import { formatDate } from '../util/date';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse>
) {
    try {
        const client = await clientPromise;
        const database = client.db(process.env.MONGODB_DB);

        //sort data in an ascending order to display the recent posts first
        const result = await database.collection("picture_posts").find().sort({datePosted:-1}).toArray();
        result.map( row => {
            row.dateStr = formatDate(new Date(row.datePosted), 'fulldate');
            row.isEdit = false;
            return row;
        });
        res.status(200).json({ status: 'success', result: result });
    } catch (err) {
        res.status(500).json({ status: "failed"});
    }
    
}
