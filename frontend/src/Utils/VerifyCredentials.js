const verifyCredentials = async (navigate) => {
    if(localStorage.getItem("@attendanceToken")){
        const request = await fetch("http://localhost:5500/auth", {
            headers: {
                authorization: "Bearer " + localStorage.getItem("@attendanceToken"),
            },
        });
        // Get Status
        const status = await request.status;
        // If token is invalid, push to login
        if (status !== 200) {
            navigate("/login");
            return 0;
        }
        return 1;
    }else{
        navigate("/login");
        return 0;
    }
}

export {verifyCredentials}


