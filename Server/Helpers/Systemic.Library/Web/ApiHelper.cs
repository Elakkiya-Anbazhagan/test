// ***********************************************************************
// Assembly         : Api.Server
// Author           : vscodeguru
// Created          : 03-24-2017
//
// Last Modified By : vscodeguru
// Last Modified On : 03-23-2017
// ***********************************************************************
// <copyright file="ApiHelper.cs" company="Microsoft">
//     Copyright © Microsoft 2017
// </copyright>
// <summary></summary>
// ***********************************************************************
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using Systemic.Library;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;

namespace Systemic.Library.Web
{
    /// <summary>
    /// Class ApiHelper.
    /// </summary>
    public class ApiHelper
    {
        #region Private Variables
        /// <summary>
        /// Gets the client.
        /// </summary>
        /// <value>The client.</value>
        private RestClient Client { get; }
        /// <summary>
        /// Gets or sets the request.
        /// </summary>
        /// <value>The request.</value>
        private RestRequest Request { get; set; }
        /// <summary>
        /// Gets or sets a value indicating whether this instance is manual token.
        /// </summary>
        /// <value><c>true</c> if this instance is manual token; otherwise, <c>false</c>.</value>
        private bool _IsManualToken { get; set; }
        #endregion

        #region Constructor
        /// <summary>
        /// Help To Perform Web Api Operation
        /// </summary>
        /// <param name="ActionName">Action Name Of WebApi</param>
        /// <param name="method">The method.</param>
        /// <param name="IsManualToken">if set to <c>true</c> [is manual token].</param>
        /// <param name="isManualHeader">if set to <c>true</c> [is manual header].</param>
        /// <exception cref="System.Exception">
        /// Action Name Not Found
        /// or
        /// Please Add Web Api Base Url In Web.Config File AppSetting With The Name Of Systemic.WebApi.BaseUrl
        /// or
        /// </exception>
        public ApiHelper(string ActionName, WebMethod method, bool IsManualToken = false, bool isManualHeader = false)
        {

            if (string.IsNullOrWhiteSpace(ActionName))
                throw new Exception("Action Name Not Found");
            Client = new RestClient(ActionName);

            if (method == WebMethod.DELETE)
                Request = new RestRequest(Method.DELETE);
            else if (method == WebMethod.GET)
                Request = new RestRequest(Method.GET);
            else if (method == WebMethod.HEAD)
                Request = new RestRequest(Method.HEAD);
            else if (method == WebMethod.MERGE)
                Request = new RestRequest(Method.MERGE);
            else if (method == WebMethod.OPTIONS)
                Request = new RestRequest(Method.OPTIONS);
            else if (method == WebMethod.PATCH)
                Request = new RestRequest(Method.PATCH);
            else if (method == WebMethod.POST)
                Request = new RestRequest(Method.POST);
            else if (method == WebMethod.PUT)
                Request = new RestRequest(Method.PUT);

            if (!isManualHeader)
                Request.AddHeader("content-type", "application/json");

            _IsManualToken = IsManualToken;

        }

        #endregion

        /// <summary>
        /// Adds the file.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <param name="obj">The object.</param>
        public void AddFile(string name, byte[] obj)
        {
            Request.AddFile(name, obj, "false");
            Request.AlwaysMultipartFormData = true;
        }

        #region Request Header
        /// <summary>
        /// Adds the header.
        /// </summary>
        /// <param name="Name">The name.</param>
        /// <param name="Value">The value.</param>
        /// <exception cref="System.Exception">
        /// Request header name cannot be empty
        /// or
        /// Request header Value Cannot be empty. Please check value for \"" + Name + "\"
        /// or
        /// </exception>
        public void AddHeader(string Name, string Value)
        {
            if (string.IsNullOrWhiteSpace(Name))
                throw new Exception("Request header name cannot be empty");
            if (string.IsNullOrWhiteSpace(Value))
                throw new Exception("Request header Value Cannot be empty. Please check value for \"" + Name + "\"");
            Request.AddHeader(Name, Value);
        }

        /// <summary>
        /// Adds the URL segment.
        /// </summary>
        /// <param name="Name">The name.</param>
        /// <param name="Value">The value.</param>
        /// <exception cref="System.Exception">
        /// Request header name cannot be empty
        /// or
        /// Request header Value Cannot be empty. Please check value for \"" + Name + "\"
        /// or
        /// </exception>
        public void AddUrlSegment(string Name, string Value)
        {
            if (string.IsNullOrWhiteSpace(Name))
                throw new Exception("Request header name cannot be empty");
            if (Value == null)
                throw new Exception("Request header Value Cannot be empty. Please check value for \"" + Name + "\"");
            Request.AddUrlSegment(Name, Value);
        }
        #endregion
        /// <summary>
        /// Enum ParamType
        /// </summary>
        public enum ParamType
        {
            /// <summary>
            /// The cookie
            /// </summary>
            Cookie = 0,
            /// <summary>
            /// The get or post
            /// </summary>
            GetOrPost = 1,
            /// <summary>
            /// The URL segment
            /// </summary>
            UrlSegment = 2,
            /// <summary>
            /// The HTTP header
            /// </summary>
            HttpHeader = 3,
            /// <summary>
            /// The request body
            /// </summary>
            RequestBody = 4,
            /// <summary>
            /// The query string
            /// </summary>
            QueryString = 5
        }
        #region Request Parameter
        /// <summary>
        /// Adds the parameter.
        /// </summary>
        /// <param name="Name">The name.</param>
        /// <param name="Value">The value.</param>
        /// <param name="Type">The type.</param>
        /// <exception cref="System.Exception">
        /// Request parameter name cannot be empty
        /// or
        /// </exception>
        public void AddParameter(string Name, object Value, ParamType Type = ParamType.UrlSegment)
        {
            if (string.IsNullOrWhiteSpace(Name))
                throw new Exception("Request parameter name cannot be empty");

            if (Type == ParamType.UrlSegment)
            {
                Request.AddParameter(Name, Value, ParameterType.UrlSegment);
            }
            else if (Type == ParamType.RequestBody)
            {
                Request.AddParameter(Name, Value, ParameterType.RequestBody);
            }
            else if (Type == ParamType.UrlSegment)
            {
                Request.AddParameter(Name, Value, ParameterType.UrlSegment);
            }
            else if (Type == ParamType.HttpHeader)
            {
                Request.AddParameter(Name, Value, ParameterType.HttpHeader);
            }
        }

        /// <summary>
        /// Adds the body parameter.
        /// </summary>
        /// <param name="Value">The value.</param>
        /// <param name="contentType">Type of the content.</param>
        /// <exception cref="System.Exception">
        /// Request body parameter value cannot be empty
        /// or
        /// </exception>
        public void AddBodyParameter(object Value, ContentType contentType = ContentType.Json)
        {

            if (Value == null)
                throw new Exception("Request body parameter value cannot be empty");

            string name = (contentType == ContentType.Json) ? "application/json" : "application/x-www-form-urlencoded";
            object _obj = (contentType == ContentType.Json) ? Value.ToJsonSerialize() : Value;
            Request.AddParameter(name, _obj, ParameterType.RequestBody);

        }
        #endregion

        #region Execution Types
        /// <summary>
        /// Execute your Current Request Which is Using Wrapper JSON
        /// </summary>
        /// <returns>Return Web-Api Response Message</returns>
        /// <exception cref="System.Exception"></exception>
        public string Execute()
        {
            IRestResponse Response = Client.Execute(Request);

            ServerResponse _ServerResponse = CheckResponse(Response);
            return _ServerResponse.success.message;
        }

        /// <summary>
        /// Executes the specified json parser name.
        /// </summary>
        /// <param name="JSONParserName">Name of the json parser.</param>
        /// <returns>System.String.</returns>
        /// <exception cref="System.Exception"></exception>
        public string Execute(string JSONParserName)
        {
            IRestResponse Response = Client.Execute(Request);

            ServerResponse _ServerResponse = CheckResponse(Response);
            var reader = new JsonTextReader(new StringReader(Response.Content));
            reader.FloatParseHandling = FloatParseHandling.Decimal;
            JObject response = JObject.Load(reader);
            string resultStr = response["success"]["result"][JSONParserName].ToString();
            return resultStr;
        }

        /// <summary>
        /// Executes the specified json parser name.
        /// </summary>
        /// <param name="JSONParserName">Name of the json parser.</param>
        /// <param name="Message">The message.</param>
        /// <returns>System.String.</returns>
        /// <exception cref="System.Exception"></exception>
        public string Execute(string JSONParserName, ref string Message)
        {
            IRestResponse Response = Client.Execute(Request);

            ServerResponse _ServerResponse = CheckResponse(Response);
            var reader = new JsonTextReader(new StringReader(Response.Content));
            reader.FloatParseHandling = FloatParseHandling.Decimal;
            JObject response = JObject.Load(reader);
            string resultStr = response["success"]["result"][JSONParserName].ToString();
            Message = _ServerResponse.success.message;
            return resultStr;
        }

        /// <summary>
        /// Execute your Current Request Which is Using Wrapper JSON
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns>Return Web-Api Response Message</returns>
        /// <exception cref="System.Exception"></exception>
        public T Execute<T>() where T : new()
        {
            IRestResponse Response = Client.Execute(Request);
            ServerResponse _ServerResponse = CheckResponse(Response);
            var reader = new JsonTextReader(new StringReader(Response.Content));
            reader.FloatParseHandling = FloatParseHandling.Decimal;
            JObject response = JObject.Load(reader);

            string resultStr = response["success"]["result"][typeof(T).Name].ToString();

            return resultStr.ToJsonDeSerialize<T>();
        }

        /// <summary>
        /// Executes the specified json parser name.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="JSONParserName">Name of the json parser.</param>
        /// <returns>T.</returns>
        /// <exception cref="System.Exception"></exception>
        public T Execute<T>(string JSONParserName) where T : new()
        {
            IRestResponse Response = Client.Execute(Request);

            ServerResponse _ServerResponse = CheckResponse(Response);
            var reader = new JsonTextReader(new StringReader(Response.Content));
            reader.FloatParseHandling = FloatParseHandling.Decimal;
            JObject response = JObject.Load(reader);
            string resultStr = response["success"]["result"][JSONParserName].ToString();

            return resultStr.ToString().ToJsonDeSerialize<T>();
        }

        /// <summary>
        /// Executes the specified json parser name.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="JSONParserName">Name of the json parser.</param>
        /// <param name="Message">The message.</param>
        /// <returns>T.</returns>
        /// <exception cref="System.Exception"></exception>
        public T Execute<T>(string JSONParserName, ref string Message) where T : new()
        {
            IRestResponse Response = Client.Execute(Request);

            ServerResponse _ServerResponse = CheckResponse(Response);
            var reader = new JsonTextReader(new StringReader(Response.Content));
            reader.FloatParseHandling = FloatParseHandling.Decimal;
            JObject response = JObject.Load(reader);
            string resultStr = response["success"]["result"][JSONParserName].ToString();
            Message = _ServerResponse.success.message;
            return resultStr.ToJsonDeSerialize<T>();
        }

        /// <summary>
        /// Execute your current request With Normal Response
        /// </summary>
        /// <typeparam name="T">Type to deserialize response content</typeparam>
        /// <returns>Return generic type</returns>
        /// <exception cref="System.Exception"></exception>
        public T ExecuteBasic<T>() where T : new()
        {
            IRestResponse Response = Client.Execute(Request);
            CheckResponse(Response);
            return Response.Content.ToJsonDeSerialize<T>();
        }

        /// <summary>
        /// Execute your Current Request
        /// </summary>
        /// <returns>Return Web-Api Response Message</returns>
        /// <exception cref="System.Exception"></exception>
        public string ExecuteBasic()
        {
            IRestResponse Response = Client.Execute(Request);
            CheckResponse(Response);
            return Response.Content;
        }
        #endregion

        #region Validate Response
        /// <summary>
        /// Checks the response.
        /// </summary>
        /// <param name="Response">The response.</param>
        /// <returns>ServerResponse.</returns>
        private ServerResponse CheckResponse(IRestResponse Response)
        {
            CheckForNormalException(Response); // Raise WebException if any
            return CheckWrapperJsonResponse(Response); // Raise ApiException if any
        }
        /// <summary>
        /// Checks for normal exception.
        /// </summary>
        /// <param name="Response">The response.</param>
        /// <exception cref="System.Exception">
        /// Web-Api Controller Or Action Not Found
        /// or
        /// Internal Server Exception Occurred
        /// or
        /// Internal Server Exception Occurred
        /// or
        /// Unauthorized Access Has Been Found
        /// or
        /// </exception>
        private void CheckForNormalException(IRestResponse Response)
        {

            switch (Response.StatusCode)
            {
                case HttpStatusCode.NotFound:
                    throw new WebException("Api Controller Or Action Not Found");
                case HttpStatusCode.InternalServerError:
                    throw new WebException("Api Server Exception Occurred");
                default:
                    if (Response.ErrorException != null || Response.ResponseStatus != RestSharp.ResponseStatus.Completed)
                    {
                        if (Response.ErrorException != null) throw Response.ErrorException;
                    }
                    else if (HttpStatusCode.InternalServerError == Response.StatusCode)
                    {
                        throw new WebException("Api Server Exception Occurred");
                    }
                    else if (HttpStatusCode.Unauthorized == Response.StatusCode)
                    {
                        throw new WebException("Unauthorized Access Has Been Found");
                    }
                    else if (HttpStatusCode.NotImplemented == Response.StatusCode)
                    {
                        throw new WebException("Api Server Exception Occurred");
                    }
                    else if (Response.StatusCode != HttpStatusCode.OK)
                    {
                        ErrorResponseBasic er = new ErrorResponseBasic();
                        try
                        {

                            er = Response.Content.ToJsonDeSerialize<ErrorResponseBasic>();
                        }
                        catch (Exception)
                        {
                            er.error = Response.StatusDescription;
                        }
                        finally { throw new WebException(er.error); }
                    }
                    break;
            }
        }
        /// <summary>
        /// Checks the wrapper json response.
        /// </summary>
        /// <param name="Response">The response.</param>
        /// <exception cref="System.Exception"></exception>
        private ServerResponse CheckWrapperJsonResponse(IRestResponse Response)
        {

            ServerResponse _ServerResponse = Response.Content.ToJsonDeSerialize<ServerResponse>();
            if (new string[] { "failure", "error" }.Contains(_ServerResponse.response.ToStringOrEmpty().ToLower()))
            {
                string message = string.Empty;
#if DEBUG
                message = _ServerResponse.failure.message + " \r\n " + _ServerResponse.failure.description;
#else
                message = _ServerResponse.failure.message;
#endif
                if (new double[] { 401, 403, 404, 500 }.Contains(_ServerResponse.failure.code))
                    throw new WebException(message);
                else if (_ServerResponse.failure.code == 401.1)
                    throw new DeveloperKeyException(message);
                else if (new double[] { 401.2, 501 }.Contains(_ServerResponse.failure.code))
                    throw new ApiException(message);
                else
                    throw new WebException(message);


            }
            return _ServerResponse;
        }
        #endregion
    }
    /// <summary>
    /// Enum WebMethod
    /// </summary>
    public enum WebMethod
    {
        /// <summary>
        /// The get
        /// </summary>
        GET = 0,
        /// <summary>
        /// The post
        /// </summary>
        POST = 1,
        /// <summary>
        /// The put
        /// </summary>
        PUT = 2,
        /// <summary>
        /// The delete
        /// </summary>
        DELETE = 3,
        /// <summary>
        /// The head
        /// </summary>
        HEAD = 4,
        /// <summary>
        /// The options
        /// </summary>
        OPTIONS = 5,
        /// <summary>
        /// The patch
        /// </summary>
        PATCH = 6,
        /// <summary>
        /// The merge
        /// </summary>
        MERGE = 7
    }

    /// <summary>
    /// Enum ContentType
    /// </summary>
    public enum ContentType
    {
        /// <summary>
        /// The json
        /// </summary>
        Json,
        /// <summary>
        /// The URL encoded
        /// </summary>
        UrlEncoded
    }

    /// <summary>
    /// Class ErrorResponseBasic.
    /// </summary>
    public class ErrorResponseBasic
    {
        /// <summary>
        /// Gets or sets the error.
        /// </summary>
        /// <value>The error.</value>
        public string error { get; set; }
        /// <summary>
        /// Gets or sets the error description.
        /// </summary>
        /// <value>The error description.</value>
        public string error_description { get; set; }
        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>The description.</value>
        public string description { get; set; }

    }


}