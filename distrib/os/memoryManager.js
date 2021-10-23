/* ------------
     MemoryManager.ts

     Manages Memory allocation
     Monitoring & deciding what blocks of memory are free / should be used.
     Memory has a size of 758 bytes, allowing 3 blocks for individual programs.
     ------------ */
var TSOS;
(function (TSOS) {
    // My TODO:
    //  + Make the list that will track which PCBs are in memory,
    //    From that list, it will be known whether the process has
    //    terminated or if it should remain in memory.
    //    Terminated PCB = Block of memory that is ready to use. 
    class MemoryManager {
        // May change to just be PID number.
        constructor() {
            // Initial available range 0x000 -> 0x2FF
            this.availStart = 0x000;
            this.availEnd = MEMORY_SIZE - 0x001;
            // Initial 3 free blocks.
            this.part = [null, null, null];
        }
        // May remove
        availRange() {
            return this.availStart;
        }
        // May remove
        /*
        public nextAvailRange() {
            return this.availStart + 0x100;
        }
        */
        /*
        / Verify Memory Function
        /   Checks if memory is available to allocate
        /   Used when creating a PCB
        */
        verifyMemory() {
            // Check if adequate memory is available
            return (this.availStart < MEMORY_SIZE);
        }
        /*
        /  Deallocate Range Function
        /    Frees up range availability
        /    * Proj 3, this will be reworked to deallocate a specific range
        */
        deallocateRange() {
            this.availStart = 0x00;
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