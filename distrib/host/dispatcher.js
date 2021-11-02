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
            // Set state of PIDRUNNING to Ready
            PCBList[PIDRUNNING].state = TSOS.PCB.STATES[1];
        }
        // Save state of CPU into just-halted PCB
        // Also save state of MDR & MAR
        saveState(pid) {
            PCBList[pid].Acc = _CPU.accumulator;
            PCBList[pid].IR = _CPU.instrReg;
            PCBList[pid].PC = _CPU.progCounter;
            PCBList[pid].Xreg = _CPU.xReg;
            PCBList[pid].Yreg = _CPU.yReg;
            PCBList[pid].Zflag = _CPU.zFlag;
            // Determining which partition owns this MAR & MDR
            // Can do division to solve but this is more readable.
            switch (PCBList[pid].base) {
                case 0x000:
                    MARSTATE[0] = _Memory.getMAR();
                    MDRSTATE[0] = _Memory.getMDR();
                    break;
                case 0x100:
                    MARSTATE[1] = _Memory.getMAR();
                    MDRSTATE[1] = _Memory.getMDR();
                    break;
                case 0x200:
                    MARSTATE[2] = _Memory.getMAR();
                    MDRSTATE[2] = _Memory.getMDR();
                    break;
            }
        }
        // Load CPU with PCB-to-run's Attributes
        // Also load state of MDR & MAR
        loadState() {
            _CPU.accumulator = PCBList[PIDRUNNING].Acc;
            _CPU.instrReg = PCBList[PIDRUNNING].IR;
            _CPU.progCounter = PCBList[PIDRUNNING].PC;
            _CPU.xReg = PCBList[PIDRUNNING].Xreg;
            _CPU.yReg = PCBList[PIDRUNNING].Yreg;
            _CPU.zFlag = PCBList[PIDRUNNING].Zflag;
            // Determining which partition owns this MAR & MDR
            switch (PCBList[PIDRUNNING].base) {
                case 0x000:
                    _Memory.setMAR(MARSTATE[0]);
                    _Memory.setMDR(MDRSTATE[0]);
                    break;
                case 0x100:
                    _Memory.setMAR(MARSTATE[1]);
                    _Memory.setMDR(MDRSTATE[1]);
                    break;
                case 0x200:
                    _Memory.setMAR(MARSTATE[2]);
                    _Memory.setMDR(MDRSTATE[2]);
                    break;
            }
        }
    }
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=dispatcher.js.map