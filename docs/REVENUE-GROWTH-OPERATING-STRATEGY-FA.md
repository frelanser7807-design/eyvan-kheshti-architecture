# سیستم رشد و درآمد World Arch Journal

---
status: active-pilot
created: 2026-10-03
updated: 2026-10-03
owner: Farnaz Ghaffarian
timezone: Asia/Tehran
---

## نتیجهٔ ممیزی فعلی

زیرساخت فنی سایت سالم است، اما مسیر اندازه‌گیری و تبدیل هنوز کامل نیست. مشکل اصلی در این مرحله «کمبود محتوا» نیست؛ مشکل این است که کلیک، منبع ورودی و رسیدن مخاطب از شبکه‌ها به محصول Etsy به‌صورت قابل اتکا ثبت نمی‌شود.

### سایت و آنالیتیکس

- ۶۱ نشانی زندهٔ سایت بررسی شد؛ همه پاسخ ۲۰۰، Title، Canonical و H1 دارند.
- GA4 فعال است، اما در بازهٔ ۲۸روزهٔ 2026-09-05 تا 2026-10-02 فقط ۱ کاربر، ۱ نشست و ۴ بازدید صفحه ثبت کرده است.
- تنها منبع ثبت‌شده Direct بوده و رویدادها فقط `page_view`، `first_visit`، `scroll` و `session_start` هستند.
- در بازهٔ ۲۸روزهٔ قبل، داده‌ای ثبت نشده است؛ بنابراین هنوز امکان قضاوت آماری دربارهٔ رشد یا افت وجود ندارد.
- کلیک Etsy، کلیک CTA، پخش ویدیو، ارسال فرم، خبرنامه و خروجی شبکه‌های اجتماعی به‌صورت رویداد اختصاصی ثبت نمی‌شوند.
- Google Search Console هنوز متصل نیست؛ در نتیجه Click، Impression، CTR، Query و Average Position واقعی گوگل ناموجود است.

### شبکه‌ها

- YouTube فارسی: ۳٬۷۴۰ مشترک، ۵٬۵۶۵٬۱۹۲ بازدید، ۴۵۴ ویدیو؛ کانال دارای دارایی مخاطب است اما حدود ۹٫۵ ماه انتشار تازه نداشته است. در ۵۰ ویدیوی اخیر، ۴۷ توضیح خالی، ۰ لینک سایت و ۰ تگ ثبت شده است.
- YouTube انگلیسی: ۳ مشترک، ۳٬۱۲۳ بازدید و ۵ ویدیو؛ دو شورت ۹۳٫۳٪ بازدید کانال را ساخته‌اند. آدرس‌های قدیمی Netlify و هندل‌های ناهماهنگ باید حذف شوند.
- Instagram فارسی: ۲۱٬۴۲۸ دنبال‌کننده و ۳۱۰ محتوا. محتوای شگفتی/حادثه/کنجکاوی معماری Reach بالایی می‌سازد، اما CTA و لینک‌دهی به محصول کم است.
- Instagram انگلیسی: حساب تازه با ۶ ریل و Reach سی‌روزهٔ ۵۴۴؛ URL خام کپشن قابل کلیک نیست و باید از Bio و Story Link Sticker استفاده شود.
- Pinterest: ۱۳ پین، ۶ Monthly View و ۰ Outbound Click؛ پروفایل هنوز آدرس قدیمی دارد و کتاب کودک با برند معماری مخلوط شده است.
- Facebook: اتصال هست ولی Checkpoint مانع خواندن صفحه است.
- LinkedIn: پروفایل فعلی با نام و Headline ناقص است و دسترسی سازمانی لازم وجود ندارد.

## هدف تجاری

ساخت یک قیف قابل‌اندازه‌گیری که هر محتوای تأییدشده را به یکی از این خروجی‌ها برساند:

1. فروش محصول دیجیتال در Etsy؛
2. دریافت سفارش طراحی، ارائه یا معماری؛
3. رشد دارایی مخاطب و ایمیل؛
4. ساخت محصول و Bundle جدید از تقاضای واقعی؛
5. ایجاد درآمد دلاری قابل تکرار و قابل گزارش.

## معماری قیف

```text
محتوای فارسی یا انگلیسی
        ↓
صفحهٔ مقصد متناسب با همان موضوع و زبان
        ↓
پیش‌نمایش، مزیت، اعتماد، قیمت و CTA واحد
        ↓
لینک ردیابی‌شدهٔ /go/etsy/{product}
        ↓
Etsy Listing
        ↓
فروش، Favorite، Review و Bundle بعدی
```

برای محتوای بسیار خرید‌محور مانند Product Pin یا Story فروش، تست مستقیم Etsy مجاز است؛ برای آموزش، مقاله و YouTube، صفحهٔ محصول سایت اولویت دارد تا مخاطب گرم و کلیک قابل‌اندازه‌گیری شود.

## اولویت‌های ۷۲ ساعت اول

### P0 — اندازه‌گیری

1. اتصال Google Search Console و ثبت Sitemap.
2. افزودن رویدادهای GA4:
   - `view_product`
   - `outbound_etsy_click`
   - `product_video_play`
   - `download_click`
   - `newsletter_submit`
   - `contact_click`
   - `social_outbound_click`
   - `scroll_75`
3. افزودن پارامترهای `language`، `product_id`، `platform`، `campaign` و `content_id`.
4. ساخت لینک‌های کوتاه داخلی مانند `/go/etsy/almora` و `/go/etsy/interior-template` برای ثبت کلیک و هدایت به Listing صحیح.
5. استاندارد UTM برای تمام شبکه‌ها:

```text
utm_source / utm_medium / utm_campaign / utm_content / language
```

### P0 — یکپارچه‌سازی برند و لینک

- دامنهٔ اصلی در همه‌جا فقط `worldarchjournal.com` باشد.
- همهٔ Netlify URLهای قدیمی از Bio و Description حذف شوند.
- هندل صحیح Instagram، Pinterest و YouTube در سایت و کانال‌ها یکسان شود.
- برای فارسی و انگلیسی دو Landing Page جدا با پیام و CTA بومی ساخته شود.

### P1 — بهینه‌سازی فروش محصول

هر صفحهٔ محصول باید بالای Fold این موارد را داشته باشد:

- تصویر یا ویدیوی واقعی محصول؛
- نتیجه‌ای که خریدار می‌گیرد، نه فقط ویژگی فایل؛
- تعداد اسلاید/صفحه، فرمت، میزان ویرایش‌پذیری و سازگاری؛
- قیمت و دکمهٔ واحد خرید Etsy؛
- Preview چند صفحه‌ای؛
- FAQ، License، نحوهٔ دانلود و اعتماد؛
- Schema نوع Product و Offer؛
- پیشنهاد مرتبط یا Bundle.

پیشنهاد آزمایشی قیمت‌گذاری، بدون تغییر خودکار Listing:

- محصول تکی: قیمت فعلی نزدیک ۵ پوند حفظ شود؛
- Bundle دو قالب: تست بازهٔ ۸ تا ۹ پوند؛
- Lead Magnet رایگان: یک نمونهٔ ۳ اسلایدی یا Checklist ارائهٔ معماری برای جمع‌آوری ایمیل.

## موتور محتوای فروش‌محور

### ستون‌های فارسی

- ۵۰٪ حل مسئله: پلان، ابعاد، ارائه، قبل/بعد و اشتباهات رایج؛
- ۳۰٪ کنجکاوی و خبر معماری برای Reach؛
- ۲۰٪ Case Study، محصول و دعوت به مشاوره یا خرید.

### ستون‌های انگلیسی

- ۵۰٪ AI Architecture Prompt و Tutorial؛
- ۳۰٪ BIM/Revit و Technical Detail؛
- ۲۰٪ Template، Product Demo و Case Study.

### قاعدهٔ CTA

هر محتوا فقط یک CTA داشته باشد:

- Awareness: Save / Follow؛
- Consideration: Read / Download / View Preview؛
- Conversion: Buy on Etsy / Request a Quote / Consult.

## نقش هر پلتفرم

| پلتفرم | نقش | خروجی اصلی |
|---|---|---|
| سایت | منبع اصلی و صفحهٔ تبدیل | Product View، Etsy Click، Lead |
| YouTube فارسی | احیای اعتماد و جذب جست‌وجوی فارسی | سایت/خدمت/محصول مرتبط |
| YouTube انگلیسی | جست‌وجوی بین‌المللی و نمایش فرایند | Product Page یا Prompt Page |
| Instagram فارسی | Reach، اعتماد و سفارش | Story Link یا Landing فارسی |
| Instagram انگلیسی | Visual Discovery | Bio/Story Link به محصول یا Prompt |
| Pinterest | ورودی Evergreen و خرید‌محور | Product Page یا Etsy Direct Test |
| LinkedIn | اعتبار حرفه‌ای و سفارش B2B | Case Study و Consultation |
| Facebook | بازتوزیع و Community | Product/Article Click |
| Telegram Bot | داشبورد خصوصی تصمیم‌گیری | Report، Alert، Draft Approval |

## برنامهٔ پایلوت ۳۰روزه

### هفتهٔ ۱ — اندازه‌گیری و پاک‌سازی

- اتصال Search Console؛
- اجرای رویدادها و UTM؛
- اصلاح لینک و Bio همهٔ حساب‌ها؛
- ثبت Baseline سایت و کانال‌ها؛
- رفع Checkpoint Facebook و هویت LinkedIn.

### هفتهٔ ۲ — صفحات تبدیل و Listing

- بازطراحی دو صفحهٔ PowerPoint؛
- ساخت Preview، FAQ و CTA ردیابی‌شده؛
- بازنویسی عنوان، تصاویر اول و توضیح Etsy بر اساس نیت خرید؛
- ساخت یک Bundle و یک Lead Magnet به‌صورت Draft.

### هفتهٔ ۳ — انتشار آزمایشی

- YouTube فارسی: ۳ Short و ۱ ویدیوی ۳ تا ۶ دقیقه‌ای؛
- YouTube انگلیسی: ۳ Short و ۱ Long؛
- هر Instagram: سه Reel با Story Link؛
- برای هر محتوای اصلی دو تا سه Pin؛
- LinkedIn و Facebook: نسخهٔ بومی‌شده، نه کپی یکسان.

### هفتهٔ ۴ — بهینه‌سازی

- تکرار ۲۰٪ محتوای برنده؛
- توقف قالب‌های دارای Impression ولی بدون Click؛
- آزمون یک متغیر در هر نوبت: Hook یا Cover یا CTA؛
- تحلیل مسیر Platform → Landing → Etsy Click → Sale؛
- انتخاب محصول یا Bundle ماه بعد بر اساس تقاضا.

## KPIها

- سایت: Sessions، Engaged Sessions، Product View، Etsy Outbound Click و Lead؛
- گوگل: Impression، Click، CTR، Position و Query؛
- Etsy: Visits، Favorites، Conversion، Orders، Revenue و Review؛
- YouTube: Impressions CTR، Retention، Watch Time، Subscriber Gain و Site Click؛
- Instagram: Reach، Save، Share، Profile Visit و Link Tap؛
- Pinterest: Impression، Pin Click و Outbound Click؛
- درآمد: Revenue per Product، Revenue per Source و Conversion Rate.

تا زمانی که Baseline هفت‌روزه ساخته نشده، هدف درصدی قطعی تعیین نمی‌شود. هر هدف بعدی بر مبنای میانهٔ چهار هفته‌ای تنظیم خواهد شد.

## قواعد ایمنی و منبع حقیقت

- Google Drive: فایل‌های اصلی، دادهٔ خام، رسیدها و نسخهٔ خصوصی.
- Obsidian: تصمیم‌ها، فرضیه‌ها، یادگیری‌ها و Next Action.
- GitHub: کد، Schema، Config، تست و گزارش Redacted؛ بدون Token، Password، OTP، اطلاعات مشتری یا دادهٔ مالی.
- Etsy و پلتفرم‌ها: منبع حقیقت فروش و عملکرد همان پلتفرم.
- هیچ انتشار، تغییر قیمت، تبلیغ پولی یا پیام خارجی بدون تأیید فرناز انجام نمی‌شود.

## معیار موفقیت پایلوت

- همهٔ لینک‌ها دارای UTM یا Redirect قابل‌اندازه‌گیری باشند؛
- هیچ حساب فارسی و انگلیسی با هم اشتباه نشود؛
- حداقل ۹۰٪ فیلدهای گزارش روزانه کامل باشد؛
- بتوان برای هر فروش یا Lead، منبع محتمل را تا سطح Campaign ردیابی کرد؛
- حداقل یک فرمت محتوایی با کلیک واقعی به صفحهٔ محصول شناسایی شود؛
- گزارش هفتگی مشخص کند چه چیزی باید تکرار، اصلاح یا متوقف شود.


