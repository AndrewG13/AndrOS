/* ------------
     MemoryManager.ts

     Manages Memory allocation
     Meaning, doing something like "Load" , "Load" should fail for Proj2
     So essentially monitoring & deciding what blocks of memory are free / should be used

     ------------ */
var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor() {
            // Initial available range 0x00 -> 0xFF (256 bytes)
            this.availStart = 0x00;
            this.availEnd = 0xFF;
        }
        availRange() {
            return this.availStart;
        }
        nextAvailRange() {
            return this.availStart + 0x100;
        }
        assignRange() {
            // First check if no more memory available
            if (this.availStart >= MEMORY_SIZE) {
                return -1;
            }
            else {
                // retain available starting address to allot
                let returnStart = this.availStart;
                // increment the available starting address (next block)
                this.availStart += 0x100;
                return returnStart;
            }
        }
        cycle() {
            _Kernel.krnTrace('MMU cycle');
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map