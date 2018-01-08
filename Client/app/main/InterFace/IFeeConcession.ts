import * as common from './ICommon';

export class mlAcademicConcessionData {
    AcademicYearID = '';
    Balance = 0;
    Receivable = 0;
    FeeSysID = 0;
    FeeName = '';
    AccountName = '';
    AcademicYearSysID = 0;
    TermSysID = 0;
    TermName = '';
    FeeCategorySysID = 0;
    FeeCategoryName = '';
    StudentSysID = 0;
    AcaFeeStrucMapSysID = 0;
    TotalAmount = 0;
    PaidAmount = 0;
    ConcessionAmount = 0;
    PrevConcession = 0;
}
export class mlFeeConcessionTrans {
    ConcessionTransSysID: number;
    ConcessionSysID: number;
    AcaFeeStrucMapSysID: number;
    Amount: number;
}
export class mlFeeConcessionMaster {
    ConcessionSysID: number;
    ConcessionNo: string;
    ConcessionDate: string;
    StudentSysID: number;
    AcademicYearSysID: number;
    IsApproved: boolean;
    IsCancelled: boolean;
    CancelledBy: string;
    CancelledDate: string;
}
export class AcademicConcessionData {
    AcademicFeeConcessionMaster = new mlFeeConcessionMaster();
    AcademicFeeConcessionTrans: mlFeeConcessionTrans[] = [];
}
