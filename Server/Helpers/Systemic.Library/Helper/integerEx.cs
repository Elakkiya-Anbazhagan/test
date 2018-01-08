/*
 * Author       :   Prabakaran
 * Date         :   24-12-2016
 * Description  :   This Class Contain Integer Conversion Related Extension Methods.
 */

using System;

namespace Systemic.Library
{
    /// <summary>
    /// This Class Contain Integer Conversion Related Extension Methods.
    /// </summary>
    public static class integerEx
    {
        #region Integer Conversion

        /// <summary>
        ///     Converts the value of the specified object to a 16-bit signed integer
        /// <code>
        ///     obj.ToInt16();    
        /// </code>
        /// </summary>
        /// <param name="obj">Object</param>
        /// <returns>16-bit signed integer</returns>
        public static short ToInt16(this object obj)
        {
            try
            {
                if (obj == null)
                    return 0;
                return (short)(obj.ToString().Length <= 0 ? 0 : Convert.ToInt16(obj));
            }
            catch (Exception ex)
            {
                throw obj.ThrowConvertionError("Int16", ex);
            }
        }

        /// <summary>
        ///     Converts the value of the specified object to a 32-bit signed integer
        /// <code>
        ///     obj.ToInt32();    
        /// </code>
        /// </summary>
        /// <param name="obj">Object</param>
        /// <returns>32-bit signed integer</returns>
        public static int ToInt32(this object obj)
        {
            try
            {
                if (obj == null)
                    return 0;
                return obj.ToString().Length <= 0 ? 0 : Convert.ToInt32(obj);
            }
            catch (Exception ex)
            {
                throw obj.ThrowConvertionError("Int32", ex);
            }
        }

        /// <summary>
        ///     Converts the value of the specified object to a 64-bit signed integer
        /// <code>
        ///     obj.ToInt64();    
        /// </code>
        /// </summary>
        /// <param name="obj">Object</param>
        /// <returns>64-bit signed integer</returns>
        public static long ToInt64(this object obj)
        {
            try
            {
                if (obj == null)
                    return 0;
                return obj.ToString().Length <= 0 ? 0 : Convert.ToInt64(obj);
            }
            catch (Exception ex)
            {
                throw obj.ThrowConvertionError("Int64", ex);
            }
        }

        /// <summary>
        ///     Converts the value of the specified Object to a 32-bit signed integer
        /// <code>
        ///     obj.ToInt();    
        /// </code>
        /// </summary>
        /// <param name="obj">Object</param>
        /// <returns>32-bit signed integer</returns>
        public static int ToInt(this object obj)
        {
            try
            {
                if (obj == null)
                    return 0;
                string value = obj.ToStringOrEmpty();
                    
                return obj.ToString().Length <= 0 ? 0 : Convert.ToInt32(value.Substring(0, value.IndexOf('.') > 0 ? value.IndexOf('.') : value.Length));
            }
            catch (Exception ex)
            {
                throw obj.ThrowConvertionError("Int", ex);
            }
        }

        #endregion
    }
}
