using Systemic.Library;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;


namespace School.Server
{
    public static class SessionHelper
    {
        public static void Set<T>(this ISession session, string key, T value)
        {
            session.SetString(key, value.ToJsonSerialize());
        }

        public static T Get<T>(this ISession session, string key) where T : new()
        {
            try
            {
                var value = session.GetString(key);
                return value == null ? default(T) : value.ToJsonDeSerialize<T>();
            }
            catch (System.Exception)
            {
                return default(T);
            }
        }
    }
}