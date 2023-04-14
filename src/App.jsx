import { createContext } from 'react'
import './App.css'
import Todo from './Todo.jsx'
import globalStates from './globalStates'

export const globalContext=createContext();

function App() {
  return (
    <globalContext.Provider value={globalStates()}>
      <Todo/>
    </globalContext.Provider>
  )
}

export default App
