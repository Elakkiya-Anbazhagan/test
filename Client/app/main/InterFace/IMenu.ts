import * as common from './ICommon';

export class IMenu {
    MenuSysID = 0;
    Name = '';
    Icon = '';
    ParentSysID = 0;
    ParentMenuName = '';
    Url = '';
    SortOrder = 0;
    IsAllowSubMenu = false;
    IsSuperAdminMenu = false;
    IsAction = false;
    SpecialValue = '';
}