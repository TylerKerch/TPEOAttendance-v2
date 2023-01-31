import Layout from 'components/Layout/Layout.js';
import {useForm} from '@mantine/form';
import { IconTrash } from "@tabler/icons";
import {Fragment, useEffect, useState} from "react";
import {Box, Button, Container, Paper, RingProgress, Select, SimpleGrid, Table, ActionIcon, Text, TextInput, Title} from '@mantine/core';
import {DatePicker, TimeInput} from '@mantine/dates';
import {verifyCredentials} from 'utils/VerifyCredentials.js';
import { useNavigate } from 'react-router-dom';
const { default: jwtDecode } = require("jwt-decode");

export default function AttendanceHistory() {
    let navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            if(await verifyCredentials(navigate)){
                await getAttendance();
                setLoaded(true);
            }
        }
        fetchData();
    }, []);

    const [attendance, setAttendance] = useState();
    const [loaded, setLoaded] = useState(false);
    const [metrics, setMetrics] = useState({});
    const [role, setRole] = useState();

    async function getAttendance() {
        const attendance_list = await fetch("http://${process.env.HOSTNAME}/attendance_list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("@attendanceToken"),
            },
            body: JSON.stringify({ id: jwtDecode(localStorage.getItem("@attendanceToken")).user_id }),
        });
        const result = await attendance_list.json();
        const elements = result.data;
        elements.sort(function(a, b){return (new Date(b.day)).getTime() - (new Date(a.day)).getTime()});
        let roleCount = 0;
        let roleAttended = 0;
        let generalCount = 0;
        let generalAttended = 0;
        const rows = elements.map((element) => {
            if(element.type == "General"){
                generalCount++;
                if(element.attendance !== "Absent")
                    generalAttended++;
            }else if(element.type == result.type){
                roleCount++;
                if(element.attendance !== "Absent")
                    roleAttended++;
            }
            return (<tr key={element.name}>
              <td>{element.name}</td>
              <td>{element.day}</td>
              <td>{element.type}</td>
              <td>{element.attendance}</td>
            </tr>);
        });
        setRole(result.type);
        setMetrics({roleCount: roleCount, roleAttended: roleAttended, generalCount: generalCount, generalAttended: generalAttended});
        setAttendance(rows);
    };

    return (
        <Fragment>
            <Layout headerTitle="History" back logout>
                {loaded && <div>
                    <SimpleGrid
                        cols={2}
                        spacing={0}
                        breakpoints={[
                            { maxWidth: 800, cols: 1}
                          ]}>
                        <Container sx={{maxWidth: '400px', padding: '10px', margin: '10px', borderRadius: '100px', backgroundColor: '#E4F1FF', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <RingProgress
                                sections={[{ value: metrics.generalAttended/metrics.generalCount*100, color: 'blue' }]}
                                rootColor="#D9EAFF"
                                roundCaps
                                label={
                                <Text color="blue" weight={700} align="center" size="md">
                                    {metrics.generalAttended} / {metrics.generalCount}
                                </Text>
                                }
                            />
                            <Text color="blue" weight={700} align="center" size="xl">
                                    General Meetings Attended
                                </Text>
                        </Container>
                        <Container sx={{maxWidth: '400px', padding: '10px', margin: '10px', borderRadius: '100px', backgroundColor: '#EEDAFF', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <RingProgress
                                sections={[{value: metrics.roleAttended/metrics.roleCount*100, color: '#C175FF'}]}
                                rootColor="#DFBCFB"
                                roundCaps
                                label={
                                <Text color="purple" weight={700} align="center" size="md">
                                    {metrics.roleAttended} / {metrics.roleCount}
                                </Text>
                                }
                            />
                            <Text color="purple" weight={700} align="center" size="xl">
                                    {role} Meetings Attended
                                </Text>
                        </Container>
                    </SimpleGrid>
                    <Box
                        sx={(theme) => ({
                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                            textAlign: 'center',
                            padding: theme.spacing.xl,
                            borderRadius: theme.radius.md,
                            cursor: 'pointer',
                            width: '100%',
                            float: 'right',
                            padding: '20px',

                            '&:hover': {
                            backgroundColor:
                                theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                            },
                        })}
                    >
                        {/*https://codesandbox.io/s/5qwru?file=/src/TransactionsTable.js*/}
                            <Paper shadow="xs" padding="lg" style={{ overflowX: "auto", marginTop: "20px"}}>
                                <Table style={{ tableLayout: "fixed", minWidth: 500, textAlign: "left"}}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: 100 }}>Meeting Name</th>
                                            <th style={{ width: 100 }}>Day</th>
                                            <th style={{ width: 100 }}>Meeting Type</th>
                                            <th style={{ width: 100 }}>Attendance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendance}
                                    </tbody>
                                </Table>
                            </Paper>

                    </Box></div>}
            </Layout>
        </Fragment>
    );
}