import * as common from './ICommon';
export class ILedgerWiseTransList {
    JournalSysID = 0;
    TransactionDate = '';
    TransactionNo = '';
    Narration = '';
    Credit = 0;
    Debit = 0;
    CurrentBalance = 0;
}
export class ILedgerWiseTransListView {
    LedgerSysID = 0;
    FromDate = '';
    ToDate = '';
    OpeningBalance = '';
}