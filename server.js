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

async function answerPicked(answer) {

    if (answer === 'View All Employees') {
        const result = await pool.query(`
        SELECT role_id, first_name, last_name, title, department.name AS department, salary, manager_id AS manager FROM employee 
        JOIN role ON employee.role_id=role.id 
        JOIN department ON role.department_id=department.id
        `)
        console.table(result.rows)
    } else if (answer === 'Add Employee') {
        const workRoles = await pool.query('SELECT title FROM role')
        let roles = []
        let i = 0
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
        if (answers.employee_manager != null) {
            console.log(`${answers.employee_first_name} ${answers.employee_last_name} has been added with role ${answers.employee_role} with manager ${answers.employee_manager}`)
        } else {
            `
        ${answers.employee_first_name} ${answers.employee_last_name} has been added with role ${answers.employee_role}
            `}
    } else if (answer === 'Update Emplmoyee Role') {
        
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