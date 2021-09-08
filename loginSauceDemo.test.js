//Pemanggilan module puppeteer
const puppeteer = require('puppeteer');

//Deklarasi variabel yang berisi username dan password yang valid yang berbentuk json
const validCredential = {'username': 'standard_user', 'password': 'secret_sauce'};

//Test script untuk skenario sukses login
test('Success login test', async () => {
    //Membuka browser baru dengan puppeteer
    const browser = await puppeteer.launch({
        //Argumen headless bernilai false agar menampilkan proses tes di browser
        headless: false,
        //Memperlambat jalannya puppeteer agar proses bisa terlihat (setiap aksi memiliki durasi 50ms)
        slowMo: 50
    });
    //Membuka halaman baru
    const page = await browser.newPage();
    //Pergi ke url https://www.saucedemo.com/
    await page.goto('https://www.saucedemo.com/');
    //Menunggu elemen div dengan class 'login_logo' terdeteksi di halaman browser sebelum melanjutkan proses
    await page.waitForSelector('div.login_logo');
    //Mendapatkan value dari title halaman
    const pageTitle = await page.title();
    //Matcher untuk membandingkan expected value dengan value dari title halaman
    expect(pageTitle).toBe('Swag Labs');
    
    //Melakukan klik pada elemen input dengan id 'user-name'
    await page.click('input#user-name');
    //Menginput username pada elemen input dengan id 'user-name'
    await page.type('input#user-name', validCredential.username);
    //Melakukan klik pada elemen input dengan id 'password'
    await page.click('input#password');
    //Menginput password pada elemen input dengan id 'password'
    await page.type('input#password', validCredential.password);
    //Melakukan klik pada elemen input dengan id 'login-button'
    await page.click('input#login-button');

    //Menunggu elemet div dengan class 'app_logo' terdeteksi di halaman browser sebelum melanjutkan proses
    await page.waitForSelector('div.app_logo');
    //Mendapatkan url halaman browser yang sedang aktif
    let pageUrl = await page.url();
    //Matcher untuk membandingkan expected url dengan url yang didapatkan
    expect(pageUrl).toBe('https://www.saucedemo.com/inventory.html');

    //Melakukan klik pada elemen button dengan id 'react-burger-menu-btn'
    await page.click('button#react-burger-menu-btn');
    //Melakukan klik pada elemen a dengan id 'logout_sidebar_link'
    await page.click('a#logout_sidebar_link');
    //Menunggu elemet div dengan class 'login_logo' terdeteksi di halaman browser sebelum melanjutkan proses
    await page.waitForSelector('div.login_logo');
    
    //Menutup browser
    await browser.close();
//Timeout 30s, seluruh proses test pada scope ini harus selesai kurang dari 30s
}, 30000)

//Deklarasi variabel yang berisi array 2 dimensi yang berisi data invalid untuk test
const invalidCredential = [
    ['invalid username', 'test_user', 'secret_sauce', 'Epic sadface: Username and password do not match any user in this service'],
    ['incorrect password', 'standard_user', '123456', 'Epic sadface: Username and password do not match any user in this service'],
    ['missing username', '', 'secret_sauce', 'Epic sadface: Username is required'],
    ['missing password', 'standard_user', '', 'Epic sadface: Password is required']
];

//Test script untuk skenario gagal login. 'test.each' digunakan agar script bisa running berkali-kali sebanyak data invalidCredential
test.each(invalidCredential)('Failed login test - %s', async (title, username, password, errorMessage) => {
    //Membuka browser baru dengan puppeteer
    const browser = await puppeteer.launch({
        //Argumen headless bernilai false agar menampilkan proses tes 
        headless: false,
        //Memperlambat jalannya puppeteer agar proses bisa terlihat (setiap aksi memiliki durasi 50ms)
        slowMo: 50
    });
    //Membuka halaman baru
    const page = await browser.newPage();
    //Pergi ke url https://www.saucedemo.com/
    await page.goto('https://www.saucedemo.com/');
    //Menunggu elemen div dengan class 'login_logo' terdeteksi di halaman browser sebelum melanjutkan proses
    await page.waitForSelector('div.login_logo');
    //Mendapatkan value dari title halaman
    const pageTitle = await page.title();
    //Matcher untuk membandingkan expected value dengan value dari title halaman
    expect(pageTitle).toBe('Swag Labs');
    
    //Melakukan klik pada elemen input dengan id 'user-name'
    await page.click('input#user-name');
    //Menginput username pada elemen input dengan id 'user-name'
    await page.type('input#user-name', username);
    //Melakukan klik pada elemen input dengan id 'password'
    await page.click('input#password');
    //Menginput password pada elemen input dengan id 'password'
    await page.type('input#password', password);
    //Melakukan klik pada elemen input dengan id 'login-button'
    await page.click('input#login-button');

    //Menunggu elemet div dengan class 'error-message-container' terdeteksi di halaman browser sebelum melanjutkan proses
    await page.waitForSelector('div.error-message-container');
    //Mendapatkan text yang berada pada elemen h3
    const errorText = await page.$eval('h3', element => element.textContent);
    //Matcher untuk membandingkan expected text dengan text yang didapatkan dari elemen h3
    expect(errorText).toBe(errorMessage);
    
    //Menutup Browser
    await browser.close();
//Timeout 15s, seluruh proses test pada scope ini harus selesai kurang dari 15s
}, 15000)