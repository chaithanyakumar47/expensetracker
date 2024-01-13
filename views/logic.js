async function userSignup(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    const userData = {
        username,
        email,
        password
    };
    // console.log(userData);
    
    try {
        const data = await axios.post('http://localhost:3000/user/signup',userData);
        // console.log(data.data);


    } catch(err) {
        // console.log(err.message);
        const parent = document.getElementById('error');
        const child = `${err.message}`;
        parent.innerHTML = parent.innerHTML + child;

    }

}

async function userSignin(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    const userData = {
        email,
        password
    };
    // console.log(userData);
    
    try {
        const data = await axios.post('http://localhost:3000/user/login',userData);
        if(data.data.status === true){
            const a = document.getElementById('expense');
            a.setAttribute('href','Expense.html');
            a.textContent = 'Add/Check Expenses'
            localStorage.setItem('token', data.data.token);
        }


    } catch(err) {
        console.log(err);


    }
}

async function addExpense(event) {
    event.preventDefault();
    const description = event.target.description.value;
    const amount = event.target.amount.value;
    const category = event.target.category.value
    
    const expenseData = {
        description,
        amount,
        category
    }
    
    try {
        const token = localStorage.getItem('token');
        const data =  await axios.post('http://localhost:3000/expense/addExpense',expenseData, { headers: { 'Authorization': token }});
        getExpenses(data.data)
        
    } catch (err) {
        console.log(err);
    }
    

}

 async function deleteExpense(expenseId) {
try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/expense/deleteExpense/${expenseId}`,{ headers: { 'Authorization': token }});
        const parent = document.getElementById('expenses');
        const child = document.getElementById(expenseId);
        parent.removeChild(child);
        console.log("Deleted");

        } catch (err) {
            console.log(err);
        }
    }


function getExpenses(expense) {
    const parent = document.getElementById('expenses');
    const child = `<li id = '${expense.id}'> ${expense.description} - ${expense.amount} - ${expense.category}  <button onclick = deleteExpense(${expense.id})>Delete</button></li>`;
    parent.innerHTML = parent.innerHTML + child;
}


window.addEventListener("DOMContentLoaded", async () => {
    try{
        const token = localStorage.getItem('token');
        data = await axios.get('http://localhost:3000/expense/getExpense', { headers: { 'Authorization': token }})
        for (let i=0; i < data.data.length; i++) {
            getExpenses(data.data[i])
        }
    } catch (err) {
        console.log(err)
    }
});