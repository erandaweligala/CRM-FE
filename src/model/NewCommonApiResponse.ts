interface NewCommonApiResponse<T> {
    code: string;
    message: string;
    description: string;
    traceId: string;
    timestamp: string;
    pageDetail?: {
        pageNumber: string,
        pageElementCount: string,
        totalRecords: string,
    };
    data: T
}

export default NewCommonApiResponse;