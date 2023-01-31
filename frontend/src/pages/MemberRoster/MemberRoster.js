import Layout from 'components/Layout/Layout.js';
import {useForm} from '@mantine/form';
import { IconTrash } from "@tabler/icons";
import {Fragment, useEffect, useState} from "react";
import {Box, Button, Paper, Select, SimpleGrid, Table, ActionIcon, Text, TextInput, Title} from '@mantine/core';
import {DatePicker, TimeInput} from '@mantine/dates';
import {verifyCredentials} from 'utils/VerifyCredentials.js';
import { useNavigate } from 'react-router-dom';
import DropdownMember from 'utils/DropdownMember.js';

export default function MemberRoster() {
    let navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            if(await verifyCredentials(navigate, true)){
                getDropdowns();
                setLoaded(true);
            }
        }
        fetchData();
    }, []);

    const [loaded, setLoaded] = useState(false);
    const [dropdowns, setDropdowns] = useState();

    async function getDropdowns() {
        const members_list = await fetch("http://${process.env.REACT_APP_HOSTNAME}/members_list", {
            method: "GET",
            headers: {
                authorization: "Bearer " + localStorage.getItem("@attendanceToken"),
            },
        });
        const members_list_result = (await members_list.json()).data;
        const memberDropdowns = members_list_result.map((member) => (
            <DropdownMember key={member.id} member={member}/>
        ));

        setDropdowns(memberDropdowns);
    }

    return (
        <Fragment>
            <Layout headerTitle="Members" back logout>
                {loaded && 
                    <Box
                        sx={(theme) => ({
                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                            textAlign: 'center',
                            borderRadius: theme.radius.md,
                            cursor: 'pointer',
                            width: '100%',
                            float: 'left',
                            padding: '10px',

                            '&:hover': {
                            backgroundColor:
                                theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                            },
                        })}
                    >
                        <SimpleGrid
                            cols={3}
                            spacing={0}
                            breakpoints={[
                                { maxWidth: 800, cols: 1},
                                { maxWidth: 1250, cols: 2}
                            ]}>
                           {dropdowns}
                        </SimpleGrid>
                    </Box>}
            </Layout>
        </Fragment>
    );
}