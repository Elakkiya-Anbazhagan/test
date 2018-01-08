import * as common from './ICommon';

export class IOutward {
    PayModeSysID: number;
    AccountSysID: string;
    AccountName: string;
    TransctionRefType: string;
    VoucherDate: string;
    ContactName: string;
    TransctionRefTypeSysID: number;
    PaymodeTypeSysID: number;
    TransactionNo: string;
    TransactionDate: string;
    TransactionBankSysID: number;
    Amount: number;
    StatusSysID: number;
    StatusName: string;
    IsIssued: boolean;
    IssuedTo: string;
    ClearedDate: string;
    PresentedDate: string;
    BouncedDate: string;
    BankName: string;
    PayMode: string;
    PresentedBank: string;
    LedgerSysID: number;
    CancelledReason: string;
    Narration: string;
    VoucherNo: string;
}

export class IOutwardView {
    AccountSysID: '';
    StatusSysID = '';
    BankSysID = '';
    FromDate = '';
    ToDate = '';
    PresentedDate = '';
    RealizedDate = '';
}
