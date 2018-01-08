using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Systemic.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Systemic.Library.Web;
using Systemic.Library;
using System.Net;

namespace School.Server.Controllers
{
    public class AppController : GuardianController
    {
        public AppController(IOptions<AppConfig> appConfig, IHostingEnvironment env) : base(appConfig, env)
        {

        }

        public async Task<IActionResult> Index()
        {
            return await ViewApp(ViewType.Index);
        }
        public async Task<IActionResult> SignOut()
        {
            return await ViewApp(ViewType.SignOut);
        }
        public IActionResult Error()
        {
            return View();
        }
        [HttpGet]
        public ServerResponse ValidateUser(string Url)
        {
            try
            {
                string _Url = Url.Split('?')[0].ToStringOrEmpty();
                if (this._isAuthTokenReady && this._isDevTokenReady && _Url.ToLower() != "/app/error")
                {
                    if (_authentication.lstMenu.FindAll(itm => itm.Url.ToLower() == _Url.ToLower()).Count == 0)
                        throw new PageAccessException("You Don't have enough permission to access this page");
                }
                return ServerResponse.Success("Status", _isAuthTokenReady, "");
            }
            catch (PageAccessException ex)
            {
                return ServerResponse.Error(ex.Message, 401.3);
            }
            catch (Exception ex)
            {
                string Message = "";
#if DEBUG
                Message = ex.Message;
#else
                Message = "Something Went Wrong.";
#endif
                return ServerResponse.Error(Message, 500);
            }
        }
        public ServerResponse SignIn([FromBody]mlApp.mlAuthData data)
        {
            try
            {
                ValidateApplicationDeveloper();
                ApiHelper Api = new ApiHelper(_appConfig.Api.Application.GetUrl("sysauth/token"), WebMethod.POST);

                mlApi.TokenRequest reqData = new mlApi.TokenRequest();
                reqData.AuthType = "admin";
                reqData.Client = "Matrix";
                reqData.Agent = "";
                reqData.UserName = data.Username;
                reqData.Password = data.Password;
                reqData.CompanyID = _appConfig.Api.Application.CompanyID;
                reqData.DevKey = _appConfig.Api.Developer.Key;
                reqData.DevToken = _developer.Token;
                reqData.Agent = Request.Headers["User-Agent"].ToStringOrEmpty();
                reqData.IP = Request.GetClientIpAddress();
                Api.AddBodyParameter(reqData);
                mlApi.mlAuthData resData = Api.Execute<mlApi.mlAuthData>("UserData");

                _isAuthTokenReady = true;
                _authentication = resData;
                resData.lstMenu = new System.Collections.Generic.List<mlApi.mlMenuActionInfo>();
                HttpContext.Response.Cookies.Set<mlApi.mlAuthData>("Config.User", resData);
                return ServerResponse.Success("Status", true, "Login Success");
            }
            catch (WebException ex)
            {
                return ServerResponse.Error(ex, 500);
            }
            catch (ApiException ex)
            {
                return ServerResponse.Error(ex, 501);
            }
            catch (DeveloperKeyException ex)
            {
                return ServerResponse.Error(ex, 401.1);
            }
            catch (Exception ex)
            {
                return ServerResponse.Error(ex, 500);
            }
        }
    }
    public static class HttpRequestMessageExtensions
    {
        public static string GetClientIpAddress(this Microsoft.AspNetCore.Http.HttpRequest request)
        {
            return request.HttpContext.Connection.RemoteIpAddress.ToStringOrEmpty();

        }
    }
}
