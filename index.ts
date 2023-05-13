import { interval, take, map, tap } from 'rxjs';

const solutions = [
  { key: 'standard', fn: standard },
  { key: 'rxjs', fn: rxjs },
  { key: 'rxjsIfLess', fn: rxjsIfLess },
  { key: 'rxjsPipeOperators', fn: rxjsPipeOperators },
  { key: 'rxjsPipeOperatorsFactory', fn: rxjsPipeOperatorsFactory },
];

solutions.forEach((solution) => {
  var button = document.createElement('BUTTON');
  button.textContent = solution.key;
  button.addEventListener('click', solution.fn);
  document.getElementById('button-container').appendChild(button);
});

function standard() {
  for (let i = 0; i <= 21; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      console.log('FizzBuzz');
    } else if (i % 3 === 0) {
      console.log('Fizz');
    } else if (i % 5 === 0) {
      console.log('Buzz');
    } else {
      console.log(i);
    }
  }
}

function rxjs() {
  interval()
    .pipe(
      take(21),
      map((num) => {
        if (num % 3 === 0 && num % 5 === 0) return 'FizzBuzz';
        else if (num % 3 === 0) return 'Fizz';
        else if (num % 5 === 0) return 'Buzz';
        return num;
      })
    )
    .subscribe(console.log);
}

function rxjsIfLess() {
  const rules = [
    { rule: (num) => num % 3 === 0 && num % 5 === 0, value: 'FizzBuzz' },
    { rule: (num) => num % 3 === 0, value: 'Fizz' },
    { rule: (num) => num % 5 === 0, value: 'Buzz' },
  ];
  interval()
    .pipe(
      take(21),
      map((num) => rules.find((rule) => rule.rule(num))?.value || num)
    )
    .subscribe(console.log);
}

function rxjsPipeOperators() {
  const starter = map((index: number) => [index, '']);
  const fizzer = map(([index, value]: [number, string]) => [
    index,
    value + (index % 3 === 0 ? 'Fizz' : ''),
  ]);
  const buzzer = map(([index, value]: [number, string]) => [
    index,
    value + (index % 5 === 0 ? 'Buzz' : ''),
  ]);
  const picker = map(([index, value]: [number, string]) => value || index);

  interval()
    .pipe(take(21), starter, buzzer, fizzer, picker)
    .subscribe(console.log);
}

function rxjsPipeOperatorsFactory() {
  const fizzBuzzFactory = (name: string, modulo: number) =>
    map(([index, value]: [number, string]) => [
      index,
      value + (index % modulo === 0 ? name : ''),
    ]);

  const starter = map((index: number) => [index, '']);
  const picker = map(([index, value]: [number, string]) => value || index);

  interval()
    .pipe(
      take(21),
      starter,
      fizzBuzzFactory('Fizz', 3),
      fizzBuzzFactory('Buzz', 5),
      picker
    )
    .subscribe(console.log);
}
