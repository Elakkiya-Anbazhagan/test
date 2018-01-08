using System;

namespace Systemic.Library
{
    internal static class Helper
    {
        private const string ErrorConvertion = "{2}Error while convert \"{0}\" as \"{1}\". Please check the value";

        #region Internal Helper Function
        internal static Exception ThrowConvertionError(this object obj, string methodName, Exception ex)
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
