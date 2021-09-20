/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverKeyboard extends TSOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            // Stores keycodes of digit-shifted symbols
            // For example: Keyboard key 1 also has the symbol !.
            //              The keycode for ! is 33, therefore put 33 in index 1.
            this.numSyms = [41, 33, 64, 35, 36, 37, 94, 38, 42, 40];
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }
        krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted === true) {
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                }
                else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode >= 186) && (keyCode <= 222)) { // special symbols keys
                chr = this.computeSpecSyms(keyCode, isShifted);
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode >= 48) && (keyCode <= 57)) { // digits
                // Need to be handled if shifted!
                chr = this.computeNumSyms(keyCode, isShifted);
                _KernelInputQueue.enqueue(chr);
                // Canvas-specific edits
            }
            else if ((keyCode == 32) || // space
                (keyCode == 8) || // backspace
                (keyCode == 9) || // tab
                (keyCode == 13) || // enter
                (keyCode == 38) || // arrow up
                (keyCode == 40)) { // arrow down            
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
        }
        /*
        *  computerSpecialSymbols Function
        *     Utilizes a switch-case due to the randomness of keycodes
        */
        computeSpecSyms(keyCode, isShifted) {
            switch (keyCode) {
                case 192:
                    if (isShifted) {
                        keyCode = 126; // ~
                    }
                    else {
                        keyCode = 96; // ` 
                    }
                    break;
                case 189:
                    if (isShifted) {
                        keyCode = 95; // _
                    }
                    else {
                        keyCode = 45; // -
                    }
                    break;
                case 187:
                    if (isShifted) {
                        keyCode = 43; // +
                    }
                    else {
                        keyCode = 61; // =
                    }
                    break;
                case 219:
                    if (isShifted) {
                        keyCode = 123; // {
                    }
                    else {
                        keyCode = 91; // [                 
                    }
                    break;
                case 221:
                    if (isShifted) {
                        keyCode = 125; // }
                    }
                    else {
                        keyCode = 93; // ]
                    }
                    break;
                case 220:
                    if (isShifted) {
                        keyCode = 124; // |
                    }
                    else {
                        keyCode = 92; // \
                    }
                    break;
                case 186:
                    if (isShifted) {
                        keyCode = 58; // :
                    }
                    else {
                        keyCode = 59; // ;
                    }
                    break;
                case 222:
                    if (isShifted) {
                        keyCode = 34; // "
                    }
                    else {
                        keyCode = 39; // '
                    }
                    break;
                case 188:
                    if (isShifted) {
                        keyCode = 60; // <
                    }
                    else {
                        keyCode = 44; // ,
                    }
                    break;
                case 190:
                    if (isShifted) {
                        keyCode = 62; // >
                    }
                    else {
                        keyCode = 46; // .
                    }
                    break;
                case 191:
                    if (isShifted) {
                        keyCode = 63; // ?
                    }
                    else {
                        keyCode = 47; // /
                    }
                    break;
            }
            let symChr;
            symChr = String.fromCharCode(keyCode);
            return symChr;
        }
        /*
        *  computeNumberSymbols Function
        *
        *  Utilizes the numSyms Array due to the sequential nature of keycodes
        */
        computeNumSyms(keyCode, isShifted) {
            // If not shifted, no index lookup needed (digit keys & keyCodes properly align)
            if (isShifted) {
                // First, find out which digit was passed in
                let digit = keyCode - 48;
                // Then lookup & return the corresponding symbol keycode
                keyCode = this.numSyms[digit];
                // 7 & 9 have a special case. Handling it afterwards for simplicity
                if ((digit == 7) && (isShifted)) {
                    ampersand = true;
                }
                if ((digit == 9) && (isShifted)) {
                    leftParen = true;
                }
            }
            let chr;
            chr = String.fromCharCode(keyCode);
            return chr;
        }
    }
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverKeyboard.js.map