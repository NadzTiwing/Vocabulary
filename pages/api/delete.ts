// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "../config/mongodb";
import { IResponse } from '../interface';
import cloudinary from "cloudinary";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse>
) {
    const client = await clientPromise;
    const database = client.db(process.env.MONGODB_DB);
    const id = req.body.id;
    try {
        cloudinary.v2.uploader.destroy(id).then( async (res: any) => {
            await database.collection("picture_posts").deleteOne({ _id: id});
            console.log("Successfully deleted!");
        });
        res.status(201).json({ status: "success" })
    } 
    catch(e) {
        res.status(400).json({ status: "failed" });
    }
}
