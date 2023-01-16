import Layout from '../../components/Layout/Layout.js';
import LoginLink from '../../components/LoginLink/LoginLink.js';
import { useNavigate } from "react-router-dom";
import {Fragment, useEffect} from "react";



export default function MeetingCreation() {
    let navigate = useNavigate();
    useEffect(() => {
        const checkLoggedIn = async () => {
            if(localStorage.getItem("@attendanceToken")){
                const request = await fetch("http://localhost:5500/auth", {
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