/* ------------
     Memory.ts

     This implementation of main memory comes directly from my VM project
     in Organization and Architecture class with Gormanly
     Things have been reworked for this project, and if you see any redundancy (here and Accessor),
     I did so with the intention of simulating how things really work.  Hopefully I was accurate.
     ------------ */
var TSOS;
(function (TSOS) {
    class Memory {
        constructor() {
            this.memoryAddr = new Array(MEMORY_SIZE);
            this.mar = 0x00;
            this.mdr = 0x00;
        }
        /*
        / Init Function
        /   Initializes memory registers
        */
        init() {
            // Change all bytes in memory = 0
            for (let addr = 0; addr < MEMORY_SIZE; addr++) {
                this.memoryAddr[addr] = 0x00;
            }
        }
        /*
        / Reset Function
        /   Formats memory to initial values
        */
        reset() {
            this.init();
            this.mdr = 0x00;
            this.mar = 0x00;
        }
        /*
        / GetMar Function
        /   Returns the MAR
        */
        getMAR() {
            return this.mar;
        }
        /*
        / GetMdr Function
        /   Returns the MDR
        */
        getMDR() {
            return this.mdr;
        }
        /*
        / SetMar Function
        /   Sets the MAR based on parameter
        */
        setMAR(newMar) {
            this.mar = newMar;
        }
        /*
        / SetMdr Function
        /   Sets the MDR based on parameter
        */
        setMDR(newMdr) {
            this.mdr = newMdr;
        }
        /*
        / Read function
        /   Take the value in the register specified by the MAR, and store it in the MDR
        /   "Take a byte from memory"
        */
        read() {
            this.mdr = this.memoryAddr[this.mar];
        }
        /*
        / Write function
        /   Take the value in the MDR, and store it in the register specified by the MAR
        /   "Putting a byte into memory"
        */
        write() {
            this.memoryAddr[this.mar] = this.mdr;
        }
        /*
        / DisplayMemory function
        / Param: starting address, ending address
        / Displays memory addresses from specified limit, Hex formatted
        / If either parameters are invalid, an error log will print
        */
        displayMemory(start, end) {
            // Check if invalid portion of memory
            if (start >= this.memoryAddr.length || start < 0 || end >= this.memoryAddr.length || end < start) {
                console.log(" - Address Range [" + (hexLog(start, 4)) + " → " + (hexLog(end, 4)) + "] Invalid");
                _StdOut.putText("Illegal memory parameters");
            }
            else {
                // Must be valid
                while (start < this.memoryAddr.length && start <= end) {
                    // this will become a frontend thing to display on
                    //console.log(" - Address[" + (hexLog(start, 4)) + "]  Value " + (hexLog(this.memoryAddr[start], 2)));
                    start = start + 0x01;
                }
            }
        }
        cycle() {
            _Kernel.krnTrace('MEM cycle');
            // MyTODO: Display memory code here?
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map