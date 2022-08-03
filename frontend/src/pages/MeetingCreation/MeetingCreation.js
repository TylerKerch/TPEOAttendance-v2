import "./meetingcreation.css";

import dayjs from "dayjs";
import { useForm } from '@mantine/form';
import {Fragment, useReducer, useState} from "react";
import {Button, Select, TextInput, Title} from '@mantine/core';
import {DatePicker, TimeInput} from '@mantine/dates';

export default function MeetingCreation() {

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

    return (
        <Fragment>
            <div className="float-container">
                    <div className="meeting-float-child">
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
                        <Button variant="light" onClick={() => meeting.validate()}>Submit Meeting</Button>
                </div>
            </div>
        </Fragment>
    );
}