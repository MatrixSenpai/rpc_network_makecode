/**
 * RPC over BLE
 * 
 * Rock = 0, Paper = 1, Scissors = 2
 */

let didThrow = false
let hand = 0

radio.setGroup(1)

radio.onReceivedNumber(function (num) {
    if(!didThrow) throwHand();

    showThrow(hand);
    basic.pause(1000)

    if (hand == 0 && num == 1)
        showWon(false);
    if (hand == 0 && num == 2)
        showWon(true);
    if (hand == 1 && num == 0)
        showWon(true);
    if (hand == 1 && num == 2)
        showWon(false);
    if (hand == 2 && num == 0)
        showWon(false);
    if (hand == 2 && num == 1)
        showWon(true);

    if (hand == num)
        basic.showString("Draw!")

    didThrow = false
});

input.onButtonPressed(Button.A, function () {
    throwHand();
})

const throwHand = () => {
    basic.clearScreen();
    hand = randint(0, 2);
    radio.sendNumber(hand);
    didThrow = true;
}

const showThrow = (num: number) => {
    switch(num) {
    case 0:
        basic.showLeds(`
        # # # # #
        # . . . #
        # . . . #
        # . . . #
        # # # # #
        `);
        break;
    case 1:
        basic.showLeds(`
        . . . . .
        . # # # .
        . # # # .
        . # # # .
        . . . . .
        `);
        break;
    default:
        basic.showLeds(`
        # # . . #
        # # . # .
        . . # . .
        # # . # .
        # # . . #
        `);
        break;
    }
}

const showWon = (didWin: boolean) => {
    if(didWin)
        basic.showString("WINNER!");
    else
        basic.showString("LOSER!");
}
