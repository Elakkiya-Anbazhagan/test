/*
 * Author       :   Prabakaran
 * Date         :   24-12-2016
 * Description  :   This Class Contain String Conversion Related Extension Methods.
 */

using System;
using System.Globalization;

namespace Systemic.Library
{
    /// <summary>
    /// This Class Contain String Conversion Related Extension Methods.
    /// </summary>
    public static  class stringEx
    {
        /// <summary>
        ///     Converts the object to string
        ///     Removes the white spaces
        /// </summary>
        /// <param name="obj">Object</param>
        /// <returns>Returns the string</returns>
        /// <code>
        ///     obj.ToStringOrEmpty();    
        /// </code>
        public static string ToStringOrEmpty(this object obj)
        {
            try
            {
                return obj == null ? string.Empty : Convert.ToString(obj).Trim();
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }

        /// <summary>
        ///     Converts the object to string if String Empty return NULL
        ///     Removes the white spaces
        /// <code>
        ///     obj.ToStringNull();    
        /// </code>
        /// </summary>
        /// <param name="obj">Object</param>
        /// <returns>Returns the string or null</returns>
        public static string ToStringNull(this object obj)
        {
            try
            {
                return obj == null ? null : (obj.ToString().Length == 0 ? null : Convert.ToString(obj).Trim());
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        ///     Returns the string converted to Upper case.
        /// <code>
        ///     obj.ToUpper();    
        /// </code>
        /// </summary>
        /// <param name="obj">Object</param>
        /// <returns>
        ///     Returns the string in Upper case 
        ///     Ex: WELCOME
        /// </returns>
        public static string ToUpperCase(this string obj)
        {
            try
            {
                return obj == null ? string.Empty : Convert.ToString(obj).ToUpper();
            }
            catch (Exception ex)
            {
                throw obj.ThrowConvertionError("Upper Case", ex);
            }
        }

        /// <summary>
        ///     Returns a copy of this string converted to Lower case.
        /// </summary>
        /// <param name="obj">Object</param>
        /// <returns>
        ///     Returns the string in Lower case
        ///     Ex: welcome
        /// </returns>
        /// <code>
        ///     obj.ToLower();    
        /// </code>
        public static string ToLowerCase(this string obj)
        {
            try
            {
                return obj == null ? string.Empty : Convert.ToString(obj).ToLower();
            }
            catch (Exception ex)
            {
                throw obj.ThrowConvertionError("Lower Case", ex);
            }
        }

        /// <summary>
        ///     Returns the string Title case.
        /// <code>
        ///     obj.ToTitleCase();    
        /// </code>
        /// </summary>
        /// <param name="obj">Object</param>
        /// <returns>
        ///     String in Title case 
        ///     Ex: Welcome
        /// </returns>
        public static string ToTitleCase(this string obj)
        {
            try
            {
                return obj == null
                    ? string.Empty
                    : Convert.ToString(obj).ToUpper();
            }
            catch (Exception ex)
            {
                throw obj.ThrowConvertionError("Title Case", ex);
            }
        } 
    }
}
