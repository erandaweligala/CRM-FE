interface DealsKanbanViewResponseModel {
    stage: string;
    totalAmount: string;
    percentage: string;
    count: string;
    dealList: {
        id: string;
        name: string;
        accountName: string;
        contactName: string;
        ownerId: string;
        amount: string;
        closingDate: string;
    }[]
}

export default DealsKanbanViewResponseModel;