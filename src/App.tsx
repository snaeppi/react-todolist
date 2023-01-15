import React, { useState, useEffect } from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTodo from './addTodo';

import './App.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';


import { ThemeProvider, createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
  },
});


export type TodoParent = {
  date?: string;
  description?: string;
  priority?: string;
  id?: string;
}

export type Todo = Required<Pick<TodoParent, "date" | "description" | "priority">>;

interface TodoWithId extends Todo {id: string}

function App() {
  const [todos, setTodos] = useState<Array<TodoWithId>>([]);

  async function fetchItems() {
    const response = await fetch("https://todolist-bc448-default-rtdb.europe-west1.firebasedatabase.app/items/.json");
    if (!response.ok) {
      throw new Error(`An error occured: ${response.status}`);
    }
    const data = await response.json();
    if (data === null) {
      setTodos([]);
    } else {
      const keys = Object.keys(data);
      const valueKeys: Array<TodoWithId> = Object.values(data).map((item, index) => 
      Object.defineProperty(item, 'id', {value: keys[index]})) as Array<TodoWithId>;
      setTodos(valueKeys);
    }
  }

  const addTodo= (newTodo: Todo): void => {
    fetch("https://todolist-bc448-default-rtdb.europe-west1.firebasedatabase.app/items/.json",
     {
      method: 'POST',
      body: JSON.stringify(newTodo)
     })
     .then(response => fetchItems())
     .catch(err => console.error(err))
  }

  const deleteTodo = (id: string) => {
    fetch(`https://todolist-bc448-default-rtdb.europe-west1.firebasedatabase.app/items/${id}.json`,
    {
      method: 'DELETE',
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchItems();
  }, [])

  const prioritySort = (a: string, b: string) => {
    const priorities = ["Low", "Medium", "High", "Top"];
    if (a === b) {
      return 0;
    } else if (priorities.indexOf(a) > priorities.indexOf(b)) {
      return 1;
    } else {
      return -1;
    }
  }

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h5">
            TodoList
          </Typography>
        </Toolbar>
      </AppBar>
      <AddTodo addTodo={addTodo} /> 
      <div className='ag-theme-material' style={{ height: 400, width: 700, margin: 'auto'}}>
        <AgGridReact rowData={todos}>
          <AgGridColumn sortable={true} filter={true} field='description' />
          <AgGridColumn sortable={true} filter={true} field='date' />
          <AgGridColumn sortable={true} filter={true} field='priority' sortingOrder={['desc','asc',null]} comparator={(a: string, b: string) => prioritySort(a,b)}/>
          <AgGridColumn 
            headerName=''
            field='id' 
            width={90}
            cellRenderer={ (params: any) => 
              <IconButton onClick={() => deleteTodo(params.value)} size="small" color="error">
                <DeleteIcon />
              </IconButton>
            }
          />      
        </AgGridReact>
      </div>
      </ThemeProvider>
    </div>
  );
}

export default App;