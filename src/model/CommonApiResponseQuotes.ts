interface CommonApiResponse<T> {
    result: {
        resultCode: string;
        resultDescription: string;
        pageDetail?: {
            pageNumber: string;
            pageElementCount: string;
            totalRecords: string;
        }
    }
    responseData: T
}

export default CommonApiResponse;
