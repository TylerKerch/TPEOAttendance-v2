const { default: jwtDecode } = require("jwt-decode");
const verifyCredentials = async (navigate, checkAdmin) => {
    if(localStorage.getItem("@attendanceToken")){
        console.log(process.env.REACT_APP_HOSTNAME)
        const request = await fetch(`http://localhost:5500/auth`, {
            headers: {
                authorization: "Bearer " + localStorage.getItem("@attendanceToken"),
            },
        });
        const status = await request.status;
        if (status !== 200) {
            navigate("/login");
            return -1;
        }
        const decode = jwtDecode(localStorage.getItem("@attendanceToken"));
        const member = await fetch(`http://${process.env.REACT_APP_HOSTNAME}/member`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("@attendanceToken"),
            },
            body: JSON.stringify({ member: decode }),
        });
        const result = (await member.json()).data;
        if(checkAdmin){
            if (!result.admin) {
                navigate("/");
            }
        }
        return result;
    }else{
        navigate("/login");
        return -1;
    }
}

export {verifyCredentials}


