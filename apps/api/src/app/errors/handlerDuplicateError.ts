
 type TErrorSources = {
    path: string | number;
    message: string;
  }[];
  
 type TGenericErrorResponse = {
    statusCode: number;
    message: string;
    errorSources: TErrorSources;
  };

  const handleDuplicateError = (err: any): TGenericErrorResponse => {
    // Extract value within double quotes using regex
    const match = err.message.match(/"([^"]*)"/);
  
    // The extracted value will be in the first capturing group
    const extractedMessage = match && match[1];
  
    const errorSources: TErrorSources = [
      {
        path: '',
        message: `${extractedMessage} is already exists`,
      },
    ];
  
    const statusCode = 400;
  
    return {
      statusCode,
      message: 'Invalid ID',
      errorSources,
    };
  };
  
  export default handleDuplicateError;