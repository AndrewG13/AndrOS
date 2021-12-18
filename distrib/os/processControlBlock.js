/* ------------
     ProcessControlBlock.ts

     PCBs are stored & managed in the Memory Manager

     ------------ */
var TSOS;
(function (TSOS) {
    class PCB {
        constructor(savedPC, savedAcc, savedXreg, savedYreg, savedZflag, loadedToDisk) {
            this.state = PCB.STATES[0];
            this.PID = PCB.PID++;
            this.IR = 0x00;
            this.PC = savedPC;
            this.Acc = savedAcc;
            this.Xreg = savedXreg;
            this.Yreg = savedYreg;
            this.Zflag = savedZflag;
            this.onDisk = loadedToDisk;
            // this.priority = ?
            // These will be assigned by the Memory Manager (triggered in "Load").
            // For now default to null.
            this.base = null;
            this.limit = null;
        }
        /*
        / Update PCB Function
        /    Syncs PCB attributes to CPU
        /    This is used while in execution
        */
        updatePCB() {
            this.PC = _CPU.progCounter;
            this.Acc = _CPU.accumulator;
            this.Xreg = _CPU.xReg;
            this.Yreg = _CPU.yReg;
            this.Zflag = _CPU.zFlag;
        }
    }
    // For assigning states of PCBs
    PCB.STATES = ["Resident", "Ready", "Running", "Terminated"];
    // For assigning PIDs
    PCB.PID = 0;
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=processControlBlock.js.map