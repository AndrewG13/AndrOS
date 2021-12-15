/* ------------
     Disk.ts

     Simulates a real implementation of how Disk hardware works.
     There are (4) tracks of (8) sectors, each sector hosting its own (8) blocks of memory.
     Disk Memory consists of: 256 total blocks, 64 bytes stored at each block. 
     Disk Memory = 16,384 (16k) total bytes of memory.

     Layout of each major function of Disk memory:
     - add note
     - add note
     - add note
     - add note
     ------------ */

     module TSOS {

        // MyTODO: 
        // Session storage works like a Map, use it like this:
        //sessionStorage.setItem(key,val); // set
        //sessionStorage.getItem(key);     // get
        //sessionStorage.removeItem(key);  // rem
        
        // Implementation should have the {key being a combination of t.s.b.}
        //                                {val being the data stored at that location}
        
        // Make sure to incorporate the Directories & FDL (File Data Locations) seperately and accordingly.
        // Dir. range: 000 - 077  (in Octal) 
        // FDL  range: 100 - 377  (in Octal)

        // In each 64 byte block, the structure is as follows:
        //         First byte: In-use boolean (0 = available, 1 = used).
        //       Next 3 bytes: t,s,b sequentially.
        // Remaining 60 bytes: Data portion (either a file name, or the actual program code (code exceeding 60 bytes makes a new FDL))

        export class Disk {

            private formatted : boolean;

            constructor() {
                this.formatted = false;
                //this.init();
            }

            /*
            / Init Function
            /   Initializes memory registers
            */
            private init() : void {
                // Declare & initialize all blocks on the Disk
                for (let t = 0; t < TRACK_SIZE; t++) {
                    for (let s = 0; s < SECTOR_SIZE; s++) {
                        for (let b = 0; b <BLOCK_SIZE; b++) {
                            // Place in Session Storage
                            // Format: Key = {t s b}
                            //         Val = {0 / / / -------- etc.}
                            sessionStorage.setItem(t + "" + s + "" + b ,"0///" + AsciiLib.nullBlock());
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
            */
            public resetBlock(tsb : string) : void {
                // Clear the specific block on the Disk

            }

            public format() {
                this.init();
                _StdOut.putText("Disk Formatted");
            }

            public getBlock(tsb : string) {
                console.log(sessionStorage.getItem(tsb));
            }

            public setBlock(tsb : string, data : string) {
                let entireBlock : string = sessionStorage.getItem(tsb);
                let inuse = entireBlock.charAt(0);
                let pointer : string = entireBlock.substring(1, 4);
                
                sessionStorage.setItem(tsb,inuse + pointer + data);
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
    
