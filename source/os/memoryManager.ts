/* ------------
     MemoryManager.ts


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
    