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
var TSOS;
(function (TSOS) {
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
    class Disk {
        constructor() {
            this.DIR_START = "000";
            this.FLD_START = "100";
            this.formatted = false;
            //this.init();
        }
        /*
        / Init Function
        /   Initializes memory registers
        */
        init() {
            // Declare & initialize all blocks on the Disk
            for (let t = 0; t < TRACK_SIZE; t++) {
                for (let s = 0; s < SECTOR_SIZE; s++) {
                    for (let b = 0; b < BLOCK_SIZE; b++) {
                        // Place in Session Storage
                        // Format: Key = {t s b}
                        //         Val = {0 / / / -------- etc.}
                        sessionStorage.setItem(t + "" + s + "" + b, "0///" + TSOS.AsciiLib.nullBlock());
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
        reset() {
            this.init();
        }
        /*
        / Reset Block Function
        /   Clear a specific block on the Disk
        */
        resetBlock(tsb) {
            // Clear the specific block on the Disk
        }
        format() {
            this.init();
            _StdOut.putText("Disk Formatted");
        }
        getBlock(tsb) {
            console.log(sessionStorage.getItem(tsb));
        }
        setBlock(tsb, data) {
            // get all data currently at this block
            let entireBlock = sessionStorage.getItem(tsb);
            // get the in-use byte (first byte)
            let inuse = entireBlock.charAt(0);
            // get the pointer, could be null = /// (next three bytes)
            let pointer = entireBlock.substring(1, 4);
            sessionStorage.setItem(tsb, inuse + pointer + data);
        }
        /*
        / Disk Status Function
        /    Gets format status of the Disk (whether it is usable or not)
        */
        status() {
            return this.formatted;
        }
        /*
        / Display function
        /   Param: starting address, ending address (may need to change)
        /   Displays Disk memory blocks from specified limit, Hex formatted
        /   If either parameters are invalid, an error log will print
        */
        display(start, end) {
        }
    }
    TSOS.Disk = Disk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=disk.js.map