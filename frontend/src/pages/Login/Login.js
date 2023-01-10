import Layout from '../../components/Layout/Layout.js';
import LoginLink from '../../components/LoginLink/LoginLink.js';
import { useNavigate } from "react-router-dom";
import {Fragment, useEffect} from "react";



export default function MeetingCreation() {
    let navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem("@attendanceToken")){
            navigate("/");
        }
    }, []);

    return (
        <Fragment>
            <Layout>
                    <LoginLink/>
            </Layout>
        </Fragment>
    );
}