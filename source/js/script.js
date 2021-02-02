// smooth scroll to anchor
const anchors = document.querySelectorAll('a[href^="#"]');

for (let anchor of anchors) {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const goto = anchor.hasAttribute('href') ? anchor.getAttribute('href') : 'body';
    document.querySelector(goto).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
}
const setCursorPosition = (pos, elem) => {
  elem.focus();
  if (elem.setSelectionRange) elem.setSelectionRange(pos, pos);
  else if (elem.createTextRange) {
    let range = elem.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
};

function mask(e) {
  let matrix = this.defaultValue,
    i = 0,
    def = matrix.replace(/\D/g, ''),
    val = this.value.replace(/\D/g, '');
  def.length >= val.length && (val = def);
  matrix = matrix.replace(/[_\d]/g, function (a) {
    return val.charAt(i++) || '_';
  });
  this.value = matrix;
  i = matrix.lastIndexOf(val.substr(-1));
  i < matrix.length && matrix != this.defaultValue ? i++ : (i = matrix.indexOf('_'));
  setCursorPosition(i, this);
}
document.querySelector('.number__input').addEventListener('input', mask);

const ring = document.querySelector('.progress-ring');
const circle = document.querySelector('.progress-ring__circle');
const check = document.querySelector('.progress-ring__check');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = 0;

const setProgress = (percent) => {
  const offset = circumference + (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
  setTimeout(() => {
    check.style = `display: block;`;
  }, 3000);
};

ring.addEventListener('click', () => {
  setProgress(100);
});

const modal = document.querySelector('.modal');

window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const button = document.querySelector('.form__btn');
  const status = document.querySelector('.form__status');

  const success = () => {
    form.reset();
    button.style = 'display: none ';
    status.innerHTML = 'Сообщение отправлено!';
  };

  const error = () => {
    status.innerHTML = 'Oops! There was a problem.';
  };

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    modal.classList.add('modal--show');
    const data = new FormData(form);
    ajax(form.method, form.action, data, success, error);
  });
});

const ajax = (method, url, data, success, error) => {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== XMLHttpRequest.DONE) return;
    if (xhr.status === 200) {
      success(xhr.response, xhr.responseType);
    } else {
      error(xhr.status, xhr.response, xhr.responseType);
    }
  };
  xhr.send(data);
};

modal.addEventListener('click', (evt) => {
  if (!evt.target.closest('.modal__window')) {
    if (modal.classList.contains('modal--show')) {
      modal.classList.remove('modal--show');
    }
  }
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    if (modal.classList.contains('modal--show')) {
      modal.classList.remove('modal--show');
    }
  }
});
