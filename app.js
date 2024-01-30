const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors');


const sequelize = require('./util/database');
const User = require('./models/User')
const ForgotPassword = require('./models/ForgotPasswordRequests')
const Expense = require('./models/Expenses');
const Order = require('./models/orders');


const userRoutes = require('./Routes/user')
const expenseRoutes = require('./Routes/expense');
const purchaseRoutes = require('./Routes/purchase');
const premiumRoutes = require('./Routes/premium');
const passwordRoutes = require('./Routes/password');


app.use(cors());

app.use(bodyParser.json({ extended: false}));

app.use('/user', userRoutes);

app.use('/expense', expenseRoutes)

app.use('/purchase', purchaseRoutes)

app.use('/premium/', premiumRoutes)

app.use('/password', passwordRoutes)


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword)



sequelize
.sync()
.then(result => {
    app.listen(3000);
}).catch(err => console.log(err));

