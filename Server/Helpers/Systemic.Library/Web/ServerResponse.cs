using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;

#pragma warning disable 1591
namespace Systemic.Library.Web
{
    public class ServerResponse
    {
        public ServerResponse()
        {
            success = new MlSuccess(0, "");
            failure = new MlError(0);
            response = "success";
        }
        public string response { get; set; }
        public MlSuccess success { get; set; }
        public MlError failure { get; set; }
        public static ServerResponse Success(object obj, string message)
        {
            ServerResponse res = new ServerResponse();
            res.success = new MlSuccess(200, message == string.Empty ? "Method implemented successfully" : message);
            Type[] type = {
                    typeof(string),
                    typeof(short),
                    typeof(long),
                    typeof(int),
                    typeof(bool),
                    typeof(bool),
                    typeof(DateTime)
                };



            if (type.Contains(obj.GetType()))
            {
                const string PropName = nameof(obj);

                res.success.message = obj?.ToString();
                ((IDictionary<string, object>)res.success.result).Add(PropName, obj);
            }
            else
            {
                ((IDictionary<string, object>)res.success.result).Add(obj.GetType().Name, obj);
            }
            res.response = "success";
            return res;
        }
        public static ServerResponse Success(string jsonKey, object obj, string message)
        {
            ServerResponse res = new ServerResponse();
            res.success = new MlSuccess(200, message == string.Empty ? "Method implemented successfully" : message);
            ((IDictionary<string, object>)res.success.result).Add(jsonKey, obj);
            res.response = "success";
            return res;
        }
        public static ServerResponse Success(string message)
        {
            ServerResponse res = new ServerResponse();
            res.success = new MlSuccess(200, message);
            res.response = "success";
            return res;
        }
        public static ServerResponse Error(string message, double statusCode = 501)
        {
            ServerResponse res = new ServerResponse();
            res.failure = new MlError(statusCode)
            {
                message = message,
#if DEBUG
                description = "",
                trace = "",
#endif
                code = statusCode
            };
            res.response = "error";
            return res;
        }
        public static ServerResponse Error(Exception error, double statusCode = 501)
        {
            ServerResponse res = new ServerResponse();
            res.failure = new MlError(statusCode)
            {
                message = error.Message,
#if DEBUG
                description = error.GetBaseException().StackTrace,
                trace = error.StackTrace,
#endif
                code = statusCode
            };
            res.response = "error";
            return res;
        }
    }
    public class MlError
    {
        public MlError(double code)
        {
            this.code = code;
            message = string.Empty;
            description = string.Empty;
            trace = string.Empty;
        }
        public double code { get; set; }
        public string message { get; set; }
        public string description { get; set; }
        public string trace { get; set; }
    }
    public class MlSuccess
    {
        public MlSuccess(int code, string message)
        {
            this.code = code;
            this.message = message;
            result = new ExpandoObject();
        }
        public int code { get; set; }
        public string message { get; set; }
        public dynamic result { get; set; }
    }

}