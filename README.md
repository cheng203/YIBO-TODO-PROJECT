This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## YIBO's customerized TO-DO application

This project utilizes technique stacks including

- React.js
- Ant Design
- Node.js
- Express
- Sequelize
- MySql
- Axios
- Body-parser

**React.js, Ant Design, Node.js, Express, Sequelize, MySql**

​	

- **Functionality Analysis**
  - allow user to add new to-do task including task title, task description, task deadline and task status (todo, complete)
  - for each to-do task, allow user to edit its title, description and deadline, mark as complete and then will move to the right complete list, delete directly without marking it as complete
  - once to-do task is done, it will be moved to complete list and allow user to decide if the specific task should be deleted

- **Front UI layout and component using Ant Design (4.X)**

  

<img src="https://github.com/cheng203/YIBO-TODO-PROJECT/blob/master/img/1.png" />

​											Figure 1: Overall View of Front End

<img src="https://github.com/cheng203/YIBO-TODO-PROJECT/blob/master/img/2.png" />

​																Figure 2: Modal for Adding New Task 

<img src="https://github.com/cheng203/YIBO-TODO-PROJECT/blob/master/img/3.png />

​												Figure 3: Modal for Editing Existing Unfinished Task

<img src="https://github.com/cheng203/YIBO-TODO-PROJECT/blob/master/img/4.png" />

​										Figure 4: Added Function for Each Unfinished Task and Pagination



- **Backend API Design (Accomplished by Node.js under Express Framework)**
  - create new task object
    - url (http://localhost:8080/create)
    - method: POST
    - params:
      - name
      - deadline
      - content
      - status	
  - update a TO-DO list
    - url (http://localhost:8080/update)
    - method: POST
    - params:
      - name
      - deadline
      - content	
  - update TO-DO task from unfinished to finished
    - url (http://localhost:8080/update_status)
    - method: POST
    - params:
      - id
      - status
  - delete a task
    - url (http://localhost:8080/delete)
    - method: POST
    - params:
      - id	
  - list finish&unfinish tasks stored in MySql based up status and page number
    - url (http://localhost:8080/list/status/pageNum)
    - method: get
    - params:
      - status
      - page number	