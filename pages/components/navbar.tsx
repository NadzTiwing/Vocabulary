
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';

const Navbar = (props: any) => {
    const [selected, setSelected] = useState<string>("all");

    const onHandleChange = (day: string) => {
        setSelected(day);
        props.filterPosts(day);
    }
    return(
        <nav className="navbar">
            <h5 className="app-title">Picshare</h5>
            <div className="filter-section">
                <Form.Select aria-label="filter selection" className="day-selection" value={selected}  onChange={(evt)=>onHandleChange(evt.target.value)}>
                    <option value="all">Show all</option>
                    {props.days.map( (day: any) => (
                        <option value={day.dateStr} key={`date-${day._id}`}>{day.dateStr}</option>
                    ))}
                </Form.Select>
            </div>
        </nav>
    );
}

export default Navbar;