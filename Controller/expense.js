const Expense = require('../models/Expenses');


const addExpense = async (req, res) => {
    const t = await sequelize.transaction();
    try{
        const date = req.body.date;
        const description = req.body.description;
        const amount = req.body.amount;
        const category = req.body.category
        const income = req.body.income
        const userId = req.user.id
        const currentIncome = req.user.totalIncome;
        const updatedIncome = currentIncome + parseInt(income)
        const currentExpense = req.user.totalExpenses
        const updatedExpense = currentExpense + parseInt(amount)
        if (description){
            const details = await Expense.create({ date: date, description: description, amount: amount, category: category, income: income, userId: userId}, { transaction: t});
            const test = await req.user.update({ totalExpenses: updatedExpense}, { transaction: t })
            await t.commit();
            res.status(201).json(details)
        } else {
            const details = await Expense.create({ date: date, description: null, amount: 0, category: null, income: income, userId: userId}, { transaction: t});
            const test = await req.user.update({ totalIncome: updatedIncome}, { transaction: t })
            await t.commit();
            res.status(201).json(details)
        }
        
        

    } catch (err) {
        await t.rollback();
        res.json(err);
    }
}

const getExpense = async (req, res) => {
    try {
        // const data = await Expense.findAll({ where: { userId: req.user.id}});
        const data = await req.user.getExpenses();
        res.status(200).json(data);
    } catch(err) {
        res.json(err);
        console.log(err)
    }
}

const deleteExpense = async (req, res) => {
    const t = await sequelize.transaction()
    try {
        const userId = req.user.id
        const id = req.params.id;
        const expenseObj = await Expense.findOne({ where: { id: id, userId: userId}})
        const expenseAmount = Number(expenseObj.amount)
        console.log('Expense Amount >>>',expenseAmount)
        const currentAmount = Number(req.user.totalExpenses)
        console.log('Currrent Amount >>>',currentAmount)
        const updatedExpense = currentAmount - expenseAmount
        console.log('Updated Amount >>>',updatedExpense)
        await expenseObj.destroy({transaction: t})
        await req.user.update({totalExpenses: updatedExpense }, { transaction: t})
        
        await t.commit()
        
        res.status(200).json({ message: 'Expense Deleted'});
    } catch (err) {
        await t.rollback()
        res.status(500).json(err);
    }
}

module.exports = {
    addExpense,
    getExpense,
    deleteExpense
}