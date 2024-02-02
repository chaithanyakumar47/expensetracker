


async function addExpense(event) {
    event.preventDefault();
    const date = new Date()
    const description = event.target.description.value;
    const amount = event.target.amount.value;
    const category = event.target.category.value;
    const income = event.target.income.value;
    
    const expenseData = {
        date,
        description,
        amount,
        category,
        income
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
        console.log(data)
        const parent = document.getElementById('expenses');
        const child = document.getElementById(expenseId);
        parent.removeChild(child);
        console.log("Deleted");

        } catch (err) {
            console.log(err);
        }
    }


function getExpenses(expense) {
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const d = new Date();
    let name = month[d.getMonth()];
    const parent = document.getElementById('expenses');
    parent.innerHTML = ''
    for( let i = 0; i < expense.length; i++){

        const test = new Date(expense[i].date)
        const onlyDate = new Date(expense[i].date).toISOString().split('T')[0];
        console.log(month[test.getMonth()])
        
        if (expense[i].amount > 0) {
            const child = `<li id = '${expense[i].id}'> ${onlyDate} - ${expense[i].description} - ${expense[i].amount} - ${expense[i].category}   <button onclick = deleteExpense(${expense[i].id})>Delete</button></li>`;
            // parent.innerHTML = parent.innerHTML + child;
            parent.innerHTML+=child
        } else {
            const child = `<li id = '${expense[i].id}'>${onlyDate} Income - ${expense[i].income}<button onclick = deleteExpense(${expense[i].id})>Delete</button></li>`;
            // parent.innerHTML = parent.innerHTML + child;
            parent.innerHTML+=child
        }
    }
        
}
function showPagination(pageData) {
    
    currentPage = pageData.currentPage
    hasNexPage = pageData.hasNexPage
    nextPage = pageData.nextPage
    hasPreviousPage = pageData.hasPreviousPage
    previousPage = pageData.previousPage
    lastPage = pageData.lastPage
    

    const pagination = document.getElementById('container');
    pagination.innerHTML = ''
    if (hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.innerHTML = previousPage
        btn2.addEventListener('click', () => limitedExpenses(previousPage))
        pagination.appendChild(btn2)
    }
        const btn1 = document.createElement('button');
        btn1.innerHTML = `<h3>${currentPage}</h3>`
        btn1.addEventListener('click', () => limitedExpenses(currentPage))
        pagination.appendChild(btn1)

    if (hasNexPage) {
        const btn3 = document.createElement('button')
        btn3.innerHTML = nextPage
        btn3.addEventListener('click', () => limitedExpenses(nextPage))
        pagination.appendChild(btn3)
    }

    
}

function limitedExpenses(page) {

    const token = localStorage.getItem('token');
    axios
    .get(`http://localhost:3000/expense/getExpense?page=${page}`,  { headers: { 'Authorization': token }})
    .then((res) => {
    
        getExpenses(res.data.expenses);
        showPagination(res.data)
        
    })
    .catch()

}

async function getDownloads() {
    try {
        const token = localStorage.getItem('token')
        const parent = document.getElementById('downloads');
        const data = await axios.get('http://localhost:3000/expense/getDownloads', { headers: { 'Authorization': token }});
        parent.innerHTML = ''
        for (let i = 0; i < data.data.length; i++) {
            const child = `<li>${data.data[i].name} - <a href="${data.data[i].url}">Download</a>`
            parent.innerHTML+= child;
        }
    } catch (err) {
        console.log(err)
    }

    
}


window.addEventListener("DOMContentLoaded", async () => {
    try{
        const objUrlParams = new URLSearchParams(window.location.search);
        const page = objUrlParams.get("page") || 1;
        const token = localStorage.getItem('token');
        data = await axios.get(`http://localhost:3000/expense/getExpense?page=${page}`, { headers: { 'Authorization': token }})
        console.log('data >>',data)
        
       
        getExpenses(data.data.expenses)
        
        console.log('data.data >>', data.data)
        showPagination(data.data)
        
        const flag = await checkPremium()
        if (flag === true) {
            document.getElementById('rzp-button1').style.visibility = "hidden";
            const parent = document.getElementById('premium-section');
            parent.innerHTML+=`You are a premium User`;
            showLeaderboard()
        }
        getDownloads()
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
        const data = await axios.get('http://localhost:3000/premium/setPremium', { headers: {"Authorization" : token} });
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
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderboardElem.innerHTML += `<li>Name - ${userDetails.username} Total Expense - ${userDetails.totalExpenses || 0} </li>`
        })
    }
    document.getElementById("message").appendChild(inputElement);

}

async function checkPremium()  {
    try {
        const token = localStorage.getItem('token');
        const data = await axios.get('http://localhost:3000/premium/checkPremium', { headers: {"Authorization" : token} });
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

async function download() {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:3000/expense/download',  { headers: {"Authorization" : token} })
        console.log(response)

        if(response.status == 200) {
        var a = document.createElement('a');
        a.href = response.data.fileUrl;
        a.download = 'myexpense.csv';
        a.click()


        
    } else {
        throw new Error(response.data.message);
    }
} catch (err) {
    console.log(err)
}

}
