import EntityDetail from "../common-models/EntityDetail.ts";

const formatCommonSectionResponse = (apiResponse: EntityDetail[]) : {
    formattedSections: string[];
    formattedResponse: {
        title: string;
        accountDetails: EntityDetail[];
    }[];
} => {

    const sections: string[] = [];

    apiResponse.forEach((singleItem) => {
        if (!sections.includes(singleItem.section)) {
            sections.push(singleItem.section);
        }
    });

    const accountDetailsFiltered: {
        title: string;
        accountDetails: EntityDetail[];
    }[] = [];

    sections.forEach((sectionName) => {
        const temp: EntityDetail[] = [];
        apiResponse.forEach((response) => {
            if (response.section === sectionName) {
                temp.push(response);
            }
        });
        accountDetailsFiltered.push({title: sectionName, accountDetails: temp});
    });

    return {
        formattedSections: sections,
        formattedResponse: accountDetailsFiltered
    }

}

export default formatCommonSectionResponse;