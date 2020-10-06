const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
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
            choices: ["Add Employee", "Update Employee", "Delete Employee", "Start Again", "Exit"]
          }
        ]).then(({addOrUpdate})=> {
          if(addOrUpdate === "Add Employee") {
              askUserForNewEmployeeInfo();
          }

          else if(addOrUpdate === "Update Employee") {
             updateEmployee();
          }

          else if(addOrUpdate === "Delete Employee") {
            deleteEmployee();
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
                validate: function(value) {
                  if (value.length <1) {
                    console.log("Employee must have an updated Role ID, please enter one");
                    return false;
                  }
                  return true;
                }
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
                console.log("Employee role successfully updated, see table below.");
                listEmployees();
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
                    console.log("Employee Manager ID successfully updated, see table below.");
                    listEmployees();
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
            console.log("Employee must have an ID, please enter one");
            return false;
          }
          return true;
        }
      },

      {
        name: "employeeFirstName",
        message: "What is the employee's first name?",
        type: "input",
        validate: function(value) {
          if (value.length <1) {
            console.log("Employee must have a first name, please enter one");
            return false;
          }
          return true;
        }
      },

      {
        name: "employeeLastName",
        message: "What is the employee's last name?",
        type: "input",
        validate: function(value) {
          if (value.length <1) {
            console.log("Employee must have a last name, please enter one");
            return false;
          }
          return true;
        }
      },

      {
        name: "employeeRoleID",
        message: "What is the employee's role I.D.?",
        type: "input",
        validate: function(value) {
          if (value.length <1) {
            console.log("Employee must have a role I.D., please enter one");
            return false;
          }
          return true;
        }
      },

      {
        name: "employeeManagerID",
        message: "What is the employee's manager's I.D.?",
        type: "input"
      }
    ]).then(({employeeID, employeeFirstName, employeeLastName, employeeRoleID, employeeManagerID}) => {
      addEmployee(employeeID, employeeFirstName, employeeLastName, employeeRoleID, employeeManagerID);
      console.log("Employee successfully added, see table below.");
      listEmployees();
      getEmployees();
    })
  }

  function deleteEmployee(){
    connection.query("SELECT * FROM employee", (err, data) => {
      if (err) throw err;
      const arrayOfEmployeeNames = data.map((employee) => employee.id);
      inquirer.prompt([
        {
          name: "employeeToDelete",
          message: "Which employee are you deleting?",
          type: "list",
          choices: arrayOfEmployeeNames,
        }
      ])
      .then(({employeeToDelete}) => {
        connection.query(
        "DELETE FROM employee WHERE ?",
        [
          {
            id: employeeToDelete,
          },
        ],
        (err, data) => {
          if (err) throw err;
          console.log("Employee successfully deleted, see table below.");
          listEmployees();
          getEmployees();
        })
      });
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
              choices: ["Add Department", "Delete Department", "Start Again", "Exit"]
            }
          ]).then(({addOrExit})=> {
            if(addOrExit === "Add Department") {
              askForNewDepartmentInfo();
            }

            else if(addOrExit === "Delete Department") {
              deleteDepartment();
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
            validate: function(value) {
              if (value.length <1) {
                console.log("Department must have an I.D., please enter one");
                return false;
              }
              return true;
            }
          },
  
          {
            name: "departmentName",
            Message: "What is the name of this department?",
            type: "input",
            validate: function(value) {
              if (value.length <1) {
                console.log("Department must have a name, please enter one");
                return false;
              }
              return true;
            }
          },
      ]).then(({departmentID, departmentName}) => {
        addDepartment(departmentID, departmentName);
        console.log("Department successfully added, see table below.");
        listDepartments();
        getDepartments();
      })
    }

    function deleteDepartment(){
      connection.query("SELECT * FROM department", (err, data) => {
        if (err) throw err;
        const arrayOfDepartmentNames = data.map((department) => department.department_name);
        inquirer.prompt([
          {
            name: "departmentToDelete",
            message: "Which department are you deleting?",
            type: "list",
            choices: arrayOfDepartmentNames,
          }
        ])
        .then(({departmentToDelete}) => {
          connection.query(
          "DELETE FROM department WHERE ?",
          [
            {
              department_name: departmentToDelete,
            },
          ],
          (err, data) => {
            if (err) throw err;
            console.log("Department successfully deleted, see table below.");
            listDepartments();
            getDepartments();
          })
        });
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
              choices: ["Add Role", "Delete Role", "Start Again", "Exit"]
            }
          ]).then(({addOrExit})=> {
            if(addOrExit === "Add Role") {
              askForNewRoleInfo();
            }

            else if(addOrExit === "Delete Role") {
              deleteRole();
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
            message: "What will the I.D. be for this role?",
            type: "input",
            validate: function(value) {
              if (value.length <1) {
                console.log("Role must have an I.D., please enter one");
                return false;
              }
              return true;
            }
          },
  
          {
            name: "roleTitle",
            message: "What is the title of this role?",
            type: "input",
            validate: function(value) {
              if (value.length <1) {
                console.log("Role must have a title, please enter one");
                return false;
              }
              return true;
            }
          },

          {
            name: "roleSalary",
            message: "What is the salary for this role?",
            type: "input",
            validate: function(value) {
              if (value.length <1) {
                console.log("Role must have a salary assigned, please enter one");
                return false;
              }
              return true;
            }
          },

          {
            name: "roleDepartment",
            message: "Please enter the Department for this role:",
            type: "input",
            validate: function(value) {
              if (value.length <1) {
                console.log("Role must have a department it is assigned to, please enter one");
                return false;
              }
              return true;
            }
          },
      ]).then(({roleID, roleTitle, roleSalary, roleDepartment}) => {
        addRole(roleID, roleTitle, roleSalary, roleDepartment);
        listRoles();
        getRoles();
      })
    }

    function deleteRole(){
      connection.query("SELECT * FROM role", (err, data) => {
        if (err) throw err;
        const arrayOfRoleTitles = data.map((role) => role.title);
        inquirer.prompt([
          {
            name: "roleToDelete",
            message: "Which role are you deleting?",
            type: "list",
            choices: arrayOfRoleTitles,
          }
        ])
        .then(({roleToDelete}) => {
          connection.query(
          "DELETE FROM role WHERE ?",
          [
            {
              title: roleToDelete,
            },
          ],
          (err, data) => {
            if (err) throw err;
            console.log("Department successfully deleted, see table below.");
            listRoles();
            getRoles();
          })
        });
    })
  }
  