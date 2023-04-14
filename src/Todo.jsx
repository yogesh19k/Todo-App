import React, { useContext, useEffect,useState  } from "react";
import {Form,Input,Typography,Space,Tag,Popconfirm,DatePicker, Button, ConfigProvider,Select} from 'antd'
import { ProTable } from '@ant-design/pro-components';
import enUS from "antd/locale/en_US";
import { PlusOutlined } from "@ant-design/icons"
import {ImBin} from "react-icons/im"
import {HiPencilSquare} from "react-icons/hi2";
import AddTask from "./assets/AddTask.jsx";
import dayjs from "dayjs";
import { data } from "./assets/data.jsx";
import { globalContext } from "./App.jsx";


export default function Todo(){

    const {tasks,setTasks,setAddTaskMode} =useContext(globalContext)
    const [filteredTask,setFilterTask]=useState(data)
    const [editRowId,setEditRowId]=useState('')
    const [filter,setFilter]=useState('')
    // to edit tags------------------------
    const [tagMode,setTagMode]=useState(false)
    const [tagsList,setTagsList]=useState([])
    const [currentTag,setCurrentTag]=useState('')
    //-------------------------------------

    const [form] = Form.useForm();

    const tableColumns=[
        {   title: "Timestamp",
            dataIndex: "timeStamp",
            valueType: "date",
            width: 80,
            sorter: (a, b) => new Date(a.timeStamp) - new Date(b.timeStamp),
            search: false,
            onCell:(row) =>({
                row,
                formiptype:<Input disabled></Input>,
                isedit: editRowId === row.id,
                dataIndex:"timeStamp",
                title:"Timestamp"
            })
        },
    
        {   title: "Status",
            dataIndex: "status",
            search: false,
            filters: true,
            onFilter: true,
            width:120,
            valueType: "select",
            valueEnum: {
                open: { text: "OPEN", status: "Default" },
                working: { text: "WORKING", status: "Processing" },
                done: { text: "DONE", status: "Success" },
                overdue: { text: "OVERDUE", status: "Error" },
            },
            onCell:(row) =>({
                row,
                formiptype:<Select options={[
                    {
                        value: 'open',
                        label: 'OPEN',
                    },
                    {
                        label: 'WORKING',
                        value: 'working',
                    },
                    {
                        value: 'overdue',
                        label: 'OVERDUE',
                    },
                    {
                        value: 'done',
                        label: 'DONE',
                    },
                ]} ></Select>,
                isedit: editRowId === row.id,
                dataIndex:"status",
                title:"Status"
            })
        },
    
        {   title: "Title",
            dataIndex: "title",
            search: false,
            sorter: (a, b) => a.title.charAt(0) - b.title.charAt(0),
            onCell:(row) =>({
                row,
                formiptype:<Input></Input>,
                isedit: editRowId === row.id,
                dataIndex:"title",
                title:"Title"
            })
        },
        {   title: "Description",
            dataIndex: "description",
            search: false,
            sorter: (a, b) => a.description.charAt(0) - b.description.charAt(0),
            onCell:(row) =>({
                row,
                formiptype:<Input></Input>,
                isedit: editRowId === row.id,
                dataIndex:"description",
                title:"Description"
            })
        },
    
        {   title: "Duedate",
            dataIndex: "dueDate",
            valueType: "date",
            width: 100,
            sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
            search: false,
            // onCell:(row) =>({
            //     row,
            //     formiptype: <DatePicker format={'YYYY/DD/MM'} />,
            //     isedit: editRowId === row.id,
            //     dataIndex:"dueDate",
            //     title:"Duedate"
            // })
        },
    
        {   title: "Tags",
            dataIndex: "tags",
            width: 100,
            search: false,
            editable: true,
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        return (
                            <Tag 
                                key={tag}>
                                {tag}
                            </Tag>
                        )
                    })}
                </>
            ),
            onCell:(row) =>({
                row,
                formiptype: <>
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
                                    value={currentTag}
                                    onChange={(e) =>setCurrentTag(e.target.value)}
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
                        </>,
                isedit: editRowId === row.id,
                dataIndex:"tags",
                title:"Tags"
            })
        },
    
        {   title: "Action",
            search: false,
            width:80,
            render: (_, record,action) => {
                return (
                <Space size="middle">
                { editRowId === record.id ? (
                    <span>
                        <Typography.Link
                        onClick={() => editSave()}
                            style={{marginRight: 5}}
                            >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" 
                            onConfirm={()=> setEditRowId('')}
                        >
                        <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ):
                (<Typography.Link disabled={editRowId !==''}
                        onClick={() => handelEditClick(record)}
                    >
                        <HiPencilSquare 
                        className="tasks-elements--edit"/>
                    </Typography.Link>)
                    }
                    <Popconfirm
                        title="Are you sure to delete this item?"
                        onConfirm={() => deleteTask(record.id)}
                    >
                        <ImBin
                            className="tasks-elements--delete"
                        />
                    </Popconfirm>
    
                </Space>)
            }
        }
    
    ]

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

    function deleteTask(taskId){
        setTasks((oldTask)=>{
            return oldTask.filter((task)=>{
                if(task.id !== taskId){
                    return task
                }
            })
            
        })
        setAddTaskMode(false)
        setTagsList([])
        setCurrentTag('')
    }

    function editSave(){
        form.validateFields()
        .then((data) => {
            setTasks((oldTask) => {
                const temp=[...oldTask]
                const index=oldTask.findIndex((item) => editRowId === item.id)
                temp.splice(index,1,{
                    ...oldTask[index],
                    ...data,
                    tags:tagsList
                })
                return(temp)
            })
            setAddTaskMode(false)
            setTagsList([])
            setCurrentTag('')
            setEditRowId('')
        })
        .catch(console.error)
        
    }

    function RowEditMode({row,dataIndex,title,formiptype,isedit,children,...restProps}){
        return(
            <td {...restProps}>
                {isedit ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: dataIndex==="tags"?false:true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {formiptype}
                    </Form.Item>
                ): (children)}
            </td>
        )
    }
    
    function handelEditClick(row){
        form.setFieldsValue({
            timeStamp: '',
            title: '',
            description: '',
            dueDate: '',
            ...row,
        });
        setTagsList(row.tags)
        setEditRowId(row.id)
    }

    useEffect(()=>{
        if(filter === ''){
            setFilterTask([...tasks])
        }
        const dates = tasks.filter((task)=>{
            const startDate=dayjs(task.timeStamp).format("YYYY-MM-DD")
            const dueDate=dayjs(task.dueDate).format("YYYY-MM-DD")
            if(startDate.includes(filter) || dueDate.includes(filter))
                return task
        })

        const other = tasks.filter(task =>
            Object.keys(task).some((key)=>
                String(task[key])
                    .toLowerCase()
                    .includes(filter.toLowerCase())
            )
        )
        setFilterTask(Array.from(new Set([...dates,...other])))

    },[filter,tasks])


    return(
        <ConfigProvider locale={enUS}>
            <Form form={form} component={false} >
                <ProTable
                    columns={tableColumns}
                    dataSource={filteredTask}
                    rowKey="id"
                    components={{
                        body:{
                            cell:(props) =>{
                                return <RowEditMode {...props}/>
                            }
                        }
                    }}
                    pagination={{
                        pageSize: 4,
                    }}
                    bordered
                    toolbar={{
                        search: {
                            // onSearch: (value) => { filterSearch(value) },
                            onChange:(e)=>setFilter(e.target.value),
                            value:filter
                        },
                        actions: [
                            <Button key="button" icon={<PlusOutlined />} type="primary"  
                            onClick={()=>setAddTaskMode(true)}
                            >
                            Add Task
                            </Button>],
                        }}
                    search={false}
                ></ProTable>
            </Form>
            <AddTask></AddTask>
        </ConfigProvider >
    )
}