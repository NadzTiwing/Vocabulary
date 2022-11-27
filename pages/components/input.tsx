import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { BsFillFileEarmarkImageFill } from "react-icons/bs";
import Image from 'next/image';
import Spinner from './spinner';

const InputCard = (props: any) => {
    return(
        <Card className="input-card">
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                        placeholder="Share your memorable photo" 
                        as="textarea" 
                        rows={3} 
                        value={props.caption}
                        onChange={evt=>props.setCaption(evt.target.value)}
                        />
                    </Form.Group>
                </Form>
                { props.previewImg && 
                    <Image
                        src={props.previewImg}
                        alt="image"
                        placeholder="blur"
                        blurDataURL={props.previewImg}
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
                        <Form.Label className="upload-icon"> 
                        <BsFillFileEarmarkImageFill className="file-icon"/> 
                        </Form.Label>
                        <Form.Control 
                        type="file" 
                        className="hide"
                        name="newFile" 
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(evt) => props.onSelectFile(evt)}
                        disabled={props.isPosting}
                    />
                    </Form.Group>
                    <Button className="red-orange-btn" onClick={props.uploadPost} disabled={props.isPosting}>{props.isPosting ? <div> uploading... <Spinner size="sm"/> </div> : "POST"}</Button>
                </div>
            </Card.Body>
        </Card>
    );
}

export default InputCard;