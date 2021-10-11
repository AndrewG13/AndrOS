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
var TSOS;
(function (TSOS) {
    // is Command 'InterruptCheck' needed?
    let Commands;
    (function (Commands) {
        Commands[Commands["FETCH"] = 0] = "FETCH";
        Commands[Commands["DECODE"] = 1] = "DECODE";
        Commands[Commands["EXECUTE"] = 2] = "EXECUTE";
        Commands[Commands["WRITEBACK"] = 3] = "WRITEBACK";
    })(Commands || (Commands = {}));
    class Cpu {
        // Registers & Flags
        constructor(progCounter = 0, accumulator = 0, xReg = 0, yReg = 0, zFlag = false, instrReg = 0, overFlow = false, currentCommand = Commands.FETCH, isExecuting = false) {
            this.progCounter = progCounter;
            this.accumulator = accumulator;
            this.xReg = xReg;
            this.yReg = yReg;
            this.zFlag = zFlag;
            this.instrReg = instrReg;
            this.overFlow = overFlow;
            this.currentCommand = currentCommand;
            this.isExecuting = isExecuting;
            // Array of Opcodes (denoting operand quantity)
            this.oneByteOpcode = [0xA9, 0xA2, 0xA0, 0xD0];
            this.twoByteOpcode = [0xAD, 0x8D, 0x6D, 0xAE, 0xAC, 0xEC, 0xEE]; // FF was here
            // CPU-specific members
            //currentCommand: Commands;
            this.firstDPhase = true;
            this.firstEPhase = true;
        }
        init() {
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
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if (this.isExecuting) {
                // Check to see what Command should proceed each cycle
                // Afterwards, move on to next appropriate Command
                if (this.currentCommand === Commands.FETCH) {
                    this.fetch();
                    // Switch to next Command
                    this.currentCommand = Commands.DECODE;
                }
                else if (this.currentCommand === Commands.DECODE) {
                    // in reverse order just in case 0 operand, unaffectant otherwises
                    this.currentCommand = Commands.EXECUTE;
                    this.decode();
                }
                else if (this.currentCommand === Commands.EXECUTE) {
                    // in reverse order just in case Instruction which requires Write Back
                    this.currentCommand = Commands.FETCH;
                    this.execute();
                }
                else { // must be WRITEBACK
                    this.writeBack();
                    this.currentCommand = Commands.FETCH;
                }
                // Display registers each cycle.  
                // * Proj 3, this will be using PCB to determine registers to display
                _MemoryAccessor.displayRegisters(0x00, 0xFF);
            }
        }
        run(pcb) {
            // * Proj 3, will decide which of 3 memory blocks to run based on passed in PCB
            this.isExecuting = true;
            pcb.state = TSOS.PCB.STATES[2];
        }
        // simply grabs byte (instruction) from memory
        fetch() {
            _MemoryAccessor.changeMAR(this.progCounter);
            _MemoryAccessor.readFrom();
            this.instrReg = _MemoryAccessor.checkMDR();
            this.progCounter++;
        }
        // Retrieve data based on instruction (0, 1, or 2 bytes?)
        // Can have 1 phase  (if an instruction with no bytes of data -> call execute immediately)
        //                   (if an instruction with 1 byte of data)
        //       or 2 phases (if an instruction with 2 bytes of data, remember little endian)
        decode() {
            // Special case: FF
            if (this.instrReg == 0xFF && (this.xReg == 0x01 || this.xReg == 0x02)) {
                // Zero OPcode Operand, call execute immediately.
                this.execute();
            }
            else // this.xReg == 0x03
             
            // It will proceed to the two byte opcode block for FF
            // dont forget to remove FF 2 byte opcode handling
            // Check for '2 Operands' Instruction
            if (this.isTwoByteOPCODE()) {
                if (this.firstDPhase) {
                    // set Little Endian flag
                    _MemoryAccessor.setLeFlag();
                    _MemoryAccessor.changeMAR(this.progCounter);
                    _MemoryAccessor.readFrom();
                    this.progCounter++;
                    this.firstDPhase = false;
                    this.currentCommand = Commands.DECODE;
                }
                else {
                    // retrieve data, setup for Execute
                    _MemoryAccessor.changeMAR(this.progCounter);
                    _MemoryAccessor.readFrom();
                    this.progCounter++;
                    this.firstDPhase = true;
                }
            }
            else 
            // Check for '1 Operand' Instruction
            if (this.isOneByteOPCODE()) {
                // retrieve data, setup for Execute
                _MemoryAccessor.changeMAR(this.progCounter);
                _MemoryAccessor.readFrom();
                this.progCounter++;
            }
            else {
                // Must be '0 Operand' Instruction
                // Since the Decode phase does nothing here, call Execute immediately
                this.currentCommand = Commands.FETCH;
                this.execute();
            }
        }
        // Executes the instruction (functionality goes here)
        // Can have 2 phases (only for EE)
        execute() {
            // OP Codes to use: 
            switch (this.instrReg) {
                case 0xA9: // Load Accu with Constant
                    this.accumulator = _MemoryAccessor.checkMDR();
                    break;
                case 0xAD: // Load Accu with Value from Memory
                    this.accumulator = _MemoryAccessor.checkMDR();
                    break;
                case 0x8D: // Store Memory Register with Accu Value
                    _MemoryAccessor.changeMDR(this.accumulator);
                    this.currentCommand = Commands.WRITEBACK;
                    break;
                /*
                  case 0x8A: // Load Accu with X Register Value
                  this.accumulator = this.xReg;
                  break;
                
                  case 0x98: // Load Accu with Y Register value
                  this.accumulator = this.yReg;
                  break;
                */
                case 0x6D: // Add with Carry (Accu += value from Memory Register)
                    let acc = this.accumulator;
                    let mdr = _MemoryAccessor.checkMDR();
                    if (acc >= 0x80) {
                        acc -= 0x100;
                    }
                    if (mdr >= 0x80) {
                        mdr -= 0x100;
                    }
                    acc += mdr;
                    // if negative overflow
                    if (acc < -128) {
                        acc *= -1;
                        acc = 0x100 - acc;
                        this.overFlow = true;
                    }
                    else // if result is negative (valid)
                     if (acc < 0) {
                        acc *= -1;
                        acc = 0x100 - acc;
                    }
                    else // if positive overflow
                     if (acc >= 0x80) {
                        acc -= 0x80;
                        this.overFlow = true;
                    }
                    this.accumulator = acc;
                    break;
                case 0xA2: // Load X Register with Constant
                    this.xReg = _MemoryAccessor.checkMDR();
                    break;
                case 0xAE: // Load X Register with value from Memory
                    this.xReg = _MemoryAccessor.checkMDR();
                    break;
                /*
                  case 0xAA: // Load X Register with Accu value
                  this.xReg = this.accumulator;
                  break;
                */
                case 0xA0: // Load Y Register with Constant
                    this.yReg = _MemoryAccessor.checkMDR();
                    break;
                case 0xAC: // Load Y Register with value from Memory
                    this.yReg = _MemoryAccessor.checkMDR();
                    break;
                /*
                case 0xA8: // Load Y Register with Accu value
                  this.yReg = this.accumulator;
                  break;
                */
                case 0xEA: // No Operation
                    // Did you know that Ducks actually have little teeth?
                    // Look it up, I'm serious
                    break;
                case 0x00: // Break
                    // Stop the CPU commands, may need to change this
                    this.isExecuting = false;
                    // Ask Kernel to conclude program
                    _Kernel.krnEndProg();
                    break;
                case 0xEC: // Compare value from Memory Register to X Register, zFlag = true if equal
                    this.zFlag = (this.xReg == _MemoryAccessor.checkMDR());
                    break;
                case 0xD0: // Branch Constant-bytes if zFlag = false
                    // If branch occurs
                    if (!this.zFlag) {
                        // Calculate how far back the Program Counter needs to go
                        let backtrackDifference = 0x100 - (_MemoryAccessor.checkMDR());
                        // Backtrack the Program Counter based on result (Loop back to desired register)
                        this.progCounter -= backtrackDifference;
                    }
                    break;
                case 0xEE: // Increment value in Memory Register
                    if (this.firstEPhase) {
                        this.accumulator = _MemoryAccessor.checkMDR();
                        this.firstEPhase = false;
                        this.currentCommand = Commands.EXECUTE;
                    }
                    else {
                        this.accumulator++;
                        if (this.accumulator == 0x100) {
                            this.accumulator = 0x00;
                            this.overFlow = true;
                        }
                        _MemoryAccessor.changeMDR(this.accumulator);
                        this.firstEPhase = true;
                        this.currentCommand = Commands.WRITEBACK;
                    }
                    break;
                case 0xFF: // Multiple Cases
                    if (this.xReg == 0x01) {
                        _StdOut.putText("" + this.yReg);
                    }
                    else { // must be xReg == 0x02
                        // where in memory = front part of PC & yReg
                        // example: PC=1234 yReg=AA, place in memory = 12AA
                        let inMemory;
                        if (this.progCounter < 0x100) {
                            inMemory = this.yReg;
                        }
                        else {
                            inMemory = (((this.progCounter / 0x100) * 0x100) + this.yReg);
                        }
                        _MemoryAccessor.changeMAR(inMemory);
                        _MemoryAccessor.readFrom();
                        while (_MemoryAccessor.checkMDR() != 0x00) {
                            _StdOut.putText(TSOS.AsciiLib.encode(_MemoryAccessor.checkMDR()));
                            _MemoryAccessor.changeMAR((_MemoryAccessor.checkMAR()) + 1);
                            _MemoryAccessor.readFrom();
                        }
                    }
                    this.currentCommand = Commands.FETCH;
                    break;
            }
        }
        // To keep it in sync with Gormanly's project, writeback is an extra cycle
        // Write back whats in MDR to the memory location in MAR
        // Pretty sure just for EE
        writeBack() {
            _MemoryAccessor.writeTo();
        }
        /*
        / Is Two Byte Opcode? function
        / Finds out if the current instruction requires 2 Operands (retrievals from memory)
        */
        isTwoByteOPCODE() {
            for (let i = 0; i < this.twoByteOpcode.length; i++) {
                if (this.instrReg == this.twoByteOpcode[i]) {
                    return true;
                }
            }
            return false;
        }
        /*
        / Is One Byte Opcode? function
        / Finds out if the current instruction requires 1 Operand (retrievals from memory)
        */
        isOneByteOPCODE() {
            for (let i = 0; i < this.oneByteOpcode.length; i++) {
                if (this.instrReg == this.oneByteOpcode[i]) {
                    return true;
                }
            }
            return false;
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map