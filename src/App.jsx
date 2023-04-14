import { createContext } from 'react'
import './App.css'
import Todo from './Todo.jsx'
import globalStates from './globalStates'

export const globalContext=createContext();

function App() {
  return (
    <globalContext.Provider value={globalStates()}>
      <div className="App">
        <Todo/>
      </div>
    </globalContext.Provider>
  )
}

export default App
