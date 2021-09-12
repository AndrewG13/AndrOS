/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted === true) { 
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                } else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);

            } else if ( (keyCode >= 186) && (keyCode <= 222) ) { // special symbols
                chr = this.computeSymbols(keyCode, isShifted);
                _KernelInputQueue.enqueue(chr);

            
                // * Special input keys * (Seperated purely for my sanity)

                // Non canvas-specific edits
            } else if (((keyCode >= 48) && (keyCode <= 57)) ||   // digits
                        (keyCode == 32)) {                       // space
                        
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);

                // Canvas-specific edits
            } else if ((keyCode == 8)   ||  // backspace
                       (keyCode == 9)   ||  // tab
                       (keyCode == 13)  ||  // enter
                       (keyCode == 38)  ||  // arrow up
                       (keyCode == 40)) {   // arrow down            
                                        
                //_Console.putText("canvas edits");
                //_KernelInputQueue.q.pop();
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
        }

        private computeSymbols(keyCode : number, isShifted) {
            let symChr : string;

            switch (keyCode) {
                case 192 :
                    if (isShifted) {
                        keyCode = 126;
                    } else {
                        keyCode = 96;
                    }
                    break;

                case 189 :
                    if (isShifted) {
                        keyCode = 95;
                    } else {
                        keyCode = 45;
                    }
                    break;

                case 187 :
                    if (isShifted) {
                        keyCode = 43;
                    } else {
                        keyCode = 61;
                    }
                    break;

                case 219 :
                    if (isShifted) {
                        keyCode = 123;
                    } else {
                        keyCode = 91;                       
                    }
                    break;

                case 221 :
                    if (isShifted) {
                        keyCode = 125;
                    } else {
                        keyCode = 93;
                    }
                    break;

                case 220 :
                    if (isShifted) {
                        keyCode = 124;
                    } else {
                        keyCode = 92;
                    }
                    break;

                case 186 :
                    if (isShifted) {
                        keyCode = 58;
                    } else {
                        keyCode = 59;
                    }
                    break;

                case 222 :
                    if (isShifted) {
                        keyCode = 34;
                    } else {
                        keyCode = 39;
                    }
                    break;

                case 188 :
                    if (isShifted) {
                        keyCode = 60;
                    } else {
                        keyCode = 44;
                    }
                    break;
            
                case 190 :
                    if (isShifted) {
                        keyCode = 62;
                    } else {
                        keyCode = 46;
                    }
                    break;

                case 191 :
                    if (isShifted) {
                        keyCode = 63;
                    } else {
                        keyCode = 47;
                    }
                    break;
                }

            symChr = String.fromCharCode(keyCode);
            return symChr;
        }
    }
}
