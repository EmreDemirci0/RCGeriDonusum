using Microsoft.VisualStudio.TestTools.UnitTesting;
using TestDeneme;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;
using OpenQA.Selenium.Firefox;

namespace TestDeneme.Tests
{
    [TestClass()]
    public class UnitTest1Tests
    {
        
        IWebDriver driver = new FirefoxDriver();
        
        [TestMethod()]
        public void UserLoginValues()
        {
            driver.Url = "localhost:3000/user/login";

            IWebElement emailTextField = driver.FindElement(By.ClassName("emailinput"));
            emailTextField.SendKeys("yemre.1268@gmail.com");
            
            IWebElement pwTextField = driver.FindElement(By.ClassName("pwinput"));
            pwTextField.SendKeys("123"+Keys.Enter);
            System.Threading.Thread.Sleep(2000);

        }
        [TestMethod()]
        public void UserConvertRecycleCoin()
        {
            UserLoginValues();//convertCoin

            IWebElement ConvertCoinTextField = driver.FindElement(By.ClassName("convertCoin"));
            ConvertCoinTextField.SendKeys("1000");
            System.Threading.Thread.Sleep(1000);
            IWebElement ConvertCoinButton = driver.FindElement(By.ClassName("exchangeButton"));
            ConvertCoinButton.Submit();
           
        }
        [TestMethod()]
        public void UserTransferRC()
        {
            UserLoginValues();//convertSHA
            IWebElement TransferSHAadress = driver.FindElement(By.ClassName("transferSHA"));
            TransferSHAadress.Clear();
            TransferSHAadress.SendKeys("09c325b649569cd807051111364f693f973867318ce3eb878e5935bfae009b00");//batuhana gönderdik

            IWebElement TransferCoinTextField = driver.FindElement(By.ClassName("transferCoin"));
            TransferCoinTextField.SendKeys("1");
            System.Threading.Thread.Sleep(1000);
            IWebElement TranferCoinButton = driver.FindElement(By.ClassName("transferButton"));
            System.Threading.Thread.Sleep(1000);
            
            TranferCoinButton.Submit();
            

        }
        [TestMethod()]
        public void AdminLoginValues()
        {
            driver.Url = "localhost:3000/admin/login";
            IWebElement AdminEmailTextField = driver.FindElement(By.ClassName("emailinput"));
            AdminEmailTextField.SendKeys("yemre.1268@gmail.com");

            IWebElement AdminpwTextField = driver.FindElement(By.ClassName("pwinput"));
            AdminpwTextField.SendKeys("123" + Keys.Enter);
            System.Threading.Thread.Sleep(2000);
        }
        [TestMethod()]
        public void AdminUpdateGlassAmount()
        {
            AdminLoginValues();
            IWebElement UpdateGlassAmountTextField = driver.FindElement(By.Name("Glass"));
            UpdateGlassAmountTextField.SendKeys("10");
            System.Threading.Thread.Sleep(1000);
            IWebElement ConfirmCoinButton = driver.FindElement(By.ClassName("updateButton"));
            ConfirmCoinButton.Submit();
        }
        
    }
}