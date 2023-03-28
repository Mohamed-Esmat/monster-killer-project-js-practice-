const ATTACK_VALUE = 10; // Global value which we just hardcoded into the code
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;
const MODE_ATTACK = 'ATTACK'; // MODE_ATTACK = 0
const MODE_STRONG_ATTACK = 'STRONG_ATTACK'; // MODE_STRONG_ATTACK = 1
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'LOG_EVENT_MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';


let battleLog = [];
let lastLoggedEntry;

function getMaxLifeValues() {
  const enteredValue = prompt('Maximum life for you and the monster.', '100');

  let parsedValue = parseInt(enteredValue);
  if (isNaN(parsedValue) || parsedValue <= 0) {
    // chosenMaxLife = 100;
    throw { message: 'Invalid user input not a number!' };
  }
  return parsedValue;
}


let chosenMaxLife;
try {
  chosenMaxLife = getMaxLifeValues();

} catch (error) {
  console.error(error);
  chosenMaxLife = 100;
  alert('You entered something wrong, default value of 100 was used.')
} finally { // for cleanup work [maybe release some data or clear some variables, do something kike this and then you could do it in finally]
  
}



let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };

  // switch (ev) {
  //   case LOG_EVENT_PLAYER_ATTACK:
  //     logEntry.target = 'MONSTER';
  //     break;
  //   case LOG_EVENT_PLAYER_STRONG_ATTACK:
  //     logEntry.target = 'MONSTER';
  //     break;
  //   case LOG_EVENT_MONSTER_ATTACK:
  //     logEntry.target = 'PLAYER';
  //     break;
  //   default:
  //     logEntry = {};
  // }

  if (ev === LOG_EVENT_PLAYER_ATTACK) {
    logEntry.target = 'MONSTER';
  } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry.target = 'MONSTER';
  } else if (ev === LOG_EVENT_PLAYER_HEAL) {
    logEntry.target = 'PLAYER';
  } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
    logEntry.target = 'PLAYER';
  } else if (ev === LOG_EVENT_GAME_OVER) {
    logEntry = {
      event: ev,
      value: val,
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
  }
  battleLog.push(logEntry);
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentMonsterHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    alert('You would be dead but the bonus life saved you!');
    setPlayerHealth(initialPlayerHealth);
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You win🐱‍🏍');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'PLAYER WON',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You lose😛');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'MONSTER WON',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('You have draw🥱');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'A DRAW',
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackMonster(mode) {
  let maxDamage =
    mode === MODE_ATTACK
      ? ATTACK_VALUE
      : mode === MODE_STRONG_ATTACK
      ? STRONG_ATTACK_VALUE
      : null; // Ternary Operator
  let logEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : mode === MODE_STRONG_ATTACK
      ? LOG_EVENT_PLAYER_STRONG_ATTACK
      : null;

  // if (mode === MODE_ATTACK) {
  //   maxDamage = ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK;
  // } else if (mode === MODE_STRONG_ATTACK) {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
  let healValue;
  if (currentMonsterHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("you can't heal to more than your max initial health.");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function printLogHandler() {
  // for (let i = 0; i < battleLog.length; i++) {
  //   // console.log('----------')
  //   console.log(battleLog[i]);
  // }
  // let j = 0;
  // while (j < 3) {
  //   console.log('---------');
  //   j++;
  // }
  // let k = 1;
  // do {
  //   console.log(k);
  //   k++;
  // } while (k < 3);

  // let j = 0;
  // outerWhile: do {
  //   console.log('Outer', j);
  //   innerFor: for (let k = 0; k < 5; k++) {
  //     if (k === 3) {
  //       // break outerWhile;
  //       continue outerWhile; // dangerous! => Infinite loop!
  //     }
  //     console.log('Inner', k);
  //   }
  //   j++;
  // } while (j < 3);

  // let i = 0;
  // for (const logEntry of battleLog) {
  //   console.log('---------')
  //   if (!lastLoggedEntry && lastLoggedEntry !== 0 || lastLoggedEntry < i) {
  //     console.log(`#${i}`);
  //     for (const key in logEntry) {
  //       console.log(`${key} => ${logEntry[key]}`); // important: the name inside of [] has to be a string (or a variable that holds the property name you want to access)!
  //     }
  //     lastLoggedEntry = i;
  //     break;//break stop the nearest loop if we could say
  //   }
  //   i++;
  // }
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);
