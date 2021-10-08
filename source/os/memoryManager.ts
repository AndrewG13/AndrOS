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
            // Index 0 = starting address
            // Index 1 =   ending address
            private availStart : number;
            private availEnd : number;

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

            public assignRange() : number {
                // First check if no more memory available
                if (this.availStart >= MEMORY_SIZE) {
                    return -1;
                } else {
                    // retain available starting address to allot
                    let returnStart = this.availStart;
                    // increment the available starting address (next block)
                    this.availStart += 0x100;

                    return returnStart;
                }
            }
    
            public cycle(): void {
                _Kernel.krnTrace('MMU cycle');
            }
        }
    }
    