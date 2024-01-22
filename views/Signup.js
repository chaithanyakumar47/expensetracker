

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


