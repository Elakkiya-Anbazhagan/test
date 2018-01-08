import * as common from './ICommon';

export class IInward {
    PayModeSysID: number;
    AccountSysID: string;
    TransctionRefType: string;
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
    PresentedDate: string;
    ClearedDate: string;
    BouncedDate: string;
    BankName: string;
    PayMode: string;
    PresentedBank: string;
    CancelledReason: string;
    Narration: string;
    LedgerSysID: string;
    LedgerName: string;
    VoucherNo: string;
    VoucherDate: string;
}

export class IInwardView {
    AccountSysID = '';
    StatusSysID = '';
    BankSysID = '';
    FromDate = '';
    ToDate = '';
    RealizedDate = '';
    PresentedDate = '';
}
