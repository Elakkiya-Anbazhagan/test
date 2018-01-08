
export class ILock {
    LockedBy: string;
    LockedDate: string;
    LockedReason: string;
    IsLocked: boolean;
}
export interface ICreated {
    CreatedBy: string;
    CreatedDate: string;
    IsDeleted: boolean;
}

export interface IUpdated {
    UpdatedBy: string;
    UpdatedDate: string;
}
export interface IContact {
    Address1: string;
    Address2: string;
    CitySySID: string;
    District: string;
    Pincode: string;
    Phone: string;
    Mobile: string;
    Email: string;
}
export interface Idd {
    id: any;
    text: string;
}
export interface Ims {
    label: any;
    value: string;
}
export interface ImportError {
    Slno: string,
    Error: string
}

export class ITransactionPaymode {
    PayModeSysID: string;
    TransctionRefType: string;
    TransctionRefTypeSysID: string;
    PaymodeTypeSysID: string;
    TransactionNo: string;
    TransactionDate: string;
    TransactionBankSysID: string;
    StatusSysID: number;
    LedgerSysID: string;
    ClearedDate: string;
    Amount: number;
    IsDeleted: boolean;
}