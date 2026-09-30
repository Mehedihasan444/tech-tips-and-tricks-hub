import React from 'react';

const PageTitle = ({title}:{title:string}) => {
    return (
        <h1 className='text-2xl mb-6  border-l-5 border-primary font-bold pl-5'>
            {title}
        </h1>
    );
};

export default PageTitle;