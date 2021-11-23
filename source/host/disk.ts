/* ------------
     Disk.ts

     Simulates a real implementation of how Disk hardware works.
     There are (4) tracks of (8) sectors, each sector hosting its own (8) blocks of memory.
     Layout of each major function of Disk memory:
     - add note
     - add note
     - add note
     - add note
     ------------ */

     module TSOS {

        export class Disk {

            // Disk Memory, __ addresses, _ byte stored at each block
            // May change to one triple array (tsb : number[][][])
            private track  : number[];
            private sector : number[];
            private block  : number[];

            constructor() {
                this.track = new Array(TRACK_SIZE);
                this.sector = new Array(SECTOR_SIZE);
                this.block = new Array(BLOCK_SIZE);
                this.init();
            }

            /*
            / Init Function
            /   Initializes memory registers
            */
            public init() : void {
                // Change all bytes in memory = 0
                for (let t = 0; t < TRACK_SIZE; t++) {
                    //this.track[t] = 0x00;
                    for (let s = 0; s < SECTOR_SIZE; s++) {
                        //this.sector[s] = 0x00;
                        for (let b = 0; b <BLOCK_SIZE; b++) {
                            //this.block[b] = 0x00;
                            // session storage here?
                        }
                    }
                }

            }

            /*
            / Reset Function
            /   Formats Disk memory to initial values
            /   Will this be needed?
            */
            public reset() : void {
                this.init();

            }

            /*
            / Reset Block Function
            /   Clear a specific block on the Disk
            /   May need to pass in t & s as well
            */
            public resetBlock(b : number) : void {
                // Clear the specific block on the Disk

            }
    
            
            /*
            / Display function
            /   Param: starting address, ending address (may need to change)
            /   Displays Disk memory blocks from specified limit, Hex formatted
            /   If either parameters are invalid, an error log will print
            */
            public display(start : number, end : number) {

            }

        }
    }
    