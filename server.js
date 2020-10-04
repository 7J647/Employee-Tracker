const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "PootyGasser5%",
    database: "tracker"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    inquirer.prompt([
      {
        name: "userArea",
        message: "Which area would you like to enter?",
        type: "list",
        choices: ["Employees", "Departments", "Roles"]
      }
  //CHANGING THIS TO ES6 FORMAT BELOW
  //   ]).then(result => {
  //     console.log(result.userArea);
  //     if(result.userArea === "Employees") {
  //       getEmployees();
  //     }
  //   })
  // });
      ]).then(({userArea})=> {
        // console.log(userArea);
        if(userArea === "Employees") {
          listEmployees(); 
          getEmployees();
        }
        // else if(userArea === "Departments")
      })
    });

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
            choices: ["Add Employee", "Update Employee", "Exit"]
          }
        ]).then(({addOrUpdate})=> {
          if(addOrUpdate === "Add Employee") {
              askUserForNewEmployeeInfo();
          }

          else if(addOrUpdate === "Update Employee") {
             updateEmployee();
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
      console.log(data);
      const arrayOfEmployeeNames = data.map(employee => employee.first_name + " " + employee.last_name);
      console.log(arrayOfEmployeeNames);
      inquirer.prompt([
        {
          name: "employeeToUpdate",
          message: "Which employee are you updating?",
          type: "list",
          choices: arrayOfEmployeeNames,
        },
      ])
      .then(({employeeToUpdate}) => {
        console.log(employeeToUpdate);
      });
    });
  }

  function askUserForNewEmployeeInfo(){
    inquirer.prompt([
      {
        name: "employeeID",
        Message: "What will the I.D. be for this employee?",
        type: "input",
      },

      {
        name: "employeeFirstName",
        Message: "What is the employee's first name?",
        type: "input"
      },

      {
        name: "employeeLastName",
        Message: "What is the employee's last name?",
        type: "input"
      },

      {
        name: "employeeRoleID",
        Message: "What is the employee's role I.D.?",
        type: "input"
      },

      {
        name: "employeeManagerID",
        Message: "What is the employee's manager's I.D.?",
        type: "input"
      }
    ]).then(({employeeID, employeeFirstName, employeeLastName, employeeRoleID, employeeManagerID}) => {
      // console.log(employeeID);
      // console.log(employeeFirstName);
      // console.log(employeeLastName);
      // console.log(employeeRoleID);
      // console.log(employeeManagerID);
      addEmployee(employeeID, employeeFirstName, employeeLastName, employeeRoleID, employeeManagerID);
      listEmployees();
      getEmployees();
    })
  }
  // function start() {
  //   inquirer
  //     .prompt({
  //       name: "addViewUpdate",
  //       type: "list",
  //       message: "Would you like to [POST] an auction or [BID] on an auction?",
  //       choices: ["POST", "BID", "EXIT"]
  //     })
  //     .then(function(answer) {
  //       // based on their answer, either call the bid or the post functions
  //       if (answer.postOrBid === "POST") {
  //         postAuction();
  //       }
  //       else if(answer.postOrBid === "BID") {
  //         bidAuction();
  //       } else{
  //         connection.end();
  //       }
  //     });
  // }
  