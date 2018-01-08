// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Systemic.Library
{
    public class ApiException : Exception
    {
        public ApiException() { }

        public ApiException(string message) : base(message) { }

        public ApiException(string message, Exception inner) : base(message, inner) { }
        public ApiException(Exception ex) : base(ex.Message, ex.InnerException) { }
    }

    public class DeveloperKeyException : Exception
    {
        public DeveloperKeyException() { }

        public DeveloperKeyException(string message) : base(message) { }

        public DeveloperKeyException(string message, Exception inner) : base(message, inner) { }
        public DeveloperKeyException(Exception ex) : base(ex.Message, ex.InnerException) { }
    }

    public class PageAccessException : Exception
    {
        public PageAccessException() { }

        public PageAccessException(string message) : base(message) { }

        public PageAccessException(string message, Exception inner) : base(message, inner) { }
        public PageAccessException(Exception ex) : base(ex.Message, ex.InnerException) { }
    }
}