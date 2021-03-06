/* ------------
     MemoryAccessor.ts

        Synonymous to Gormanly's MMU

     ------------ */
var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() {
            // Little Endian Flag: Used to indicate when the following 2 DATA inputs will be in LE format
            // Index 0 = Flag
            //           Flag = 0 : No
            //           Flag = 1 : Yes, lob will be stored
            //           Flag = 2 : Yes, hob will be added, full address complete
            //
            // Index 1 = Address (to manipulate)
            this.leFlag = new Array(0x2);
            this.leFlag[0] = 0; // LE flag      set to zero 
            this.leFlag[1] = 0; // data-portion set to zero
            // Initialize Base & Limit registers
            this.base = 0x000;
            this.limit = 0x000;
        }
        /*
        / Set Little Endian Flag function
        /    Sets the flag accordingly (based on instruction/opcode)
        */
        setLeFlag() {
            this.leFlag[0] = 1; // on, indicating Little Endian
        }
        /*
        / writeImmediate function
        /    Param: Register, Data
        /    Writes a single byte to memory based on specifications
        /    Utilizes MAR & MDR manipulation in one method
        /    MAR & MDR will remain untouched after computation
        /
        /    FOR OS PROJ: This is how "load" will populate main memory
        */
        writeImmediate(register, data) {
            this.changeMDR(data);
            this.changeMAR(register);
            this.writeTo();
        }
        /////////////////////////////////////////////////////////////////////////////////////
        //  The following functions are major actions the Accessor does.                    //
        //  Redundant function calls, but simulates how the Accessor is manipulating Memory //
        //  Not using inheritance because that doesn't conceptually make sense              //
        /////////////////////////////////////////////////////////////////////////////////////
        /*
        / displayRegisters function
        /    Param: start address, end address
        /    Synonymous to Memory's displayMemory()
        */
        displayRegisters(start, end) {
            _Memory.display(start, end);
        }
        /*
        / reset function
        /    Synonymous to Memory's reset()
        */
        resetMem() {
            _Memory.reset();
        }
        /*
        / resetBlock function
        /    Resets a specified portion of memory
        */
        resetBlock(start, end) {
            _Memory.resetRegs(start, end);
        }
        /*
        / readFrom function
        /    Synonymous to Memory's read() + LE check
        */
        readFrom() {
            if (this.checkMAR() < this.base || this.checkMAR() > this.limit) {
                // This means a memory write violation has occurred
                // Send violation notice to the CPU
                _CPU.end("[Violation: Invalid Access Attempt]");
            }
            else {
                // No violation, read
                _Memory.read();
                // If MDR contains an instruction that utilizes Little Endian formats
                //  in its next 2 registers/data inputs, set the leFlag = 1
                // Checks for Little Endian Addressing:
                // Check if MDR is a High Order Byte
                if (this.leFlag[0] == 2) {
                    // Format address based on stored Lob and new Hob
                    this.leFlag[1] += (_Memory.getMDR() * 256);
                    // Change MAR to appropriate address, reset leFlag
                    this.changeMAR(this.leFlag[1]);
                    // Second read to get the appropriate value into the MDR
                    // based on the new (LE) MAR
                    _Memory.read();
                    // reset flag
                    this.leFlag[0] = 0;
                    this.leFlag[1] = 0;
                }
                // Check if MDR is a Low Order Byte
                if (this.leFlag[0] == 1) {
                    // set address data
                    this.leFlag[1] = _Memory.getMDR();
                    // set flag to 2 (HOB incoming)
                    this.leFlag[0] = 2;
                }
            }
        }
        /*
        / writeTo function
        /   Synonymous to Memory's write()
        */
        writeTo() {
            // Check if memory violation attempt
            if (this.checkMAR() < this.base || this.checkMAR() > this.limit) {
                // This means a memory write violation has occurred
                // Send violation notice to the CPU
                _CPU.end("[Violation: Invalid Access Attempt]");
            }
            else {
                // No violation, write
                _Memory.write();
            }
        }
        /*
        / checkMAR function
        /    Return: address (from MAR)
        /    Synonymous to Memory's getMAR()
        */
        checkMAR() {
            return _Memory.getMAR();
        }
        /*
        / checkMDR function
        /    Return: data (from MDR)
        /    Synonymous to Memory's getMDR()
        */
        checkMDR() {
            return _Memory.getMDR();
        }
        /*
        / changeMAR function
        /    Param: address (to set MAR)
        /    Synonymous to Memory's setMAR()
        */
        changeMAR(newMar) {
            _Memory.setMAR(newMar + this.base);
        }
        /*
        / changeMDR function
        /    Param: data (to set MDR)
        /    Synonymous to Memory's setMDR()
        /    Additional Check if Little Endian is required
        */
        changeMDR(newMdr) {
            _Memory.setMDR(newMdr);
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map