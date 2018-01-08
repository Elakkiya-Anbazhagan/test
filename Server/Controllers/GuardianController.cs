// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Systemic.Library;
using Systemic.Library.Web;
using Systemic.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using School.Server;

namespace School.Server.Controllers
{
    public class GuardianController : Controller
    {
        protected readonly IHostingEnvironment _env;
        protected readonly AppConfig _appConfig;
        protected bool _isDevTokenReady
        {
            get { return HttpContext.Session.Get<bool>("Guardian.isDevTokenReady"); }
            set { HttpContext.Session.Set<bool>("Guardian.isDevTokenReady", value); }
        }
        protected bool _isAuthTokenReady
        {
            get { return HttpContext.Session.Get<bool>("Guardian.isAuthTokenReady"); }
            set { HttpContext.Session.Set<bool>("Guardian.isAuthTokenReady", value); }
        }
        protected mlAuth.Response _developer
        {
            get { return HttpContext.Session.Get<mlAuth.Response>("Guardian.DeveloperData"); }
            set { HttpContext.Session.Set<mlAuth.Response>("Guardian.DeveloperData", value); }
        }
        protected mlApi.mlAuthData _authentication
        {
            get { return HttpContext.Session.Get<mlApi.mlAuthData>("Guardian.UserData"); }
            set { HttpContext.Session.Set<mlApi.mlAuthData>("Guardian.UserData", value); }
        }

        public GuardianController(IOptions<AppConfig> appConfig, IHostingEnvironment env) : base()
        {
            _env = env;
            _appConfig = appConfig.Value;
        }

        protected bool ValidateApplicationDeveloper()
        {
            try
            {
                // If Developer Token is Ready Check Token Status For Each App Server Request, From Auth Server
                if (_isDevTokenReady)
                {
                    ApiHelper Api = new ApiHelper($"{_appConfig.Api.Developer.BaseUrl}/validate", WebMethod.POST, true);
                    mlAuth.Validate Data = new mlAuth.Validate();
                    Data.DevToken = _developer.Token;
                    Data.DevKey = _appConfig.Api.Developer.Key;
                    Api.AddBodyParameter(Data);
                    if (Api.Execute("Status").ToBoolean())
                        return true;
                }
                InitiateApplicationDeveloper();
                return false;
            }
            catch (WebException ex)
            {
                _isDevTokenReady = false;
                _developer = new mlAuth.Response();
                throw ex;
            }
            catch (ApiException ex)
            {
                _isDevTokenReady = false;
                _developer = new mlAuth.Response();
                throw new DeveloperKeyException(ex);
            }
            catch (Exception ex)
            {
                _isDevTokenReady = false;
                _developer = new mlAuth.Response();
                throw ex;
            }
        }
        protected bool InitiateApplicationDeveloper()
        {
            mlAuth.Request Data = new mlAuth.Request();
            ApiHelper Api = new ApiHelper($"{_appConfig.Api.Developer.BaseUrl}/token", WebMethod.POST, true);
            Data.Username = _appConfig.Api.Developer.Username;
            Data.Password = _appConfig.Api.Developer.Password;
            Data.DeveloperKey = _appConfig.Api.Developer.Key;
            Api.AddBodyParameter(Data);
            _developer = Api.Execute<mlAuth.Response>("AuthToken");
            _isDevTokenReady = true;
            return _isDevTokenReady;
        }

        protected ViewResult ViewError(double ErrorCode, string ErrorMessage)
        {
            ViewBag.ErrorCode = ErrorCode;
            ViewBag.ErrorMessage = ErrorMessage;
            ViewBag.CompanyName = _appConfig.Provider.Name;
            ViewBag.CopyRights = $"© Copyright <strong>{_appConfig.Provider.Name}</strong> {DateTime.Now.Year}.";
            return View("~/Views/App/Error.cshtml");
        }
        protected async Task<ViewResult> ViewApp(ViewType typ)
        {
            try
            {
                if (typ == ViewType.SignOut)
                {
                    // Clear Session
                    HttpContext.Session.Clear();
                    // Clear Browser Cookies
                    CookieHelper.Clear(HttpContext.Request.Cookies, HttpContext.Response.Cookies);
                }

                /*
                    // Set Server Configuration Session
                    HttpContext.Session.Set ("Guardian.isDevTokenReady", false);
                    HttpContext.Session.Set ("Guardian.isAuthTokenReady", false);
                */

                // Set Client Configuration Cookies
                HttpContext.Response.Cookies.Set<AppConfig.provider>("Config.Provider", _appConfig.Provider);
                HttpContext.Response.Cookies.Set<AppConfig.company>("Config.Company", _appConfig.Company);

                if (!_isAuthTokenReady)
                    HttpContext.Response.Cookies.Set<mlApi.mlAuthData>("Config.User", new mlApi.mlAuthData());
                HttpContext.Response.Cookies.Set<AppConfig.Application>("Config.Api", _appConfig.Api.Application);
                // Validation Developer Authentication & it's status
                ValidateApplicationDeveloper();
                // Load Angular Main JS File
                ViewBag.MainDotJs = await GetMainDotJs();
                return View("~/Views/App/Index.cshtml");
            }
            catch (DeveloperKeyException ex)
            {
                return ViewError(401.1, ex.Message);
            }
            catch (Exception ex)
            {
                return ViewError(500, ex.Message);
            }
        }
        // Because for production this is hashed chunk so has changes on each production build
        protected async Task<string> GetMainDotJs()
        {
            var basePath = _env.WebRootPath + "//dist//";

            if (_env.IsDevelopment() && !System.IO.File.Exists(basePath + "main.js"))
            {
                // Just a .js request to make it wait to finish webpack Dev middle-ware finish creating bundles:
                // More info here: https://github.com/aspnet/JavaScriptServices/issues/578#issuecomment-272039541
                using (var client = new HttpClient())
                {
                    var requestUri = Request.Scheme + "://" + Request.Host + "/dist/main.js";
                    await client.GetAsync(requestUri);
                }
            }
            var info = new System.IO.DirectoryInfo(basePath);
            var file = info.GetFiles()
                .Where(f => _env.IsDevelopment() ? f.Name == "main.js" : f.Name.StartsWith("main.") && !f.Name.EndsWith("bundle.map"));
            return file.FirstOrDefault().Name;
        }

        protected enum ViewType
        {
            SignOut,
            Index
        }
    }
}