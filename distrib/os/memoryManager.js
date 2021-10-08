/* ------------
     MemoryManager.ts

     Manages Memory allocation
     Meaning, doing something like "Load" , "Load" should fail for Proj2
     So essentially monitoring & deciding what blocks of memory are free / should be used

     ------------ */
var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor() {
            this.variable = 0;
        }
        cycle() {
            _Kernel.krnTrace('MMU cycle');
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map