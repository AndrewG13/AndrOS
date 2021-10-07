/* ------------
     MemoryAccessor.ts

        Synonymous to Gormanly's MMU

     ------------ */

     module TSOS {

        export class MemoryAccessor {
            // Accessing the Main Memory Object -> _Memory 
            
            // Little Endian Flag: Used to indicate when the following 2 DATA inputs will be in LE format
            // Index 0 = Flag
            //           Flag = 0 : No
            //           Flag = 1 : Yes, lob will be stored
            //           Flag = 2 : Yes, hob will be added, full address complete
            //
            // Index 1 = Address (to manipulate)
            private leFlag : number[] = new Array(0x2);

            constructor() {
                this.leFlag[0] = 0; // LE flag      set to zero 
                this.leFlag[1] = 0; // data-portion set to zero
            }

            /*
            / Set Little Endian Flag function
            / Sets the flag accordingly (based on instruction/opcode)
            */
            public setLeFlag() : void {
                this.leFlag[0] = 1; // on, indicating Little Endian
            }

            // The following functions are major actions the Accessor does
            // Redundant, but simulates how the Accessor is the one doing the Memory touches

            /*
            / writeTo function
            /   Synonymous to Memory's write()
            */
            public writeTo() : void {
                _Memory.write();
            }

            /*
            / checkMAR function
            / Return: address (from MAR)
            / Synonymous to Memory's getMAR()
            */
            public checkMAR() : number {
                return _Memory.getMAR();
            }

            /*
            / checkMDR function
            / Return: data (from MDR)
            / Synonymous to Memory's getMDR()
            */
            public checkMDR() : number {
               return _Memory.getMDR();
            }

            /*
            / changeMAR function
            / Param: address (to set MAR)
            / Synonymous to Memory's setMAR()
            */
            public changeMAR(newMar : number) : void {
                _Memory.setMAR(newMar);
            }

            /*
            / changeMDR function
            / Param: data (to set MDR)
            / Synonymous to Memory's setMDR()
            / Additional Check if Little Endian is required
            */
            public changeMDR(newMdr : number) : void {
                _Memory.setMDR(newMdr);
            }


            // Shouldn't need a cycle function
        }
    }
    