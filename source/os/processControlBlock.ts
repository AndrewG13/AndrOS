/* ------------
     ProcessControlBlock.ts


     ------------ */

     module TSOS {

        export class PCB {
            
            // For assigning states of PCBs
            static STATES : string[] = ["New", "Resident", "Ready", "Running", "Terminated"];
            // For assigning PIDs
            static PID : number = 0;

            // According to notes, should have:
            //  State, PID, PC, X Y regs, Z flag, knowledge of memory "block" / range 
            //  States: New        - Typed in User Textarea (So unused...)
            //          Resident   - After "load" done, will receive PCB, PID, etc
            //          Ready      - On the Ready Queue, will start executing momentarily (instantly)
            //          Running    - In execution
            //          Terminated - If killed or completed

            public state : string;
            public PID : number;
            public PC : number;
            public Acc : number; // may remove
            public Xreg : number;
            public Yreg : number;
            public Zflag : number;
            // public priority : number; 
            public startAddr : number;
            public endAddr : number; // just start + 0xFF (programs are 256 bytes)
            constructor(savedPC : number, savedAcc : number, savedXreg : number, savedYreg : number, savedZflag : number) {
                this.state = PCB.STATES[0];
                this.PID = PCB.PID++;
                this.PC = savedPC;
                this.Acc = savedAcc;
                this.Xreg = savedXreg;
                this.Yreg = savedYreg;
                this.Zflag = savedZflag;

                // Contact the Memory Manager if memory is available
                this.startAddr = _MemoryManager.assignRange();
                this.endAddr = this.startAddr + 0xFF;
            }
            

        }
    }
    