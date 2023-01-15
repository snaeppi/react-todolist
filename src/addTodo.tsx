import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Todo } from './App'

type InputEvent = React.ChangeEvent<HTMLInputElement>;

function AddTodo(props: any) {

    const [open, setOpen] = useState(false);
    const [todo, setTodo] = useState<Todo>({date: '', description: '', priority: ''});

    const handleOpen = () => {
        setOpen(true);
    }
    
    const handleClose = () => {
        setOpen(false);
        setTodo({date: '', description: '', priority: ''});
    }

    const handleSave = () => {
        props.addTodo(todo);
        handleClose();
    }

    const handleInput = (e: InputEvent) => {
        setTodo({...todo, [e.target.name]: e.target.value});
    }

    const handleChange = (e: SelectChangeEvent) => {
        setTodo({...todo, [e.target.name]: e.target.value});
    };

    return(
        <div>
            <Button variant="outlined" color="primary" style={{margin: 10}} onClick={handleOpen}>
                Add todo
            </Button>
            <Dialog open={open} > 
                <DialogTitle>New todo</DialogTitle>
                <DialogContent>
                    <TextField
                        name="description"
                        value={todo.description}
                        onChange={handleInput}
                        margin="dense"
                        label="Description"
                        fullWidth
                    /> 
                    <TextField
                        name="date"
                        value={todo.date}
                        onChange={handleInput}
                        margin="dense"
                        label="Date"
                        fullWidth
                        id="date"
                        type="date"
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth margin="dense">
                        <InputLabel id="priority-label">Priority</InputLabel>
                        <Select
                            name="priority"
                            labelId="priority-label"
                            id="priority"
                            label="Priority"
                            onChange={handleChange}
                        >
                            <MenuItem value={"Top"}>Top</MenuItem>
                            <MenuItem value={"High"}>High</MenuItem>
                            <MenuItem value={"Medium"}>Medium</MenuItem>
                            <MenuItem value={"Low"}>Low</MenuItem>
                        </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={handleClose}>Cancel</Button>
                    <Button color="primary" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog> 
        </div>
    );
}

export default AddTodo;