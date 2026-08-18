interface CommonApiResponse<T> {
    result: {
        resultCode: string;
        resultDescription: string;
    }
    responseData: T
}

export default CommonApiResponse;