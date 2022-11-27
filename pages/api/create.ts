import type { NextApiRequest, NextApiResponse } from 'next';
import fs from "fs-extra";
import cloudinary from "cloudinary";
import clientPromise from "../config/mongodb";
import formidable from "formidable";
import { IResponse, IPost } from '../interface';


//turn off validator that checks if the sent request is a JSON
export const config = {
    api: {
        bodyParser: false
    }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse>
) {
    const client = await clientPromise;

    const form = new formidable.IncomingForm();
    const path = './public/temp';
    let uploadData: IPost = {
        _id: undefined,
        datePosted: "",
        url: "",
        caption: ""
    }
    
    form.parse(req, async function (err:any, fields:any, files:any) {
        
        const caption = fields.caption;
        const file = files.file;
        const imgData = fs.readFileSync(file.filepath);
        
        /**
         * Check if directory exist, if not it will create the directory
         * temporarily put the image in ./public/temp
         * upload the image in cloudinary
         * if successfully uploaded, save the image data in the database
         * then remove the copied image from the temp folder
         */
        fs.ensureDirSync(path);
        let filepathCopy = `${path}/${file.originalFilename}`;
        fs.writeFileSync(filepathCopy, imgData);
        
        await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload(filepathCopy)
            .then( (result: any) => {
                uploadData = {
                    _id: result.public_id,
                    datePosted: new Date(result.created_at),
                    url: result.url,
                    caption: caption
                };
                resolve(result);
            })
        })
        .then(async (data) => {
            fs.unlinkSync(filepathCopy);
            await client.db().collection("picture_posts").insertOne(uploadData);

            res.status(201).json({ status: "success", result: uploadData });
            console.log("Successfully created!");
        })
        .catch((err) => {
            console.log("Upload failed: "+err);
            res.status(500).json({ status: "failed" });
        })
    });
}
