document.addEventListener('DOMContentLoaded', () => {
    // Translations
    const translations = {
        en: {
            'app-name': 'ZakatCalc',
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
            'mal-title': 'Zakat Al-Mal',
            'mal-description': 'Check if your wealth has reached the Nisaab and how much Zakat is due.',
            'mal-button': 'Go to Zakat Al-Mal',
            'mal-calculator-title': 'Zakat Al-Mal Calculator',
            'mal-helper-text': 'Use this calculator to estimate if you owe Zakat based on the current gold price.',
            'fitr-food-price-label': 'Food Price per Kilogram',
            'fitr-food-price-placeholder': 'e.g., 2.50',
            'fitr-currency-label': 'Currency',
            'fitr-individuals-label': 'Number of Individuals',
            'fitr-individuals-placeholder': 'e.g., 4',
            'fitr-food-type-label': 'Food Type',
            'food-rice': 'Rice (2.0 kg)',
            'food-wheat': 'Wheat (2.5 kg)',
            'food-dates': 'Dates (3.0 kg)',
            'food-raisins': 'Raisins (1.625 kg)',
            'food-corn': 'Corn (2.0 kg)',
            'mal-wealth-label': 'Total Liquid Wealth',
            'mal-wealth-placeholder': 'e.g., 50000',
            'mal-currency-label': 'Currency',
            'button-calculate': 'Calculate',
            'about-title': 'About ZakatCalc',
            'about-description-1': 'ZakatCalc is a modern, easy-to-use web application designed to help Muslims around the world calculate their Zakat accurately and with confidence. Our goal is to provide a reliable tool that simplifies the process of fulfilling this important pillar of Islam.',
            'about-description-2': 'The application uses real-time financial data for currency exchange rates and the market price of gold to ensure that the calculations for both Zakat Al-Fitr and Zakat Al-Mal are as precise as possible.',
            'about-api-title': 'API Usage',
            'about-api-intro': 'ZakatCalc uses two public APIs to fetch real-time financial data:',
            'about-api-currency': 'Currency Exchange Rates: https://open.er-api.com/v6/latest/USD - Provides up-to-date exchange rates for various currencies based on USD.',
            'about-api-gold': 'Gold Price: https://data-asg.goldprice.org/dbXRates/USD - Provides the current market price of gold per ounce, which is converted to per gram for calculations.',
            'about-api-note': 'These APIs are called automatically when you use the calculators. No API keys are required as we use free public endpoints.',
            'about-calc-fitr-title': 'How We Calculate Zakat Al-Fitr',
            'about-calc-fitr-intro': 'Zakat Al-Fitr is calculated based on the amount of staple food required per person:',
            'about-calc-fitr-rice': 'Rice: 2.0 kg per person',
            'about-calc-fitr-wheat': 'Wheat: 2.5 kg per person',
            'about-calc-fitr-dates': 'Dates: 3.0 kg per person',
            'about-calc-fitr-raisins': 'Raisins: 1.625 kg per person',
            'about-calc-fitr-corn': 'Corn: 2.0 kg per person',
            'about-calc-fitr-formula': 'Formula:',
            'about-calc-fitr-step1': 'Total Weight = Number of Individuals × Food Weight per Person',
            'about-calc-fitr-step2': 'Total Monetary Value = Total Weight × Food Price per Kilogram',
            'about-calc-fitr-example': 'Example: For a family of 4 using rice at 2.50 per kg: Total Weight = 4 × 2.0 = 8.0 kg, Total Value = 8.0 × 2.50 = 20.00',
            'about-calc-mal-title': 'How We Calculate Zakat Al-Mal',
            'about-calc-mal-intro': 'Zakat Al-Mal is calculated based on the Nisaab (minimum threshold) which is equivalent to 85 grams of gold:',
            'about-calc-mal-step1': 'Nisaab Calculation: We fetch the current gold price per gram in USD, then calculate: Nisaab in USD = 85 grams × Gold Price per Gram',
            'about-calc-mal-step2': 'Currency Conversion: The Nisaab is then converted to your selected currency using real-time exchange rates.',
            'about-calc-mal-step3': 'Zakat Calculation: If your total liquid wealth is equal to or exceeds the Nisaab, you owe Zakat of 2.5% (0.025) of your total wealth.',
            'about-calc-mal-formula': 'Formula:',
            'about-calc-mal-formula1': 'Nisaab (in selected currency) = 85 × Gold Price per Gram (USD) × Exchange Rate',
            'about-calc-mal-formula2': 'If Wealth ≥ Nisaab: Zakat Due = Wealth × 0.025 (2.5%)',
            'about-calc-mal-formula3': 'If Wealth < Nisaab: No Zakat is due',
            'about-calc-mal-note': 'Note: The gold price and exchange rates are updated in real-time to ensure accuracy.',
            'about-disclaimer-title': 'Disclaimer',
            'about-disclaimer-text': 'This tool is intended for informational purposes only and should not be a substitute for consultation with a qualified religious scholar. While we strive for accuracy, we cannot guarantee the absolute correctness of every calculation. Please consult with your local Imam or scholar for definitive rulings.',
            'about-developer-title': 'Developer',
            'about-developer-text': 'This application was developed by a passionate software engineer dedicated to creating useful tools for the Muslim community.',
            'footer-text': '© 2025 ZakatCalc. All Rights Reserved.',
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
            'button-clear': 'Clear Form',
            'copied-success': 'Result copied to clipboard!',
        },
        ar: {
            'app-name': 'حاسبة الزكاة',
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
            'mal-title': 'زكاة المال',
            'mal-description': 'تحقق مما إذا كان ثروتك قد وصلت إلى النصاب وكم مقدار الزكاة المستحقة.',
            'mal-button': 'انتقل إلى زكاة المال',
            'mal-calculator-title': 'حاسبة زكاة المال',
            'mal-helper-text': 'استخدم هذه الحاسبة لتقدير ما إذا كنت مديناً بالزكاة بناءً على سعر الذهب الحالي.',
            'fitr-food-price-label': 'سعر الطعام لكل كيلوغرام',
            'fitr-food-price-placeholder': 'مثال: 2.50',
            'fitr-currency-label': 'العملة',
            'fitr-individuals-label': 'عدد الأفراد',
            'fitr-individuals-placeholder': 'مثال: 4',
            'fitr-food-type-label': 'نوع الطعام',
            'food-rice': 'أرز (2.0 كجم)',
            'food-wheat': 'قمح (2.5 كجم)',
            'food-dates': 'تمر (3.0 كجم)',
            'food-raisins': 'زبيب (1.625 كجم)',
            'food-corn': 'ذرة (2.0 كجم)',
            'mal-wealth-label': 'إجمالي الثروة السائلة',
            'mal-wealth-placeholder': 'مثال: 50000',
            'mal-currency-label': 'العملة',
            'button-calculate': 'احسب',
            'about-title': 'حول حاسبة الزكاة',
            'about-description-1': 'حاسبة الزكاة هي تطبيق ويب حديث وسهل الاستخدام مصمم لمساعدة المسلمين حول العالم على حساب زكاتهم بدقة وثقة. هدفنا هو توفير أداة موثوقة تبسط عملية أداء هذا الركن المهم من الإسلام.',
            'about-description-2': 'يستخدم التطبيق بيانات مالية في الوقت الفعلي لأسعار صرف العملات وسعر الذهب في السوق لضمان أن حسابات زكاة الفطر وزكاة المال دقيقة قدر الإمكان.',
            'about-api-title': 'استخدام واجهة برمجة التطبيقات',
            'about-api-intro': 'تستخدم حاسبة الزكاة واجهتين برمجيتين عامتين لجلب البيانات المالية في الوقت الفعلي:',
            'about-api-currency': 'أسعار صرف العملات: https://open.er-api.com/v6/latest/USD - يوفر أسعار صرف محدثة للعملات المختلفة بناءً على الدولار الأمريكي.',
            'about-api-gold': 'سعر الذهب: https://data-asg.goldprice.org/dbXRates/USD - يوفر سعر الذهب الحالي في السوق للأونصة، والذي يتم تحويله إلى الجرام للحسابات.',
            'about-api-note': 'يتم استدعاء هذه الواجهات البرمجية تلقائياً عند استخدام الحاسبات. لا حاجة لمفاتيح واجهة برمجة التطبيقات حيث نستخدم نقاط نهاية عامة مجانية.',
            'about-calc-fitr-title': 'كيف نحسب زكاة الفطر',
            'about-calc-fitr-intro': 'يتم حساب زكاة الفطر بناءً على كمية الطعام الأساسي المطلوبة لكل شخص:',
            'about-calc-fitr-rice': 'الأرز: 2.0 كجم لكل شخص',
            'about-calc-fitr-wheat': 'القمح: 2.5 كجم لكل شخص',
            'about-calc-fitr-dates': 'التمر: 3.0 كجم لكل شخص',
            'about-calc-fitr-raisins': 'الزبيب: 1.625 كجم لكل شخص',
            'about-calc-fitr-corn': 'الذرة: 2.0 كجم لكل شخص',
            'about-calc-fitr-formula': 'الصيغة:',
            'about-calc-fitr-step1': 'إجمالي الوزن = عدد الأفراد × وزن الطعام لكل شخص',
            'about-calc-fitr-step2': 'إجمالي القيمة النقدية = إجمالي الوزن × سعر الطعام لكل كيلوغرام',
            'about-calc-fitr-example': 'مثال: لعائلة مكونة من 4 أشخاص تستخدم الأرز بسعر 2.50 لكل كجم: إجمالي الوزن = 4 × 2.0 = 8.0 كجم، إجمالي القيمة = 8.0 × 2.50 = 20.00',
            'about-calc-mal-title': 'كيف نحسب زكاة المال',
            'about-calc-mal-intro': 'يتم حساب زكاة المال بناءً على النصاب (الحد الأدنى) والذي يعادل 85 جراماً من الذهب:',
            'about-calc-mal-step1': 'حساب النصاب: نجلب سعر الذهب الحالي لكل جرام بالدولار الأمريكي، ثم نحسب: النصاب بالدولار = 85 جرام × سعر الذهب لكل جرام',
            'about-calc-mal-step2': 'تحويل العملة: يتم بعد ذلك تحويل النصاب إلى العملة المختارة باستخدام أسعار الصرف في الوقت الفعلي.',
            'about-calc-mal-step3': 'حساب الزكاة: إذا كانت ثروتك السائلة الإجمالية تساوي أو تتجاوز النصاب، فإنك مدين بزكاة مقدارها 2.5% (0.025) من إجمالي ثروتك.',
            'about-calc-mal-formula': 'الصيغة:',
            'about-calc-mal-formula1': 'النصاب (بالعملة المختارة) = 85 × سعر الذهب لكل جرام (بالدولار) × سعر الصرف',
            'about-calc-mal-formula2': 'إذا كانت الثروة ≥ النصاب: الزكاة المستحقة = الثروة × 0.025 (2.5%)',
            'about-calc-mal-formula3': 'إذا كانت الثروة < النصاب: لا زكاة مستحقة',
            'about-calc-mal-note': 'ملاحظة: يتم تحديث سعر الذهب وأسعار الصرف في الوقت الفعلي لضمان الدقة.',
            'about-disclaimer-title': 'إخلاء المسؤولية',
            'about-disclaimer-text': 'هذه الأداة مخصصة لأغراض إعلامية فقط ولا ينبغي أن تكون بديلاً عن استشارة عالم ديني مؤهل. بينما نسعى جاهدين للدقة، لا يمكننا ضمان الصحة المطلقة لكل حساب. يرجى استشارة إمامك المحلي أو عالم ديني للحصول على أحكام نهائية.',
            'about-developer-title': 'المطور',
            'about-developer-text': 'تم تطوير هذا التطبيق بواسطة مهندس برمجيات متحمس مكرس لإنشاء أدوات مفيدة للمجتمع المسلم.',
            'footer-text': '© 2025 حاسبة الزكاة. جميع الحقوق محفوظة.',
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
            'button-clear': 'مسح النموذج',
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
        currentLang: localStorage.getItem('zakatcalc_lang') || 'en',
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

        // Update placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                el.setAttribute('placeholder', translations[lang][key]);
            }
        });

        // Update select options
        const foodTypeSelect = document.getElementById('food-type');
        if (foodTypeSelect) {
            const options = foodTypeSelect.querySelectorAll('option');
            options.forEach(option => {
                const key = option.getAttribute('data-i18n');
                if (key && translations[lang] && translations[lang][key]) {
                    option.textContent = translations[lang][key];
                }
            });
        }
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
            appState.rates = ratesResult?.rates || ratesResult || null;
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
            // Clear results when switching pages
            const results = page.querySelector('.results-container');
            if (results) {
                results.style.display = 'none';
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
            const defaultCurrency = (select.id === 'mal-currency') ? 'SAR' : 'USD';
            const optionToSelect = clonedFragment.querySelector(`option[value="${defaultCurrency}"]`);
            if(optionToSelect) optionToSelect.selected = true;
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
    }

    function clearGlobalMessage() {
        const globalMessage = document.getElementById('global-message');
        if (!globalMessage) return;
        globalMessage.classList.add('hidden');
    }

    // --- Utility Functions ---
    function formatNumber(num) {
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function scrollToResults(resultsElement) {
        setTimeout(() => {
            resultsElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showSuccessMessage(t('copied-success'));
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showSuccessMessage(t('copied-success'));
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showSuccessMessage(t('copied-success'));
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
            const foodWeight = parseFloat(document.getElementById('food-type').value);

            if (isNaN(foodPrice) || foodPrice <= 0 || isNaN(individuals) || individuals <= 0) {
                fitrResults.innerHTML = `<p class="error">${t('error-invalid-input')}</p>`;
                fitrResults.style.display = 'block';
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
            fitrResults.style.display = 'block';
            fitrResults.classList.add('show');
            
            addResultActions(fitrResults, resultText, resultHTML, t('fitr-result-title'));
            scrollToResults(fitrResults);
        });
    }

    // --- Zakat Al-Mal Calculator ---
    function setupMalForm() {
        malForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const wealth = parseFloat(document.getElementById('wealth').value);
            const currency = document.getElementById('mal-currency').value;

            malResults.style.display = 'block';
            malResults.classList.add('show');
            malResults.innerHTML = `<div class="loader"></div><p>${t('calculating')}</p>`;
            scrollToResults(malResults);

            if (isNaN(wealth) || wealth < 0) {
                malResults.innerHTML = `<p class="error">${t('error-invalid-wealth')}</p>`;
                return;
            }

            const goldPricePerGramUSD = await API.getGoldPrice();

            if (!goldPricePerGramUSD || !appState.rates) {
                malResults.innerHTML = `<p class="error">${t('error-api-failed')}</p>`;
                return;
            }

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

    // --- Start the App ---
    initializeApp();
});
