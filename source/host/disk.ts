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

        // MyTODO: 
        // Session storage functions like a Map, call it like this:
        //sessionStorage.setItem(key,val); // set
        //sessionStorage.getItem(key);       // get
        //sessionStorage.removeItem(key);    // rem
        //
        // Implementation should have the key being a combination of t.s.b.
        //                                val being the data stored at that location

        export class Disk {

            // Disk Memory, __ addresses, _ byte stored at each block
            // May change to one triple array (tsb : number[][][])
            private track  : number[];
            private sector : number[];
            private block  : number[];

            private formatted : boolean;

            constructor() {
                this.track = new Array(TRACK_SIZE);
                this.sector = new Array(SECTOR_SIZE);
                this.block = new Array(BLOCK_SIZE);

                this.formatted = false;
                //this.init();
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

                this.formatted = true;

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

            public format() {
                this.init();
                _StdOut.putText("Disk Formatted");
            }

            /*
            / Disk Status Function
            /    Gets format status of the Disk (whether it is usable or not)
            */
            public status() {
                return this.formatted;
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
    