import Layout from '../../components/Layout/Layout.js';
import LoginLink from '../../components/LoginLink/LoginLink.js';
import {useForm} from '@mantine/form';
import {Fragment, useEffect, useState} from "react";
import {Box, Button, Paper, Select, Table, Text, TextInput, Title} from '@mantine/core';
import {DatePicker, TimeInput} from '@mantine/dates';

export default function MeetingCreation() {

    useEffect(() => {
        if(localStorage.getItem("@token")){
            getMeetings();
            setLoggedIn(true);
        }
    }, []);

    const[meetings, setMeetings] = useState();
    const[loggedIn, setLoggedIn] = useState(false);
    
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

        }
    });

    async function getMeetings() {
        const meetings_list = await fetch("http://localhost:5500/meetings_list", {
            method: "GET",
            headers: {
                authorization: "Bearer " + localStorage.getItem("@token"),
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
              <td>{element.password}</td>
            </tr>
          ));
        setMeetings(rows);
    };

    return (
        <Fragment>
            <Layout headerTitle="Meetings">
                    <Box 
                        sx={(theme) => ({
                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                            textAlign: 'center',
                            padding: theme.spacing.xl,
                            borderRadius: theme.radius.md,
                            cursor: 'pointer',
                            width: '50%',
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
                            label="Meeting length"
                            description="hh:mm"
                            required
                            {...meeting.getInputProps('time')}
                        />
                        <Button variant="light" sx={{marginTop:'10px'}}onClick={() => meeting.validate()}>Submit Meeting</Button>
                    </Box>

                    <Box 
                        sx={(theme) => ({
                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                            textAlign: 'center',
                            padding: theme.spacing.xl,
                            borderRadius: theme.radius.md,
                            cursor: 'pointer',
                            width: '50%',
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
                        {loggedIn 
                            ? <Paper shadow="xs" padding="lg" style={{ overflowX: "auto", marginTop: "20px"}}>
                                <Table style={{ tableLayout: "fixed", minWidth: 500 }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: 100 }}>Meeting Name</th>
                                            <th style={{ width: 100 }}>Day</th>
                                            <th style={{ width: 100 }}>Start Date</th>
                                            <th style={{ width: 100 }}>End Date</th>
                                            <th style={{ width: 100 }}>Type</th>
                                            <th style={{ width: 100 }}>Password</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {meetings}
                                    </tbody>
                                </Table>
                                </Paper>
                            : <LoginLink/>
                        }

                    </Box>
               </Layout>
        </Fragment>
    );
}