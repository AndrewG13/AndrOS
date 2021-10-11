/* ------------
     ProcessControlBlock.ts

     PCBs are stored & managed in the Memory Manager

     ------------ */
var TSOS;
(function (TSOS) {
    class PCB {
        constructor(savedPC, savedAcc, savedXreg, savedYreg, savedZflag) {
            this.state = PCB.STATES[0];
            this.PID = PCB.PID++;
            this.PC = savedPC;
            this.Acc = savedAcc;
            this.Xreg = savedXreg;
            this.Yreg = savedYreg;
            this.Zflag = savedZflag;
            // this.priority = ?
            // Since "load" contacted the Memory Manager, we know memory is available.
            // Now assign an address range / block
            this.startAddr = _MemoryManager.assignRange();
            this.endAddr = this.startAddr + 0xFF;
        }
    }
    // For assigning states of PCBs
    PCB.STATES = ["Resident", "Ready", "Running", "Terminated"];
    // For assigning PIDs
    PCB.PID = 0;
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=processControlBlock.js.map