/* ------------
     ProcessControlBlock.ts


     ------------ */
var TSOS;
(function (TSOS) {
    class PCB {
        //public variable : number;
        // According to notes, should have:
        //  State, PID, PC, X Y regs, Z flag, knowledge of memory "block" / range 
        //  States: New Running Waiting Ready Terminated Resident
        constructor() {
            //this.variable = 0;
        }
    }
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=processControlBlock.js.map