import { useEffect, useMemo, useRef, useState } from 'react';

const destinations = [
  ['draft', 'پیش‌نویس خصوصی'],
  ['article', 'مقاله سایت'],
  ['magazine', 'مجله معماری'],
  ['instagram', 'اینستاگرام'],
  ['youtube', 'یوتیوب'],
  ['pinterest', 'پینترست'],
  ['linkedin', 'لینکدین'],
  ['facebook', 'فیسبوک'],
  ['whatsapp', 'واتساپ'],
  ['gmail', 'جیمیل'],
  ['netlify', 'مدیریت سایت'],
];

const controlApps = [
  ['whatsapp', 'WhatsApp', 'پاسخ و پیگیری مشتری'],
  ['youtube', 'YouTube', 'ویدئو، شورت و Community'],
  ['instagram', 'Instagram', 'ریلز، کاروسل و استوری'],
  ['facebook', 'Facebook', 'پست، ریلز و پیام'],
  ['linkedin', 'LinkedIn', 'مقاله و پست حرفه‌ای'],
  ['pinterest', 'Pinterest', 'پین و بُرد'],
  ['gmail', 'Gmail', 'پیش‌نویس و پاسخ ایمیل'],
  ['netlify', 'Website', 'انتشار و کنترل سایت'],
];

export default function CommandCenter() {
  const isLocal = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
  const [provider, setProvider] = useState('ollama');
  const [destination, setDestination] = useState('draft');
  const [prompt, setPrompt] = useState('');
  const [secret, setSecret] = useState('');
  const [references, setReferences] = useState([]);
  const [generateImage, setGenerateImage] = useState(false);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [actionStatus, setActionStatus] = useState('idle');
  const [connections, setConnections] = useState([]);
  const [providers, setProviders] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('loading');
  const [connectionsCheckedAt, setConnectionsCheckedAt] = useState(null);
  const [inbox, setInbox] = useState({ items: [], sources: [] });
  const [inboxStatus, setInboxStatus] = useState('idle');
  const [installPrompt, setInstallPrompt] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(typeof Notification === 'undefined' ? 'unsupported' : Notification.permission);
  const [voiceLanguage, setVoiceLanguage] = useState('fa-IR');
  const [voiceStatus, setVoiceStatus] = useState('idle');
  const speechRef = useRef(null);
  const canRun = useMemo(() => prompt.trim().length >= 8 && (isLocal || secret.trim().length >= 8) && !['running', 'reading'].includes(status), [prompt, secret, status, isLocal]);
  const authHeaders = () => secret.trim().length >= 8 ? { authorization: `Bearer ${secret.trim()}` } : {};

  useEffect(() => {
    const existing = document.querySelector('meta[name="robots"]');
    const robots = existing || document.createElement('meta');
    const previous = existing?.content;
    robots.name = 'robots';
    robots.content = 'noindex, nofollow, noarchive';
    if (!existing) document.head.appendChild(robots);
    return () => {
      if (!existing) robots.remove();
      else robots.content = previous || 'index, follow';
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/command-center-status.json', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('status unavailable')))
      .then((payload) => {
        if (!active) return;
        setConnections(Array.isArray(payload.connections) ? payload.connections : []);
        setConnectionsCheckedAt(payload.checkedAt || null);
        setConnectionStatus('snapshot');
      })
      .catch(() => active && setConnectionStatus('error'));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const rememberInstall = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    window.addEventListener('beforeinstallprompt', rememberInstall);
    return () => window.removeEventListener('beforeinstallprompt', rememberInstall);
  }, []);

  const run = async () => {
    if (!canRun) return;
    setStatus('running');
    setResult(null);
    try {
      const response = await fetch('/api/ai-command-center', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ provider, destination, prompt: prompt.trim(), references, generateImage, mode: 'draft_only' }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message || 'اجرای فرمان ناموفق بود.');
      setResult(payload);
      setStatus('done');
    } catch (error) {
      const packageText = [
        'WORLD ARCH JOURNAL — COMMAND CENTER',
        `Provider: ${provider}`,
        `Destination: ${destination}`,
        `Generate image: ${generateImage ? 'yes' : 'no'}`,
        `Reference frames prepared: ${references.length}`,
        'Mode: draft first; do not publish, send or modify an account without my final approval.',
        '',
        prompt.trim(),
      ].join('\n');
      try {
        await navigator.clipboard.writeText(packageText);
        setResult({ handoff: true, handoffText: packageText, apiMessage: error instanceof Error ? error.message : 'Direct API unavailable.' });
        setStatus('done');
      } catch {
        setResult({ error: error instanceof Error ? error.message : 'خطای ناشناخته' });
        setStatus('error');
      }
    }
  };

  const magazineFactory = () => {
    setDestination('magazine');
    setProvider('gemini');
    setPrompt('Analyze the uploaded reference magazine or visual samples and build a complete original English World Arch Journal issue from zero to production-ready delivery. Include the cover, table of contents, page-by-page flatplan, full editorial copy, project facts, image and diagram briefs, captions, credits, source and media-rights checks, SEO metadata, website extracts, and coordinated social launch package. Preserve only the reference’s high-level professional rhythm; do not copy its text, logo, photographs, or distinctive artwork. Mark every missing fact for my review.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadExample = () => {
    setProvider('gemini');
    setDestination('magazine');
    setPrompt('یک مجله معماری انگلیسی حرفه‌ای درباره بازسازی فضاهای کوچک بساز. ساختار شامل کاور، فهرست، معرفی پروژه، کانسپت طراحی، مشخصات پروژه، پلان‌ها، توضیح تصاویر، نتیجه‌گیری، سئوی صفحه و بسته معرفی برای شبکه‌های اجتماعی باشد. محتوا کاملاً原创 و برای WORLD ARCH JOURNAL باشد؛ فعلاً منتشر نکن.');
    setResult(null);
    setPendingAction(null);
    setStatus('idle');
  };

  const prepareExternalAction = async () => {
    if (!canRun) return;
    setActionStatus('preparing');
    setPendingAction(null);
    try {
      const response = await fetch('/api/composio-command', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ phase: 'prepare', destination, command: prompt.trim() }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message || 'برنامه اجرای Composio آماده نشد.');
      setPendingAction(payload.actionPlan);
      setResult(payload);
      setActionStatus('approval');
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'خطای اجرای Composio' });
      setActionStatus('error');
    }
  };

  const executeExternalAction = async () => {
    if (!pendingAction) return;
    setActionStatus('executing');
    try {
      const response = await fetch('/api/composio-command', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ phase: 'execute', destination: pendingAction.destination, command: pendingAction.command, confirmation: 'EXECUTE_APPROVED' }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message || 'اجرای Composio ناموفق بود.');
      setResult(payload);
      setPendingAction(null);
      setActionStatus('done');
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'خطای اجرای Composio' });
      setActionStatus('error');
    }
  };

  const checkConnections = async () => {
    if (!isLocal && secret.trim().length < 8) {
      setResult({ error: 'ابتدا کلید خصوصی مدیریت را وارد کنید.' });
      setStatus('error');
      return;
    }
    setConnectionStatus('loading');
    try {
      const response = await fetch('/api/ai-command-center', { headers: authHeaders() });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message || 'اتصال‌ها بررسی نشدند.');
      setConnections(payload.connections || []);
      setProviders(payload.providers || {});
      setConnectionsCheckedAt(payload.checkedAt || new Date().toISOString());
      setConnectionStatus('done');
    } catch (error) {
      try {
        const fallback = await fetch('/command-center-status.json', { cache: 'no-store' }).then((response) => response.json());
        setConnections(fallback.connections || []);
        setConnectionsCheckedAt(fallback.checkedAt || null);
        setConnectionStatus('snapshot');
        setResult({ notice: 'وضعیت آخرین تست عملی Composio نمایش داده شد؛ بررسی زنده سرور پنل در دسترس نبود.' });
      } catch {
        setResult({ error: error instanceof Error ? error.message : 'اتصال‌ها بررسی نشدند.' });
        setStatus('error');
        setConnectionStatus('error');
      }
    }
  };

  const prepareFor = (slug, title) => {
    setDestination(slug === 'netlify' ? 'article' : slug);
    setPrompt(`Prepare an original ${title} content draft for World Arch Journal. Match our premium architectural identity, include a clear call to action, and do not publish until I approve the final preview.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshInbox = async () => {
    if (!isLocal && secret.trim().length < 8) {
      setResult({ error: 'ابتدا کلید خصوصی مدیریت را وارد کنید.' });
      setStatus('error');
      return;
    }
    setInboxStatus('loading');
    try {
      const response = await fetch('/api/control-inbox', { headers: authHeaders() });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message || 'صندوق پیام دریافت نشد.');
      setInbox({ items: payload.items || [], sources: payload.sources || [] });
      setInboxStatus('done');
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'صندوق پیام دریافت نشد.' });
      setStatus('error');
      setInboxStatus('error');
    }
  };

  const installApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    setInstallPrompt(null);
  };

  const enableNotifications = async () => {
    if (typeof Notification === 'undefined') return;
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };

  const toggleVoice = () => {
    if (voiceStatus === 'listening') {
      speechRef.current?.stop();
      return;
    }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceStatus('unsupported');
      return;
    }
    const recognition = new Recognition();
    recognition.lang = voiceLanguage;
    recognition.interimResults = true;
    recognition.continuous = false;
    let finalText = '';
    recognition.onstart = () => setVoiceStatus('listening');
    recognition.onresult = (event) => {
      let interimText = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0]?.transcript || '';
        if (event.results[index].isFinal) finalText += transcript;
        else interimText += transcript;
      }
      if (finalText) {
        setPrompt((current) => `${current}${current.trim() ? ' ' : ''}${finalText.trim()}`);
        finalText = '';
      }
      if (interimText) setVoiceStatus('listening');
    };
    recognition.onerror = (event) => setVoiceStatus(event.error === 'not-allowed' ? 'denied' : 'error');
    recognition.onend = () => setVoiceStatus((current) => current === 'listening' ? 'idle' : current);
    speechRef.current = recognition;
    recognition.start();
  };

  const imageData = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, mimeType: file.type, data: String(reader.result).split(',')[1] });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const videoFrames = (file) => new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    video.muted = true;
    video.preload = 'metadata';
    video.onerror = () => { URL.revokeObjectURL(url); reject(new Error('ویدئو خوانده نشد.')); };
    video.onloadedmetadata = async () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 960 / Math.max(video.videoWidth, video.videoHeight));
      canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
      canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
      const ctx = canvas.getContext('2d');
      const items = [];
      for (const ratio of [.05, .33, .66, .94]) {
        video.currentTime = Math.max(0, Math.min(video.duration - .05, video.duration * ratio));
        await new Promise((done) => { video.onseeked = done; });
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        items.push({ name: `${file.name} — frame ${Math.round(ratio * 100)}%`, mimeType: 'image/jpeg', data: canvas.toDataURL('image/jpeg', .72).split(',')[1], sourceType: 'video_frame', duration: Math.round(video.duration * 10) / 10 });
      }
      URL.revokeObjectURL(url);
      resolve(items);
    };
    video.src = url;
  });

  const addReferences = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 4);
    const oversized = files.find((file) => file.size > 80 * 1024 * 1024);
    if (oversized) {
      setResult({ error: `فایل «${oversized.name}» بیشتر از ۸۰ مگابایت است.` });
      setStatus('error');
      return;
    }
    setStatus('reading');
    try {
      const groups = await Promise.all(files.map((file) => file.type.startsWith('video/') ? videoFrames(file) : imageData(file).then((item) => [item])));
      setReferences(groups.flat().slice(0, 12));
      setStatus('idle');
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'فایل مرجع خوانده نشد.' });
      setStatus('error');
    }
  };

  return (
    <main className="command-center" dir="rtl">
      <header className="command-header">
        <a href="/">WORLD ARCH JOURNAL</a>
        <span>AI COMMAND CENTER</span>
      </header>
      <section className="command-hero">
        <p>مرکز فرمان خصوصی</p>
        <h1>یک پیام، سه مغز، همهٔ کانال‌ها</h1>
        <span>Gemini، GPT و Claude در شورای تصمیم‌گیری؛ Composio پل امن اتصال ابزارهاست.</span>
        <div className="command-live-note"><i className="command-dot connected" /> Gemini مستقل از Work پیش‌نویس می‌سازد؛ عملیات خارجی از مسیر امن Composio و فقط بعد از تأیید شما اجرا می‌شود.</div>
      </section>

      <section className="command-guide" aria-label="راهنمای استفاده">
        <div><b>۱</b><span>مغز و مقصد را انتخاب کن</span></div>
        <div><b>۲</b><span>فرمان را تایپ کن یا با میکروفن بگو</span></div>
        <div><b>۳</b><span>«ساخت پیش‌نویس» را بزن و نتیجه را بررسی کن</span></div>
        <button type="button" onClick={loadExample}>قرار دادن یک نمونه فرمان</button>
      </section>

      <section className="command-grid">
        <article className="command-card command-form">
          <label>مغز اجرا
            <div className="command-segmented">
              {['ollama', 'gemini', 'openai', 'anthropic', 'all'].map((item) => <button key={item} type="button" className={provider === item ? 'active' : ''} onClick={() => setProvider(item)}>{item === 'ollama' ? 'رایگان محلی' : item === 'openai' ? 'GPT' : item === 'anthropic' ? 'Claude' : item === 'all' ? 'هر سه' : 'Gemini'}{providers[item] && !providers[item].configured ? ' ◌' : ''}</button>)}
            </div>
          </label>
          <label>مقصد
            <select value={destination} onChange={(event) => setDestination(event.target.value)}>
              {destinations.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label>فرمان شما — از اینجا با هوش مصنوعی صحبت کن
            <textarea rows="8" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="مثلاً: یک پیش‌نویس انگلیسی درباره نمای پایدار برای اینستاگرام آماده کن؛ فعلاً منتشر نکن." />
            <div className="command-voice">
              <select aria-label="زبان تایپ صوتی" value={voiceLanguage} onChange={(event) => setVoiceLanguage(event.target.value)}>
                <option value="fa-IR">فارسی</option><option value="en-GB">English</option>
              </select>
              <button type="button" className={voiceStatus === 'listening' ? 'active' : ''} onClick={toggleVoice}>{voiceStatus === 'listening' ? 'توقف ضبط' : '🎙 تایپ صوتی'}</button>
              <span>{voiceStatus === 'denied' ? 'مجوز میکروفن مسدود است' : voiceStatus === 'unsupported' ? 'مرورگر تایپ صوتی را پشتیبانی نمی‌کند' : voiceStatus === 'error' ? 'صدا دریافت نشد؛ دوباره امتحان کنید' : voiceStatus === 'listening' ? 'در حال شنیدن…' : 'متن صدا به فرمان اضافه می‌شود'}</span>
            </div>
          </label>
          <label>نمونه تصویری یا ویدئویی
            <input type="file" accept="image/*,video/*" multiple onChange={addReferences} />
            <span className="command-reference-note">{references.length ? `${references.length} تصویر/فریم آماده تحلیل است` : 'حداکثر ۴ فایل؛ از هر ویدئو ۴ فریم کلیدی استخراج می‌شود.'}</span>
          </label>
          <label className="command-check"><input type="checkbox" checked={generateImage} onChange={(event) => setGenerateImage(event.target.checked)} /> تولید یک تصویر اصلی توسط GPT</label>
          {!isLocal && <label>کلید ورود پنل
            <input type="password" autoComplete="off" value={secret} onChange={(event) => setSecret(event.target.value)} placeholder="کلید خصوصی مدیریت" />
          </label>}
          {isLocal && <small>حالت امن محلی فعال است؛ کلید مدیریت در مرورگر نمایش داده نمی‌شود.</small>}
          <button type="button" onClick={magazineFactory}>کارخانه مجله از روی نمونه</button>
          {!prompt.trim() && <small className="command-run-hint">ابتدا فرمانت را در کادر بالا بنویس یا «قرار دادن یک نمونه فرمان» را بزن.</small>}
          <button className="command-run" type="button" disabled={!canRun} onClick={run}>{status === 'running' ? 'در حال اجرا…' : status === 'reading' ? 'در حال خواندن نمونه…' : '▶ اجرای فرمان و ساخت پیش‌نویس'}</button>
          {['facebook', 'linkedin', 'pinterest', 'whatsapp', 'youtube'].includes(destination) && <button type="button" disabled={!canRun || actionStatus === 'preparing' || actionStatus === 'executing'} onClick={prepareExternalAction}>{actionStatus === 'preparing' ? 'در حال آماده‌سازی…' : 'آماده‌سازی اجرای Composio'}</button>}
          <small>ساخت محتوا خصوصی است. ارسال یا انتشار عمومی فقط با تأیید جداگانه انجام می‌شود.</small>
        </article>

        <article className="command-card command-output" aria-live="polite">
          <div><span>RESULT</span><b className={`command-status ${status}`}>{status === 'done' ? 'آماده بازبینی' : status === 'running' ? 'در حال پردازش' : status === 'error' ? 'خطا' : 'منتظر فرمان'}</b></div>
          {!result && <p className="command-empty">تحلیل Gemini، GPT و Claude و تصمیم مشترک شورا اینجا نمایش داده می‌شود.</p>}
          {result?.error && <p className="command-error">{result.error}</p>}
          {result?.notice && <p className="command-warning">{result.notice}</p>}
          {result?.warning && <p className="command-warning">{result.warning}</p>}
          {pendingAction && <section className="command-handoff"><h2>تأیید اجرای واقعی</h2><p><b>{pendingAction.label}</b></p><pre>{pendingAction.command}</pre><button className="command-run" type="button" disabled={actionStatus === 'executing'} onClick={executeExternalAction}>{actionStatus === 'executing' ? 'در حال اجرا…' : 'تأیید و اجرا در Composio'}</button></section>}
          {result?.mode === 'executed' && <section className="command-result-block"><h2>Composio اجرا کرد</h2><pre>{JSON.stringify(result.execution, null, 2)}</pre></section>}
          {result?.handoff && <section className="command-handoff"><h2>فرمان آماده شد</h2><p>فرمان در کلیپ‌بورد کپی شد. آن را در چت «Revit AI &amp; Composio Control» Paste کنید تا از اتصال فعال Composio اجرا شود.</p><details><summary>مشاهده بسته فرمان</summary><pre>{result.handoffText}</pre></details></section>}
          {result?.outputs?.map((output) => (
            <section key={output.provider} className="command-result-block">
              <h2>{output.provider === 'ollama' ? 'هوش مصنوعی رایگان محلی' : output.provider === 'openai' ? 'GPT' : output.provider === 'anthropic' ? 'Claude' : 'Gemini'}</h2>
              <pre>{output.text}</pre>
            </section>
          ))}
          {result?.council?.length > 0 && <section className="command-council">
            <div><span>AI COUNCIL</span><b>{result.councilComplete ? 'اجماع سه‌مدلی' : 'بررسی ناقص'}</b></div>
            {result.council.map((output) => <article key={output.provider}><h3>{output.provider === 'openai' ? 'GPT' : output.provider === 'anthropic' ? 'Claude' : 'Gemini'}</h3><pre>{output.text}</pre></article>)}
          </section>}
          {result?.errors?.map((item) => <p className="command-warning" key={`${item.provider}-${item.message}`}>{item.provider === 'openai' ? 'GPT' : item.provider === 'openai-image' ? 'تصویر GPT' : String(item.provider).startsWith('anthropic') ? 'Claude' : 'Gemini'}: {item.message}</p>)}
          {result?.images?.map((item, index) => <figure className="command-generated" key={index}><img src={`data:${item.mimeType};base64,${item.data}`} alt="Generated draft visual" /><figcaption>تصویر پیشنهادی — پیش‌نویس خصوصی</figcaption></figure>)}
        </article>
      </section>

      <section className="command-control">
        <div className="command-control-title">
          <div><p>COMPOSIO CONTROL</p><h2>کنترل شبکه‌ها و سایت</h2></div>
          <button type="button" onClick={checkConnections} disabled={connectionStatus === 'loading'}>{connectionStatus === 'loading' ? 'در حال بررسی…' : 'بررسی اتصال‌ها'}</button>
        </div>
        {connectionsCheckedAt && <p className="command-checked-at">آخرین تست ثبت‌شده: {new Date(connectionsCheckedAt).toLocaleString('fa-IR')}</p>}
        <div className="command-app-grid">
          {controlApps.map(([slug, title, description]) => {
            const connection = connections.find((item) => item.slug === slug);
            const state = connection?.status || 'unknown';
            return <article className="command-app" key={slug}>
              <div><span className={`command-dot ${state}`} /> <b>{title}</b></div>
              <p>{description}</p>
              <small>{connection?.detail || (state === 'connected' ? 'متصل و آماده' : state === 'attention' ? 'نیازمند بازبینی اتصال' : state === 'not_connected' ? 'هنوز متصل نیست' : 'برای مشاهده، اتصال‌ها را بررسی کنید')}</small>
              <button type="button" onClick={() => prepareFor(slug, title)}>ساخت محتوا</button>
            </article>;
          })}
        </div>
        <p className="command-approval-note">انتشار، ارسال پیام، حذف یا تغییر حساب فقط بعد از پیش‌نمایش و تأیید نهایی شما اجرا می‌شود.</p>
      </section>

      <section className="command-inbox">
        <div className="command-control-title">
          <div><p>UNIFIED INBOX</p><h2>صندوق کنترل مرکزی</h2></div>
          <button type="button" onClick={refreshInbox} disabled={inboxStatus === 'loading'}>{inboxStatus === 'loading' ? 'در حال دریافت…' : 'دریافت پیام‌ها'}</button>
        </div>
        <div className="command-inbox-sources">
          {['whatsapp', 'instagram', 'facebook', 'linkedin', 'gmail', 'sms'].map((slug) => {
            const source = inbox.sources.find((item) => item.slug === slug);
            return <span key={slug}><i className={`command-dot ${source?.status || 'unknown'}`} />{slug === 'sms' ? 'SMS' : slug}</span>;
          })}
        </div>
        {inbox.items.length === 0 ? <div className="command-inbox-empty"><b>هنوز پیام زنده‌ای دریافت نشده است</b><p>{inboxStatus === 'done' ? 'اتصال‌های فعال بررسی شدند. دریافت خودکار پیام پس از فعال‌شدن Webhook هر شبکه شروع می‌شود.' : 'کلید مدیریت را وارد کنید و «دریافت پیام‌ها» را بزنید.'}</p></div> : <div className="command-message-list">{inbox.items.map((item) => <article key={item.id}><b>{item.sender}</b><span>{item.platform}</span><p>{item.preview}</p><button type="button">پیشنهاد پاسخ</button></article>)}</div>}
      </section>

      <section className="command-mobile">
        <div><p>MOBILE COMPANION</p><h2>اتصال گوشی به پنل</h2><span>نصب روی صفحه اصلی، اعلان‌های پنل و ارسال فایل از دوربین یا گالری.</span></div>
        <div className="command-mobile-actions">
          <button type="button" onClick={installApp} disabled={!installPrompt}>{installPrompt ? 'نصب روی گوشی' : 'از منوی مرورگر نصب کنید'}</button>
          <button type="button" onClick={enableNotifications} disabled={notificationPermission === 'granted' || notificationPermission === 'unsupported'}>{notificationPermission === 'granted' ? 'اعلان فعال است' : notificationPermission === 'denied' ? 'اعلان در مرورگر مسدود است' : notificationPermission === 'unsupported' ? 'اعلان پشتیبانی نمی‌شود' : 'فعال‌کردن اعلان'}</button>
        </div>
        <small>SMS: نیازمند اپ همراه اندروید و مجوز جداگانه؛ پیام‌های بانکی و کدهای ورود وارد AI نمی‌شوند.</small>
      </section>
    </main>
  );
}
