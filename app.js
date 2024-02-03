const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors');
const path = require('path')
const fs = require('fs')
const helmet = require('helmet');
const morgan = require('morgan')


const sequelize = require('./util/database');
const User = require('./models/User')
const ForgotPassword = require('./models/ForgotPasswordRequests')
const Expense = require('./models/Expenses');
const Order = require('./models/orders');
const Downloads = require('./models/downloads');


const userRoutes = require('./Routes/user')
const expenseRoutes = require('./Routes/expense');
const purchaseRoutes = require('./Routes/purchase');
const premiumRoutes = require('./Routes/premium');
const passwordRoutes = require('./Routes/password');

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'), { flags: 'a'});

app.use(cors());

app.use(helmet());

app.use(morgan('combined', { stream: accessLogStream}));

app.use(bodyParser.json({ extended: false}));

app.use('/user', userRoutes);

app.use('/expense', expenseRoutes)

app.use('/purchase', purchaseRoutes)

app.use('/premium', premiumRoutes)

app.use('/password', passwordRoutes)


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword)

User.hasMany(Downloads);
Downloads.belongsTo(User)



sequelize
.sync()
.then(result => {
    app.listen(3000);
}).catch(err => console.log(err));

