import {useForm} from '@mantine/form';
import { IconTrash } from "@tabler/icons";
import {Fragment, useEffect, useState} from "react";
import {Accordion, Box, Button, Container, Paper, SimpleGrid, Space, RingProgress, Select, Table, Text, Title, filterProps} from '@mantine/core';
import {DatePicker, TimeInput} from '@mantine/dates';
import { useNavigate } from 'react-router-dom';
const { default: jwtDecode } = require("jwt-decode");

export default function DropdownMember(props) {

  useEffect(() => {
      const fetchData = async () => {
          await getAttendance();
      }
      fetchData();
  }, []);

  const [attendance, setAttendance] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [admin, setAdmin] = useState(props.member.admin);

  async function changeAttendance(newValue, meeting) {
    const res = await fetch("http://localhost:5500/update_attendance", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("@attendanceToken"),
        },
        body: JSON.stringify({ member: props.member.id, id: meeting, status: newValue }),
    });
    getAttendance();
  }
  async function getAttendance() {
    const attendance_list = await fetch("http://localhost:5500/attendance_list", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("@attendanceToken"),
        },
        body: JSON.stringify({ id: props.member.id}),
    });
    const result = await attendance_list.json();
    const meetings = result.data;
    meetings.sort(function(a, b){return (new Date(b.day)).getTime() - (new Date(a.day)).getTime()});
            
    let roleCount = 0;
    let roleAttended = 0;
    let generalCount = 0;
    let generalAttended = 0;
    const rows = meetings.map((element) => {
        if(element.type == "General"){
            generalCount++;
            if(element.attendance !== "Absent")
                generalAttended++;
        }else{
            roleCount++;
            if(element.attendance !== "Absent")
                roleAttended++;
        }

        let color = 'black';
        let backgroundColor = 'black';
        if (element.attendance == "Present") {
            color = "#6EC47F";
            backgroundColor = "#CBE9D1";
        } else if (element.attendance == "Absent") {
            color = "#EF7357";
            backgroundColor = "#FDEAE5";
        } else if (element.attendance == "Excused") {
            color = "#64A9F7";
            backgroundColor = "#C5E0FF";
        } else {
            color = "#D39800";
            backgroundColor = "#FCEFCC";
        }

        return (<tr key={element.id}>
          <td>{element.name}</td>
          <td>{element.day}</td>
          <td>{element.type}</td>
          <td>
            <Select defaultValue={element.attendance} 
              styles={(theme) => ({
                input: {
                  color: color,
                  backgroundColor: backgroundColor
                },
                item: {
                  // applies styles to selected item
                  '&[data-selected]': {
                    '&, &:hover': {
                      backgroundColor:
                        backgroundColor,
                      color: color,
                    },
                  },
        
                  // applies styles to hovered item (with mouse or keyboard)
                  '&[data-hovered]': {},
                },
              })}
              data={['Present', 'Late', 'Absent', 'Excused']} 
              onChange={(newValue) => (changeAttendance(newValue, element.id))}
            />
          </td>
        </tr>);
    });
    setMetrics({roleCount: roleCount, roleAttended: roleAttended, generalCount: generalCount, generalAttended: generalAttended});
    setAttendance(rows);
  };

  async function changeAdmin(){
    await fetch(`http://localhost:5500/${props.member.admin?"revokeAdmin":"admin"}`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("@attendanceToken"),
      },
      body: JSON.stringify({id: props.member.id}),
    });
    setAdmin(!admin);
  }

    return (
      <Accordion variant="filled">
      <Accordion.Item value={props.member.id} style={{padding:0}}>
        <Accordion.Control>{props.member.name} | {props.member.type}</Accordion.Control>
        <Accordion.Panel style={{padding: '0px'}}>
        <SimpleGrid
              cols={2}
              spacing={0}
              breakpoints={[
                  { maxWidth: 600, cols: 1}
                ]}>
              <Container sx={{maxWidth: '300px', height: '100px', padding: '0px', margin: '5px', borderRadius: '100px', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <RingProgress
                      sections={[{ value: metrics.generalAttended/metrics.generalCount*100, color: 'blue' }]}
                      rootColor="#D9EAFF"
                      roundCaps
                      size={100}
                      label={
                      <Text color="blue" weight={700} align="center" size="md">
                          {metrics.generalAttended} / {metrics.generalCount}
                      </Text>
                      }
                  />
                  <Text color="blue" weight={700} align="center" size="xs">
                          General Meetings Attended
                      </Text>
              </Container>
              <Container sx={{maxWidth: '300px', height: '100px', padding: '0px', margin: '5px', borderRadius: '100px', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <RingProgress
                      sections={[{value: metrics.roleAttended/metrics.roleCount*100, color: '#C175FF'}]}
                      rootColor="#DFBCFB"
                      roundCaps
                      size={100}
                      label={
                      <Text color="purple" weight={700} align="center" size="md">
                          {metrics.roleAttended} / {metrics.roleCount}
                      </Text>
                      }
                  />
                  <Text color="purple" weight={700} align="center" size="xs">
                          {props.member.type} Meetings Attended
                      </Text>
              </Container>
          </SimpleGrid>
          <Paper shadow="xs" style={{ overflowX: "auto", margin: '-12px'}}>
              <Table style={{ tableLayout: "fixed", minWidth: 200, textAlign: "left"}}>
                  <thead>
                      <tr>
                          <th style={{ width: 50 }}>Meeting Name</th>
                          <th style={{ width: 50 }}>Day</th>
                          <th style={{ width: 50 }}>Meeting Type</th>
                          <th style={{ width: 70 }}>Attendance</th>
                      </tr>
                  </thead>
                  <tbody>
                      {attendance}
                  </tbody>
              </Table>
          </Paper>
          <Space h="lg"/>
          <Button onClick={changeAdmin} sx={{backgroundColor: '#c1c1c1', 
                            color: 'black',
                            '&:hover': 
                                { backgroundColor: '#3e3e3e', 
                                color: 'white' } }}>
                    {admin?"Remove Admin":"Make Admin"}
          </Button>
        </Accordion.Panel>
      </Accordion.Item>
      </Accordion>);
}