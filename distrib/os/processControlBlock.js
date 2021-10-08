/* ------------
     ProcessControlBlock.ts


     ------------ */
var TSOS;
(function (TSOS) {
    class PCB {
        //public variable : number;
        // According to notes, should have:
        //  State, PID, PC, X Y regs, Z flag, knowledge of memory "block" / range 
        //  States: New        - Typed in User Textarea (So unused...)
        //          Resident   - After "load" done, will receive PCB, PID, etc
        //          Ready      - On the Ready Queue, will start executing momentarily (instantly)
        //          Running    - In execution
        //          Terminated - If killed or completed
        constructor() {
            //this.variable = 0;
        }
    }
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=processControlBlock.js.map