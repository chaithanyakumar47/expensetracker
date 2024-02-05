

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
        const data = await axios.post('http://15.207.107.209:3000/user/login',userData);
        if(data.data.status === true){
            const a = document.getElementById('expense');
            a.setAttribute('href','expense.html');
            localStorage.setItem('token', data.data.token);
            window.location.href = "../Expense/expense.html";
            a.textContent = 'Add/Check Expenses'
            
        }


    } catch(err) {
        console.log(err);


    }
}

