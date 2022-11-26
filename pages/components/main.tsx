import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { PostCard } from './postCard';
import { useState } from 'react';
import { BsFillFileEarmarkImageFill } from "react-icons/bs";
import Compressor from 'compressorjs';
import Image from 'next/image'
import Spinner from './spinner';
import { IResult } from '../interface';
import Navbar from './navbar';
import { formatDate } from '../util/date';

export const Main = (props:any) => {
    const [posts, setPosts] = useState(props.posts);
    const [chosenImg, setChosenImg] = useState() as any;
    const [previewImg, setPreviewImg] = useState('');
    const [caption, setCaption] = useState('');
    const [isPosting, setPosting] = useState(false);
    const [selected, setSelected] = useState<string>("all");
    const uniqueDays = props.posts.filter(
        (post: any, index: number, self: any) => {
            return self[index].dateStr.indexOf(post.dateStr) === index;
        });    

    const isFilesizeExceed = (size: number) => {
        const imgSize = size / 1024 / 1024; // in MB
        return imgSize > 2 ? true : false;
    }

    const onSelectFile = async (evt: any) => {
        let imgUrlObj:any;
        const img = evt.target.files;
        if (!img || img.length === 0) {
            return;
        }
        
        const imgSize = img[0].size;
        if(isFilesizeExceed(imgSize)) { // if filesize exceeds 2MB, compress the image
            new Compressor(img[0], {
                quality: 0.6,
                success: (compressedImg) => {
                  // Use the compressed file to upload the selected image
                  if(isFilesizeExceed(compressedImg.size)) {
                    alert("File size exceeds 2MB limit");
                    setPreviewImg('');
                  } else {
                    setChosenImg(img);
                    imgUrlObj = URL.createObjectURL(compressedImg);
                    setPreviewImg(imgUrlObj);
                    //preventMemoryLeaks(imgUrlObj);
                    return () => URL.revokeObjectURL(imgUrlObj);
                  }
                },
                error: (err) => {
                    console.error("Image upload error:" +err);
                    alert("Oops something wrong happened. Please try again.");
                }
            });
        } else {
            setChosenImg(img);
            imgUrlObj = URL.createObjectURL(img[0]);
            setPreviewImg(imgUrlObj);
            //preventMemoryLeaks(imgUrlObj);
            return () => URL.revokeObjectURL(imgUrlObj);
        }
    }

    const uploadPost = async() => {
        if(!chosenImg) {
            alert("Please select an image.");
            return;
        }
        
        /**
         * Use FormData to send the file object of the uploaded picture
         * and the entered caption
        */
        setPosting(true);
        const body = new FormData();
        body.append("file", chosenImg[0]);
        body.append("caption", caption);
        const upload = await fetch("/api/create", {
          method: "POST",
          body
        });

        try {
            const response = await upload.json();
            if(response.status === "success" ) {
                const result = response.result;
                let newPost = {
                    _id: result._id,
                    datePosted: result.datePosted,
                    caption: result.caption,
                    url: result.url
                }
                posts.unshift(newPost);
                setPosting(false);
            }

            //reset input 
            setCaption("");
            setPreviewImg("");
        } catch (e) { console.error(e); }   
    }

    const removePost = async (id: any) => {
        if (window.confirm("Are you sure you want to remove this post?")) { 
            const updatePosts = await fetch("/api/delete", {
                method: "DELETE",
                body: JSON.stringify({id}),
                headers: {
                    "Content-Type": "application/json",
                }
            }); 
            try {
                const response = await updatePosts.json();
                if(response.status === "success" ) {
                    alert("Successfully removed!");
                }
            } catch (e) { console.error(e); }  
            let updatedPosts = posts.filter((post: IResult) => post._id !== id);
            setPosts(updatedPosts);
        } 
    }

    const isEditPost = (id: any) => {
        setPosts(
            posts.map( (post: any) => {
                if(post._id === id) post.isEdit = !post.isEdit;
                return post;
            })
        );
    }

    const handleChange = (id:any, value: string) => {
        setPosts(posts.map( (post: any) => {
            if(post._id === id) post.caption = value;
            return post;
        }));
    }

    const updatePost = async (id: any) => {
        const updatePosts = await fetch("/api/update", {
            method: "PUT",
            body: JSON.stringify({id, caption}),
            headers: {
                "Content-Type": "application/json",
            }
        }); 
        try {
            const response = await updatePosts.json();
            if(response.status === "success") isEditPost(id);
        } catch (e) { 
            alert("Oops, something went wrong, please try again");
            console.error(e); 
        } 
    }

    const filterPosts = (selectedDate: string) => {
        if(selectedDate !== "all") setPosts(posts.filter((post: any) => post.dateStr === selectedDate ));
        else setPosts(posts);
        console.log("filtered!");
    }
    
    return(
        <>
        <Navbar filterPosts={filterPosts} days={uniqueDays}/>
        <Card className="input-card">
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                        placeholder="Share your memorable photo" 
                        as="textarea" 
                        rows={3} 
                        value={caption}
                        onChange={evt=>setCaption(evt.target.value)}
                        />
                    </Form.Group>
                </Form>
                { previewImg && 
                    <Image
                        src={previewImg}
                        alt="image"
                        placeholder="blur"
                        blurDataURL={previewImg}
                        width={700}
                        height={475}
                        sizes="100vw"
                        className="uploaded-img"
                        style={{
                            width: "100%",
                            height: "auto",
                        }}
                    />
                }
                <div className="actions">
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label className="upload-icon"> <BsFillFileEarmarkImageFill/> </Form.Label>
                        <Form.Control 
                        type="file" 
                        className="hide"
                        name="newFile" 
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(evt) => onSelectFile(evt)}
                        disabled={isPosting}
                    />
                    </Form.Group>
                    <Button className="red-orange-btn" onClick={uploadPost} disabled={isPosting}>{isPosting ? "posting..." : "POST"}</Button>
                </div>
            </Card.Body>
        </Card>
        { posts ? 
        posts.map((post: any) => (
            <PostCard 
            key={post._id}  
            _id={post._id}
            url={post.url}
            datePosted={post.datePosted}
            caption={post.caption}
            onRemove={removePost}
            isEditPost={isEditPost}
            isEdit={post.isEdit}
            updatePost={updatePost}
            handleChange={handleChange}
            />
        )) : <Spinner/>
        }
        </>
    );
}