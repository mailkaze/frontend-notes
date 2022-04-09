import { useState, useEffect } from 'react'

function App() {
  const [notes, setNotes] = useState([])
  const [noteText, setNoteText] = useState("")

  const getNotes = async () => {
    setNotes([])
    const url = 'http://localhost:3001/api/notes'
    const res = await fetch(url)
    const data = await res.json()
    setNotes(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // una posibilidad entre un billón de que se repita un ID, no es lo más seguro pero sirve para el ejemplo
    const randomId = Math.floor(Math.random() * 1000000000)
    const newNote = {
      id: randomId,
      text: noteText,
      done: false
    }
    const url = 'http://localhost:3001/api/notes'
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newNote)
    })
    console.log('respuesta del servidor:', res);
    setNoteText("")
    getNotes()
  }

  const handleCheck = async (e, note) => {
    note.done = e.target.checked
    const url = `http://localhost:3001/api/note/${note.id}`
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(note)
    })
    console.log('respuesta del servidor:', res);
    getNotes()
  }

  const handleDelete = async (e, note) => {
    const url = `http://localhost:3001/api/note/${note.id}`
    const res = await fetch(url, { method: 'DELETE' })
    console.log('respuesta del servidor:', res);
    getNotes()
  }

  useEffect(() => {
    getNotes()
  }, [])

  return (
    <div className="App">
      <form action='submit' onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="exampleInputEmail1" className="form-label">Tarea</label>
        <input 
          type="text" 
          className="form-control" 
          id="exampleInputEmail1" 
          aria-describedby="emailHelp"
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">Guardar</button>
    </form>
      <ul className="list-group">
        {
          notes.map(note => 
            <li className="list-group-item" key={note.id}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  value="" 
                  id="flexCheckDefault" 
                  checked={note.done} 
                  onChange={(e) => handleCheck(e, note)}
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  {note.text}
                </label>
                <button className='btn btn-danger' onClick={(e) => handleDelete(e, note)}>Eliminar</button>
              </div>
            </li>
          )
        }
      </ul>
    </div>
  );
}

export default App;
