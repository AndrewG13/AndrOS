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
        //sessionStorage.removeItem(key);  // rem, dont use
        
        // Implementation should have the {key being a combination of t.s.b.}
        //                                {val being the data stored at that location}
        
        // Make sure to incorporate the Directories & FDL (File Data Locations) seperately and accordingly.
        // Dir. range: 000 - 077  (in Octal) 
        // FDL  range: 100 - 377  (in Octal)

        // In each 64 byte block, the structure is as follows:
        //         First byte: In-use boolean      (0 = available, 1 = used)
        //       Next 3 bytes: t,s,b sequentially  (/// if null pointer)
        // Remaining 60 bytes: Data portion        (either a file name, or the actual program code (code exceeding 60 bytes makes a new FDL))

        export class Disk {
            
            private DIR_START : string = "000"; // tsb where DIR starts
            private FLD_START : string = "100"; // tsb where DFL starts
            private nextDir : string = "001";   // to keep track of next available DIR
            private nextFdl : string = "100";   // to keep track of next available FDL
            private formatted : boolean;        // format status

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
                // override the Master Boot Record's data
                sessionStorage.setItem("000", "1///" + "4D4252" + AsciiLib.nullBlockMBR());
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
            / ResetBlock Function
            /   Clear a specific block on the Disk
            */
            public resetBlock(tsb : string) : void {
                // Clear the specific block on the Disk
            }

            /*
            / Format Function
            /    Wipe the Disk (initially required)
            */
            public format() {
                this.init();
                _StdOut.putText("Disk Formatted");
            }

            /*
            / LS Function
            /    List all files on the Disk (excludes Swapper files)
            /    *Lists the active directories
            */
            public ls() : string {
                let retlist : string = "";
                // iterate through entire file directory, looking for in-use files
                for (let i = "001"; i !== "OOB"; i = incrementTSB(i, "DIR")) {
                    let data : string = sessionStorage.getItem(i);
                    let inUse : string = data.charAt(0);
                    if (inUse === "1") {
                        // found a file, add its name to the return value
                        let filename : string = data.substring(4);
                        filename = AsciiLib.encodeString(filename);
                        retlist += filename + ", ";
                    }
                }
                 
                // remove additional comma & space
                retlist = retlist.substring(0, retlist.length - 2);
                return retlist;
            }

            /*
            / Create Function
            /    Create a file on the Disk
            /    Driver checks if already on Disk, so no conflicts here
            */
            public create(filename : string) {
                // create a file in a known-to-be-ready block
                sessionStorage.setItem(this.nextDir, "1///" + filename);
                // increment the next directory available
                this.nextDir = incrementTSB(this.nextDir, "DIR");
            }

            /*
            / Read Function
            /   Read contents of a tsb on Disk
            /   Driver checks if file exists, so no conflicts here
            */
            public read(tsb : string) : string {
                let retval : string = "";
                let data = this.getBlock(tsb);
                let pointer = data.substring(1, 4);
                // check if file points to a FDL
                if (pointer === "///") {
                    // no pointer, return nothing
                    return "*File empty";
                } else {
                    // get data associated at pointer (in FDL)
                    data = this.getBlock(pointer);
                    // check if it points to another fdl
                    pointer = data.substring(1,4);
                    // extract the last (possibly only) data portion
                    data = data.substring(4);
                    // encode the Ascii to text
                    data = AsciiLib.encodeString(data);
                    retval += data;

                    // while chaining exists, continue to read chained fdls (except last)
                    while (pointer !== "///") {
                        data = this.getBlock(pointer);
                        pointer = data.substring(1,4);
                        data = data.substring(4);
                        data = AsciiLib.encodeString(data);
                        retval += data;
                    }
                    return retval;
                }
            }

            /*
            / Write Function
            /    Writes content to a file on Disk
            /    Driver checks if file exists, so no conflicts here
            */
            public write(tsb : string, asciiText : string[]) {
                let data = this.getBlock(tsb);
                let pointer = data.substring(1, 4);
                // check if file points to a FDL
                if (pointer === "///") {
                    // no pointer, create one for this directory to point to next file
                    pointer = this.nextFdl;
                    sessionStorage.setItem(tsb, "1" + pointer + data.substring(4))
                    this.nextFdl = incrementTSB(this.nextFdl, "FDL");
                } else {
                    // wipe ALL previous data
                    this.wipeChains(pointer);
                }

                   // If data is too large, continue writing to new FDLs & chaining them  
                   while(asciiText.length > 1) {
                        // get next available fdl
                        let chainPointer = this.nextFdl;
                        // write
                        sessionStorage.setItem(pointer, "1" + chainPointer + asciiText.shift());
                        // update nextfdl variable
                        this.nextFdl = incrementTSB(this.nextFdl, "FDL");
                        // update both pointers
                        pointer = chainPointer;
                    }
                
                    // Now just do normal write (< 60 bytes)
                    sessionStorage.setItem(pointer, "1///" + asciiText[0]);

                return "Data written successfully";
            }

            /*
            / Delete Function
            /   Delete a file on Disk & its associated FDL(s)
            */
            public delete(tsb : string) {
                let data = this.getBlock(tsb); 
                let pointer = data.substring(1,4);
                let pointers : string[] = new Array(); // Array for all tsbs to delete

                // Add the initial pointer to the list
                pointers.push(tsb);
                
                // While further FDLs exists, add them to the list
                while (pointer !== "///") {
                    pointers.push(pointer);
                    data = this.getBlock(pointer);
                    pointer = data.substring(1,4);
                }

                // Delete them all!
                for (let i = 0; i < pointers.length; i++) {
                    sessionStorage.setItem(pointers[i], "0///" + AsciiLib.nullBlock())
                }
            }

            /*
            / GetBlock Function
            /    Helper function to get a block from Disk, given tsb location
            */
            private getBlock(tsb : string) : string {
                console.log(sessionStorage.getItem(tsb));
                return sessionStorage.getItem(tsb);
            }

            /*
            / SetBlock Function
            /    Helper function to set a block's data on Disk, given tsb location
            */
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
            / WipeChains Function
            /    Helper function wipe ALL chains following a tsb
            */
            private wipeChains(tsb : string) {
                if (tsb !== "///") {
                    // get NEXT chained tsb to wipe
                    let nextTsb = (sessionStorage.getItem(tsb)).substring(1,4);
                    // wipe CURRENT tsb
                    sessionStorage.setItem(tsb, "0///" + AsciiLib.nullBlock());
                    // recursively wipe!
                    this.wipeChains(nextTsb);
                }

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
    
