import * as common from './ICommon';

export class mlDayBookList {
    JournalDate = '';
    JournalNo = '';
    Narration = '';
    LedgerSysID = 0;
    Credit = 0;
    Debit = 0;
}
export class mlDayBook {
    OpeningBalance = 0;
    DayBookList: mlDayBookList[];
    Details: mlDayBookDetails;
    constructor() {
        this.Details = new mlDayBookDetails();
    }
}
export class mlDayBookDetails {
    LedgerSysID = 0;
    JournalDate = '';
}
export class mlDayMaster {
    DaySysID = 0;
    ClosingDate = '';
    OpeningBalance = 0;
    ClosingBalance = 0;
    Income = 0;
    Expense = 0;
    IsApproved = false;
    LedgerSysID = 0;
}
export class mlDayTrans {
    DayTransSysID = 0;
    DaySysID = 0;
    TwoThousand = 0;
    FiveHundred = 0;
    OneHundred = 0;
    Fifty = 0;
    Twenty = 0;
    Ten = 0;
    Five = 0;
    Two = 0;
    One = 0;
}
export class DayBookCloseData {
    Master: mlDayMaster;
    Trans: mlDayTrans;
    constructor() {
        this.Master = new mlDayMaster();
        this.Trans = new mlDayTrans();
    }
}