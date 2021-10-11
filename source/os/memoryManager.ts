/* ------------
     MemoryManager.ts

     Manages Memory allocation
     Meaning, doing something like "Load" , "Load" should fail for Proj2
     So essentially monitoring & deciding what blocks of memory are free / should be used

     ------------ */

     module TSOS {

        // MyTODO: 
        // add html displays (checking text file for code)
        // linewrap


        export class MemoryManager {
            // Current available memory block / range
            private availStart : number; // starting address available
            private availEnd : number;   // ending address available, may not use

            constructor() {
                // Initial available range 0x00 -> 0xFF (Proj 3 range will increase)
                this.availStart = 0x00;
                this.availEnd = MEMORY_SIZE - 0x01; 
            }

            // May not use
            public availRange() {
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
            public verifyMemory() : boolean {
                // Check if adequate memory is available
                return (this.availStart < MEMORY_SIZE);
            }

            /*
            /  Deallocate Range Function
            /    Frees up range availability
            /    * Proj 3, this will be reworked to deallocate a specific range
            */
            public deallocateRange() : void {
                this.availStart = 0x00;
            }

            /*
            / Assign Range Function
            /   Allocates a [256 byte sized] block of memory for a PCB
            */
            public assignRange() : number {
                // Since "load" verifies Memory, we know theres available space

                // Next, retain available starting address to allot
                let addr = this.availStart;
                // Finally, increment the available starting address (next block)
                this.availStart += 0x100;

                return addr;
            }
    
        }
    }
    