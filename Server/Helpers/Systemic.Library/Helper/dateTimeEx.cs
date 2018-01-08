/*
 * Author       :   Prabakaran
 * Date         :   24-12-2016
 * Description  :   This Class Contain Decimal Conversion Related Extension Methods.
 */

using System;
using System.Globalization;

namespace Systemic.Library
{
    /// <summary>
    /// This Class Contain Decimal Conversion Related Extension Methods.
    /// </summary>
    public static class dateTimeEx
    {

        #region Date Time conversion
        /// <summary>
        /// Convert Object to specified format
        /// </summary>
        /// <param name="date"></param>
        /// <param name="sourceFormat"><seealso cref="DateFormat"/></param>
        /// <param name="destFormat"></param>
        /// <returns></returns>
        public static string ToDateTime(this object date, DateFormat sourceFormat, DateFormat destFormat)
        {
            try
            {
                return ConvertDate(date.ToStringOrEmpty(), sourceFormat, destFormat);
            }
            catch (Exception ex)
            {
                throw date.ThrowConvertionError($"DateTime ({sourceFormat} => {destFormat})", ex);
            }
        }
        /// <summary>
        /// Convert Object to specified format
        /// </summary>
        /// <param name="date"></param>
        /// <param name="sourceFormat"><see cref="DateFormat"/></param>
        /// <param name="destFormat"><see cref="DateFormat"/></param>
        /// <param name="seprator">Ex: '-' or '/'</param>
        /// <returns></returns>
        public static string ToDateTime(this object date, DateFormat sourceFormat, DateFormat destFormat, char seprator)
        {
            try
            {
                return ConvertDate(date.ToStringOrEmpty(), sourceFormat, destFormat).Replace("-", seprator.ToStringOrEmpty());
            }
            catch (Exception ex)
            {
                throw date.ThrowConvertionError($"DateTime ({sourceFormat} => {destFormat})", ex);
            }
        }

        #endregion

        internal static string ConvertDate(string date, DateFormat sourceFormat, DateFormat destFormat)
        {
            if (date.ToStringOrEmpty().Length == 0)
                return "";
            date = date.Replace("/", "-").Replace(".", "-");

            var destinationFormat = "{0:" + destFormat.Value + "}";
            return string.Format(destinationFormat, DateTime.ParseExact(date, sourceFormat.Value, CultureInfo.InvariantCulture));
        }
    }


    /// <summary>
    /// Date Format
    /// </summary>
    public class DateFormat
    {
        private DateFormat(string value) { Value = value; }
        internal string Value { get; set; }
        /// <summary>
        /// dd-MM-yyyy
        /// </summary>
        public static DateFormat DMY => new DateFormat("dd-MM-yyyy");

        /// <summary>
        /// MM-dd-yyyy
        /// </summary>
        public static DateFormat MDY => new DateFormat("MM-dd-yyyy");

        /// <summary>
        /// yyyy-MM-dd
        /// </summary>
        public static DateFormat YMD => new DateFormat("yyyy-MM-dd");

        /// <summary>
        /// dd-MM-yyyy hh:mm:ss
        /// </summary>
        public static DateFormat DMYHMS => new DateFormat("dd-MM-yyyy hh:mm:ss");

        /// <summary>
        /// MM-dd-yyyy hh:mm:ss
        /// </summary>
        public static DateFormat MDYHMS => new DateFormat("MM-dd-yyyy hh:mm:ss");

        /// <summary>
        /// yyyy-MM-dd hh:mm:ss
        /// </summary>
        public static DateFormat YMDHMS { get { return new DateFormat("yyyy-MM-dd hh:mm:ss"); } }
    }


    /// <summary>
    /// Time Zone Enumerator
    /// </summary>
    public class TimeZone
    {
        private TimeZone(string value) { Value = value; }
        protected string Value { get; set; }



        /// <summary>
        /// (UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi
        /// </summary>
        public static TimeZone India { get { return new TimeZone("India Standard Time"); } }
        /// <summary>
        /// (UTC-08:00) Pacific Time (US and Canada)
        /// </summary>
        public static TimeZone US { get { return new TimeZone("Pacific Standard Time"); } }
        /// <summary>
        /// (UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi
        /// </summary>
        public static TimeZone China { get { return new TimeZone("China Standard Time"); } }
        /// <summary>
        /// (UTC+08:00) Kuala Lumpur, Singapore
        /// </summary>
        public static TimeZone Singapore { get { return new TimeZone("Singapore Standard Time"); } }

    }
}
