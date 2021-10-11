/* ------------
     MemoryManager.ts

     Manages Memory allocation
     Meaning, doing something like "Load" , "Load" should fail for Proj2
     So essentially monitoring & deciding what blocks of memory are free / should be used

     ------------ */
var TSOS;
(function (TSOS) {
    // MyTODO: 
    // Making the CPU pause for interrupts possible fix: Add some CPU attribute to the kernel interrupt queue
    // Implement CPU Commands, PCB (assigning here? once prog done make space available)
    // add html displays (checking text file for code)
    // linewrap
    class MemoryManager {
        constructor() {
            // Initial available range 0x00 -> 0xFF (Proj 3 range will increase)
            this.availStart = 0x00;
            this.availEnd = MEMORY_SIZE - 0x01;
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
        /  Deallocate Range Function
        /    * Proj 3, this will be reworked
        /    Frees up range availability
        */
        deallocateRange() {
            this.availStart -= 0x100;
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