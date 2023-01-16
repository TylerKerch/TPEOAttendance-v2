import React from 'react'
import {AppShell, Button, Header, Image, Text} from '@mantine/core';
import { IconArrowLeft } from "@tabler/icons";
import {useNavigate} from "react-router-dom";
import background from "./Background.svg";
import tpeoLogo from "./TPEO_Logo.png";
export default function Layout(props) {
    let navigate = useNavigate();

    function logout() {
        localStorage.removeItem("@attendanceToken");
        navigate("/login");
    }
    function getHeader() {
            return (
                <Header
                    height={(props.headerTitle?120:40)} style={{boxShadow: '0px 3.0px 4.0px hsl(0deg 0% 0% / 0.28)',
                        backgroundColor: 'rgba(255,255,255,0.92)',
                        }}>
                    <div style={{margin: '6px', display: "flex", flexDirection: "row", width: "100%", height: '25px'}}>
                        <img src={tpeoLogo} width="25px" height="25px"/>
                        <Text sx={{marginLeft: '10px', fontSize:(window.matchMedia("(max-width: 400px)").matches?'12px':'15px')}} fontStyle="roboto">Texas Product Engineering Organization</Text>
                    </div>
                    <div style={{marginLeft:(props.button ? '30px' : '10px'),
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    height: '50%',
                                    width: '100%'
                                }}
                    >
                        {props.back && <Button size='lg' variant='light' sx={{width: '60px',height: '60px',backgroundColor: '#f0f0f0', marginTop: '10px', marginRight: '10px', padding: '10px', borderRadius: '100px', color: 'black'}} onClick={()=>navigate("/")}>
                            <IconArrowLeft style={{width: '60px',height: '60px'}}/>
                        </Button>}
                        {props.headerTitle && <Text sx={{marginLeft:'10px',
                                                        marginRight: '10px',
                                                        color: 'white',
                                                        fontSize:(window.matchMedia("(max-width: 450px)").matches?'40px':'60px'),
                                                        textShadow: '2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black, 1px 1px black, -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black',
                                                        fontStyle: 'normal',
                                                        fontWeight: '500',
                                                        whiteSpace: 'nowrap'}}>
                                                            {props.headerTitle}
                                                </Text>}
                        {props.logout && <Button size='lg' variant='light' sx={{float: 'right', fontSize: '90%', marginTop: '10px', marginLeft: 'auto', marginRight: "80px", width: '80px',height: '50px',backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '100px', color: 'black'}} onClick={logout}>
                            Log Out
                        </Button>}
                    </div>
                </Header>
            )
    }

    return (
        <AppShell 
            header={getHeader()}
            styles={(theme) => ({
                main: {backgroundSize: "cover", backgroundRepeat: 'no-repeat', backgroundImage: `url(${background})`, backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            {props.children}
            
        </AppShell>
    )
}