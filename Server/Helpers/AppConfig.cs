namespace School
{
    public class AppConfig
    {
        public class Developer
        {
            public string Key { get; set; }
            public string BaseUrl { get; set; }
            public string Username { get; set; }
            public string Password { get; set; }
        }
        public class Application
        {
            public string BaseUrl { get; set; }
            public string GetUrl(string url) { return BaseUrl + url; }
            public string CompanyID { get; set; }
        }
        public class api
        {
            public Developer Developer { get; set; } = new Developer();
            public Application Application { get; set; } = new Application();
        }
        public class provider
        {
            public string Name { get; set; }
            public string Logo { get; set; }
        }
        public class company
        {
            public string Name { get; set; }
            public string Id { get; set; }
            public string Logo { get; set; }
        }
        public api Api { get; set; } = new api();
        public provider Provider { get; set; } = new provider();
        public company Company { get; set; } = new company();
    }
}