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

            // Check to see what Command should proceed each cycle
            // Afterwards, move on to next appropriate Command

            if (this.currentCommand === Commands.FETCH){
                this.fetch();

                // Switch to next Command
                this.currentCommand = Commands.DECODE;
            } else
            if (this.currentCommand === Commands.DECODE){

                // in reverse order just in case 0 operand, unaffectant otherwises
                this.currentCommand = Commands.EXECUTE;
                this.decode();
            } else
            if (this.currentCommand === Commands.EXECUTE){

                // in reverse order just in case Instruction which requires Write Back
                this.currentCommand = Commands.FETCH;
                this.execute();
            } else { // must be WRITEBACK
                this.writeBack();

                this.currentCommand = Commands.FETCH;
            } 

            }
        }

        public run(pcb : PCB) {


        }

        // simply grabs byte (instruction) from memory
        public fetch() {
            _MemoryAccessor.changeMAR(this.progCounter);
            _MemoryAccessor.readFrom();
            this.instrReg = _MemoryAccessor.checkMDR();
            this.progCounter++;
        }

        // Retrieve data based on instruction (0, 1, or 2 bytes?)
        // Can have 1 phase  (if an instruction with no bytes of data -> burn a cycle)
        //                   (if an instruction with 1 byte of data)
        //       or 2 phases (if an instruction with 2 bytes of data, remember little endian)
        public decode() {

            if (this.instrReg == 0xFF && (this.xReg == 0x01 || this.xReg == 0x02)) {

                if (this.debug){console.log("0 Operand Instruction, SKIP DECODE");}
                this.execute();
            } else  // this.xReg == 0x03
                    // It will proceed to the two byte opcode block for FF
      
      
            // Check for '2 Operands' Instruction
            if (this.isTwoByteOPCODE()) {
              if (this.firstDPhase){
                // set Little Endian flag
                this._mmu.setLeFlag();
                this._mmu.changeMAR(this.progCounter);
                this._mmu.readFrom();
                this.progCounter++;
                this.firstDPhase = false;
                this.currentCommand = Commands.DECODE;
              } else {
                // retrieve data, setup for Execute
                this._mmu.changeMAR(this.progCounter);
                this._mmu.readFrom();
                this.progCounter++;
                this.firstDPhase = true;
              }
            } else
            // Check for '1 Operand' Instruction
            if (this.isOneByteOPCODE()) {
              // retrieve data, setup for Execute
              this._mmu.changeMAR(this.progCounter);
              this._mmu.readFrom();
              this.progCounter++;
            } else {
            // Must be '0 Operand' Instruction
            // Since the Decode phase does nothing here, call Execute immediately
            if (this.debug){console.log("0 Operand Instruction, SKIP DECODE");}
            this.currentCommand = Commands.INTERRUPTCHECK;
            this.execute();
            }

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
