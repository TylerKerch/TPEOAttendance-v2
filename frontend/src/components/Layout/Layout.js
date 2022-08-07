import React from 'react'
import {AppShell, Button, Header, Text} from '@mantine/core';
import { IconArrowLeft } from "@tabler/icons";

export default function Layout(props) {
    function getHeader() {
            return (
                <Header
                    height={100} style={{boxShadow: '0px 3.0px 4.0px hsl(0deg 0% 0% / 0.28)'}}>
                    <div style={{marginLeft:'30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    height: '100%',
                                    width: 'fit-content'}}
                    >
                        <Button size='lg'>
                            <IconArrowLeft />
                        </Button>
                        {props.headerTitle && <Text sx={{marginLeft:'30px', fontSize:'40px'}}>{props.headerTitle}</Text>}
                    </div>
                </Header>
            )
    }

    return (
        <AppShell 
            header={getHeader()}
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            {props.children}
        </AppShell>
    )
}