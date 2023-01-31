import Layout from 'components/Layout/Layout.js';
import {useForm} from '@mantine/form';
import { IconTrash } from "@tabler/icons";
import {Fragment, useEffect, useState} from "react";
import {Box, Button, Paper, Select, SimpleGrid, Table, ActionIcon, Text, TextInput, Title} from '@mantine/core';
import {DatePicker, TimeInput} from '@mantine/dates';
import {verifyCredentials} from 'utils/VerifyCredentials.js';
import { useNavigate } from 'react-router-dom';

export default function MeetingCreation() {
    let navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            if(await verifyCredentials(navigate, true)){
                await getMeetings();
                setLoaded(true);
            }
        }
        fetchData();
    }, []);

    const [meetings, setMeetings] = useState();
    const [loaded, setLoaded] = useState(false);
    const meeting = useForm({
        initialValues: {
          name: '',
          password: '',
        },
        validate: { 
            name: (value) => (!value? 'Required' : null),
            type: (value) => (!value? 'Required' : null),
            password: (value) => (!value? 'Required' : null),
            date: (value) => (!value? 'Required' : null),
            time: (value) => (!value? 'Required' : null),
            duration: (value) => (!value? 'Required' : null)
        }
    });

    async function submitMeeting() {

        if(meeting.validate().hasErrors){
            return;
        }
        const input = meeting.values;
        const startDate = new Date(input.date.getTime() + input.time.getHours()*60*60*1000 + input.time.getMinutes()*60*1000)
        const endDate = new Date(startDate.getTime() + input.duration.getHours()*60*60*1000 + input.duration.getMinutes()*60*1000)

        const res = await fetch("https://${process.env.REACT_APP_HOSTNAME}/meeting", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("@attendanceToken"),
            },
            body: JSON.stringify({name: input.name, start: startDate, end: endDate, type: input.type, password: input.password}),
        });
        getMeetings();
    }
    
    async function deleteMeeting(meetingName) {
        const res = await fetch("https://${process.env.REACT_APP_HOSTNAME}/delete_meeting", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("@attendanceToken"),
            },
            body: JSON.stringify({ meeting: meetingName }),
        });
        getMeetings();
    }
    async function getMeetings() {
        const meetings_list = await fetch("https://${process.env.REACT_APP_HOSTNAME}/meetings_list", {
            method: "GET",
            headers: {
                authorization: "Bearer " + localStorage.getItem("@attendanceToken"),
            },
        });
        const result = await meetings_list.json();
        const elements = result.data;
        elements.sort(function(a, b){return Date.parse(b.start) - Date.parse(a.start)});
        const rows = elements.map((element) => (
            <tr key={element.name}>
              <td>{element.name}</td>
              <td>{element.day}</td>
              <td>{element.fStart}</td>
              <td>{element.fEnd}</td>
              <td>{element.type}</td>
              <td style={{wordWrap: 'break-word'}}>{element.password}</td>
              <td> <ActionIcon
                        color="red"
                        title="Remove transaction"
                        onClick={() => deleteMeeting(element.id)}
                    >
                        <IconTrash />
                    </ActionIcon>
            </td>
            </tr>
          ));
        setMeetings(rows);
    };

    return (
        <Fragment>
            <Layout headerTitle="Meetings" back logout>
                {loaded && <SimpleGrid
                    cols={2}
                    spacing="lg"
                    breakpoints={[
                        { maxWidth: 1000, cols: 1, spacing: 'sm'}
                      ]}>
                    <Box
                        sx={(theme) => ({
                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                            textAlign: 'center',
                            padding: theme.spacing.xl,
                            borderRadius: theme.radius.md,
                            cursor: 'pointer',
                            width: '100%',
                            float: 'left',
                            padding: '20px',

                            '&:hover': {
                            backgroundColor:
                                theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                            },
                        })}
                    >
                        <Title>Create Meeting</Title>
                        <TextInput
                            placeholder="Your meeting name"
                            label="Meeting name"
                            required
                            {...meeting.getInputProps('name')}
                        />
                        <Select
                            label="Meeting Type"
                            placeholder="Pick one"
                            data={[
                                { value: 'General', label: 'General' },
                                { value: 'Engineering', label: 'Engineering' },
                                { value: 'Design', label: 'Design' },
                                { value: 'Product', label: 'Product' },
                            ]}
                            required
                            {...meeting.getInputProps('type')}
                        />
                        <TextInput
                            placeholder="Your meeting password"
                            label="Meeting password"
                            required
                            {...meeting.getInputProps('password')}
                        />
                        <DatePicker
                            placeholder="Pick date"
                            label="Meeting date"
                            required
                            {...meeting.getInputProps('date')}
                        />
                        <TimeInput 
                            label="Meeting time"
                            format="12"
                            required
                            {...meeting.getInputProps('time')}
                        />
                        <TimeInput
                            label="Meeting length"
                            description="hh:mm"
                            required
                            {...meeting.getInputProps('duration')}
                        />
                        <Button variant="light" sx={{marginTop:'10px', backgroundColor: '#c1c1c1', 
                            color: 'black',
                            '&:hover': 
                                { backgroundColor: '#3e3e3e', 
                                color: 'white' } }}
                            onClick={() => submitMeeting()}>Submit Meeting</Button>
                    </Box>

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
                        <Title>List Of TPEO Meetings</Title>
                            <Paper shadow="xs" padding="lg" style={{ overflowX: "auto", marginTop: "20px"}}>
                                <Table style={{ tableLayout: "fixed", minWidth: 500, textAlign: "left"}}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: 100 }}>Meeting Name</th>
                                            <th style={{ width: 100 }}>Day</th>
                                            <th style={{ width: 100 }}>Start Date</th>
                                            <th style={{ width: 100 }}>End Date</th>
                                            <th style={{ width: 100 }}>Type</th>
                                            <th style={{ width: 100 }}>Password</th>
                                            <th style={{ width: 100 }}/>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {meetings}
                                    </tbody>
                                </Table>
                            </Paper>

                    </Box>
                </SimpleGrid>}
            </Layout>
        </Fragment>
    );
}