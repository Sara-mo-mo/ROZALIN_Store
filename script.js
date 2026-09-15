const buttons = document.querySelectorAll('.create-btn');

buttons.forEach(button => {
  button.addEventListener('click', function (e) {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const circle = document.createElement('span');
    circle.classList.add('ripple');
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    button.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 600);
  });
});

const buttons = document.querySelectorAll('.sign-in-btn');

buttons.forEach(button => {
  button.addEventListener('click', function (e) {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const circle = document.createElement('span');
    circle.classList.add('ripple');
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    button.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 600);
  });
});