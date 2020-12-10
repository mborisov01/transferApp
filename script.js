'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

let inputLoginUsername = document.querySelector('.login__input--user');
let inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movement) {
  containerMovements.innerHTML = '';
  movement.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">€${mov} €</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBallance = function (acc) {
  acc.ballance = acc.movements.reduce((acc, move) => acc + move, 0);
  labelBalance.textContent = `${acc.ballance} EUR`;
};

const createUserNames = function (accs) {
  accs.forEach(function (acc, i) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserNames(accounts);

const calcDisplaySummery = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes} €`;

  const out = acc.movements
    .filter(mov => mov <= 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(out)} €`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${interest} €`;
};

const updateUi = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBallance(acc);
  calcDisplaySummery(acc);
};

//EVENT Listeners

let currentAccount;
console.log('currentAccount before', currentAccount);
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('Logged in');
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUi(currentAccount);
  } else {
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Wrong Pin`;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  let receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  let amount = Number(inputTransferAmount.value);
  console.log(receiverAccount);

  inputTransferTo.value = inputTransferAmount.value = '';

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.ballance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    updateUi(currentAccount);
  } else {
    console.log('invalid transfer');
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  let CloseUsername = inputCloseUsername.value;
  let ClosePin = Number(inputClosePin.value);

  if (
    CloseUsername === currentAccount.username &&
    ClosePin === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
});

console.log(movements);

movements.sort((a, b) => {
  if (a > b) {
    return 1;
  } else {
    return -1;
  }
});

console.log('sorted', movements);
