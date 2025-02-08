import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  datePicker: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  clockFace: {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
  },
};

let userSelectedDate = null;
let timerId = null;
refs.startBtn.disabled = true;

flatpickr(refs.datePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      refs.startBtn.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      refs.startBtn.disabled = false;
    }
  },
});

const timer = {
  start() {
    if (!userSelectedDate) return;

    if (timerId) clearInterval(timerId);

    refs.startBtn.disabled = true;
    refs.datePicker.disabled = true;

    timerId = setInterval(() => {
      const currentTime = Date.now();
      const ms = userSelectedDate - currentTime;

      if (ms <= 0) {
        clearInterval(timerId);
        refs.datePicker.disabled = false;
        refs.startBtn.disabled = true;
        updateClockFace({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const time = convertMs(ms);
      updateClockFace(time);
    }, 1000);
  },
};

refs.startBtn.addEventListener('click', () => timer.start());

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor(((ms % day) % hour) / minute),
    seconds: Math.floor((((ms % day) % hour) % minute) / second),
  };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function updateClockFace({ days, hours, minutes, seconds }) {
  refs.clockFace.days.textContent = addLeadingZero(days);
  refs.clockFace.hours.textContent = addLeadingZero(hours);
  refs.clockFace.minutes.textContent = addLeadingZero(minutes);
  refs.clockFace.seconds.textContent = addLeadingZero(seconds);
}
