const inquirer = require('inquirer')
const { Pool } = require('pg')


const pool = new Pool({
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    database: 'employee_db'
})

async function employeeRoles(roles) {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'employee_first_name',
            message: 'What is the first name of the employee?'
        },
        {
            type: 'input',
            name: 'employee_last_name',
            message: 'What is the last name of the employee?'
        },
        {
            type: 'list',
            name: 'employee_role',
            message: 'What is the role of the employee?',
            choices: roles
        },
        {
            type: 'input',
            name: 'employee_manager',
            message: 'Who is the employee\'s manager?',
            default: null
        }
    ])
    return answers
}

async function addRole(departments) {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'role_name',
            message: 'What is the name of the role?'
        },
        {
            type: 'input',
            name: 'role_salary',
            message: 'What is the salary?'
        },
        {
            type: 'list',
            name: 'role_department',
            message: 'What department does the role belong to?',
            choices: departments
        }
    ])
    return answers
}

async function addDepartment() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: 'What is the name of the department?'
        }
    ])
    return answers
}

async function updateEmployee(names, roles) {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_name',
            message: 'Which employee\'s role do you want to update?',
            choices: names
        },
        {
            type: 'list',
            name: 'employee_role',
            message: 'Which role do you want to assign the selected employee?',
            choices: roles
        }
    ])
    return answers
}

async function answerPicked(answer) {
    console.log(answer)
    if (answer === 'View All Employees') {
        const result = await pool.query(`
        SELECT e.id, e.first_name, e.last_name, title, department.name AS department, salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee AS e
        LEFT JOIN employee AS m ON e.manager_id=m.id
        JOIN role ON e.role_id=role.id 
        JOIN department ON role.department_id=department.id
        `)
        console.table(result.rows)
    } else if (answer === 'Add Employee') {
        const workRoles = await pool.query('SELECT title FROM role')
        let roles = []
        for (let i = 0; i < workRoles.rows.length; i++) {
            roles.push(workRoles.rows[i].title)
        }
        const answers = await employeeRoles(roles)
        for (let i = 0; i < workRoles.rows.length; i++) {
            if (workRoles.rows[i].title === answers.employee_role) {
                const results = await pool.query(`
                INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('${answers.employee_first_name}', '${answers.employee_last_name}', ${i + 1}, ${answers.employee_manager})
                `)
            }
        }
    } else if (answer === 'Update Employee Role') {
        const employeeNames = await pool.query('SELECT first_name, last_name FROM employee')
        let names = []
        for (let i = 0; i < employeeNames.rows.length; i++) {
            names.push(`${employeeNames.rows[i].first_name} ${employeeNames.rows[i].last_name}`)
        }
        const workRoles = await pool.query('SELECT title FROM role')
        let roles = []
        for (let i = 0; i < workRoles.rows.length; i++) {
            roles.push(workRoles.rows[i].title)
        }
        const answers = await updateEmployee(names, roles)
        for (let i = 0; i < workRoles.rows.length; i++) {
            if (workRoles.rows[i].title === answers.employee_role){
                for (let x = 0; x < employeeNames.rows.length; x++){
                    if (`${employeeNames.rows[x].first_name} ${employeeNames.rows[x].last_name}` === answers.employee_name){
                        console.log('hellowthaldjl;faksdl;kahdf;kjghadfk;g')
                        const results = await pool.query(`
                        UPDATE employee SET role_id = ${i+1} WHERE first_name = '${employeeNames.rows[x].first_name}'
                    `)}
                }
            }
        }

    } else if (answer === 'View All Roles') {
        const result = await pool.query('SELECT * FROM role')
        console.table(result.rows)
    } else if (answer === 'Add Role') {
        const departments = await pool.query('SELECT name FROM department')
        let departmentNames = []
        for (let i = 0; i < departments.rows.length; i++) {
            departmentNames.push(departments.rows[i].name)
        }

        const answers = await addRole(departmentNames)

        for (let i = 0; i < departments.rows.length; i++) {
            if (departments.rows[i].name === answers.role_department) {
                const results = await pool.query(`
                INSERT INTO role(title, salary, department_id) 
                VALUES ('${answers.role_name}', '${answers.role_salary}', ${i + 1})
                `)
            }
        }
        const result = await pool.query('SELECT * FROM role')
    } else if (answer === 'View All Departments') {
        const result = await pool.query('SELECT * FROM department')
        console.table(result.rows)
    } else if (answer === 'Add Department') {
        const answers = await addDepartment()
        const results = await pool.query(`
                INSERT INTO department(name) 
                VALUES ('${answers.department_name}')`)
    } else if (answer === 'Quit') {
        process.exit(0)
    }
    askQuestion()
}

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

            answerPicked(answer)
        })
}

askQuestion()