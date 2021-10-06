/* ------------
     Memory.ts

     This implementation of main memory comes directly from my VM project
     in Organization and Architecture class with Gormanly

     ------------ */
var TSOS;
(function (TSOS) {
    class Memory {
        constructor() {
            // Main Memory, 256 addresses, 1 byte stored at each address
            this.memorySize = 0x100;
            this.memoryAddr = new Array(this.memorySize);
            this.mar = 0x00;
            this.mdr = 0x00;
        }
        /*
        / Init Function
        /   Initializes memory registers
        */
        init() {
            // Change all bytes in memory = 0
            for (let addr = 0; addr < this.memorySize; addr++) {
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
        getMar() {
            return this.mar;
        }
        /*
        / GetMdr Function
        /   Returns the MDR
        */
        getMdr() {
            return this.mdr;
        }
        /*
        / SetMar Function
        /   Sets the MAR based on parameter
        */
        setMar(newMar) {
            this.mar = newMar;
        }
        /*
        / SetMdr Function
        /   Sets the MDR based on parameter
        */
        setMdr(newMdr) {
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
        cycle() {
            _Kernel.krnTrace('MEM cycle');
            // MyTODO: Display memory code here?
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map