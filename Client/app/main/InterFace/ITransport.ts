import * as common from './ICommon';

export class IRoute {
    RouteSysID: number;
    RouteName: string;
    BranchSysID: string;
    Locked: common.ILock;
    constructor() {
        this.Locked = new common.ILock();
        this.RouteSysID = 0;
    }
}
export class IStop {
    StopSysID: number;
    StopName: string;
    Lat: string;
    Long: string;
    Locked: common.ILock;
    constructor() {
        this.Locked = new common.ILock();
        this.StopSysID = 0;
    }
}
export class IRouteMap {
    RouteSysID: number;
    RouteName: string;
    VehicleSysID: string;
    VehicleNo: string;
}
export class IVehicle {
    VehicleSysID: string;
    VehicleTypeSysID: string;
    VehicleName: string;
    VehicleNo: string;
    DeviceID: string;
    BranchSysID: string;
    Locked: common.ILock;
    constructor() {
        this.Locked = new common.ILock();
        this.VehicleSysID = '0';
    }
}
export class IStopSearchData {
    AcademicYearSysId: string;
    RouteSysID: string;
    VehicleSysID: string;
    TripSysID: string;
}
export class IStopMappingList {
    MapSysID: string;
    AcademicYearSysID: string;
    RouteSysID: string;
    VehicleSysID: string;
    TripSysID: string;
    StopSysID: string;
    StopName: string;
    Amount: number;
}

