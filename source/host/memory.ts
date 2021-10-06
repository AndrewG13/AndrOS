/* ------------
     Memory.ts

     This implementation of main memory comes directly from my VM project 
     in Organization and Architecture class with Gormanly 

     ------------ */

     module TSOS {

        export class Memory {

            // Main Memory, 256 addresses, 1 byte stored at each address
            memorySize : number = 0x100;
            private memoryAddr : number[];
            // The MAR & MDR, they handle address retrieval & manipulation
            private mar : number; // stores an address index (location in memory)
            private mdr : number; // stores a value (one byte of data)
            
            constructor() {
                this.memoryAddr = new Array(this.memorySize);
                this.mar = 0x00; 
                this.mdr = 0x00; 
            }

            /*
            / Init Function
            /   Initializes memory registers
            */
            public init() : void {
                // Change all bytes in memory = 0
                for (let addr = 0; addr < this.memorySize; addr++) {
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
            public setMar(newMar : number) : void {
                this.mar = newMar;
            }

            /*
            / SetMdr Function
            /   Sets the MDR based on parameter
            */
            public setMdr(newMdr : number) : void {
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

            public cycle(): void {
                _Kernel.krnTrace('MEM cycle');
                // MyTODO: Display memory code here?
            }
        }
    }
    