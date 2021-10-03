/* ------------
     Memory.ts


     ------------ */

     module TSOS {

        export class Memory {
            public variable : number;
            
            constructor() {
                this.variable = 0;
            }

            public init() {
                
            }
    
            public cycle(): void {
                _Kernel.krnTrace('CPU cycle');
                // TODO: Accumulate CPU usage and profiling statistics here.
                // Do the real work here. Be sure to set this.isExecuting appropriately.
            }
        }
    }
    