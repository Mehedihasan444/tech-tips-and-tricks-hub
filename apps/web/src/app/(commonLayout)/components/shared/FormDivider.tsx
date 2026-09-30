import { Divider } from '@nextui-org/react';
import React from 'react';

const FormDivider = () => {
    return (
        <div className="my-4 flex flex-col items-center">
        <Divider className=" bg-primary/50" />
        <span className="text-center -mt-3 bg-default-50 px-5">OR</span>
      </div>
    );
};

export default FormDivider;