interface CreateAttachmentRequestBody {
    id?: string;
    fileName: string;
    referenceId: string;
    description: string;
    content: string;
    createdBy: string;
    documentType:string;
    type?: string;
    requester:string;
}

export default CreateAttachmentRequestBody;