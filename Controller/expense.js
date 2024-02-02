const Expense = require('../models/Expenses');
const Downloads = require('../models/downloads');
const sequelize = require('../util/database');
const AWS = require('aws-sdk');
const Userservices = require('../services/userservices');
const S3services = require('../services/S3services');


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
        const ITEMS_PER_PAGE = parseInt(req.header('rows')) || 2
        const page = +req.query.page || 1;
        let totalItems;
        total = await Expense.count()
        totalItems = total
        // products.findAll({
        //     offset: (page - 1) * ITEMS_PER_PAGE,
        //     limit: ITEMS_PER_PAGE
        // })
        const data = await req.user.getExpenses( {
            offset: (page - 1) * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE
        });
        res.status(200).json({
            expenses: data,
            currentPage: page,
            hasNexPage: ITEMS_PER_PAGE * page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
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


const download = async (req, res) => {
    try {

        const expenses = await Userservices.getExpenses(req);
        const stringifiedExpenses = JSON.stringify(expenses)

        const userId = req.user.id;

        const filename = `Expenses${userId}/${new Date()}.txt`;
        const fileInfo = await S3services.uploadToS3(stringifiedExpenses, filename);
        const fileUrl = fileInfo.Location
        res.status(200).json({ fileUrl, fileInfo: fileInfo})
        saveDownloads(fileInfo, userId)
    } catch (err) {
        console.log(err);
        res.status(500).json( { fileUrl: '', success: false, err: err})
    }
}

async function saveDownloads(fileInfo, userId)  {
    const t = await sequelize.transaction();
    try {

        const longname = fileInfo.Key;
        let startIndex = longname.indexOf('/') + 1;
        let endIndex = longname.lastIndexOf(')') + 1;
        const name = longname.substring(startIndex, endIndex);
        const url = fileInfo.Location;
        
        
        const details = await Downloads.create({ name: name, url: url, userId: userId}, { transaction: t});
        await t.commit();
    } catch (err) {
        console.log(err)
        await t.rollback();
    }
}

const getDownloads = async (req, res) => {
    try {
        const data = await req.user.getDownloads();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ err: err})
    }

}

module.exports = {
    addExpense,
    getExpense,
    deleteExpense,
    download,
    getDownloads
}