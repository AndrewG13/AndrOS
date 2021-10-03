/* ------------
     Memory.ts


     ------------ */
var TSOS;
(function (TSOS) {
    class Memory {
        constructor() {
            this.variable = 0;
        }
        init() {
        }
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map