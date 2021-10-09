/* ------------
     MemoryManager.ts

     Manages Memory allocation
     Meaning, doing something like "Load" , "Load" should fail for Proj2
     So essentially monitoring & deciding what blocks of memory are free / should be used

     ------------ */
var TSOS;
(function (TSOS) {
    // MyTODO: 
    // Implement CPU Commands, PCB (assigning here? once prog done make space available)
    // fix up displayRegisters function in Memory
    // assignRange should initiate creating a PCB, but CPU should be doing that task specifically
    // modify "load", add "run", 
    // add html displays (checking text file for code)
    // ready queue (in here?)
    // linewrap
    class MemoryManager {
        constructor() {
            // Initial available range 0x00 -> 0xFF (256 bytes)
            this.availStart = 0x00;
            this.availEnd = 0xFF;
        }
        // May not use
        availRange() {
            return this.availStart;
        }
        // May not use
        /*
        public nextAvailRange() {
            return this.availStart + 0x100;
        }
        */
        /*
        / Verify Memory Function
        /   * Used when creating a PCB *
        /   Checks if memory is available to allocate
        */
        verifyMemory() {
            // Check if adequate memory is available
            return (this.availStart < MEMORY_SIZE);
        }
        /*
        / Assign Range Function
        /   Allocates a [256 byte sized] block of memory for a PCB
        */
        assignRange() {
            // Since "load" verifies Memory, we know theres available space
            // Next, retain available starting address to allot
            let addr = this.availStart;
            // Finally, increment the available starting address (next block)
            this.availStart += 0x100;
            return addr;
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map