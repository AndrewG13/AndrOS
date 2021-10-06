/* ------------
     Memory.ts


     ------------ */

     module TSOS {

        export class Memory {

            // Main Memory, 256 addresses, with 1 byte each
            // These represent the addresses found in a computer
            // Each address is s
            memorySize : number = 0x100;
            private memoryAddr : number[];
            private mar : number;
            private mdr : number;
            
            constructor() {
                this.memoryAddr = new Array(this.memorySize);
                
                // The MAR and MDR, they handle address manipulation
                this.mar = 0x00; // stores an address number (location in memory)
                this.mdr = 0x00; // stores a value (that one byte data)
                
            }

            public init() {
                // Initialize all bytes in memory to 0
                for (let addr = 0; addr < this.memorySize; addr++) {
                    this.memoryAddr[addr] = 0x00;
                }

            }
    
            public cycle(): void {
                _Kernel.krnTrace('CPU cycle');
                // TODO: Accumulate CPU usage and profiling statistics here.
                // Do the real work here. Be sure to set this.isExecuting appropriately.
            }
        }
    }
    