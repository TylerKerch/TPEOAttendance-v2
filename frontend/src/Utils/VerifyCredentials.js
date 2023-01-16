const verifyCredentials = async (navigate) => {
    if(localStorage.getItem("@attendanceToken")){
        const request = await fetch("http://localhost:5500/auth", {
            headers: {
                authorization: "Bearer " + localStorage.getItem("@attendanceToken"),
            },
        });
        const status = await request.status;
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


