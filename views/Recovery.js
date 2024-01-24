async function resetPassword(event) {
    event.preventDefault()
    const email = event.target.email.value
    const password = event.target.password.value;
    const userData = {
        email,
        password
    }
    try {
        const token = localStorage.getItem('token')
        const data = await axios.post('http://localhost:3000/password/newpassword', userData, { headers: { 'Authorization': token }})
        console.log(data)

    } catch (err) {
        console.log(err)
    }
}

