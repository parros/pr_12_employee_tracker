const inquirer = require('inquirer')
const {Pool} = require('pg')

const pool = new Pool({
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    database: 'employee_db'
})



function askQuestion() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'pickWhatToDo',
                message: 'What would you like to do?',
                choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
            }
        ]).then((answers) => {

            const answer = answers.pickWhatToDo

            async function answerPicked (answer) {
                if (answer === 'View All Employees') {
                    const result = await pool.query('Select employee_id, first_name, last_name, manager_id FROM employee JOIN role ON employee.role_id=role.role_id JOIN department ON role.department_id=department.department_id')
                    console.table(result.rows)
                } else if (answer === 'View All Roles') {
                    const result = await pool.query('Select * FROM role')
                    console.table(result.rows)
                } else if (answer === 'View All Departments') {
                    const result = await pool.query('Select * FROM department')
                    console.table(result.rows)
                } else if (answer === 'Quit') {
                    process.exit(0)
                }
                askQuestion()
            }
            
            answerPicked(answer)
    })}

askQuestion()