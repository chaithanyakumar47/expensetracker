

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
        console.log('before the alert')
        alert(`Welcome ${username}!, Please Login`);
        console.log('past the alert')


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
        const data = await axios.delete(`http://localhost:3000/expense/deleteExpense/${expenseId}`,{ headers: { 'Authorization': token }});
        console.log(data);
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
        const flag = await checkPremium()
        if (flag === true) {
            document.getElementById('rzp-button1').style.visibility = "hidden";
            const parent = document.getElementById('premium-section');
            parent.innerHTML+=`You are a premium User`;
            showLeaderboard()
        }
    } catch (err) {
        console.log(err)
    }
});

async function transactionFail(order_id, payment_id) {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.post('http://localhost:3000/purchase/failedTransaction', {
            order_id: order_id,
            payment_id: payment_id,
        }, { headers: { 'Authorization': token } })
    } catch (err) {
        console.log(err)
    }    
}

 async function premiumUser() {
    try {
        const token = localStorage.getItem('token');
        console.log(token)
        const data = await axios.get('http://localhost:3000/setPremium', { headers: {"Authorization" : token} });
        localStorage.setItem('token', data.data.token);
        document.getElementById('rzp-button1').style.visibility = "hidden";
        const parent = document.getElementById('premium-section');
        parent.innerHTML+=`You are a premium User`;
    }
     catch (err) {
        console.log(err)
     }
}

function showLeaderboard(){
    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.value = 'Show Leaderboard'
    inputElement.setAttribute('id','leaderboardButton');
    inputElement.onclick = async() => {
        const token = localStorage.getItem('token')
        const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: {"Authorization" : token} })
        console.log(userLeaderBoardArray)

        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML = "";
        leaderboardElem.innerHTML += '<h1> Leader Board </<h1>'
        // userLeaderBoardArray.data.forEach((userDetails) => {
        //     leaderboardElem.innerHTML += `<li>Name - ${userDetails.username} Total Expense - ${userDetails.totalExpenses} </li>`
        // })
        console.log(userLeaderBoardArray)
    }
    document.getElementById("message").appendChild(inputElement);

}

async function checkPremium()  {
    try {
        const token = localStorage.getItem('token');
        const data = await axios.get('http://localhost:3000/checkPremium', { headers: {"Authorization" : token} });
        console.log(data)
        if (data.data.success === true) {
            return true
        }
        else {
            return false
        }
        console.log(data)
    } catch (err) {
        console.log(err)
    }
}

document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "order_id": response.data.order.id,// For one time payment
     // This handler function will handle the success payment
     "handler": async function (response) {
        const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} })
        
        console.log(res)
         alert('You are a Premium User Now')
         
         premiumUser()
         showLeaderboard()
        },

    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
        transactionFail(response.error.metadata.order_id, response.error.metadata.payment_id)
        console.log(response.error.metadata)
        alert('Something went wrong')
        
    });
}
