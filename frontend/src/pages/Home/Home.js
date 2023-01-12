import Layout from '../../components/Layout/Layout.js';
import { Fragment, useEffect} from "react";
import { Button, SimpleGrid} from '@mantine/core';
import { useNavigate } from "react-router-dom";
import {verifyCredentials} from '../../Utils/VerifyCredentials.js';

export default function Home() {
    let navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            await verifyCredentials(navigate);
        }
        fetchData();
    }, []);

    function HomeButton(props) {
        return <Button variant="light" 
                    sx={{ margin: '10px',
                            marginTop: '50px',
                            textAlign: 'left',
                            height: '100%', 
                            width: '100%', 
                            fontSize: '38px',
                            display: 'inline-flex',
                            alignItems: 'flex-begin', 
                            borderRadius: '27.23px', 
                            backgroundColor: '#f2f2f2', 
                            color: 'black',
                            paddingTop: '130px',
                            paddingLeft: '30px',
                            fontWeight: '100',
                            '&:hover': 
                                { backgroundColor: 'black', 
                                color: 'white' } }}
                    onClick={() => navigate(props.navigateTo)}>
                    {props.title}
                </Button>
    }

    return (
        <Fragment>
            <Layout headerTitle="Welcome" logout>
                <SimpleGrid
                    cols={2}
                    spacing="lg"
                    breakpoints={[
                        { maxWidth: 1300, cols: 1, spacing: 'sm' }
                    ]}>
                    <HomeButton title="Check In" navigateTo="/checkin"/>
                    <HomeButton title="Create Meeting" navigateTo="/meetings"/>
                    <HomeButton title="Attendance History" navigateTo="/history"/>
                    <HomeButton title="Create Meeting" navigateTo="/meetings"/>
                </SimpleGrid>
            </Layout>
        </Fragment>
    );
}