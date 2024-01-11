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
        window.alert(`${data.data.message}`);


    } catch(err) {
        console.log(err);


    }
}