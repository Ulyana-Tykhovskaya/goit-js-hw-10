import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const datePicker = document.querySelector('#datetime-picker');
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
refs.startBtn.disabled = true;

flatpickr(refs.datePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      alert('Please choose a date in the future');
      refs.startBtn.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      refs.startBtn.disabled = false;
    }
  },
});

const timer = {
  intervalId: null,
  start() {
    if (!userSelectedDate) return;

    this.intervalId = setInterval(() => this.tick(), 1000);
    refs.startBtn.disabled = true;
    refs.datePicker.disabled = true;
  },
  tick() {
    const currentTime = Date.now();
    const ms = userSelectedDate - currentTime;

    if (ms <= 0) {
      clearInterval(this.intervalId);
      refs.datePicker.disabled = false;
      refs.startBtn.disabled = true;
      updateClockFace({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const time = convertMs(ms);
    updateClockFace(time);
  },
};

refs.startBtn.addEventListener('click', () => timer.start());

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function updateClockFace({ days, hours, minutes, seconds }) {
  refs.clockFace.days.textContent = days;
  refs.clockFace.hours.textContent = addLeadingZero(hours);
  refs.clockFace.minutes.textContent = addLeadingZero(minutes);
  refs.clockFace.seconds.textContent = addLeadingZero(seconds);
}
