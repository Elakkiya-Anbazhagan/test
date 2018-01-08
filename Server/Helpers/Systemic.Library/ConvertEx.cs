using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using Newtonsoft.Json;

namespace Systemic.Library
{
    [ComVisible(true)]
    [Serializable]
    public static class ConvertEx
    {
        private const string ErrorConvertion = "{2}Error while convert \"{0}\" as \"{1}\". Please check the value";
        

        #region Boolean Conversion
        /// <summary>
        /// Converts the object value into Boolean data type.
        /// </summary>
        /// <param name="obj">1, 0, Y, N, YES, NO</param>
        /// <returns>true, false, true, false, true, false, true, false</returns>
        public static bool ToBoolean(this object obj)
        {
            try
            {
                return Convert.ToBoolean(obj);
            }
            catch
            {
                if (obj == null)
                    return false;
                var objStr = obj.ToString().ToUpper();
                return new[] { "TRUE", "1", "Y", "YES", "AVAILABLE" }.Contains(objStr);
            }
        }
        #endregion

        #region Json Operation
        /// <summary>
        /// Serializes the specified object to a JSON string.
        /// </summary>
        /// <param name="obj">The object to serialize.</param>
        /// <returns>A JSON string representation of the object.</returns>
        public static string ToJsonSerialize(this object obj)
        {
            try
            {
                return JsonConvert.SerializeObject(obj);
            }
            catch (Exception ex)
            {
                throw ConvertionError(obj, "JSON", ex);
            }
        }
        /// <summary>
        /// Desterilizes the JSON to the specified .NET type.
        /// </summary>
        /// <param name="json">The JSON to Desterilize.</param>
        /// <returns>A JSON string representation of the object.</returns>
        public static T ToJsonDeSerialize<T>(this string json) where T : new()
        {
            try
            {
                if (string.IsNullOrWhiteSpace(json))
                    throw new ArgumentException("Value cannot be null or whitespace.", nameof(json));
                using (var sr = new StringReader(json))
                {
                    using (var reader = new JsonTextReader(sr))
                    {
                        var jsonSerializer = new JsonSerializer
                        {
                            NullValueHandling = NullValueHandling.Ignore,
                            ObjectCreationHandling = ObjectCreationHandling.Replace,
                            MissingMemberHandling = MissingMemberHandling.Ignore,
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                            FloatParseHandling = FloatParseHandling.Decimal
                        };
                        return jsonSerializer.Deserialize<T>(reader);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ConvertionError(json, new T().GetType().Name, ex);
            }
        }

        /// <summary>
        /// Desterilizes the JSON to the specified .NET Collection type.
        /// </summary>
        /// <param name="json">The JSON to Desterilize.</param>
        /// <returns>A JSON string representation of the object.</returns>
        public static List<T> ToListJsonDeSerialize<T>(this string json) where T : new()
        {
            try
            {
                if (string.IsNullOrWhiteSpace(json))
                    throw new ArgumentException("Value cannot be null or whitespace.", nameof(json));
                using (var sr = new StringReader(json))
                {
                    using (var reader = new JsonTextReader(sr))
                    {
                        var jsonSerializer = new JsonSerializer
                        {
                            NullValueHandling = NullValueHandling.Ignore,
                            ObjectCreationHandling = ObjectCreationHandling.Replace,
                            MissingMemberHandling = MissingMemberHandling.Ignore,
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                            FloatParseHandling = FloatParseHandling.Decimal
                        };
                        return jsonSerializer.Deserialize<List<T>>(reader);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ConvertionError(json, new T().GetType().Name, ex);
            }
        }
        #endregion

        #region Internal Helper Func
        internal static Exception ConvertionError(object obj, string methodName, Exception ex)
        {
#if DEBUG
            var systemError = "System Error: " + ex.Message + Environment.NewLine + "Guru Error: ";
#else
            var systemError = "";
#endif

            return obj != null ? new Exception(string.Format(ErrorConvertion, obj.GetType().Name, methodName, systemError)) : new Exception(string.Format(ErrorConvertion, "NULL", methodName, systemError));
        }

        
        #endregion
    }
}