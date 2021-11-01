/* ------------
     MemoryManager.ts

     Manages Memory allocation
     Monitoring & deciding what blocks of memory are free / should be used.
     Memory has a size of 758 bytes, allowing 3 blocks for individual programs.
     ------------ */

     module TSOS {

        export class MemoryManager {
            // Allocating data & ensuring integrity for the Main Memory Object -> _Memory 

            private parti : number[];     // Partitions. 'parti[x] !== -1' -> Available Block.
                                          // element values = PID at 'Index' partition
                                          // index values = Partition#

            constructor() {
                // Total available range 0x000 -> 0x2FF

                // Initial 3 free blocks.
                this.parti = [-1, -1, -1]; 
            }

            
            /*
            / Verify Memory Function
            /   Checks if memory is available to allocate 
            /   Used when creating a PCB
            /   Returns the partition# + info if available, -1 otherwise.
            */
            public verifyMemory() : number[] {

                // Prepare array of info to return
                //   Index 1 = Partition #
                //   Index 2 = Base
                //   Index 3 = Limit
                let retInfo : number[] = [-1,0,0];

                // Check if adequate memory is available, stops once found space
                for (let block : number = 0; (block < PARTITIONQUANTITY) && (retInfo[0] === -1); block++) {
                    if (this.parti[block] === -1) {
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
            /    Does not handle memory being cleared!
            */
            public deallocateRange(pid : number) : void {
                // Compute partition number given the PCB's base register
                // 0x100 is the 'block' range.
                let partition = (PCBList[pid].base / 0x100);
                this.parti[partition] = -1;
                // do more here?
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
            / CheckRange Function
            /   Returns PID if partition has a PCB (aka is unavailable)
            /   Otherwise returns -1 (available to load)
            */
            public checkRange(partition : number) : number {
                if ((partition >= 0) && (partition < PARTITIONQUANTITY)) {
                    return this.parti[partition];
                } else {
                    console.log(partition + " is not valid")
                    return -1;
                }
            }
    
        }
    }
    