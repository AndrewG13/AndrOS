/* ------------
     MemoryManager.ts


     ------------ */
var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor() {
            this.variable = 0;
        }
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map