export function saveToLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromLS(key) {
  let value = JSON.parse(localStorage.getItem(key)) || [];

  return value;
}

export function formatTask(task) {
  return {
    title: task,
    completed: false,
    id: crypto.randomUUID(),
  };
}

export function debouncer(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
