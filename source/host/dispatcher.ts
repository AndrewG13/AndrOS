/* ------------
     Dispatcher.ts

     Handles the context switches (initiated by the Scheduler)
     More notes
     ------------ */

     module TSOS {

        export class Dispatcher {

            private num : number;   // dummy variable

            constructor() {
                this.num = 0x000;
            }


            public contextSwitch() {
                // Ensure CPU Attributes are saved to PCB
                this.saveState(PIDRUNNING);
                // Remember that Scheduler already move this to the back...
                
            }

            private saveState(pid : number) {
                PCBList[pid].Acc = _CPU.accumulator;
                PCBList[pid].IR = _CPU.instrReg;
                PCBList[pid].PC = _CPU.progCounter;
                PCBList[pid].Xreg = _CPU.xReg;
                PCBList[pid].Yreg = _CPU.yReg;
                PCBList[pid].Zflag = _CPU.zFlag;
            }

        }
    }
    