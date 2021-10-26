/* ------------
     ProcessControlBlock.ts

     PCBs are stored & managed in the Memory Manager

     ------------ */

     module TSOS {

        export class PCB {
            
            // For assigning states of PCBs
            static STATES : string[] = ["Resident", "Ready", "Running", "Terminated"];
            // For assigning PIDs
            static PID : number = 0;

            // According to notes, PCBs should have:
            //  State, PID, PC, X Y regs, Z flag, knowledge of memory "block" / range 
            //
            //  States: New        - Typed in User Textarea (So unused...)
            //          Resident   - After "load" done, will receive PCB, PID, etc
            //          Ready      - On the Ready Queue, will start executing momentarily (instantly)
            //          Running    - In execution
            //          Terminated - If killed or completed

            public state : string;
            public PID : number;
            public PC : number;
            public Acc : number; 
            public Xreg : number;
            public Yreg : number;
            public Zflag : boolean;
            // public priority : number; // * Proj 4
            public base : number;    // Beginning index
            public limit : number;   // Ending index

            constructor(savedPC : number, savedAcc : number, savedXreg : number, savedYreg : number, savedZflag : boolean) {
                this.state = PCB.STATES[0];
                this.PID = PCB.PID++;
                this.PC = savedPC;
                this.Acc = savedAcc;
                this.Xreg = savedXreg;
                this.Yreg = savedYreg;
                this.Zflag = savedZflag;
                // this.priority = ?

                // These will be assigned by the Memory Manager (triggered in "Load")
                // For now default to null
                this.base = null;
                this.limit = null;
            }
            
            /*
            / Update PCB Function
            /    Syncs PCB attributes to CPU
            /    This is used while in execution
            */
            public updatePCB() {
                this.PC = _CPU.progCounter;
                this.Acc = _CPU.accumulator;
                this.Xreg = _CPU.xReg;
                this.Yreg = _CPU.yReg;
                this.Zflag = _CPU.zFlag;
            }


        }
    }
    