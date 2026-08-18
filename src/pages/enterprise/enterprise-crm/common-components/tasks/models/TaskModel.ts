export interface TaskModel {
    id?: string;
    subject: string;
    description: string;
	status: string;
    createdDateTime?: string;
    dueDateTime: string;
	priority: string;
    ownerId?: string;
    referenceId?: string;
    type?: string;
}