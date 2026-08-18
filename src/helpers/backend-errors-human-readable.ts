export const getErrorHumanReadableMessage = (error: any) => {

    let errorMessage: string = 'An Error Occurred';

    if (error.response && error.response.data && error.response.data.description) {
        errorMessage = error.response.data.description;
    } else if (error.response && error.response.status) {
        errorMessage = error.response.statusText;
    } else if(error.response === undefined) {
        if(error.message === "Network Error") {
            errorMessage = "Please Check Your Internet Connection";
        } else {
            errorMessage = error.message;
        }
    }

    return errorMessage;

}
