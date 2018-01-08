import * as common from './ICommon';

export class IStopList {
    MappingSysID: string;
    FeeStructureSysID: number;
    CategoryMappingSysID: number;
    CategoryName: string;
    AcademicYearSysID: string;
    TermSysID: number;
    TermName: string;
    SectionSysID: number;
    ClassSysID: number;
    Amount: number;
}
export class IFeeData {
    AcademicYearSysId: string;
    TermSysID: string;
    ClassSysID: string;
    SectionSysID: string;
}

export class IApproveAcademicFeeData {
    AcademicYearSysId: string;
    TermSysID: string;
    ClassSysID: string;
    SectionSysID: string;
    AcademicFeeSysID: number;
}
