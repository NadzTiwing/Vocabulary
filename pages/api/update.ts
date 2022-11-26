import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from "../config/mongodb";
import { IResponse } from '../interface';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse>
) {
    const client = await clientPromise;
    const database = client.db(process.env.MONGODB_DB);
    const id = req.body.id;
    const caption = req.body.caption;

    try {
        await database.collection("picture_posts").updateOne(
            {_id: id},
            {$set: {caption: caption} }    
        );
        console.log("Successfully updated!");
        res.status(200).json({ status: "success" });
    } catch(err) {
        console.log("Update error: " +err);
        res.status(500).json({ status: "failed" });
    }
}
