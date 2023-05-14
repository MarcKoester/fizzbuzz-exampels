import {
  interval,
  take,
  map,
  tap,
  filter,
  count,
  startWith,
  fromEvent,
  exhaustMap,
  of,
} from 'rxjs';

const solutions = [
  { key: 'standard', fn: standard },
  { key: 'standardBetter', fn: standardBetter },
  { key: 'standardBetterWithoutModulo', fn: standardBetterWithoutModulo },
  { key: 'rxjs', fn: rxjs },
  { key: 'rxjsFast', fn: rxjsFast },
  { key: 'rxjsIfLess', fn: rxjsIfLess },
  { key: 'rxjsPipeOperators', fn: rxjsPipeOperators },
  { key: 'rxjsPipeOperatorsFactory', fn: rxjsPipeOperatorsFactory },
  { key: 'rxjsSingleRun', fn: rxjsSingleRun, asObservalble: true },
];

solutions.forEach((solution) => {
  var button = document.createElement('BUTTON');
  button.textContent = solution.key;
  if (solution.asObservalble) {
    solution.fn(button as any);
  } else {
    button.addEventListener('click', solution.fn as any);
  }
  document.getElementById('button-container').appendChild(button);
});

function standard() {
  for (let i = 0; i <= 100; i++) {
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

function standardBetter() {
  for (let i = 0; i <= 21; i++) {
    let value = '';
    if (i % 3 === 0) {
      value += 'Fizz';
    }
    if (i % 5 === 0) {
      value += 'Buzz';
    }
    console.log(value || i);
  }
}

function standardBetterWithoutModulo() {
  for (let i = 0; i <= 21; i++) {
    let value = '';
    if (!(i / 3).toString().split('.')[1]) {
      value += 'Fizz';
    }
    if (!(i / 5).toString().split('.')[1]) {
      value += 'Buzz';
    }
    console.log(value || i);
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
function rxjsFast() {
  of(...Array.from({ length: 100 }, (v, i) => i))
    .pipe(
      take(100),
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
    .pipe(take(21), starter, fizzer, buzzer, picker)
    .subscribe(console.log);
}

function rxjsPipeOperatorsFactory() {
  const fizzBuzzFactory = (name: string, modulo: number) =>
    map(([index, value]: [number, string]) => [
      index,
      value + (index % modulo === 0 ? name : ''),
    ]);

  const init = map((index: number) => [index, '']);
  const pick = map(
    ([index, value]: [number, string]) => value || index.toString()
  );

  interval()
    .pipe(
      take(100),
      init,
      fizzBuzzFactory('Fizz', 3),
      fizzBuzzFactory('Buzz', 5),
      pick
    )
    .subscribe(console.log);
}

function rxjsSingleRun(button: HTMLButtonElement) {
  const fizzBuzzFactory = (name: string, modulo: number) =>
    map(([index, value]: [number, string]) => [
      index,
      value + (index % modulo === 0 ? name : ''),
    ]);
  const init = map((index: number) => [index, '']);
  const pick = map(
    ([index, value]: [number, string]) => value || index.toString()
  );

  const source$ = fromEvent(button, 'click');

  source$
    .pipe(
      exhaustMap(() =>
        interval().pipe(
          take(100),
          init,
          fizzBuzzFactory('Fizz', 3),
          fizzBuzzFactory('Buzz', 5),
          pick
        )
      )
    )
    .subscribe(console.log);
}

// 0 -> 0 -> [0, ''] -> [0, 'Fizz'] -> [0, 'FizzBuzz'] -> 'FizzBuzz'
// 1 -> 1 -> [1, ''] -> [1, ''] -> [1, ''] -> '1'
// 2 -> 2 -> [2, ''] -> [2, ''] -> [2, ''] -> '2'
// 3 -> 3 -> [3, ''] -> [3, 'Fizz'] -> [2, 'Fizz'] -> 'Fizz'
// 4 -> 4 -> [4, ''] -> [4, ''] -> [4, ''] -> '4'
// 5 -> 5 -> [5, ''] -> [5, ''] -> [5, 'Buzz'] -> 'Buzz'
