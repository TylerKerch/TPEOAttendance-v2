import Layout from 'components/Layout/Layout.js';
import { useForm } from '@mantine/form';
import { Fragment, useEffect, useState } from "react";
import { Box, Button, Center, Input, Image, Paper, Select, SimpleGrid, Space, StylesApiProvider, Table, Text, TextInput, Title } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { useNavigate } from 'react-router-dom';
import { verifyCredentials } from 'utils/VerifyCredentials.js';
import smiley from "./Smiley.svg";
const { default: jwtDecode } = require("jwt-decode");

export default function Checkin() {
  let navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      if (await verifyCredentials(navigate)) {
        await getRunningMeetings();
        setLoaded(true);
      }
    }
    fetchData();
  }, []);

  const [loaded, setLoaded] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [member, setMember] = useState({});
  const [password, setPassword] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState({});
  const [runningMeetings, setRunningMeetings] = useState({});
  const [date, setDate] = useState(Math.round(Date.now() / 1000));
  
  async function getRunningMeetings() {
    const decode = jwtDecode(localStorage.getItem("@attendanceToken"));
    const res = await fetch(`https://${process.env.REACT_APP_HOSTNAME}/member`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("@attendanceToken"),
      },
      body: JSON.stringify({ member: decode }),
    });
    const resJSON = await res.json();
    setMember(resJSON.data);
    const running_meetings = await fetch(`https://${process.env.REACT_APP_HOSTNAME}/running_meetings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("@attendanceToken"),
      },
      body: JSON.stringify({ date: Math.round(Date.now() / 1000) }),
    });
    const result = await running_meetings.json();
    setRunningMeetings(result.data);
  };

  async function verifyPassword() {
    setDate(Date.now());
    const decode = jwtDecode(localStorage.getItem("@attendanceToken"));
    const res = await fetch(`https://${process.env.REACT_APP_HOSTNAME}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("@attendanceToken"),
      },
      body: JSON.stringify({ member: decode, password: password, date: date, id: selectedMeeting.id }),
    });
    const result = await res.json();
    if(result.correctPassword){
      setLoggedIn(true);
    }
  }

  function dateFormat() {
    let formatter = Intl.DateTimeFormat(
      "default", // a locale name; "default" chooses automatically
      {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      }
    );
  
  
    return formatter.format(date);
  }

  function CheckinButton(props) {
    if ((member.type == props.type || props.type == "General") && runningMeetings.hasOwnProperty(props.type) && !member.hasOwnProperty(runningMeetings[props.type].id)) {
      return <Button variant="light"
        sx={{
          margin: '10px',
          borderStyle: 'solid',
          borderWidth: '6px',
          borderColor: 'black',
          marginTop: '50px',
          textAlign: 'left',
          height: '100%',
          width: '100%',
          fontSize: '34px',
          display: 'inline-flex',
          overflowWrap: 'break-word',
          alignItems: 'flex-begin',
          borderRadius: '27.23px',
          backgroundColor: '#f2f2f2',
          color: 'black',
          paddingTop: '130px',
          paddingLeft: '30px',
          fontWeight: '100',
          '&:hover':
          {
            backgroundColor: 'black',
            color: 'white'
          }
        }}
        onClick={() => {
          setCheckingIn(true);
          setSelectedMeeting(runningMeetings[props.type])
        }}>
        {props.type} Meeting
      </Button>
    } else {
      return <Button variant="light"
        sx={{
          marginTop: '50px',
          textAlign: 'left',
          height: '100%',
          width: '100%',
          fontSize: '34px',
          display: 'inline-flex',
          alignItems: 'flex-begin',
          borderRadius: '27.23px',
          backgroundColor: '#f2f2f2',
          color: 'lightgrey',
          overflowWrap: 'break-word',
          paddingTop: '130px',
          paddingLeft: '30px',
          fontWeight: '100',
          cursor: 'default'
        }}>
        {props.type} Meeting
      </Button>
    }
  }

  return (
    <Fragment>
      <Layout headerTitle="Check In" back logout>
        {loaded && 
          (checkingIn ?
              (loggedIn ? <div style={{textAlign: "center", left: '50%', top: '30%', position: 'absolute', transform: 'translate(-50%, -30%)'}}>
                      <img src={smiley}/>
                      <Title align="center">You're all Set!</Title>
                      <Text align="center">{member.name} has been checked in to {selectedMeeting.name} at {dateFormat()}</Text>
                </div>
              :
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
                    <Title>{selectedMeeting.name}</Title>
                    <Text>Enter your passcode in the box below. This is a specialized key generated only for this meeting.</Text>
                    <TextInput
                        sx={{'input': {textAlign: 'center'}}}
                        label="Password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.currentTarget.value)}
                    />
                    <Button variant="light" sx={{marginTop:'10px', backgroundColor: '#c1c1c1', 
                            color: 'black',
                            '&:hover': 
                                { backgroundColor: '#3e3e3e', 
                                color: 'white' }}}
                        onClick={() => verifyPassword()}>Check In</Button>
                </Box>)
            :
            <SimpleGrid
              cols={2}
              spacing="lg"
              breakpoints={[
                { maxWidth: 1000, cols: 1, spacing: 'sm' }
              ]}>
              <CheckinButton type="General" />
              <CheckinButton type="Product" />
              <CheckinButton type="Design" />
              <CheckinButton type="Engineering" />
              <Space h="lg"/>
            </SimpleGrid>)}
      </Layout>
    </Fragment>
  );
}