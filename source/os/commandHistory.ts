/*
*  CommandHistory.ts
*  This is an Array that is more appealing & convenient to keep track of commands entered by the user.
*  It contains a pointer that, initially untouched, points to the current command entered (LIFO).
*  This allows for easy pivoting by the up/down keys.
*/

// Currently not done!

module TSOS {
    export class CommandHistory {


        // points to the NEXT command to show (LIFO)
        public pointer: number;  
        //   arrow up would increment the pointer
        // arrow down would decrement the pointer
        private list;


        constructor() {
            this.list = new Array();
            this.pointer = -1; // negative 1 because no commands
        }

       /*
       *  getSize Function
       *    returns the list size
       */
        public getSize() {
            return this.list.length;
        }

       /*
       *  isEmpty Function
       *    returns true if list is empty
       */
        public isEmpty() {
            return (this.list.length == 0);
        }

       /*
       *  add Function
       *    Adds most recently entered command to the 'back' of list (LIFO)
       */
        public add(command) {
            // The greator the index = the more recent a command was executed
            this.list[this.getSize()] = command;
            this.pointer = this.getSize() - 1;
        }

       /*
       *  wipeList Function
       *    This function has determined to be unneeded, therefore goes unused
       *    Deletes all elements proceeding the pointer index
       */
        public wipeList() {
            // Create an index starting at commands that need to go
            let toWipeIndex = this.pointer + 1;
            // Wipe all elements after pointer
            this.list.splice(toWipeIndex, (this.getSize() - (this.pointer + 1)));
        }

       /*
       *  upArrow Function
       *    Displays & returns current pointer command, THEN decrement pointer
       *    Console.ts handles validity (if user is on FIRST command, can't go further up)
       */
        public upArrow() {
            let command : string = this.list[this.pointer];
            this.pointer--;
            console.log(this.pointer);
            return command;
        }

       /*
       *  downArrow Function
       *    Displays & returns current pointer command, THEN increment pointer
       */
        public downArrow() {
            this.pointer += 2;
            let command : string = this.list[this.pointer];
            this.pointer--;
            console.log(this.pointer);
            return command;
        }

       /*
       *  toString Function
       *    Displays all commands in the list
       *    This would only be used for debugging purposes
       */
        public toString() : void {
            var fullHistory = "";
            for (var i in this.list) {
                fullHistory += "[" + this.list[i] + "] ";
            }
            console.log(fullHistory);
        }
    }
}

/*
*  Example Diagram:
*
*                     First entered                                  Last entered. Pointer here
*                          V                                                      V
*  Commands Entered   ->  man , ver , help , whereami , date , prompt , party , dance, ______
*
*  {At this point, if the user does an 'arrow up': "dance" will be displayed & the pointer moves to "party"}
*  {Another 'arrow up': "party" displayed & pointer at "prompt"}
*  {Another 'arrow up': "prompt" displayed & pointer at "date"}
*  {Heres the resulting list:}
*
*                                                    Pointer here
*                                                         V
*  Commands Entered   ->  man , ver , help , whereami , date , prompt , party , dance , ______
*
*/
