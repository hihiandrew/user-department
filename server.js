const Sequelize = require('sequelize')
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localost:5432/user-departments');

const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

const User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

const Department = db.define('department', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

User.belongsTo(Department, { foreignKey: 'role' });
Department.hasMany(User, { foreignKey: 'role' })

db.sync({ force: true })
    .then(async() => {
        ['moe', 'larry', 'curly', 'shep', 'joe'] = await Promise.all([
            User.create({ name: 'moe' }),
            User.create({ name: 'larry' }),
            User.create({ name: 'curly' }),
            User.create({ name: 'shep' }),
            User.create({ name: 'joe' }),
        ])
    })
    .then(async() => {
        ['Engineering', 'Teaching', 'Banking', 'Waiting'] = await Promise.all([
            Department.create({ name: 'Engineering' }),
            Department.create({ name: 'Teaching' }),
            Department.create({ name: 'Banking' }),
            Department.create({ name: 'Waiting' }),
        ])
    })
    .then(() => {
        moe.setRole(Engineering),
            larry.setRole(Engineering),
            curly.setRole(Banking),
            shep.setRole(Teaching),
            return [moe, larry, curly, shep, joe].map(user => {
                user.save()
            })
    })
    .then(() => {
        console.log('Datbase synced')
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
    })
    .catch(err => { console.log(err) })

app.get('/api/departments', async(req, res, next) => {
    const dept = await Department.findAll({
        include: [User]
    })
    res.json(dept)
})

app.use('/dist', express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', sendFile(path.join(__direname, 'index.html')))
