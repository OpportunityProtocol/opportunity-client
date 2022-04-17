function createMyContractsData(title: string, description: string, metadataLink: string, assignedTo: string, deadline: Date, status: string) {
    return { title, description, metadataLink, assignedTo, deadline, status };
}

function createMyJobsData(title: string, description: string, metadataLink: string, employer: string, deadline: Date, status: string) {
    return { title, description, metadataLink, employer, deadline, status }
}

export { createMyContractsData, createMyJobsData }