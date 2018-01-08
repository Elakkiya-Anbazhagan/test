using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using School.Server;
using School.Server.Extensions;

namespace School
{
    public class Startup
    {
        // Order or run
        //1) Constructor
        //2) Configure services
        //3) Configure

        private IHostingEnvironment _hostingEnv;
        public Startup(IHostingEnvironment env)
        {
            _hostingEnv = env;

            var builder = new ConfigurationBuilder()
                           .SetBasePath(env.ContentRootPath)
                           .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                           .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                           .AddEnvironmentVariables();

            Configuration = builder.Build();
        }

        public static IConfigurationRoot Configuration { get; set; }
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddOptions();

            services.Configure<AppConfig>(Configuration.GetSection("AppConfig"));

            services.AddResponseCompression(options =>
            {
                options.MimeTypes = Helpers.DefaultMimeTypes;
            });



            services.AddAntiforgery(options => options.HeaderName = "CSRF-TOKEN");

            services.AddCustomizedMvc();

            services.AddNodeServices();

            services.AddDistributedMemoryCache();

            services.AddMemoryCache();

            services.AddSession(options =>
           {
               options.IdleTimeout = TimeSpan.FromHours(2);
               options.CookieName = "School.Matrix";
           });
        }
        public void Configure(IApplicationBuilder app)
        {
            app.UseSession();

            app.AddDevMiddlewares();

            if (_hostingEnv.IsProduction())
            {
                app.UseResponseCompression();
            }
            else
            {

                app.UseExceptionHandler("/Home/Error");
            }

            app.UseXsrf();

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                       name: "default",
                       template: "{controller=App}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "App", action = "Index" });
            });
        }
    }
}
