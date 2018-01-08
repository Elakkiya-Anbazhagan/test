using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Systemic.Model
{
    public class mlAuth
    {
        public class Request
        {
            public string Username { get; set; }
            public string Password { get; set; }
            public string DeveloperKey { get; set; }
        }
        public class Validate
        {
            public string DevToken { get; set; }
            public string DevKey { get; set; }
        }
        public class Response
        {
            public string Token { get; set; }
            public string ExpireTime { get; set; }
        }
    }
}
