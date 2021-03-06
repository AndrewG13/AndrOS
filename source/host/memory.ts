/* ------------
     Memory.ts

     This implementation of main memory comes directly from my VM project 
     in Organization and Architecture class with Gormanly 
     Things have been reworked for this project, and if you see any redundancy (here and Accessor),
     I did so with the intention of simulating how things really work.  Hopefully I was accurate.
     ------------ */

     module TSOS {

        export class Memory {

            // Main Memory, 768 addresses, 1 byte stored at each address
            // Partitioned into 3 blocks [0-255], [256-511], [512-767]
            private memoryAddr : number[];

            // The MAR & MDR, they handle address retrieval & manipulation
            private mar : number; // stores an address index (location in memory)
            private mdr : number; // stores a value (one byte of data)
            
            constructor() {
                this.memoryAddr = new Array(MEMORY_SIZE);
                this.mar = 0x00; 
                this.mdr = 0x00; 
            }

            /*
            / Init Function
            /   Initializes memory registers
            */
            public init() : void {
                // Change all bytes in memory = 0
                for (let addr = 0; addr < MEMORY_SIZE; addr++) {
                    this.memoryAddr[addr] = 0x00;
                }
            }

            /*
            / Reset Function
            /   Formats memory to initial values
            */
            public reset() : void {
                this.init();
                this.mdr = 0x00;
                this.mar = 0x00;
            }

            /*
            / ResetRegs Function
            /   Initializes memory registers
            */
            public resetRegs(start : number, end : number) : void {
                // Change all bytes in memory between start & end
                for (let addr = start; addr <= end; addr++) {
                    this.memoryAddr[addr] = 0x00;
                }
            }
    
            /*
            / GetMar Function
            /   Returns the MAR
            */
            public getMAR() : number {
                return this.mar;
            }

            /*
            / GetMdr Function
            /   Returns the MDR
            */
            public getMDR() : number {
                return this.mdr;
            }

            /*
            / SetMar Function
            /   Sets the MAR based on parameter
            */
            public setMAR(newMar : number) : void {
                this.mar = newMar;
            }

            /*
            / SetMdr Function
            /   Sets the MDR based on parameter
            */
            public setMDR(newMdr : number) : void {
                this.mdr = newMdr;
            }

            /*
            / Read function
            /   Take the value in the register specified by the MAR, and store it in the MDR
            /   "Take a byte from memory"
            */
            public read(): void {
                this.mdr = this.memoryAddr[this.mar];
            }
  
            /*
            / Write function
            /   Take the value in the MDR, and store it in the register specified by the MAR
            /   "Putting a byte into memory"
            */
            public write(): void {
                this.memoryAddr[this.mar] = this.mdr;
            }

            /*
            / DisplayMemory function
            /   Param: starting address, ending address
            /   Displays memory addresses from specified limit, Hex formatted
            /   If either parameters are invalid, an error log will print
            */
            public display(start : number, end : number) {

                // Check if invalid portion of memory
                if (start >= this.memoryAddr.length || start < 0 || end >= this.memoryAddr.length || end < start) {
                    _StdOut.putText("Illegal memory parameters");
                } else {
                // Must be valid range, display accordingly
                    while(start < this.memoryAddr.length && start <= end) {
                        _MemoryTableCells[start].innerHTML = hexLog(this.memoryAddr[start], 2);
                        start = start + 0x01;
                    }
                }
            }

        }
    }
    