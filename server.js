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
  //   addEmployee(102, "Jill", "Flynn", 1, 101);
  //   getEmployees();
  //  connection.end();
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
        console.log(userArea);
        if(userArea === "Employees") {
          getEmployees();
        }
        // else if(userArea === "Departments")
      })
    });

  function getEmployees(){
    connection.query("SELECT * FROM employee", (err, data) => {
      if (err) throw err;
      console.table(data);
        inquirer.prompt([
          {
            name: "addOrUpdate",
            message: "What would you like to do next?",
            type: "list",
            choices: ["Add Employee", "Update Employee"]
          }
        ]).then(({addOrUpdate})=> {
          if(addOrUpdate === "Add Employee") {
            addEmployee();
            connection.end();
          }
        })
    })
    
  }
addEmployee();
function addEmployee(){}
  // function addEmployee(id, first_name, last_name, role_id, manager_id){
  //   connection.query("INSERT INTO employee SET ? ", { id: id, first_name: first_name, last_name: last_name, role_id: role_id, manager_id: manager_id}, (err, data) => {
  //     if (err) throw err;
  //     // console.log(data);
  //   })
  
  // }

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
  