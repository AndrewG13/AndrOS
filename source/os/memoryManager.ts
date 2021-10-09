/* ------------
     MemoryManager.ts

     Manages Memory allocation
     Meaning, doing something like "Load" , "Load" should fail for Proj2
     So essentially monitoring & deciding what blocks of memory are free / should be used

     ------------ */

     module TSOS {

        // MyTODO: Implement CPU Commands, PCB (assigning here? once prog done make space available)
        // modify "load", add "run", 
        // add html displays
        // ready queue (in here?)
        // linewrap


        export class MemoryManager {
            // Current available memory block / range
            private availStart : number; // starting address available
            private availEnd : number;   // ending address available

            constructor() {
                // Initial available range 0x00 -> 0xFF (256 bytes)
                this.availStart = 0x00;
                this.availEnd = 0xFF; 
            }

            public availRange() {
                return this.availStart;
            }

            public nextAvailRange() {
                return this.availStart + 0x100;
            }

            public verifyMemory() : boolean {
                // Check if adequate memory is available
                return (this.availStart < MEMORY_SIZE);
            }

            public assignRange() : number {
                // Since "load" verifies Memory, we know thers available space

                // Next, retain available starting address to allot
                let addr = this.availStart;
                // Finally, increment the available starting address (next block)
                this.availStart += 0x100;

                return addr;
            }
    
        }
    }
    