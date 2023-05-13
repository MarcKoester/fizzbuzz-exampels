import { interval, take, map } from 'rxjs';

interval()
  .pipe(
    take(196),
    map((num) => {
      if (num % 3 === 0 && num % 5 === 0) return 'fizzbuzz';
      else if (num % 3 === 0) return 'fizz';
      else if (num % 3 === 0) return 'buzz';
      return num;
    })
  )
  .subscribe(console.log);
