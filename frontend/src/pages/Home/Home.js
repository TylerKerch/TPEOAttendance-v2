import Layout from 'components/Layout/Layout.js';
import { Fragment, useEffect,useState} from "react";
import { Button, SimpleGrid, Space, Title} from '@mantine/core';
import { useNavigate } from "react-router-dom";
import {verifyCredentials} from 'utils/VerifyCredentials.js';

export default function Home() {
    let navigate = useNavigate();
    const [member, setMember] = useState();
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setMember(await verifyCredentials(navigate, true));
            setLoaded(true);
        }
        fetchData();
    }, []);

    async function changeMemberType(type) {
        console.log(member.id);
        const res = await fetch("http://${process.env.HOSTNAME}/member_type", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("@attendanceToken"),
            },
            body: JSON.stringify({member: member.id, type: type}),
        });
        setMember((await res.json()).data);
    }

    function HomeButton(props) {
        return <Button variant="light" 
                    sx={{ marginTop: '50px',
                            textAlign: 'left',
                            height: '100%', 
                            width: '100%', 
                            fontSize: '34px',
                            display: 'inline-flex',
                            alignItems: 'flex-begin', 
                            borderRadius: '27.23px', 
                            backgroundColor: '#f2f2f2', 
                            color: 'black',
                            paddingTop: '130px',
                            paddingLeft: '30px',
                            overflowWrap: 'break-word',
                            fontWeight: '100',
                            '&:hover': 
                                { backgroundColor: 'black', 
                                color: 'white' } }}
                    onClick={props.onClick}>
                    {props.title}
                </Button>
    }

    function renderContent() {
        if(!loaded)
            return null;
        if(member.type == "Member"){
            return (<div>
                    <Title>Please select your role:</Title>
                    <SimpleGrid
                        cols={3}
                        spacing="lg"
                        breakpoints={[
                            { maxWidth: 1300, cols: 1, spacing: 'sm' }
                        ]}>
                            <HomeButton title="Design" onClick={() => changeMemberType("Design")}/>
                            <HomeButton title="Product" onClick={() => changeMemberType("Product")}/>
                            <HomeButton title="Engineering" onClick={() => changeMemberType("Engineering")}/>
                            <Space h="lg"/>
                    </SimpleGrid>
                </div>);
        }else{
            return <SimpleGrid
                cols={2}
                spacing="lg"
                breakpoints={[
                    { maxWidth: 1300, cols: 1, spacing: 'sm' }
                ]}>
                <HomeButton title="Check In" onClick={() => navigate("/checkin")}/>
                <HomeButton title="Create Meeting" onClick={() => navigate("/meetings")} navigateTo="/meetings"/>
                {member.admin && <HomeButton title="Attendance History" onClick={() => navigate("/history")} />}
                {member.admin && <HomeButton title="Member Roster" onClick={() => navigate("/members")} />}
                <Space h="lg"/>
            </SimpleGrid>;
        }
    }
    return (
        <Fragment>
            <Layout headerTitle="Welcome" logout>
               {renderContent()}
            </Layout>
        </Fragment>
    );
}