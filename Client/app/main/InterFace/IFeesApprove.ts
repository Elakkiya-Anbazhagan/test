import * as common from './ICommon';

export class IFeesApprove {
    AcademicYearSysId: number;
    AcademicYearID: string;
    isAcdemicFeeCreated: boolean;
    isTransportFeeCreated: boolean;
    isMiscellaneousFeeCreated: boolean;
    isAcdemicFeeApproved: boolean;
    isTransportFeeApproved: boolean;
    isMiscellaneousFeeApproved: boolean;
    AcademicFeeStructureSysID: number;
    AcademicFeeYearSysID: number;
    AcademicFeeSysID: number;
    AcademicFeeName: string;
    TrasnportFeeStructureSysID: number;
    TrasnportFeeYearSysID: number;
    TrasnportFeeSysID: number;
    TrasnportFeeName: string;
    MiscellaneousFeeStructureSysID: number;
    MiscellaneousFeeYearSysID: number;
    MiscellaneousFeeSysID: number;
    MiscellaneousFeeName: string;
}

