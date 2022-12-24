using OpenQA.Selenium;
using OpenQA.Selenium.Firefox;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace TestDeneme
{
    class Program
    {
        static void Main(string[] args)
        {
            IWebDriver driver = new FirefoxDriver();
            driver.Url = "http://localhost:3000/user/login";

            driver.Manage().Window.Maximize();
            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(20);

            driver.FindElement(By.ClassName("emailinput")).SendKeys("yemre.1268@gmail.com");
            driver.FindElement(By.ClassName("pwinput")).SendKeys("123" + Keys.Enter);
        }
        [Fact]
        public void SiteyeGir()
        {
            IWebDriver driver = new FirefoxDriver();
            driver.Url = "http://localhost:3000/user/login";

            driver.Manage().Window.Maximize();
            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(20);

        }
    }
}
