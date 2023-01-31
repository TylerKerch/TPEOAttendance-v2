import Layout from 'components/Layout/Layout.js';
import LoginLink from 'components/LoginLink/LoginLink.js';
import { useNavigate } from "react-router-dom";
import {Fragment, useEffect} from "react";



export default function Login() {
    let navigate = useNavigate();
    useEffect(() => {
        const checkLoggedIn = async () => {
            if(localStorage.getItem("@attendanceToken")){
                const request = await fetch(`https://${process.env.REACT_APP_HOSTNAME}/auth`, {
                    headers: {
                        authorization: "Bearer " + localStorage.getItem("@attendanceToken"),
                    },
                });
                // Get Status
                const status = await request.status;
                // If token is invalid, push to login
                if (status == 200) {
                    navigate("/");
                }
            }
        }
        checkLoggedIn();
    }, []);

    return (
        <Fragment>
            <Layout>
                    <LoginLink/>
            </Layout>
        </Fragment>
    );
}