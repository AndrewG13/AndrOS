/* ------------
     Dispatcher.ts

     Handles the context switches (initiated by the Scheduler)
     More notes
     ------------ */
var TSOS;
(function (TSOS) {
    class Dispatcher {
        constructor() { }
        contextSwitch() {
            // Ensure CPU Attributes are saved to PCB
            this.saveState(PIDRUNNING);
            // Remember that Scheduler already moves this to the back of Queue...
            // Dequeuing will occur next pulse.
            // Kernel will contact Dispatcher when PCB Attributes are needed.
            // Indicate PIDRUNNING is now -1, next process begins the following cycle
            //PIDRUNNING = -1;
            _CPU.isExecuting = false;
        }
        // Save state of CPU into just-halted PCB
        saveState(pid) {
            PCBList[pid].Acc = _CPU.accumulator;
            PCBList[pid].IR = _CPU.instrReg;
            PCBList[pid].PC = _CPU.progCounter;
            PCBList[pid].Xreg = _CPU.xReg;
            PCBList[pid].Yreg = _CPU.yReg;
            PCBList[pid].Zflag = _CPU.zFlag;
        }
        // Load CPU with PCB-to-run's Attributes
        loadState() {
            _CPU.accumulator = PCBList[PIDRUNNING].Acc;
            _CPU.instrReg = PCBList[PIDRUNNING].IR;
            _CPU.progCounter = PCBList[PIDRUNNING].PC;
            _CPU.xReg = PCBList[PIDRUNNING].Xreg;
            _CPU.yReg = PCBList[PIDRUNNING].Yreg;
            _CPU.zFlag = PCBList[PIDRUNNING].Zflag;
        }
    }
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=dispatcher.js.map