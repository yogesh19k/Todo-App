import React, { useState } from 'react';
import {data} from './assets/data'

export default function globalStates(){
    const [tasks,setTasks]=useState(data)
    const [addTaskMode,setAddTaskMode]=useState(false)
    return {tasks,setTasks,addTaskMode,setAddTaskMode}
}