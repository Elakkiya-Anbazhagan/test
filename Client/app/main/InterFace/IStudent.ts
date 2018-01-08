import * as common from './ICommon';
export class IStudentDetails {
    Personal: IPersonalInfo;
    Address: IAddressInfo[];
    Document: IDocumentInfo[];
    Family: IFamilyInfo[];
    Education: IEducationInfo[];
    Admission: AdmissionInfo[];
    constructor() {
        this.Personal = new IPersonalInfo();
        this.Address = [];
        this.Document = [];
        this.Family = [];
        this.Education = [];
        this.Admission = [];
    }
}
export class IPersonalInfo {
    StudentSysID = 0;
    AcademicYearSysID = 0;
    StudentName = '';
    AdmissionNo = '';
    ClassSysID = '';
    SectionSysID = 0;
    Gender = '';
    DOB = '';
    PlaceOfBirth = '';
    LanguageAtHome = '';
    NationalitySysID = '';
    CommunitySysID = '';
    ReligionSysID = '';
    CasteSysID = '';
    MotherTongueSysID = '';
    BloodGroup = '';
    LedgerSysID = '';
    BranchSysID = 0;
    Lock: common.ILock;
    IsDeleted = false;
    IsAdmissionConfirmed = false;
    IsAdmissionCancelled = false;
    AdmissionCancelledReason = '';
    AdmissionCancelledBy = '';
    AdmissionCancelledDate = '';
    EnquirySysID = 0;
    ImageName='Default.JPG';
}
export class IAddressInfo {
    ContactSysID = 0;
    StudentSysID = 0;
    ContactTypeSysID = 0;
    IsPrimary = false;
    AlternateMobileNo = '';
    Address1 = '';
    Address2 = '';
    CitySysID = '';
    StateSysID = '';
    CountrySysID = '';
    Pincode = '';
    Phone = '';
    Mobile = '';
    Email = '';
    IsDeleted = false;
    RowIndex = 0;
}
export class IDocumentInfo {
    CertificateSysID = 0;
    StudentSysID = 0;
    CertificateTypeSysID = '';
    CertificateName = '';
    ReceivedDate = '';
    IsApproved = false;
    ApprovedBy = '';
    ApprovedDate = '';
    IsDeleted = false;
    RowIndex = 0;
}
export class IEducationInfo {
    EducationSysID = 0;
    ClassSysID = '';
    ClassName = '';
    StudentSysID = 0;
    SchoolName = '';
    AcademicYearSysID = '';
    AcademicYearID = '';
    IsDeleted = false;
    RowIndex = 0;
    constructor() {
        this.EducationSysID = 0;
        this.ClassSysID = '';
        this.ClassName = '';
        this.StudentSysID = 0;
        this.SchoolName = '';
        this.AcademicYearSysID = '';
        this.AcademicYearID = '';
    }
}
export class IFamilyInfo {
    FamilySysID = 0;
    StudentSysID = 0;
    FamilyTypeSysID = '';
    FamilyType = '';
    IsPrimary = false;
    Name = '';
    Occupation = '';
    Qualification = '';
    AnnualIncome = 0;
    OfficePhone = '';
    OfficeEmail = '';
    OfficeAddress = '';
    IsDeleted = false;
    RowIndex = 0;
}
export class IStudentPromotion {
    StudentSysID = '';
    StudentName = '';
}
export class IStudentPromotionDetail {
    ClassSysID = '';
    SectionSysID = '';
    AcademicYearSysID = '';
}
export class IStudentCurrentDetail {
    CurrentClassSysID = '';
    CurrentSectionSysID = '';
    CurrentAcademicYearSysID = '';
}

export class AdmissionInfo {
    isSectionAllotted = false;
    StudentSysID = 0;
    StudentName = '';
    PromotionSysID = 0;
    IsPromotionActive = false;
    ClassSysID = 0;
    ClassName = '';
    AdmissionYearSysID = 0;
    AdmissionNo = '';
    IsAdmissionCancelled = false;
    AdmissionCancelledReason = '';
    AdmissionCancelledBy = '';
    BranchSysID = 0;
    IsDeleted = false;
}