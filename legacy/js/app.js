document.addEventListener('DOMContentLoaded', () => {
    // Translations
    const translations = {
        en: {
            'app-name': 'ZakatCalc',
            'page-title': 'Zakat Calculator',
            'nav-home': 'Home',
            'nav-zakat-fitr': 'Zakat Al-Fitr',
            'nav-zakat-fitr-full': 'Calculate Zakat Al-Fitr',
            'nav-zakat-mal': 'Zakat Al-Mal',
            'nav-zakat-mal-full': 'Calculate Zakat Al-Mal',
            'nav-about': 'About',
            'landing-title': 'Welcome to ZakatCalc',
            'landing-subtitle': 'Your trustworthy tool for calculating Zakat.',
            'fitr-title': 'Zakat Al-Fitr',
            'fitr-description': 'Quickly calculate Zakat Al-Fitr based on local food prices and family size.',
            'fitr-button': 'Go to Zakat Al-Fitr',
            'fitr-calculator-title': 'Zakat Al-Fitr Calculator',
            'fitr-helper-text': 'Calculate the amount of Zakat Al-Fitr due based on food prices and family size.',
            'mal-title': 'Zakat Al-Mal',
            'mal-description': 'Check if your wealth has reached the Nisaab and how much Zakat is due.',
            'mal-button': 'Go to Zakat Al-Mal',
            'nav-zakat-zuru': 'Zakat Al-Zuru',
            'nav-zakat-zuru-full': 'Calculate Zakat Al-Zuru',
            'zuru-title': 'Zakat Al-Zuru',
            'zuru-description': 'Calculate Zakat on agricultural produce based on irrigation type and harvest weight.',
            'zuru-button': 'Go to Zakat Al-Zuru',
            'zuru-calculator-title': 'Zakat Al-Zuru Calculator',
            'zuru-helper-text': 'Calculate Zakat on agricultural crops based on total harvest weight and irrigation method.',
            'zuru-weight-label': 'Total Harvest Weight (kg)',
            'zuru-weight-placeholder': 'e.g., 1000',
            'zuru-irrigation-label': 'Irrigation Type',
            'zuru-rainfed': 'Rainfed (10%)',
            'zuru-irrigated': 'Irrigated (5%)',
            'zuru-mixed': 'Mixed (7.5%)',
            'zuru-result-title': 'Zakat Al-Zuru Result',
            'zuru-result-nisaab': 'Zakat Nisaab (minimum threshold)',
            'zuru-result-eligible': 'This harvest is eligible for Zakat.',
            'zuru-result-not-eligible': 'This harvest is below the Nisaab. No Zakat is due.',
            'zuru-result-rate': 'Zakat Rate Applied:',
            'zuru-result-due': 'Total Zakat Due:',
            'mal-calculator-title': 'Zakat Al-Mal Calculator',
            'mal-helper-text': 'Use this calculator to estimate if you owe Zakat based on the current gold price.',
            'fitr-food-price-label': 'Food Price per Kilogram',
            'fitr-food-price-placeholder': 'e.g., 2.50',
            'fitr-currency-label': 'Currency',
            'fitr-individuals-label': 'Number of Individuals',
            'fitr-individuals-placeholder': 'e.g., 4',
            'mal-wealth-label': 'Total Liquid Wealth',
            'mal-wealth-placeholder': 'e.g., 50000',
            'mal-currency-label': 'Currency',
            'button-calculate': 'Calculate',
            'about-title': 'About ZakatCalc',
            'about-description': 'ZakatCalc is a bilingual web application that helps Muslims calculate Zakat Al-Fitr, Zakat Al-Mal, and Zakat Al-Zuru accurately using real-time gold prices, currency exchange rates, and Islamic jurisprudence.',
            'about-api-title': 'API Usage',
            'about-api-currency': 'Currency Rates: open.er-api.com/v6/latest/USD — Free public endpoint, no key required.',
            'about-api-gold': 'Gold Price: mintedmetal.com/api/prices.json — Free public endpoint, no key required. Price per ounce is converted to grams (÷ 31.1035).',
            'about-calc-fitr-title': 'Zakat Al-Fitr',
            'about-calc-fitr-text': 'Calculated as 3 kg of staple food per person, multiplied by the local food price per kilogram. No API needed.',
            'about-calc-mal-title': 'Zakat Al-Mal',
            'about-calc-mal-text': 'Wealth Zakat is due when your liquid wealth exceeds the Nisaab (85 grams of gold). The Nisaab is calculated using live gold prices and exchange rates. Zakat due is 2.5% of total liquid wealth.',
            'about-calc-zuru-title': 'Zakat Al-Zuru',
            'about-calc-zuru-text': 'Agricultural Zakat is due when the harvest weight reaches the Nisaab of 600 kg. The rate depends on irrigation: rainfed (10%), irrigated (5%), or mixed (7.5%).',
            'about-dev-title': 'Developer',
            'about-dev-name': 'Abdulrahman Alhaytham',
            'about-dev-role': 'Software Engineer',
            'footer-text': '© ZakatCalc. All Rights Reserved.',
            'fitr-result-title': 'Zakat Al-Fitr Result',
            'fitr-result-weight': 'Total Required Weight:',
            'fitr-result-value': 'Total Monetary Value:',
            'mal-result-title': 'Zakat Al-Mal Result',
            'mal-result-nisaab': 'Based on the current gold price, the Nisaab is approximately',
            'mal-result-above': 'Your wealth of',
            'mal-result-above-cont': 'is above the Nisaab.',
            'mal-result-due': 'Zakat Due (2.5%):',
            'mal-result-below': 'Your wealth of',
            'mal-result-below-cont': 'has not reached the Nisaab.',
            'error-invalid-input': 'Please provide a valid price and number of individuals.',
            'error-invalid-wealth': 'Please enter a valid, non-negative amount for your wealth.',
            'error-api-failed': 'Could not fetch financial data. Please check your connection and try again.',
            'error-currency-rate': 'Could not find an exchange rate for',
            'error-rates-load': 'Could not load currency rates. Please try again later.',
            'calculating': 'Calculating...',
            'button-copy': 'Copy Result',
            'copied-success': 'Result copied to clipboard!',
        },
        ar: {
            'app-name': 'حاسبة الزكاة',
            'page-title': 'حاسبة الزكاة',
            'nav-home': 'الرئيسية',
            'nav-zakat-fitr': 'زكاة الفطر',
            'nav-zakat-fitr-full': 'حساب زكاة الفطر',
            'nav-zakat-mal': 'زكاة المال',
            'nav-zakat-mal-full': 'حساب زكاة المال',
            'nav-about': 'حول',
            'landing-title': 'مرحباً بك في حاسبة الزكاة',
            'landing-subtitle': 'أداة موثوقة لحساب الزكاة.',
            'fitr-title': 'زكاة الفطر',
            'fitr-description': 'احسب زكاة الفطر بسرعة بناءً على أسعار الطعام المحلية وحجم الأسرة.',
            'fitr-button': 'انتقل إلى زكاة الفطر',
            'fitr-calculator-title': 'حاسبة زكاة الفطر',
            'fitr-helper-text': 'احسب مقدار زكاة الفطر المستحقة بناءً على أسعار الطعام وحجم الأسرة.',
            'mal-title': 'زكاة المال',
            'mal-description': 'تحقق مما إذا كان ثروتك قد وصلت إلى النصاب وكم مقدار الزكاة المستحقة.',
            'mal-button': 'انتقل إلى زكاة المال',
            'nav-zakat-zuru': 'زكاة الزروع',
            'nav-zakat-zuru-full': 'حساب زكاة الزروع',
            'zuru-title': 'زكاة الزروع',
            'zuru-description': 'احسب زكاة الزروع والثمار بناءً على نوع الري ووزن المحصول.',
            'zuru-button': 'انتقل إلى زكاة الزروع',
            'zuru-calculator-title': 'حاسبة زكاة الزروع',
            'zuru-helper-text': 'احسب زكاة المحاصيل الزراعية بناءً على الوزن الإجمالي للمحصول وطريقة الري.',
            'zuru-weight-label': 'الوزن الإجمالي للمحصول (كجم)',
            'zuru-weight-placeholder': 'مثال: 1000',
            'zuru-irrigation-label': 'نوع الري',
            'zuru-rainfed': 'ري طبيعي (مطر) - 10%',
            'zuru-irrigated': 'ري صناعي - 5%',
            'zuru-mixed': 'ري مختلط - 7.5%',
            'zuru-result-title': 'نتيجة زكاة الزروع',
            'zuru-result-nisaab': 'النصاب (الحد الأدنى)',
            'zuru-result-eligible': 'هذا المحصول بلغ النصاب، الزكاة واجبة.',
            'zuru-result-not-eligible': 'هذا المحصول لم يبلغ النصاب. لا زكاة واجبة.',
            'zuru-result-rate': 'نسبة الزكاة المطبقة:',
            'zuru-result-due': 'إجمالي الزكاة الواجبة:',
            'mal-calculator-title': 'حاسبة زكاة المال',
            'mal-helper-text': 'استخدم هذه الحاسبة لتقدير ما إذا كنت مديناً بالزكاة بناءً على سعر الذهب الحالي.',
            'fitr-food-price-label': 'سعر الطعام لكل كيلوغرام',
            'fitr-food-price-placeholder': 'مثال: 2.50',
            'fitr-currency-label': 'العملة',
            'fitr-individuals-label': 'عدد الأفراد',
            'fitr-individuals-placeholder': 'مثال: 4',
            'mal-wealth-label': 'إجمالي الثروة السائلة',
            'mal-wealth-placeholder': 'مثال: 50000',
            'mal-currency-label': 'العملة',
            'button-calculate': 'احسب',
            'about-title': 'حول حاسبة الزكاة',
            'about-description': 'حاسبة الزكاة هي تطبيق ويب ثنائي اللغة يساعد المسلمين على حساب زكاة الفطر وزكاة المال وزكاة الزروع بدقة باستخدام أسعار الذهب الحية وأسعار صرف العملات وأحكام الفقه الإسلامي.',
            'about-api-title': 'استخدام واجهة برمجة التطبيقات',
            'about-api-currency': 'أسعار العملات: open.er-api.com/v6/latest/USD — نقطة نهاية عامة مجانية، لا حاجة لمفتاح.',
            'about-api-gold': 'سعر الذهب: mintedmetal.com/api/prices.json — نقطة نهاية عامة مجانية، لا حاجة لمفتاح. يتم تحويل سعر الأونصة إلى الجرام (÷ 31.1035).',
            'about-calc-fitr-title': 'زكاة الفطر',
            'about-calc-fitr-text': 'تحسب بواقع 3 كجم من الطعام الأساسي لكل شخص، مضروبة في سعر الكيلوغرام المحلي. لا حاجة لواجهة برمجة تطبيقات.',
            'about-calc-mal-title': 'زكاة المال',
            'about-calc-mal-text': 'تجب زكاة المال عندما تتجاوز ثروتك السائلة النصاب (85 جراماً من الذهب). يحسب النصاب باستخدام أسعار الذهب الحية وأسعار الصرف. الزكاة المستحقة هي 2.5% من إجمالي الثروة السائلة.',
            'about-calc-zuru-title': 'زكاة الزروع',
            'about-calc-zuru-text': 'تجب زكاة الزروع عندما يصل وزن المحصول إلى النصاب وهو 600 كجم. تختلف النسبة حسب نوع الري: ري طبيعي (10%)، ري صناعي (5%)، أو ري مختلط (7.5%).',
            'about-dev-title': 'المطور',
            'about-dev-name': 'عبدالرحمن الهيثم',
            'about-dev-role': 'مهندس برمجيات',
            'footer-text': '© حاسبة الزكاة. جميع الحقوق محفوظة.',
            'fitr-result-title': 'نتيجة زكاة الفطر',
            'fitr-result-weight': 'إجمالي الوزن المطلوب:',
            'fitr-result-value': 'إجمالي القيمة النقدية:',
            'mal-result-title': 'نتيجة زكاة المال',
            'mal-result-nisaab': 'بناءً على سعر الذهب الحالي، النصاب هو تقريباً',
            'mal-result-above': 'ثروتك البالغة',
            'mal-result-above-cont': 'تتجاوز النصاب.',
            'mal-result-due': 'الزكاة المستحقة (2.5%):',
            'mal-result-below': 'ثروتك البالغة',
            'mal-result-below-cont': 'لم تصل إلى النصاب.',
            'error-invalid-input': 'يرجى إدخال سعر صحيح وعدد أفراد صحيح.',
            'error-invalid-wealth': 'يرجى إدخال مبلغ صحيح وغير سالب لثروتك.',
            'error-api-failed': 'تعذر جلب البيانات المالية. يرجى التحقق من اتصالك والمحاولة مرة أخرى.',
            'error-currency-rate': 'تعذر العثور على سعر صرف لـ',
            'error-rates-load': 'تعذر تحميل أسعار العملات. يرجى المحاولة مرة أخرى لاحقاً.',
            'calculating': 'جاري الحساب...',
            'button-copy': 'نسخ النتيجة',
            'copied-success': 'تم نسخ النتيجة إلى الحافظة!',
        }
    };

    // State
    const appState = {
        rates: null,
        lastUpdated: {
            rates: null,
            gold: null,
        },
        currentLang: localStorage.getItem('zakatcalc_lang') || 'ar',
    };

    // Elements
    const html = document.documentElement;
    const body = document.body;
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const themeToggle = document.getElementById('theme-toggle');
    const langToggle = document.getElementById('lang-toggle');
    const sidebar = document.getElementById('sidebar');
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const currencySelects = [document.getElementById('currency'), document.getElementById('mal-currency')];
    const fitrForm = document.getElementById('fitr-form');
    const fitrResults = document.getElementById('fitr-results');
    const malForm = document.getElementById('mal-form');
    const malResults = document.getElementById('mal-results');
    const zuruForm = document.getElementById('zuru-form');
    const zuruResults = document.getElementById('zuru-results');

    // --- Language Support ---
    function setupLanguage() {
        updateLanguage(appState.currentLang);
        
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                const newLang = appState.currentLang === 'en' ? 'ar' : 'en';
                appState.currentLang = newLang;
                localStorage.setItem('zakatcalc_lang', newLang);
                updateLanguage(newLang);
            });
        }
    }

    function updateLanguage(lang) {
        appState.currentLang = lang;
        html.setAttribute('lang', lang);
        html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                // Preserve HTML structure for elements that might contain HTML
                if (el.tagName === 'CODE') {
                    el.textContent = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });

        // Update page title
        if (translations[lang] && translations[lang]['page-title']) {
            document.title = translations[lang]['page-title'];
        }

        // Update placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                el.setAttribute('placeholder', translations[lang][key]);
            }
        });

        // Update select options
        ['irrigation-type'].forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                const options = select.querySelectorAll('option');
                options.forEach(option => {
                    const key = option.getAttribute('data-i18n');
                    if (key && translations[lang] && translations[lang][key]) {
                        option.textContent = translations[lang][key];
                    }
                });
            }
        });
    }

    function t(key) {
        return translations[appState.currentLang]?.[key] || translations.en[key] || key;
    }

    // --- Initialization ---
    async function initializeApp() {
        setupLanguage();
        setupTheme();
        setupNavigation();
        try {
            const ratesResult = await API.getCurrencyRates();
            appState.rates = ratesResult?.rates || null;
            appState.lastUpdated.rates = ratesResult?.timestamp || null;
            if (appState.rates) {
                populateCurrencyDropdowns();
            } else {
                showGlobalError(t('error-rates-load'));
            }
        } catch (error) {
            showGlobalError(t('error-rates-load'));
        }
        setupFitrForm();
        setupMalForm();
        setupZuruForm();
        setupInputFormatting();
    }

    // --- Input Formatting ---
    function setupInputFormatting() {
        const numberInputs = document.querySelectorAll('input[type="number"]');
        numberInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                // Remove any non-numeric characters except decimal point
                let value = e.target.value.replace(/[^\d.]/g, '');
                // Ensure only one decimal point
                const parts = value.split('.');
                if (parts.length > 2) {
                    value = parts[0] + '.' + parts.slice(1).join('');
                }
                // Update the input value
                if (value !== e.target.value) {
                    e.target.value = value;
                }
            });
        });
    }

    // --- UI and Navigation ---
    function setupNavigation() {
        hamburgerMenu.addEventListener('click', () => {
            body.classList.toggle('sidebar-open');
            sidebar.classList.toggle('open');
        });

        // Close sidebar when clicking on overlay (outside sidebar)
        body.addEventListener('click', (e) => {
            if (body.classList.contains('sidebar-open') && !sidebar.contains(e.target) && !hamburgerMenu.contains(e.target)) {
                body.classList.remove('sidebar-open');
                sidebar.classList.remove('open');
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                showPage(pageId);
                body.classList.remove('sidebar-open');
                sidebar.classList.remove('open');
            });
        });

        // Show landing page by default and highlight corresponding nav
        showPage('landing-page');
    }

    function setupTheme() {
        const storedTheme = localStorage.getItem('zakatcalc_theme');
        if (storedTheme === 'dark') {
            body.classList.add('dark-mode');
            updateThemeToggleIcon(true);
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const isDark = body.classList.toggle('dark-mode');
                localStorage.setItem('zakatcalc_theme', isDark ? 'dark' : 'light');
                updateThemeToggleIcon(isDark);
            });
        }
    }

    function updateThemeToggleIcon(isDark) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (!icon) return;
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }

    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.add('hidden');
            const results = page.querySelector('.results-container');
            if (results) {
                results.classList.remove('show');
            }
        });
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            // Scroll to top smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function populateCurrencyDropdowns() {
        const popularCurrencies = ['USD', 'EUR', 'GBP', 'SAR', 'EGP', 'AED', 'KWD', 'TRY', 'IDR', 'PKR'];
        // Sort popular currencies alphabetically, but place USD first.
        popularCurrencies.sort((a, b) => {
            if (a === 'USD') return -1;
            if (b === 'USD') return 1;
            return a.localeCompare(b);
        });

        const fragment = document.createDocumentFragment();
        popularCurrencies.forEach(currency => {
            if (appState.rates[currency]) {
                const option = document.createElement('option');
                option.value = currency;
                option.textContent = currency;
                fragment.appendChild(option);
            }
        });

        currencySelects.forEach(select => {
            if (!select) return;
            select.innerHTML = '';
            const clonedFragment = fragment.cloneNode(true);
            // Set default selection
            const preferredCurrency = detectUserCurrency();
            const optionToSelect = clonedFragment.querySelector(`option[value="${preferredCurrency}"]`);
            if (optionToSelect) {
                optionToSelect.selected = true;
            } else {
                const usdOption = clonedFragment.querySelector('option[value="USD"]');
                if (usdOption) usdOption.selected = true;
            }
            select.appendChild(clonedFragment);
        });
    }
    
    function showGlobalError(messageKey) {
        const message = typeof messageKey === 'string' && translations[appState.currentLang]?.[messageKey] 
            ? translations[appState.currentLang][messageKey] 
            : messageKey;
        showGlobalMessage(message, 'error');
        console.error("Global Error:", message);
    }

    function showGlobalMessage(message, type = 'info') {
        const globalMessage = document.getElementById('global-message');
        if (!globalMessage) return;

        globalMessage.textContent = message;
        globalMessage.classList.remove('hidden', 'global-message--error', 'global-message--info');
        globalMessage.classList.add(
            type === 'error' ? 'global-message--error' : 'global-message--info'
        );

        clearTimeout(globalMessage._dismissTimer);
        globalMessage._dismissTimer = setTimeout(() => {
            globalMessage.classList.add('hidden');
        }, 8000);
    }

    function clearGlobalMessage() {
        const globalMessage = document.getElementById('global-message');
        if (!globalMessage) return;
        globalMessage.classList.add('hidden');
    }

    // --- Utility Functions ---
    const REGION_CURRENCY = {
        US: 'USD', GB: 'GBP', EU: 'EUR', DE: 'EUR', FR: 'EUR', IT: 'EUR',
        ES: 'EUR', NL: 'EUR', SA: 'SAR', AE: 'AED', EG: 'EGP', KW: 'KWD',
        TR: 'TRY', ID: 'IDR', PK: 'PKR', QA: 'QAR', BH: 'BHD', JO: 'JOD',
        CA: 'CAD', AU: 'AUD', JP: 'JPY', CN: 'CNY', IN: 'INR', SG: 'SGD',
        MY: 'MYR', PH: 'PHP', BD: 'BDT', NG: 'NGN', ZA: 'ZAR',
    };

    function detectUserCurrency() {
        try {
            const locale = navigator.language || 'en-US';
            const parts = locale.split('-');
            const region = parts[parts.length - 1].toUpperCase();
            return REGION_CURRENCY[region] || 'USD';
        } catch {
            return 'USD';
        }
    }

    function formatNumber(num) {
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function scrollToResults(resultsElement) {
        setTimeout(() => {
            resultsElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    function copyToClipboard(text) {
        const fallbackCopy = () => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showSuccessMessage(t('copied-success'));
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showSuccessMessage(t('copied-success'));
            }).catch(fallbackCopy);
        } else {
            fallbackCopy();
        }
    }


    function showSuccessMessage(message) {
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        const mainContent = document.getElementById('main-content');
        mainContent.insertBefore(successMsg, mainContent.firstChild.nextSibling);
        setTimeout(() => {
            successMsg.remove();
        }, 3000);
    }

    function addResultActions(resultsElement, resultText, resultHTML, title) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'results-actions';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'result-action-btn';
        copyBtn.innerHTML = `<i class="fas fa-copy"></i> ${t('button-copy')}`;
        copyBtn.addEventListener('click', () => copyToClipboard(resultText));
        
        actionsDiv.appendChild(copyBtn);
        resultsElement.appendChild(actionsDiv);
    }

    // --- Zakat Al-Fitr Calculator ---
    function setupFitrForm() {
        fitrForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const foodPriceInput = document.getElementById('food-price');
            const individualsInput = document.getElementById('individuals');
            
            const foodPrice = parseFloat(foodPriceInput.value);
            const individuals = parseInt(individualsInput.value);
            const currency = document.getElementById('currency').value;
            const foodWeight = 3.0;

            if (isNaN(foodPrice) || foodPrice <= 0 || isNaN(individuals) || individuals <= 0) {
                fitrResults.innerHTML = `<p class="error">${t('error-invalid-input')}</p>`;
                fitrResults.classList.add('show');
                return;
            }

            const totalWeight = individuals * foodWeight;
            const totalValue = totalWeight * foodPrice;

            const resultHTML = `
                <h3>${t('fitr-result-title')}</h3>
                <p><strong>${t('fitr-result-weight')}</strong> ${formatNumber(totalWeight)} kg</p>
                <p><strong>${t('fitr-result-value')}</strong> <span class="accent-text">${formatNumber(totalValue)} ${currency}</span></p>
            `;

            const resultText = `${t('fitr-result-title')}\n${t('fitr-result-weight')} ${formatNumber(totalWeight)} kg\n${t('fitr-result-value')} ${formatNumber(totalValue)} ${currency}`;

            fitrResults.innerHTML = resultHTML;
            fitrResults.classList.add('show');
            addResultActions(fitrResults, resultText, resultHTML, t('fitr-result-title'));
            scrollToResults(fitrResults);
        });
    }

    // --- Zakat Al-Mal Calculator ---
    function setupMalForm() {
        malForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = malForm.querySelector('.cta-button');
            const wealth = parseFloat(document.getElementById('wealth').value);
            const currency = document.getElementById('mal-currency').value;

            malResults.classList.add('show');
            malResults.innerHTML = `<div class="loader"></div><p>${t('calculating')}</p>`;
            scrollToResults(malResults);

            if (isNaN(wealth) || wealth < 0) {
                malResults.innerHTML = `<p class="error">${t('error-invalid-wealth')}</p>`;
                return;
            }

            submitBtn.disabled = true;
            const goldResult = await API.getGoldPrice();
            submitBtn.disabled = false;

            if (!goldResult || !appState.rates) {
                malResults.innerHTML = `<p class="error">${t('error-api-failed')}</p>`;
                return;
            }

            appState.lastUpdated.gold = goldResult.timestamp;
            const goldPricePerGramUSD = goldResult.price;

            const nisaabInUsd = 85 * goldPricePerGramUSD;
            const conversionRate = appState.rates[currency];
            
            if (!conversionRate) {
                 malResults.innerHTML = `<p class="error">${t('error-currency-rate')} ${currency}.</p>`;
                return;
            }
            
            const nisaabInSelectedCurrency = nisaabInUsd * conversionRate;

            let resultHTML = `
                <h3>${t('mal-result-title')}</h3>
                <p>${t('mal-result-nisaab')} <br><strong>${formatNumber(nisaabInSelectedCurrency)} ${currency}</strong>.</p>
                <hr>`;

            let resultText = `${t('mal-result-title')}\n${t('mal-result-nisaab')} ${formatNumber(nisaabInSelectedCurrency)} ${currency}\n`;

            if (wealth >= nisaabInSelectedCurrency) {
                const zakatDue = wealth * 0.025;
                resultHTML += `<p>${t('mal-result-above')} <strong>${formatNumber(wealth)} ${currency}</strong> ${t('mal-result-above-cont')}</p>
                               <p><strong>${t('mal-result-due')}</strong> <span class="accent-text">${formatNumber(zakatDue)} ${currency}</span></p>`;
                resultText += `${t('mal-result-above')} ${formatNumber(wealth)} ${currency} ${t('mal-result-above-cont')}\n${t('mal-result-due')} ${formatNumber(zakatDue)} ${currency}`;
            } else {
                resultHTML += `<p>${t('mal-result-below')} <strong>${formatNumber(wealth)} ${currency}</strong> ${t('mal-result-below-cont')}</p>`;
                resultText += `${t('mal-result-below')} ${formatNumber(wealth)} ${currency} ${t('mal-result-below-cont')}`;
            }

            malResults.innerHTML = resultHTML;
            addResultActions(malResults, resultText, resultHTML, t('mal-result-title'));
        });
    }

    // --- Zakat Al-Zuru Calculator ---
    const ZURU_NISAAB = 600;

    function setupZuruForm() {
        zuruForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const weight = parseFloat(document.getElementById('harvest-weight').value);
            const rate = parseFloat(document.getElementById('irrigation-type').selectedOptions[0].dataset.rate);

            if (isNaN(weight) || weight <= 0) {
                zuruResults.innerHTML = `<p class="error">${t('error-invalid-input')}</p>`;
                zuruResults.classList.add('show');
                return;
            }

            const isEligible = weight >= ZURU_NISAAB;
            const zakatDue = isEligible ? weight * rate : 0;

            const ratePercent = (rate * 100).toFixed(1);

            let resultHTML = `
                <h3>${t('zuru-result-title')}</h3>
                <p><strong>${t('zuru-result-nisaab')}:</strong> ${ZURU_NISAAB} kg</p>
                <p><strong>${t('zuru-result-rate')}</strong> ${ratePercent}%</p>
                <hr>`;

            let resultText = `${t('zuru-result-title')}\n${t('zuru-result-nisaab')}: ${ZURU_NISAAB} kg\n${t('zuru-result-rate')} ${ratePercent}%\n`;

            if (isEligible) {
                resultHTML += `
                    <p>${t('zuru-result-eligible')}</p>
                    <p><strong>${t('zuru-result-due')}</strong> <span class="accent-text">${formatNumber(zakatDue)} kg</span></p>`;
                resultText += `${t('zuru-result-eligible')}\n${t('zuru-result-due')} ${formatNumber(zakatDue)} kg`;
            } else {
                resultHTML += `<p>${t('zuru-result-not-eligible')}</p>`;
                resultText += `${t('zuru-result-not-eligible')}`;
            }

            zuruResults.innerHTML = resultHTML;
            zuruResults.classList.add('show');
            addResultActions(zuruResults, resultText, resultHTML, t('zuru-result-title'));
            scrollToResults(zuruResults);
        });
    }

    // --- Start the App ---
    initializeApp();
});
