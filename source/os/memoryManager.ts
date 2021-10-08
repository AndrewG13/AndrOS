/* ------------
     MemoryManager.ts

     Manages Memory allocation
     Meaning, doing something like "Load" , "Load" should fail for Proj2
     So essentially monitoring & deciding what blocks of memory are free / should be used

     ------------ */

     module TSOS {

        export class MemoryManager {
            public variable : number;
            
            constructor() {
                this.variable = 0;
            }
    
            public cycle(): void {
                _Kernel.krnTrace('MMU cycle');
            }
        }
    }
    