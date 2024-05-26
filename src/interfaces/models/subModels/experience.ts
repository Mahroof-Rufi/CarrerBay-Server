export interface Experience {
    _id?: string,
    jobTitle: string,
    companyName: string,
    jobType: string,
    startDate: Date,
    endDate?: Date,
    present: boolean,
    city?: string,
    state?: string,
    remort: boolean,
    overView: string,
    technologies: string[],
}