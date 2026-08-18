export default interface AccessTokenModel {
    sub: string;
    idleTimeRange: number; // Seconds
    refreshTimeRange: number; // Seconds
    tid: string;
    customProperties: {
        propertyName: string;
        propertyId: string;
        valueName: string;
        valueId: string;
    }[];
    permissions: {
        menuids: number[];
        components: {
            id: number,
            actions: number[];
            attributes: number[];
        }[]
    },
    ttype: string;
    name: string;
    exp: number;
    iat: number;
    email: string;
    userId:string;
}