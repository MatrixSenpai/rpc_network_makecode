/**
 * RPC over BLE
 * 
 * Rock = 0, Paper = 1, Scissors = 2
 */

// Initialization
let didThrow = false;
let isLockedIn = false;
let isOpponentLockedIn = false;
let hand = -1;
let opponentHand = -1;
radio.setGroup(1)

/**
 * Helper Functions
 * 
 * Handles display, winners, comms
 */

const handleThrow = () => {
    basic.showString("RPS!")
    basic.pause(500);

    console.log(hand);
    console.log(opponentHand);

    if (hand == 0 && opponentHand == 1)
        showWon(false);
    if (hand == 0 && opponentHand == 2)
        showWon(true);
    if (hand == 1 && opponentHand == 0)
        showWon(true);
    if (hand == 1 && opponentHand == 2)
        showWon(false);
    if (hand == 2 && opponentHand == 0)
        showWon(false);
    if (hand == 2 && opponentHand == 1)
        showWon(true);

    if (hand == opponentHand)
        basic.showString("Draw!")

    isLockedIn = false;
    isOpponentLockedIn = false;
    hand = -1;
    opponentHand = -1;   
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


/**
 * Radio Handlers
 * 
 * Handles getting and sending number, getting and sending state
 */

/// Receive opponent ready state
radio.onReceivedMessage(1, () => {
    isOpponentLockedIn = true;
    radio.sendNumber(hand);
});

/// Receive opponent choice
radio.onReceivedNumber((num: number) => {
    opponentHand = num;
    console.log(`${control.deviceName()}: ${num}`);
});

/**
 * Input Handlers
 * 
 * Choose your RPS and lock it in
 */

/// Swaps between rock, paper, and scissors
input.onButtonPressed(Button.A, function () {
    if(isLockedIn) return;
    hand += 1;
    if(hand >= 3) hand = 0;

    showThrow(hand);
});

/// Sends a signal to the other player that you are ready
input.onButtonPressed(Button.B, function () {
    isLockedIn = true;
    radio.sendMessage(1)
});

basic.forever(function () {
    if(isLockedIn && isOpponentLockedIn)
        handleThrow();
})