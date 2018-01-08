import * as common from './ICommon';

export class IAttendanceupload {
  Date: string;
  MeridiemSysID: string;
  MeridiemName: string;
  Choosefile: string;
}

export class IAttendance {
  StudentSysID: string;
  StudentName: string;
  ClassName: string;
  SectionName: string;
  AdmissionNo: string;
  AcademicYearSysID: string;
  constructor() {

  }
}
