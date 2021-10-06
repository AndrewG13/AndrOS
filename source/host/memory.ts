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

            /*
            / Init Function
            /   Initializes memory registers and the mar & mdr
            */
            public init() {
                // Initialize all bytes in memory to 0
                for (let addr = 0; addr < this.memorySize; addr++) {
                    this.memoryAddr[addr] = 0x00;
                }
                this.mar = 0x00;
                this.mdr = 0x00;

            }
    
            /*
            / GetMar Function
            /   Returns the MAR
            */
            public getMar() : number {
                return this.mar;
            }

            /*
            / GetMdr Function
            /   Returns the MDR
            */
            public getMdr() : number {
                return this.mdr;
            }

            /*
            / SetMar Function
            /   Sets the MAR based on parameter
            */
            public setMar(newMar : number) {
                this.mar = newMar;
            }

            /*
            / SetMdr Function
            /   Sets the MDR based on parameter
            */
            public setMdr(newMdr : number) {
                this.mdr = newMdr;
            }

            public cycle(): void {
                //_Kernel.krnTrace('CPU cycle');
                // Display memory code here
            }
        }
    }
    