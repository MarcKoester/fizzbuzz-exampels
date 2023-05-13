import { interval, take, map, tap } from 'rxjs';

const solutions = [
  { key: 'standard', fn: standard },
  { key: 'rxjs', fn: rxjs },
  { key: 'rxjsIfLess', fn: rxjsIfLess },
  { key: 'rxjsWtf', fn: rxjsWtf },
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
      console.log('fizzbuzz');
    } else if (i % 3 === 0) {
      console.log('fizz');
    } else if (i % 5 === 0) {
      console.log('buzz');
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
        if (num % 3 === 0 && num % 5 === 0) return 'fizzbuzz';
        else if (num % 3 === 0) return 'fizz';
        else if (num % 5 === 0) return 'buzz';
        return num;
      })
    )
    .subscribe(console.log);
}

function rxjsIfLess() {
  const rules = [
    { rule: (num) => num % 3 === 0 && num % 5 === 0, value: 'fizzbuzz' },
    { rule: (num) => num % 3 === 0, value: 'fizz' },
    { rule: (num) => num % 5 === 0, value: 'buzz' },
  ];
  interval()
    .pipe(
      take(21),
      map((num) => rules.find((rule) => rule.rule(num))?.value || num)
    )
    .subscribe(console.log);
}

function rxjsWtf() {
  const fizzer = map((index: number) => [index, index % 3 === 0 ? 'fizz' : '']);
  const buzzer = map(([index, value]: [number, string]) => [
    index,
    value + (index % 5 === 0 ? 'buzz' : ''),
  ]);
  const picker = map(([index, value]: [number, string]) => value || index);

  interval().pipe(take(21), fizzer, buzzer, picker).subscribe(console.log);
}
