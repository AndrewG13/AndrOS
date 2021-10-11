/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    // is Command 'InterruptCheck' needed?
    enum Commands { FETCH, DECODE, EXECUTE, WRITEBACK }

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }

        public run(pcb : PCB) {

            

            // at the end of run, clear memory for that specific block
            _MemoryAccessor.resetMem();
        }

        // simply grabs byte (instruction) from memory
        public fetch() {

        }

        // Retrieve data based on instruction (0, 1, or 2 bytes?)
        // Can have 1 phase  (if an instruction with no bytes of data -> burn a cycle)
        //                   (if an instruction with 1 byte of data)
        //       or 2 phases (if an instruction with 2 bytes of data, remember little endian)
        public decode() {

        }

        // Executes the instruction (functionality goes here)
        // Can have 2 phases (only for EE)
        public execute() {

        }

        // To keep it in sync with Gormanly's project, writeback is an extra cycle
        // Write back whats in MDR to the memory location in MAR
        // Pretty sure just for EE
        public writeBack() {

        }
    }
}
