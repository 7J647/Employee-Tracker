const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "PootyGasser5%",
    database: "tracker"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
  })

  function listEmployees(){
    connection.query("SELECT * FROM employee", (err, data) => {
      if (err) throw err;
      console.table(data);
    })
  }

  function getEmployees(){
    connection.query("SELECT * FROM employee", (err, data) => {
      if (err) throw err;
        inquirer.prompt([
          {
            name: "addOrUpdate",
            message: "What would you like to do next?",
            type: "list",
            choices: ["Add Employee", "Update Employee", "Start Again", "Exit"]
          }
        ]).then(({addOrUpdate})=> {
          if(addOrUpdate === "Add Employee") {
              askUserForNewEmployeeInfo();
          }

          else if(addOrUpdate === "Update Employee") {
             updateEmployee();
          }

          else if(addOrUpdate === "Start Again") {
            start();
         }
          else if(addOrUpdate=="Exit"){
            console.log("Thank you, session ended!")
            connection.end();
          }
        })
    })  
  }

  function addEmployee(id, first_name, last_name, role_id, manager_id){
    connection.query("INSERT INTO employee SET ? ", 
    { id: id, first_name: first_name, last_name: last_name, role_id: role_id, manager_id: manager_id}, 
      (err, data) => {
        if (err) throw err;
      })
  }


  function updateEmployee(){
    connection.query("SELECT * FROM employee", (err, data) => {
      if (err) throw err;
      inquirer.prompt([
        {
          name: "idToUpdate",
          message: "Which of the following are you updating?",
          type: "list",
          choices: ["Role ID","Manager ID"],
        }
      ])
        .then(({idToUpdate})=> {
            if(idToUpdate === "Role ID") {
                updateEmployeeRole();
            }
            else if(idToUpdate === "Manager ID") {
                updateEmployeeManager();
            }
        });
    });
}

    function updateEmployeeRole() {
      connection.query("SELECT * FROM employee", (err, data) => {
        if (err) throw err;
        const arrayOfEmployeeNames = data.map((employee) => employee.id);
        inquirer.prompt([
          {
            name: "employeeToUpdate",
            message: "Which employee are you updating?",
            type: "list",
            choices: arrayOfEmployeeNames,
          },
              {
                name: "updatedRoleID",
                message: "Please enter the employee's updated Role ID:",
                type: "input",
              }
            ])
            .then(({employeeToUpdate,updatedRoleID}) => {
              connection.query(
              "UPDATE employee SET ? WHERE ?",
              [
                {
                  role_id:  updatedRoleID,
                },
                {
                  id: employeeToUpdate,
                },
              ],
              (err, data) => {
                if (err) throw err;
                listEmployees();
                console.log("Employee successfully updated, see table below.");
                getEmployees();
              })
            });
        })
    }

        function updateEmployeeManager() {
          connection.query("SELECT * FROM employee", (err, data) => {
            if (err) throw err;
            const arrayOfEmployeeNames = data.map((employee) => employee.id);
            inquirer.prompt([

              {
                name: "employeeToUpdate",
                message: "Which employee are you updating?",
                type: "list",
                choices: arrayOfEmployeeNames,
              },
                  {
                    name: "updatedManagerID",
                    message: "Please enter the employee's new Manager's ID:",
                    type: "input",
                  }
                ])
                .then(({employeeToUpdate,updatedManagerID}) => {
                  connection.query(
                  "UPDATE employee SET ? WHERE ?",
                  [
                    {
                      manager_id:  updatedManagerID,
                    },
                    {
                      id: employeeToUpdate,
                    },
                  ],
                  (err, data) => {
                    if (err) throw err;
                    listEmployees();
                    console.log("Employee successfully updated, see table below.");
                    getEmployees();
                  })
                });
              })
            }

  function askUserForNewEmployeeInfo(){
    inquirer.prompt([
      {
        name: "employeeID",
        message: "What will the I.D. be for this employee?",
        type: "input",
        validate: function(value) {
          if (value.length <1) {
            console.log("Employee must have an ID, please start again");
            // askUserForNewEmployeeInfo();
            return false;
          }
          return true;
//
// return value.length > 0;



        }
      },

      {
        name: "employeeFirstName",
        message: "What is the employee's first name?",
        type: "input"
      },

      {
        name: "employeeLastName",
        message: "What is the employee's last name?",
        type: "input"
      },

      {
        name: "employeeRoleID",
        message: "What is the employee's role I.D.?",
        type: "input"
      },

      {
        name: "employeeManagerID",
        message: "What is the employee's manager's I.D.?",
        type: "input"
      }
    ]).then(({employeeID, employeeFirstName, employeeLastName, employeeRoleID, employeeManagerID}) => {
      addEmployee(employeeID, employeeFirstName, employeeLastName, employeeRoleID, employeeManagerID);
      listEmployees();
      getEmployees();
    })
  }

  function start() {
    inquirer.prompt([
      {
        name: "userArea",
        message: "Which database table would you like to view?",
        type: "list",
        choices: ["Employees", "Departments", "Roles"]
      }
      ]).then(({userArea})=> {
        if(userArea === "Employees") {
          listEmployees(); 
          getEmployees();
        }
        else if(userArea === "Departments") {
          listDepartments();
          getDepartments();
        }
        else if(userArea === "Roles") {
          listRoles();
          getRoles();
        }
      });
    }
  
    function listDepartments(){
      connection.query("SELECT * FROM department", (err, data) => {
        if (err) throw err;
        console.table(data);
      })
    }

    function getDepartments(){
      connection.query("SELECT * FROM employee", (err, data) => {
        if (err) throw err;
          inquirer.prompt([
            {
              name: "addOrExit",
              message: "What would you like to do next?",
              type: "list",
              choices: ["Add Department", "Start Again", "Exit"]
            }
          ]).then(({addOrExit})=> {
            if(addOrExit === "Add Department") {
              askForNewDepartmentInfo();
            }
  
            else if(addOrExit === "Start Again") {
              start();
           }
            else if(addOrExit=="Exit"){
              console.log("Thank you, session ended!")
              connection.end();
            }
          })
      })  
    }

    function addDepartment(id, department_name){
      connection.query("INSERT INTO department SET ? ", 
      {id: id, department_name: department_name}, 
        (err, data) => {
          if (err) throw err;
      })
    }

    function askForNewDepartmentInfo(){
        inquirer.prompt([
          {
            name: "departmentID",
            Message: "What will the I.D. be for this department?",
            type: "input",
          },
  
          {
            name: "departmentName",
            Message: "What is the name of this department?",
            type: "input"
          },
      ]).then(({departmentID, departmentName}) => {
        addDepartment(departmentID, departmentName);
        listDepartments();
        getDepartments();
      })
    }


    function listRoles(){
      connection.query("SELECT * FROM role", (err, data) => {
        if (err) throw err;
        console.table(data);
      })
    }

    function getRoles(){
      connection.query("SELECT * FROM role", (err, data) => {
        if (err) throw err;
          inquirer.prompt([
            {
              name: "addOrExit",
              message: "What would you like to do next?",
              type: "list",
              choices: ["Add Role", "Start Again", "Exit"]
            }
          ]).then(({addOrExit})=> {
            if(addOrExit === "Add Role") {
              askForNewRoleInfo();
            }
  
            else if(addOrExit === "Start Again") {
              start();
           }
            else if(addOrExit=="Exit"){
              console.log("Thank you, session ended!")
              connection.end();
            }
          })
      })  
    }

    function addRole(id, title, salary, department_id){
      connection.query("INSERT INTO role SET ? ", 
      {id: id, title: title, salary: salary, department_id: department_id}, 
        (err, data) => {
          if (err) throw err;
      })
    }

    function askForNewRoleInfo(){
        inquirer.prompt([
          {
            name: "roleID",
            Message: "What will the I.D. be for this role?",
            type: "input",
          },
  
          {
            name: "roleTitle",
            Message: "What is the title of this role?",
            type: "input"
          },

          {
            name: "roleSalary",
            Message: "What is the salary for this role?",
            type: "input"
          },

          {
            name: "roleDepartment",
            Message: "Please enter the Department for this role:",
            type: "input"
          },
      ]).then(({roleID, roleTitle, roleSalary, roleDepartment}) => {
        console.log(roleID);
        console.log(roleTitle);
        console.log(roleSalary);
        console.log(roleDepartment);

        addRole(roleID, roleTitle, roleSalary, roleDepartment);
        listRoles();
        getRoles();
      })
    }
  