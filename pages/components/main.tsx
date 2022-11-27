
import PostCard from './postCard';
import { useState } from 'react';
import Compressor from 'compressorjs';
import Spinner from './spinner';
import { IPost } from '../interface';
import Navbar from './navbar';
import InputCard from './input';
import { formatDate } from '../util/date';

const Main = (props:any) => {
    const [posts, setPosts] = useState(props.posts);
    const [chosenImg, setChosenImg] = useState() as any;
    const [previewImg, setPreviewImg] = useState('');
    const [caption, setCaption] = useState('');
    const [isPosting, setPosting] = useState(false);
    let tempDates: Array<string> = [];
    props.posts.map( (post: IPost) => {
        tempDates.push(post.dateStr || "");
    })
    const uniqueDays = tempDates.filter( (date: string, index: number, array: Array<string>) => {
        return array.indexOf(date) == index;
    });
    

    const isFilesizeExceed = (size: number) => {
        const imgSize = size / 1024 / 1024; // in MB
        return imgSize > 2 ? true : false;
    }

    const onSelectFile = async (evt: Event) => {
        let imgUrlObj:any;
        const img = (evt.target as HTMLInputElement).files;
        if (!img || img.length === 0) {
            return;
        }
        
        const imgSize = img[0].size;

        // if filesize exceeds 2MB, compress the image
        if(isFilesizeExceed(imgSize)) { 
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
                    return () => URL.revokeObjectURL(imgUrlObj); //prevent memory leaks
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
            return () => URL.revokeObjectURL(imgUrlObj); //prevent memory leaks
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
                    dateStr: formatDate(new Date(result.datePosted), "fulldate"),
                    caption: result.caption,
                    url: result.url,
                    isEdit: false
                }
                posts.unshift(newPost);
                setPosting(false);
            }

            //reset input 
            setCaption("");
            setPreviewImg("");
        } catch (e) { console.error(e); }   
    }

    const removePost = async (id: IPost["_id"]) => {
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
            let updatedPosts = posts.filter((post: IPost) => post._id !== id);
            setPosts(updatedPosts);
        } 
    }

    const isEditPost = (id: IPost["_id"]) => {
        setPosts(
            posts.map( (post: IPost) => {
                if(post._id === id) post.isEdit = !post.isEdit;
                return post;
            })
        );
    }

    const handleChange = (id: IPost["_id"], value: string) => {
        setPosts(posts.map( (post: IPost) => {
            if(post._id === id) post.caption = value;
            return post;
        }));
    }

    const updatePost = async (id: IPost["_id"]) => {
        let txt:string="";
        posts.map( (post: IPost) => {
            if(post._id === id) txt= post.caption;
        });
        const updatePosts = await fetch("/api/update", {
            method: "PUT",
            body: JSON.stringify({id, caption: txt}),
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
        if(selectedDate !== "all") setPosts(props.posts.filter((post: IPost) => post.dateStr === selectedDate ));
        else setPosts(props.posts);
    }
    
    return(
        <>
        <Navbar filterPosts={filterPosts} days={uniqueDays}/>
        <InputCard 
        caption={caption}
        setCaption={setCaption} 
        previewImg={previewImg} 
        onSelectFile={onSelectFile}
        isPosting={isPosting}
        uploadPost={uploadPost}
        />
        { posts ? 
        posts.map((post: IPost) => (
            <PostCard 
            key={post._id}  
            _id={post._id}
            url={post.url}
            datePosted={post.dateStr}
            caption={post.caption}
            onRemove={removePost}
            isEditPost={isEditPost}
            isEdit={post.isEdit}
            updatePost={updatePost}
            handleChange={handleChange}
            />
        )) : <Spinner size="lg"/>
        }
        </>
    );
}

export default Main;