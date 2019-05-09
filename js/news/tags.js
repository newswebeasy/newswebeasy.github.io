'use restrict';

const pad2 = (x) => (x < 10 ? '0' : '') + x;

let page = {
  categories: 'easy',
  yyyy: '2018',
  mm: '05',
  dd: '09',
  tag: 'business'
};


$(document).ready(function () {

  let url_calendar = `https://newswebeasy.github.io/news/data/${page.yyyy}/${page.mm}/calendar.json`;
  $.getJSON(url_calendar, function (resp) {
    let dt = new Date(page.yyyy, parseInt(page.mm) - 1);

    let min_date = new Date(dt);
    if (min_date.getDay() != 0) {
      // 0: sunday, 1: monday
      min_date.setDate(min_date.getDate() - min_date.getDay())
    }

    let max_date = new Date(dt);
    max_date.setDate(32);
    max_date.setDate(0);
    if (max_date.getDay() != 6) {
      // 6: saturday
      max_date.setDate(max_date.getDate() + 6 - max_date.getDay());
    }

    let di = min_date;
    let week;
    while (di <= max_date) {
      if (di.getDay() == 0) {
        // sunday
        week = '<tr>'
      }
      if (di.getMonth() == dt.getMonth()) {
        let has_news = resp.dates[pad2(di.getDate())];
        if (has_news) {
          has_news = has_news[page.categories];
          if (has_news) {
            has_news = has_news[page.tag] > 0;
          }
        }
        if (has_news) {
          if (di.getDate() !== page.dd) {
            week += '<td>';
          } else {
            week += '<td class="current">';
          }
          let dd = pad2(di.getDate());
          let url = `/news/${page.categories}/tags/${page.tag}/${page.yyyy}/${page.mm}/${dd}/`;
          week += `<a href="${url}">${di.getDate()}</a>`;
          week += '</td>';
        } else {
          week += `<td class="gray"><span>${di.getDate()}</span></td>`;
        }

      } else {
        week += '<td>&nbsp;</td>'
      }

      if (di.getDay() == 6) {
        // saturday
        week += '</tr>'
        $(week).appendTo('#calendar');
      }

      di.setDate(di.getDate() + 1);
    }

    // prev month
    let prevMonthUrl;
    if (resp.prev && resp.prev[page.categories]) {
      let prevMonth = new Date(dt);
      prevMonth.setDate(0);
      let mm = pad2(prevMonth.getMonth() + 1);
      prevMonthUrl = `/news/${page.categories}/tags/${page.tag}/${prevMonth.getFullYear()}/${mm}/${resp.prev[page.categories + '_tags'][page.tag]}/`;

      $('#prevMonth').html(`<a href="${prevMonthUrl}" title="前の月 ${prevMonth.getFullYear()}年${mm}月">&lt;</a>`);
    }

    // next month
    let nextMonthUrl;
    if (resp.next && resp.next[page.categories]) {
      let nextMonth = new Date(dt);
      nextMonth.setDate(32);
      nextMonth.setDate(1);
      let mm = pad2(nextMonth.getMonth() + 1);
      nextMonthUrl = `/news/${page.categories}/tags/${page.tag}/${nextMonth.getFullYear()}/${mm}/${resp.next[page.categories + '_tags'][page.tag]}/`;

      $('#nextMonth').html(`<a href="${nextMonthUrl}" title="次の月 ${nextMonth.getFullYear()}年${mm}月">&gt;</a>`);
    }

    let dates = Object.entries(resp.dates);
    dates = dates.filter(x => x[1][page.categories] !== undefined && page.tag in x[1][page.categories]);
    dates = dates.map(x => x[0]);
    dates.sort();
    const dd_index = dates.indexOf(page.dd);

    // prev day
    let prevDayUrl;
    if (dd_index > 0) {
      prevDayUrl = `/news/${page.categories}/tags/${page.tag}/${page.yyyy}/${page.mm}/${dates[dd_index - 1]}/`;
    } else if (dd_index === 0) {
      prevDayUrl = prevMonthUrl;
    }
    if (prevDayUrl) {
      $('#prevDay').html(`<a class="button" href="${prevDayUrl}">&lt; 前の日</a>`);
    } else {
      $('#prevDay').html('<span class="button">&lt; 前の日</span>');
    }

    // next day
    let nextDayUrl;
    if (dd_index < dates.length - 1) {
      nextDayUrl = `/news/${page.categories}/tags/${page.tag}/${page.yyyy}/${page.mm}/${dates[dd_index + 1]}/`;
    } else if (dd_index === dates.length - 1) {
      nextDayUrl = nextMonthUrl;
    }
    if (nextDayUrl) {
      $('#nextDay').html(`<a class="button" href="${nextDayUrl}">次の日 &gt;</a>`)
    } else {
      $('#nextDay').html('<span class="button">次の日 &gt;</span>');
    }

  });
});