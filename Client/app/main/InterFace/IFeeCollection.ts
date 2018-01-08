import * as common from './ICommon';

export class IFeeList {
    Fee = '';
    Amount = '';
}
export class ICollectionEntry {
    ClassSysID = '';
    SectionSysID = '';
    StudentSysID = '';
    AcademicYearSysID = '';
}
export class IAcademicInfo {
    TermSysID = '';
    TermName = '';
    CategorySysID = '';
    CategoryName = '';
    Total = 0;
    Paid = 0;
    Consession = 0;
    Balance = 0;
}

export class mlAcademicData {
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
}
export class mlAcademicFeeReceiptTrans {
    TranSysID = 0;
    ReceiptSysID = 0;
    AcaFeeStrucMapSysID = 0;
    Amount = 0;
    IsDeleted = false;
}
export class mlAcademicFeeReceiptMaster {
    ReceiptSysID = 0;
    ReceiptNo = '';
    ReceiptDate = '';
    StudentSysID = 0;
    AcademicYearSysID = 0;
    BranchSysID = 0;
    IsCancelled = false;
    CancelledBy = '';
    CancelledDate = '';
    IsDeleted = false;
    CancelledReason = '';
}
export class AcademicData {
    AcademicFeeReceiptMaster = new mlAcademicFeeReceiptMaster();
    AcademicFeeReceiptTrans: mlAcademicFeeReceiptTrans[] = [];
    TransactionPaymodeMaster = new common.ITransactionPaymode();
}
export class mlTermWiseAmountList {
    TrasnsportStudentMappingSysID = 0;
    StudentSysID = 0;
    RouteName = '';
    StopName = '';
    VehicleNo = '';
    TripName = '';
    TermName = '';
    FromMonth = '';
    ToMonth = '';
    FeeSysID = '';
    FeeName = '';
    CategorySysID = 0;
    CategoryName = '';
    TotalAmount = 0;
    PaidAmount = 0;
    BalAmount = 0;
    ReceivableAmount = 0;
    PrevConcession = 0;
    Concession = 0;
}
export class mlTransportFeeReceiptMaster {
    ReceiptSysID = 0;
    ReceiptNo = '';
    ReceiptDate = '';
    StudentSysID = 0;
    AcademicYearSysID = 0;
    MappingSysID = 0;
    Amount = 0;
    BranchSysID = 0;
    IsCancelled = false;
    CancelledBy = '';
    CancelledDate = '';
    CancelledReason = '';
}
export class TransportData {
    master = new mlTransportFeeReceiptMaster();
    trans: mlTermWiseAmountList[] = [];
    paymode = new common.ITransactionPaymode();
}

export class TransportFeeConcession {
    master: mlTransportFeesConcessionMaster;
    trans: mlTermWiseAmountList[];
}

export class mlTransportFeesConcessionMaster {
    ConcessionSysID = 0;
    ConcessionNo = '';
    ConcessionDate = '';
    StudentSysID = 0;
    AcademicYearSysID = 0;
    IsApproved = false;
    ApproveDate = '';
    ApproveBy = '';
    IsCancelled = false;
    CancelledDate = '';
    CancelledBy = '';
    CancelledReason = '';

}