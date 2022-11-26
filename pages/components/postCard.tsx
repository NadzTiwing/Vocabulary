import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Image from 'next/image';
import { IResult } from '../interface';
import { BsThreeDotsVertical } from "react-icons/bs";
import Spinner from './spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import { formatDate } from './../util/date';

export const PostCard = (props:any) => {
    let today: any = formatDate(new Date(), "fulldate");
     
    return(
        <Card className="post-card">
            <div className="img-section">
                <DropdownButton
                key={`dropdown-${props._id}`}
                drop="start"
                variant="secondary"
                title={<BsThreeDotsVertical/>}
                >
                <Dropdown.Item eventKey="edit" onClick={()=>{props.isEditPost(props._id)}}>EDIT CAPTION</Dropdown.Item>
                <Dropdown.Item eventKey="delete" onClick={()=>{props.onRemove(props._id)}} className="red-orange-txt">
                    DELETE
                </Dropdown.Item>
                </DropdownButton>
                <Image
                    src={props.url}
                    placeholder="blur"
                    blurDataURL={props.url}
                    alt="An image"
                    width={700}
                    height={475}
                    sizes="100vw"
                    className="uploaded-img"
                />
            </div>
            <Card.Body>
                <Card.Title className="data-txt">
                    { today === props.dateStr ? "Today": props.dateStr }
                </Card.Title>
                
                {props.isEdit ? 
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Control
                        as="textarea" 
                        rows={3} 
                        value={props.caption}
                        onChange={evt=>props.handleChange(props._id, evt.target.value)}
                        />
                    </Form.Group>
                    <Button className="btn-sm btn-link btn-save" onClick={()=>{props.updatePost(props._id, props.caption)}}>SAVE</Button>
                    <Button className="btn-sm btn-link btn-cancel" onClick={()=>{props.isEditPost(props._id)}}>CANCEL</Button>
                </Form>
                :
                <Card.Text>
                    {props.caption}
                </Card.Text>
                }
            </Card.Body>
        </Card>
    );
}