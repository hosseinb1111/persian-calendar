const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
  const toFa = n => String(n).replace(/\d/g, c => FA_DIGITS[c]);

  // Persian (Solar Hijri) month names, indexed 1-12.
  const MONTHS = ['', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
                  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  const WEEKDAYS_LONG = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];

  // Fixed-date occasions on the Persian calendar, keyed "month-day".
  // holiday: true = official public holiday (تعطیل رسمی); false = cultural occasion.
  // Lunar-calendar occasions (Ramadan, Eids, Ashura, etc.) move each year and are not included.
  const OCCASIONS = {
    '1-1':   { title: 'نوروز، آغاز سال نو', holiday: true },
    '1-2':   { title: 'نوروز', holiday: true },
    '1-3':   { title: 'نوروز', holiday: true },
    '1-12':  { title: 'روز جمهوری اسلامی', holiday: true },
    '1-13':  { title: 'سیزده به‌در', holiday: true },
    '7-16':  { title: 'جشن مهرگان', holiday: false },
    '9-30':  { title: 'شب یلدا', holiday: false },
    '11-10': { title: 'جشن سده', holiday: false },
    '11-22': { title: 'پیروزی انقلاب اسلامی', holiday: true },
    '2-5':   { title: 'تاجگذاری رضاشاه پهلوی (۱۳۰۵)', holiday: false },
    '2-12':  { title: 'روز معلم', holiday: false },
    '2-25':  { title: 'روز بزرگداشت فردوسی', holiday: false },
    '4-17':  { title: 'روز خبرنگار', holiday: false },
    '8-4':   { title: 'تاجگذاری محمدرضاشاه پهلوی و فرح دیبا (۱۳۴۶)', holiday: false },
    '8-13':  { title: 'روز دانشجو', holiday: false },
    '12-29': { title: 'ملی شدن صنعت نفت', holiday: true }
  };

  const enPersian = new Intl.DateTimeFormat('en-u-ca-persian', { year: 'numeric', month: 'numeric', day: 'numeric' });
  const gregFmt = new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  function persianParts(date) {
    const p = {};
    for (const part of enPersian.formatToParts(date)) p[part.type] = part.value;
    return { y: +p.year, m: +p.month, d: +p.day };
  }

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  function occasionFor(date) {
    const p = persianParts(date);
    return OCCASIONS[p.m + '-' + p.d] || null;
  }

  function monthStart(date) {
    const p = persianParts(date);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - (p.d - 1));
  }

  function nextMonthStart(first) {
    const cur = persianParts(first).m;
    const d = new Date(first);
    do { d.setDate(d.getDate() + 1); } while (persianParts(d).m === cur);
    return d;
  }

  function prevMonthStart(first) {
    const cur = persianParts(first).m;
    const d = new Date(first);
    d.setDate(d.getDate() - 1);
    const prevMonth = persianParts(d).m;
    while (true) {
      const earlier = new Date(d);
      earlier.setDate(earlier.getDate() - 1);
      if (persianParts(earlier).m !== prevMonth) break;
      d.setDate(d.getDate() - 1);
    }
    return d;
  }

  const today = new Date();
  let first = monthStart(today);
  let selected = new Date(today);

  const grid = document.getElementById('grid');
  const monthEl = document.getElementById('month');
  const yearEl = document.getElementById('year');
  const detailsEl = document.getElementById('details');

  function showDetails(date) {
    selected = new Date(date);
    const p = persianParts(date);
    const weekday = WEEKDAYS_LONG[date.getDay()];
    const occ = occasionFor(date);

    let html = '<div class="date">' + weekday + '، ' + toFa(p.d) + ' ' + MONTHS[p.m] + ' ' + toFa(p.y) + '</div>';
    html += '<div class="greg">' + gregFmt.format(date) + '</div>';
    if (occ) {
      html += '<div class="event' + (occ.holiday ? ' holiday' : '') + '">' +
              '<span class="tag">' + (occ.holiday ? 'تعطیل' : 'مناسبت') + '</span>' + occ.title + '</div>';
    } else {
      html += '<div class="none">مناسبتی برای این روز ثبت نشده است.</div>';
    }
    detailsEl.innerHTML = html;
  }

  function render() {
    const p = persianParts(first);
    monthEl.textContent = MONTHS[p.m];
    yearEl.textContent = toFa(p.y);
    grid.innerHTML = '';

    const offset = (first.getDay() + 1) % 7;
    for (let i = 0; i < offset; i++) {
      const blank = document.createElement('div');
      blank.className = 'cell empty';
      grid.appendChild(blank);
    }

    let date = new Date(first);
    while (persianParts(date).m === p.m) {
      const cell = document.createElement('button');
      cell.className = 'cell';
      cell.type = 'button';
      const dayDate = new Date(date);
      cell.textContent = toFa(persianParts(dayDate).d);
      const occ = occasionFor(dayDate);
      if (dayDate.getDay() === 5) cell.classList.add('fri');
      if (occ && occ.holiday) cell.classList.add('holiday');
      if (occ && !occ.holiday) cell.classList.add('cultural');
      if (sameDay(dayDate, today)) cell.classList.add('today');
      if (sameDay(dayDate, selected)) cell.classList.add('selected');
      cell.setAttribute('aria-label', gregFmt.format(dayDate) + (occ ? ' - ' + occ.title : ''));
      cell.addEventListener('click', () => { showDetails(dayDate); render(); });
      grid.appendChild(cell);
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    }

    showDetails(persianParts(selected).m === p.m ? selected : first);
  }

  document.getElementById('next').addEventListener('click', () => { first = nextMonthStart(first); render(); });
  document.getElementById('prev').addEventListener('click', () => { first = prevMonthStart(first); render(); });
  document.getElementById('todayBtn').addEventListener('click', () => {
    first = monthStart(new Date());
    selected = new Date(today);
    render();
  });

  // Theme: follows the system by default; manual choice is remembered per viewer.
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeBtn.textContent = theme === 'dark' ? 'حالت روشن' : 'حالت تیره';
  }

  let saved = null;
  try { saved = localStorage.getItem('persian-calendar-theme'); } catch (e) {}
  applyTheme(saved || (systemDark.matches ? 'dark' : 'light'));

  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('persian-calendar-theme', next); } catch (e) {}
  });

  render();
