import * as common from './ICommon';

export class ICategory {
  CategorySysID: number;
  CategoryName: string;
  FeeName: string;
  FeeSysID: string;
  LedgerSysID: number;
  LedgerName: string;
  BranchSysID: string;
  constructor(){
   this.CategorySysID = 0;
  }
}
export class ICategoryMap {
  isMapped: boolean;
  MappingSysID: string;
  AcademicYearID: string;
  BranchName: string;
  AccountName: string;
  CategoryName: string;
  FeeName: string;
  AcademicYearSysId: string;
  BranchSysID: string;
  AccountSysID: string;
  CategorySysID: string;
  FeeSysID: string;
  AccountID: string;
}
export class ICategoryData {
  AcademicYearSysId: string;
  FeeSysID: string;
  AccountSysID: string;
}
export class ITermMap {
  isMapped: boolean;
  MappingSysID: string;
  AcademicYearID: string;
  BranchName: string;
  CategoryName: string;
  FeeName: string;
  AcademicYearSysId: string;
  BranchSysID: string;
  CategorySysID: string;
  FeeSysID: string;
  TermName: string;
}
export class ITermData {
  AcademicYearSysId: string;
  FeeSysID: string;
  TermSysID: string;
}
