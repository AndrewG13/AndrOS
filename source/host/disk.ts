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

            private DIR_START : string = "000";
            private FLD_START : string = "100";
            private nextDir : string = "001";
            private nextFdl : string = "100";
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

            public create(filename : string) {
                // create a file in a known-to-be-ready block
                sessionStorage.setItem(this.nextDir, "1///" + filename);
                // increment the next directory available
                this.nextDir = incrementTSB(this.nextDir, "DIR");
            }

            public read(tsb : string) : string {
                let data = this.getBlock(tsb);
                let pointer = data.substring(1, 4);
                // check if file points to a FDL
                if (pointer === "///") {
                    // no pointer, return nothing
                    return "*File empty";
                } else {
                    // get data associated at pointer (in FDL)
                    this.getBlock(pointer);
                    // extract the data portion
                    data = data.substring(4);
                    // encode the Ascii to text
                    data = AsciiLib.encodeString(data);   
                    return data;             
                }
            }

            public write() {

            }

            public delete() {

            }

            private getBlock(tsb : string) : string {
                console.log(sessionStorage.getItem(tsb));
                return sessionStorage.getItem(tsb);
            }

            private setBlock(tsb : string, data : string) {
                // get all data currently at this block
                let entireBlock : string = sessionStorage.getItem(tsb);
                // get the in-use byte (first byte)
                let inuse = entireBlock.charAt(0);
                // get the pointer, could be null = /// (next three bytes)
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

            private getNextAvail(i : string, option : string) : string {

                let data = sessionStorage.getItem(i);
                while (data.charAt(0) === "1") {
                    // increment the next space
                    i = incrementTSB(i, option);
                    // check if out of bounds, if so wrap around accordingly                    
                    if (i === "OOB") {
                        if (option === "DIR") {
                            i = "001";
                        } else {
                            i = "100";
                        }
                    }
                    data = sessionStorage.getItem(i);
                }
                return i;
            }

        }
    }
    
