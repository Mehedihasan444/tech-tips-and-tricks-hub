"use client";
import { Input } from '@nextui-org/react';
import React from 'react';

const FormInput = ({type,label}:{type:string,label:string}) => {
    return (
        <>
            <Input  isRequired    className="max-w-lg" type={type} label={label} />
        </>
    );
};

export default FormInput;