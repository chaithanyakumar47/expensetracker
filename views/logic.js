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
    console.log(userData);
    
    try {
        await axios.post('http://localhost:3000/user/signup',userData);

    } catch(err) {
        console.log(err);
    }

}