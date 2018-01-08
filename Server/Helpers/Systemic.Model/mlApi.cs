using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Systemic.Model
{
    public class mlApi
    {
        public class mlAccount
        {
            public class Config
            {
                public _accountYear AccountYear { get; set; }
                public _academicYear CurrentAcademicYear { get; set; }
                public _academicYear ActiveAcademicYear { get; set; }
            }
            public class _accountYear
            {
                public int AccountYearSysID { get; set; }
                public string AccountYearID { get; set; }
                public string StartDate { get; set; }
                public string EndDate { get; set; }
            }
            public class _academicYear
            {
                public short AcademicYearSysId { get; set; }
                public string AcademicYearID { get; set; }
                public string StartDate { get; set; }
                public string EndDate { get; set; }
                public int BranchSysID { get; set; }
            }
        }

        public class mlAuthData
        {
            public mlAuthData()
            {
                Profile = new mlUser();
                School = new mlSchool();
                lstMenu = new List<mlMenuActionInfo>();
            }
            public string access_token { get; set; }
            public string refresh_token { get; set; }
            public string token_type { get; set; }
            public string expiration_time { get; set; }
            public mlUser Profile { get; set; }
            public mlSchool School { get; set; }
            public List<mlMenuActionInfo> lstMenu { get; set; }
        }


        public class mlSchool : mlAccount.Config
        {

        }

        public class mlUser
        {
            public mlUser()
            {
                Role = new mlBaseProp();
                Company = new mlCompany();
            }
            public int SysId { get; set; }
            public string FullName { get; set; }
            public string Username { get; set; }
            public string Userimage { get; set; }
            public mlBaseProp Role { get; set; }
            public mlCompany Company { get; set; }
        }

        public class mlBaseProp
        {
            public int SysId { get; set; }
            public string Id { get; set; }
            public string Name { get; set; }
        }
        public class mlCompany : mlBaseProp
        {
            public mlCompany()
            {
                Branch = new mlBranch();
            }
            public mlBranch Branch { get; set; }
        }
        public class mlBranch
        {
            public int SysId { get; set; }
            public string Name { get; set; }
            public string Logo { get; set; }
        }
        public class mlMenuActionInfo
        {
            public Int32 MenuSysID { get; set; }
            public string Name { get; set; }
            public string Icon { get; set; }
            public Int32 ParentSysID { get; set; }
            public string ParentMenuName { get; set; }
            public string Url { get; set; }
            public Int32 SortOrder { get; set; }
            public Boolean IsAllowSubMenu { get; set; }
            public Boolean IsSuperAdminMenu { get; set; }
            public Boolean IsAction { get; set; }
            public bool IsMapped { get; set; } = false;
        }
        public class TokenRequest
        {
            public string AuthType { get; set; }
            public string UserName { get; set; }
            public string Password { get; set; }
            public string CompanyID { get; set; }
            public string Client { get; set; }
            public string Agent { get; set; }
            public string IP { get; set; }
            public string DevKey { get; set; }
            public string DevToken { get; set; }
        }
    }
}
