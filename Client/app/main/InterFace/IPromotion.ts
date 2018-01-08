import * as common from './ICommon';

export class IPromotionInfo {
    AdmissionNo: '';
    AdmissionYearSysID: 0;
    PromotionSysID: 0;
    AcademicYearSysID: 0;
    StudentSysID: 0;
    StudentName: '';
    ClassSysID: 0;
    SectionSysID: 0;
    isActive: false;
    isDeleted: false;
}


export class AcademicInfo {
    AcademicYearSysID: 0;
    ClassSysID: '';
    SectionSysID: '';
}

export class PromoteStudents {
    academicInfo = new AcademicInfo();
    prvYrStudentList: IPromotionInfo[];
    constructor() {
        this.prvYrStudentList = [];
    }
}


