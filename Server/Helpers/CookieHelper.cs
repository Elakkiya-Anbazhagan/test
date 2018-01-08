using Systemic.Library;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;


namespace School.Server
{
    public static class CookieHelper
    {
        public static void Set<T>(this IResponseCookies Cookies, string key, T value)
        {
            CookieOptions opt = new CookieOptions();
            opt.Path = "/";
            Cookies.Append(key, value.ToJsonSerialize().ToStringOrEmpty(), opt);
        }

        public static T Get<T>(this IRequestCookieCollection Cookies, string key) where T : new()
        {
            string value;
            return Cookies.TryGetValue(key, out value) ? default(T) : value.ToStringOrEmpty().ToJsonDeSerialize<T>();
        }
        public static void Clear(IRequestCookieCollection ClientCookies, IResponseCookies ServerCookies)
        {
            foreach (var item in ClientCookies)
            {
                ServerCookies.Append(item.Key, "");
            }
        }
    }
}