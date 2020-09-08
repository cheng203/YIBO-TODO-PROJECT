import React from 'react';
import {Row, Col, Card, Divider, Button, Table, Space, Modal, Input, DatePicker, Form} from 'antd'
import './App.css';
import 'antd/dist/antd.css';
const {Column} = Table;


export default class App extends React.Component {

  state={
    addModalVisible: false,
    editModalVisible: false,
    unfinish: [],
    finished: [],
    editTask: {},
    unfinishPageNum: 1,
    unfinishTotal: 0,
    finishPageNum: 1,
    finishTotal: 0
  }

  getAllUnfinished(status, pageNum){
    fetch(`http://localhost:8080/list/${status}/${pageNum}`).then(response=>response.json()).then(
      data => {
        this.setState({
          unfinish: this.iterateList(data.list.rows),
          unfinishTotal: data.list.count,
        });
      }
    )
  }
  getAllfinished(status, pageNum){
    fetch(`http://localhost:8080/list/${status}/${pageNum}`).then(response=>response.json()).then(
      data => {
        this.setState({
          finished: this.iterateList(data.list.rows),
          finishTotal: data.list.count,
        })
      }
    )
  }

  iterateList(list) {
    let res = [];
    list.map((obj) => {
      res.push({
        key: obj.id,
        name: obj.name,
        content: obj.content,
        deadline: obj.deadline
      })
    })
    return res;
  }
  componentWillMount() {
    this.getAllUnfinished(0,1);
    this.getAllfinished(1,1);
  }
  //show modal
  addNewTask = ()=>{
    this.setState({
      addModalVisible: true,
    });
  }

  handleCancel = ()=>{
    this.setState({
      addModalVisible: false
    })
  }

  handleEditCancel = ()=>{
    this.setState({
      editModalVisible: false
    })
  }

  onFinish = values => {
    // alert(values.name + values.content)
    fetch("http://localhost:8080/create",{
      method: "POST",
      body: JSON.stringify({
        title: values.title,
        content: values.content,
        deadline: values.deadline
      }),
      headers: { 
        "Content-type": "application/json; charset=UTF-8"
      } 
    }).then(response=>response.json()).then(data => {
      if (data.status == '200') {
        this.setState({
          addModalVisible: false
        })
      }
      this.getAllfinished(1,1);
      this.getAllUnfinished(0,1);
    })
  };

  onFinishFailed = errorInfo => {
    this.setState({
      addModalVisible: false
    })
  };

  onEditFinishFailed = errorInfo => {
    this.setState({
      editModalVisible: false
    })
  }

  completeTodoTask = key =>{
    fetch("http://localhost:8080/update_status", {
      method: "POST",
      body: JSON.stringify({
        id: key,
        status: "1"
      }),
      headers: { 
        "Content-type": "application/json; charset=UTF-8"
      } 
    }).then(response=>response.json()).then(data => {
      if (data.status == '200') {
        this.getAllfinished(1,1);
        this.getAllUnfinished(0,1);
      }
    })
  };

  deleteToDoTask = key => {
    fetch("http://localhost:8080/delete", {
      method: "POST",
      body: JSON.stringify({
        id: key
      }),
      headers: { 
        "Content-type": "application/json; charset=UTF-8"
      } 
    }).then(response=>response.json()).then(data => {
      if (data.status == '200') {
        this.getAllfinished(1,1);
        this.getAllUnfinished(0,1);
      }
    })
  }

  editTodoTask = (record)=> {
      this.setState({
        editModalVisible: true,
        editTask: record
      })
  }
  
  onEditFinish = (values) =>{
    fetch("http://localhost:8080/update", {
      method: "POST",
      body: JSON.stringify({
        id: this.state.editTask.key,
        name: values.name,
        content: values.content,
        deadline: values.deadline
      }),
      headers: { 
        "Content-type": "application/json; charset=UTF-8"
      } 
    }).then(response=>response.json()).then(data => {
      if (data.status == '200') {
        this.setState({
          editModalVisible: false
        })
        this.getAllfinished(1,1);
        this.getAllUnfinished(0,1);
      }
    })
  }

  onUnfinishedPageChange = pageNum => {
    this.getAllUnfinished(0,pageNum);
    this.setState({
      unfinishPageNum: pageNum
    })
  }

  onfinishedPageChange = pageNum => {
    this.getAllfinished(1,pageNum);
    this.setState({
      finishPageNum: pageNum
    })
  }
  render() {
    return(
      <div className="container">
        <div className="application-title">
          <Divider>Yibo's TODO Application</Divider>
        </div>
        <div>
          <Row>
            <Col span="2"/>
            <Col span="10">
              <Button className="add-event-btn" size="large"type="primary" shape="round" onClick={this.addNewTask}>Add new task</Button>
            </Col>
            <Col span="10"/>
            <Col span="2"/>
          </Row>
        </div>
        {/* modal for add new task */}
        <Modal
          title="Add new task"
          visible={this.state.addModalVisible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Form
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: 'Please enter your task title',
                },
              ]}
            >
            <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="content"
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Deadline"
              name="deadline"
            >
              <DatePicker />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        {/* modal for edit new task */}
        <Modal
          title="Edit your task"
          visible={this.state.editModalVisible}
          onCancel={this.handleEditCancel}
          footer={null}
        >
          <Form
            onFinish={this.onEditFinish}
            onFinishFailed={this.onEditFinishFailed}
          >
            <Form.Item
              label="Key"
              name="key"
              hidden={true}
            >
            <Input />
            </Form.Item>
            <Form.Item
              label="Title"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter task title",
                },
              ]}
            >
            <Input  placeholder={this.state.editTask.name}/>
            </Form.Item>

            <Form.Item
              label="Description"
              name="content"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder={this.state.editTask.content}/>
            </Form.Item>

            <Form.Item
              label="Deadline"
              name="deadline"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <DatePicker placeholder={this.state.editTask.deadline}/>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Row gutter={32}>
          <Col span="2"/>
          <Col span="10">
            <Card title="TO-DO Tasks">
              <Table 
                dataSource={this.state.unfinish}
                pagination={{
                  current: this.state.unfinishPageNum,
                  pageSize: 5,
                  total: this.state.unfinishTotal,
                  onChange: current => this.onUnfinishedPageChange(current),
                }}
              >
                <Column title="Name" dataIndex="name" key="name" />
                <Column title="Description" dataIndex="content" key="content" />
                <Column title="Due Time" dataIndex="deadline" key="deadline" />
                <Column
                  title="Action"
                  key="action"
                  render={(text, record) => (
                    <Space size="middle">
                      <Button type="primary" size="small" shape="round" onClick={()=>this.editTodoTask(record)}>Edit</Button>
                      <Button type="primary" size="small" shape="round" onClick={()=>this.completeTodoTask(record.key)}>Complete</Button>
                      <Button type="primary" size="small" shape="round" danger onClick={()=>this.deleteToDoTask(record.key)}>Delete</Button>
                    </Space>
                  )}
                />
              </Table>
            </Card>
          </Col>
          <Col span="10">
            <Card title="Completed Tasks">
              <Table 
                dataSource={this.state.finished}
                pagination={{
                  current: this.state.finishPageNum,
                  pageSize: 5,
                  total: this.state.finishTotal,
                  onChange: current => this.onfinishedPageChange(current),
                }}
              >
                <Column title="Name" dataIndex="name" key="name" />
                <Column title="Description" dataIndex="content" key="content" />
                <Column title="Due Time" dataIndex="deadline" key="deadline" />
                <Column
                  title="Action"
                  key="action"
                  render={(text, record) => (
                    <Space size="middle">
                      <Button type="primary" size="small" shape="round" danger onClick={()=>this.deleteToDoTask(record.key)}>Delete</Button>
                    </Space>
                  )}
                />
              </Table>
            </Card>
          </Col>
          <Col span="2"/>
        </Row>
      </div>
    )
  }
}
