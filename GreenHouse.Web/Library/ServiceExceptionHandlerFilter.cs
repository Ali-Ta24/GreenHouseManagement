using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace GreenHouse.Web.Library
{
    public class ServiceExceptionHandlerFilter : IActionFilter, IOrderedFilter
    {
        //private readonly IOptions<ServiceUrls> _serviceUrls;

        //public ServiceExceptionHandlerFilter(IOptions<ServiceUrls> serviceUrls)
        //{
        //    _serviceUrls = serviceUrls;
        //}
        public int Order => int.MaxValue - 10;

        public void OnActionExecuting(ActionExecutingContext context) { }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Exception is UnauthorizedAccessException httpResponseException)
            {

                context.HttpContext.Response.Headers.Add("login-address", "https://localhost:7188/Account/Login");
                context.Result = new ObjectResult("UnauthorizedAccessException")
                {
                    StatusCode = 401
                };

                context.ExceptionHandled = true;
            }
        }
    }
}
