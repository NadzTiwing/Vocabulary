import type { NextApiRequest, NextApiResponse } from 'next';
import { IResponse } from '../interface';
import clientPromise from "../config/mongodb";
import { formatDate } from '../util/date';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse>
) {
    try {
        const client = await clientPromise;

        //sort data in descending order to display the recent posts first
        const result = await client.db().collection("picture_posts").find().sort({datePosted:-1}).toArray();
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
