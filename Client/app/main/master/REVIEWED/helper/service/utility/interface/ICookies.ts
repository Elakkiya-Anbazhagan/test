export interface IDeveloper {
    Key: string;
    BaseUrl: string;
    Username: string;
    Password: string;
}
export interface IApplication {
    GalleryBaseUrl: string;
    BaseUrl: string;
    GetUrl: void;
    CompanyID: string;
}
export interface IApi {
    Developer: IDeveloper;
}
export interface IProvider {
    Name: string;
    Logo: string;
}
export interface ICompany {
    Name: string;
    Id: string;
    Logo: string;
}
export interface IAcademicYear {
    AcademicYearSysId: number;
    AcademicYearID: string;
    StartDate: string;
    EndDate: string;
    BranchSysID: string;
}
export interface IAccountYear {
    AccountYearSysID: string;
    AccountYearID: string;
    StartDate: string;
    EndDate: string;
}
export class ISchoolConfig {
    AccountYear: IAccountYear;
    CurrentAcademicYear: IAcademicYear;
    ActiveAcademicYear: IAcademicYear;
}


export class IAppConfig {
    Application: IApplication;
    Provider: IProvider;
    Company: ICompany;
}





export class IUserAuthData {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expiration_time: string;
    Profile: IUser;
    School: ISchoolConfig;
}


export class IUser {
    SysId: number;
    FullName: string;
    Username: string;
    Userimage: string;
    Role: IAuthBaseProp;
    Company: IUserCompany;
}

export class IAuthBaseProp {
    SysId: number;
    Id: string;
    Name: string;
}
export class IUserCompany extends IAuthBaseProp {
    Branch: IUserBranch;
}
export class IUserBranch {
    SysId: number;
    Name: string;
    Logo: string;
}
