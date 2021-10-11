/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5

     My CPU is derived from Gormanly's Org & Arch class.  Therefore, my CPU is quite extensive.
     The intracies are present to really simulate how the CPU should be functioning.
     I hope it does not make YOUR brain melt like that student you showed us.
     ------------ */

module TSOS {

    // is Command 'InterruptCheck' needed?
    enum Commands { FETCH, DECODE, EXECUTE, WRITEBACK }

    export class Cpu {

      // Array of Opcodes (denoting operand quantity)
      oneByteOpcode : number[] = [0xA9, 0xA2, 0xA0, 0xD0];
      twoByteOpcode : number[] = [0xAD, 0x8D, 0x6D, 0xAE, 0xAC, 0xEC, 0xEE, 0xFF];
      
      // CPU-specific members
      currentCommand: Commands;
      firstDPhase: boolean = true;
      firstEPhase: boolean = true;

      // Registers & Flags
 


        constructor(public progCounter: number = 0,
                    public accumulator: number = 0,
                    public xReg: number = 0,
                    public yReg: number = 0,
                    public zFlag: boolean = false,
                    public instrReg: number = 0,
                    public overFlow: boolean = false,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.progCounter = 0;
            this.accumulator = 0;
            this.xReg = 0;
            this.yReg = 0;
            this.zFlag = false;
            this.instrReg = 0;
            this.overFlow = false;
            this.currentCommand = Commands.FETCH;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if (this.isExecuting) {

            }
        }

        public run(pcb : PCB) {


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

            // OP Codes to use: 

        }

        // To keep it in sync with Gormanly's project, writeback is an extra cycle
        // Write back whats in MDR to the memory location in MAR
        // Pretty sure just for EE
        public writeBack() {

        }
    }
}
