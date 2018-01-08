/*
 * Author       :   Prabakaran
 * Date         :   24-12-2016
 * Description  :   This Class Contain Decimal Conversion Related Extension Methods.
 */

using System;

namespace Systemic.Library
{
    /// <summary>
    /// This Class Contain Decimal Conversion Related Extension Methods.
    /// </summary>
    public static  class decimalEx
    {
        /// <summary>
        ///     Converts the object to Decimal
        ///     <code>
        ///         obj.ToDecimal()
        ///     </code>
        /// </summary>
        /// <param name="obj">Object</param>
        /// <returns>Returns the Decimal. By Default It Return 0.</returns>
        public static decimal ToDecimal(this object obj)
        {
            try
            {
                var tempObj = obj.ToStringOrEmpty().Replace(",", "");

                return Convert.ToDecimal(tempObj);
            }
            catch (Exception ex)
            {
                throw obj.ThrowConvertionError("Decimal", ex);
            }
        }
        /// <summary>
        ///     Converts the object to Decimal
        ///     <code>
        ///         obj.ToDecimal(DecimalFormat.Flooring)
        ///     </code>
        /// </summary>
        /// <param name="obj">Object</param>
        /// <param name="format">Decimal Convertion Format <see cref="DecimalFormat"/></param>
        /// <returns>Returns the Decimal. By Default It Return 0.</returns>
        public static decimal ToDecimal(this object obj, DecimalFormat format)
        {
            try
            {
                var tempObj = obj.ToStringOrEmpty().Replace(",", "");
                switch (format)
                {
                    case DecimalFormat.Ceiling:
                        return Math.Ceiling(Convert.ToDecimal(tempObj));
                    case DecimalFormat.Flooring:
                        return Math.Floor(Convert.ToDecimal(tempObj));
                    case DecimalFormat.Round:
                        return Math.Round(Convert.ToDecimal(tempObj), 0);
                    case DecimalFormat.Normal:
                        return Convert.ToDecimal(tempObj);
                    default:
                        throw new Exception ("Decimal Format Not Specified");
                }
            }
            catch (Exception ex)
            {
                throw obj.ThrowConvertionError("Decimal", ex);
            }
        }
    }

    /// <summary>
    ///     Decimal Format(s) Available for Conversion
    /// </summary>
    public enum DecimalFormat
    {
        /// <summary>
        /// 1) 1    => 1.00
        /// 2) 1.50 => 1.50
        /// </summary>
        Normal,
        /// <summary>
        /// 1) 1.49 => 2.00
        /// 2) 1.50 => 2.00
        /// 3) 1.51 => 2.00
        /// </summary>
        Ceiling,
        /// <summary>
        /// 1) 1.49 => 1.00
        /// 2) 1.50 => 1.00
        /// 3) 1.51 => 1.00
        /// </summary>
        Flooring,
        /// <summary>
        /// 1) 1.49 => 1.00 
        /// 2) 1.50 => 1.00
        /// 3) 1.51 => 2.00
        /// </summary>
        Round
    }
}
