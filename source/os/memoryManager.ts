/* ------------
     MemoryManager.ts

     Manages Memory allocation
     Monitoring & deciding what blocks of memory are free / should be used.
     Memory has a size of 758 bytes, allowing 3 blocks for individual programs.
     ------------ */

     module TSOS {

        // My TODO:
        //  + Make the list that will track which PCBs are in memory,
        //    From that list, it will be known whether the process has
        //    terminated or if it should remain in memory.
        //    Terminated PCB = Block of memory that is ready to use. 

        export class MemoryManager {
            // Current available memory block / range
            private availStart : number;   // starting address available.
            private availEnd : number;     // ending address available, may not use.
            private parti : number[];     // Partitions. 'parti[x] !== -1' -> Available Block.
                                          // element values = PID at 'Index' partition

            constructor() {
                // Initial available range 0x000 -> 0x2FF
                this.availStart = 0x000;
                this.availEnd = MEMORY_SIZE - 0x001; 
                // Initial 3 free blocks.
                this.parti = [-1, -1, -1]; 
            }

            // May remove
            public availRange() {
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
            /   Returns the partition number if available, -1 otherwise.
            */
            public verifyMemory() : number[] {

                // Prepare array of info to return
                //   Index 1 = Partition #
                //   Index 2 = Base
                //   Index 3 = Limit
                let retInfo : number[] = [-1,0,0];

                // Check if adequate memory is available
                for (let block : number = 0; (block < this.parti.length) && (retInfo[0] === -1); block++) {
                    if (this.parti[block] !== -1) {
                        retInfo[0] = block;
                    }
                }

                // If memory is available, calculate base & limit
                if (retInfo[0] >= 0) {
                    // Base
                    retInfo[1] = 0x100 * retInfo[0];
                    // Limit
                    retInfo[2] = (0x100 * retInfo[0]) + 0x0FF;
                }
                
                // If memory unavailable, return will indicate with -1
                return retInfo;
                
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
            public assignRange(partition : number, pid : number) : void {
                // Since "load" verifies Memory, we know theres available space

                // Next, update the partition array
                this.parti[partition] = pid;
            }

            /*
            public checkPart(partition : number) : boolean {
                if ((partition >= 0) && (partition < this.parti.length)) {
                    return this.parti[partition];
                } else {
                    console.log(partition + " is not valid")
                    return false;
                }
            }
            */
    
        }
    }
    