const Sequelize = require('sequelize');
const db = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localost:5432/user-department'
);

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Department = db.define('department', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

User.belongsTo(Department);
Department.hasMany(User, { as: 'role' });

db.sync({ force: true })
  .then(async () => {
    [moe, larry, curly, shep, joe] = await Promise.all(
      ['moe', 'larry', 'curly', 'shep', 'joe'].map(user =>
        User.create({ name: user })
      )
    );
  })
  .then(async () => {
    [Engineering, Teaching, Banking, Waiting] = await Promise.all(
      ['Engineering', 'Teaching', 'Banking', 'Waiting'].map(role =>
        Department.create({ name: role })
      )
    );
  })
  .then(async () => {
    await Promise.all([
      Engineering.setRole([moe, larry]),
      Banking.setRole(curly),
      Teaching.setRole(shep),
    ]);
  })
  .then(() => {
    console.log('Datbase synced');
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  })
  .catch(err => {
    console.log(err);
  });

app.get('/api/departments', async (req, res, next) => {
  const dept = await Department.findAll({
    include: [User],
  });
  res.json(dept);
});

app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', (req, res, next) => {
  sendFile(path.join(__direname, 'index.html'));
});
