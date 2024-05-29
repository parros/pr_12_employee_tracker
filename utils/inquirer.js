const inquirer = require('inquirer')

async function employeeRoles(roles, managers) {
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
            type: 'list',
            name: 'employee_manager',
            message: 'Who is the employee\'s manager?',
            choices: managers
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

module.exports = {
    employeeRoles,
    addRole,
    updateEmployee,
    addDepartment
}