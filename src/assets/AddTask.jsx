import React, { useContext, useState } from "react";
import { Modal, Form, Tag, Input, message, DatePicker } from 'antd';
import dayjs from 'dayjs'
import { globalContext } from "../App";
import { nanoid } from "nanoid";

export default function AddTask(){
    const [tagMode,setTagMode]=useState(false)
    const [tagsList,setTagsList]=useState([])
    const [currentTag,setCurrentTag]=useState('')
    const {setTasks,addTaskMode,setAddTaskMode} =useContext(globalContext)
    const [form] = Form.useForm();
    const { TextArea } = Input;


    function handelTagInput() {
        if(currentTag !=='' && tagsList.indexOf(currentTag)==-1)
            setTagsList((oldList)=>{
                return [...oldList,currentTag]
            })
        setCurrentTag('')
        setTagMode(false)
    }

    function tagRemoved(removedTag){
        setTagsList((oldList)=> oldList.filter((tag) => tag!==removedTag ))
    }

    function createNewTask({ title, desc,dateNow, dueDate}){
        setTasks((oldTasks)=>{
            return [
                ...oldTasks,
                {                
                    id: nanoid(),
                    title: title,
                    description: desc,
                    timeStamp: dateNow,
                    dueDate: new Date(dueDate),
                    status: "open",
                    tags: tagsList,
                }
            ]
        })
    }

    function handelFormSubmit(){
        form.validateFields()
        .then((data) => {
            createNewTask(data)
            message.success('Added!')
            setTagsList([])
            setCurrentTag('')
            form.resetFields()
            setAddTaskMode(false)
        })
        .catch(console.error)
    }

    function handelFromClose(){
        setTagsList([])
        setCurrentTag('')
        form.resetFields()
        setAddTaskMode(false)
    }


    return (
        <>
            <Modal title="Add Task"
                open={addTaskMode}
                onOk={handelFormSubmit}
                onCancel={handelFromClose}
                okText="Add Task"
                cancelText="Cancel"
            >
                <Form form={form} 
                    initialValues={{'dateNow': dayjs()}}>
                    <Form.Item name="title"
                        label="Add Title"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter a title for the task'
                            },
                            {
                                max: 100,
                                message: " Max 100 characters"
                            }

                        ]}
                    >
                        <Input placeholder="Title" />
                    </Form.Item>
                    <Form.Item name="desc"
                        label="Add Description"
                        rules={[
                            {
                                required: true,
                                message: "Please Add a Description"
                            },
                            {
                                max: 1000,
                                message: "Max 1000 Words"
                            }
                        ]}
                    >
                        <TextArea placeholder="Max Length 1000 Words" rows={4}></TextArea>
                    </Form.Item>
                    <Form.Item name="dateNow"
                        label="Start-date"
                    >
                        <DatePicker disabled format={'YYYY/DD/MM'}/>
                    </Form.Item>
                    <Form.Item name="dueDate"
                        label="Due-date"
                        rules={[
                            {
                                required: true,
                                message: "Please select due date"
                            }
                        ]}
                    >
                        <DatePicker 
                        disabledDate={(day)=> day && day < form.getFieldValue('dateNow')} 
                        format={'YYYY/DD/MM'} />
                    </Form.Item>
                    <Form.Item name="tags" label="Tags">
                        <>
                            {tagsList.map((tag, index) => {
                                return (
                                    <Tag
                                        key={tag}
                                        closable
                                        onClose={() => tagRemoved(tag)}
                                    >
                                        {tag}
                                    </Tag>
                                );
                            })}
                            {tagMode && (
                                <Input
                                    type="text"
                                    style={{ width: 100 }}
                                    value={currentTag}
                                    onChange={(e) => setCurrentTag(e.target.value)}
                                    onBlur={handelTagInput}
                                    onPressEnter={handelTagInput}
                                />
                            )}
                            {!tagMode && (
                                <Tag 
                                    onClick={() => setTagMode(true)} 
                                    style={{ background: "#fff", borderStyle: "dashed", hover: "#fff" }}>
                                    <a>Add tag</a>
                                </Tag>
                            )}
                        </>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}