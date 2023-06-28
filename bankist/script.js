const account1 = {
  owner: "Jonas Schmedtmann",
  movement: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movement: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movement: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movement: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
const accounts = [account1, account2, account3, account4];
const app = document.querySelector(".app");
const mainHead = document.querySelector(".mainHead");
const userName = document.querySelector(".userName");
const userPin = document.querySelector(".userPin");
const arrowBtn = document.querySelector(".arrowBtn");
const balance = document.querySelector(".balance");
const movements = document.querySelector(".movements");
const depositAndTime = document.querySelector(".depositandtime");
const money = document.querySelector(".money");
const transferInput1 = document.querySelector(".transferInput1");
const transferInput2 = document.querySelector(".transferinput2");
const transferInput21 = document.getElementById('transferInput2')
const transferBtn = document.querySelector(".transferBtn");
const loanInput = document.querySelector(".loanInput");
const loanBtn = document.querySelector(".loanBtn");
const closeInput1 = document.querySelector(".closeInput1");
const closeInput2 = document.querySelector(".closeInput2");
const closeBtn = document.querySelector(".closeBtn");
const moneyInn = document.querySelector(".moneyInn");
const moneyOutt = document.querySelector(".moneyOutt");
const moneyInterest = document.querySelector(".moneyInterest");
const sort = document.querySelector(".sort");
const time = document.querySelector(".time");
const lowerMost = document.querySelector(".lowermost");

const displayMovements = function (movement , sort = false) {

  const movs = sort? movement.slice().sort((a ,b) => a - b ) : movement;

  movements.innerHTML = "";
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "widthdrawal";
    const html = `
        <div class="${type}">
              <div class="depositandtime">
                <div class="text-${type}">${i + 1} ${type}</div>
                <div class="time"></div>
              </div>
              <div class="money">${mov}$</div>
            </div>
            `;
    movements.insertAdjacentHTML("afterbegin", html);
  });
};
// displayMovements(account1.movement)

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const finalBalance = function (acc) {
  acc.balance1 = acc.movement.reduce((acc, mov) => acc + mov, 0);

  balance.innerText = `${acc.balance1}$`;
};

const calcDisplaySummary = function (acc) {
  const totalDeposit = acc.movement
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  moneyInn.innerText = `${totalDeposit}$`;

  const totalOut = acc.movement
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  moneyOutt.innerText = `${Math.abs(totalOut)}$`;

  const totalInterest = acc.movement
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int , i , arr) => {
      return int >= 1;
    })

    .reduce((acc, int) => acc + int, 0);

  moneyInterest.innerText = `${totalInterest}$`;
};

const updateUI = function (acc) {
  calcDisplaySummary(acc);

  displayMovements(acc.movement);

  finalBalance(acc);
};
//retring the username work
let currentAccount;
arrowBtn.addEventListener("click", function (e) {
  currentAccount = accounts.find((acc) => acc.username === userName.value);
  // console.log(currentAccount);
  if (currentAccount?.pin === Number(userPin.value)) {
    mainHead.innerText = `Welcome back , ${currentAccount.owner.split(" ")[0]}`;
    app.style.opacity = 100;
    lowerMost.style.opacity = 100;
    
    userName.value = userPin.value = "";
    userPin.blur();
    updateUI(currentAccount);
  }
});


closeBtn.addEventListener('click' , function(){
  if(
    closeInput1.value === currentAccount.username &&
    Number(closeInput2.value) === currentAccount.pin
    ){
      const index = accounts.findIndex(
        acc => acc.username === currentAccount.username
        )
        
        accounts.splice(index , 1)
        app.style.opacity = 0
        lowerMost.style.opacity = 0;
  }
  closeInput1.value = closeInput2.value = ''
})


loanBtn.addEventListener('click' , function() {

const amount = Number(loanInput.value)

if(
 amount > 0 && currentAccount.movement.some(mov => mov >= amount * 0.1)
){
  currentAccount.movement.push(amount)

  updateUI(currentAccount)
}

loanInput.value = ''


})

transferBtn.addEventListener("click", function () {
  // console.log('hello motherFucker')
 
  const amount = Number(transferInput21.value);

  console.log('log')

  const receiverAcc = accounts.find(
    acc => acc.username === transferInput1.value
  );

  transferInput21.value = transferInput1.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance1 >= amount &&
    receiverAcc?.username !== currentAccount.username
    ) {
    currentAccount.movement.push(-amount);
    receiverAcc.movement.push(amount);
    updateUI(currentAccount);
  }
});
let sorted = false
sort.addEventListener('click' , function(){
  displayMovements(currentAccount.movement, !sorted)
  sorted = !sorted
})
