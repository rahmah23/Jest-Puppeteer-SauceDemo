const puppeteer = require('puppeteer');

const validCredential = {'username': 'standard_user', 'password': 'secret_sauce'};

test('Success login test', async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50
    });
    const page = await browser.newPage();
    await page.goto('https://www.saucedemo.com/');
    await page.waitForSelector('div.login_logo');
    const pageTitle = await page.title();
    expect(pageTitle).toBe('Swag Labs');
    
    await page.click('input#user-name');
    await page.type('input#user-name', validCredential.username);
    await page.click('input#password');
    await page.type('input#password', validCredential.password);
    
    await page.click('input#login-button');
    await page.waitForSelector('div.app_logo');
    let pageUrl = await page.url();
    expect(pageUrl).toBe('https://www.saucedemo.com/inventory.html');

    await page.click('button#react-burger-menu-btn');
    await page.click('a#logout_sidebar_link');
    await page.waitForSelector('div.login_logo');
    
    await browser.close();
}, 30000)

const credential = [
    ['invalid username', 'test_user', 'secret_sauce', 'Epic sadface: Username and password do not match any user in this service'],
    ['incorrect password', 'standard_user', '123456', 'Epic sadface: Username and password do not match any user in this service'],
    ['missing username', '', 'secret_sauce', 'Epic sadface: Username is required'],
    ['missing password', 'standard_user', '', 'Epic sadface: Password is required']
];

test.each(credential)('Failed login test - %s', async (title, username, password, errorMessage) => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50
    });
    const page = await browser.newPage();
    await page.goto('https://www.saucedemo.com/');
    await page.waitForSelector('div.login_logo');
    const pageTitle = await page.title();
    expect(pageTitle).toBe('Swag Labs');
    
    await page.click('input#user-name');
    await page.type('input#user-name', username);
    await page.click('input#password');
    await page.type('input#password', password);        
    await page.click('input#login-button');

    await page.waitForSelector('div.error-message-container');
    const errorText = await page.$eval('h3', element => element.textContent);
    expect(errorText).toBe(errorMessage);
    
    await browser.close();
}, 15000)