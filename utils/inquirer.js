const inquirer = require('inquirer')

async function employeeRoles(roles, managers) {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'employeeFirstName',
            message: 'What is the first name of the employee?'
        },
        {
            type: 'input',
            name: 'employeeLastName',
            message: 'What is the last name of the employee?'
        },
        {
            type: 'list',
            name: 'employeeRole',
            message: 'What is the role of the employee?',
            choices: roles
        },
        {
            type: 'list',
            name: 'employeeManager',
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
            name: 'roleName',
            message: 'What is the name of the role?'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary?'
        },
        {
            type: 'list',
            name: 'roleDepartment',
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
            name: 'employeeName',
            message: 'Which employee\'s role do you want to update?',
            choices: names
        },
        {
            type: 'list',
            name: 'employeeRole',
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
            name: 'departmentName',
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