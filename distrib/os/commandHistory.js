/*
*  CommandHistory.ts
*  This is an Array that is more appealing & convenient to keep track of commands entered by the user.
*  It contains a pointer that, initially untouched, points to the current command entered (LIFO).
*  This allows for easy pivoting by the up/down keys.
*  Additionally, unneeded commands will be removed when necessary. (See diagram)
*/
// Currently not done!
var TSOS;
(function (TSOS) {
    class CommandHistory {
        constructor() {
            this.list = new Array();
            this.pointer = -1; // negative 1 because no commands
        }
        /*
        *  getSize Function
        *    returns the list size
        */
        getSize() {
            return this.list.length;
        }
        /*
        *  isEmpty Function
        *    returns true if list is empty
        */
        isEmpty() {
            return (this.list.length == 0);
        }
        /*
        *  add Function
        *    Adds most recently entered command to the 'back' of list (LIFO)
        */
        add(command) {
            // The greator the index = the more recent a command was executed
            this.list[this.getSize()] = command;
            this.pointer++;
        }
        /*
        *  wipeList Function
        *    Deletes all elements proceeding the pointer index
        */
        wipeList() {
            // Pointer moves up (most recent command executed)
            this.pointer++;
            // Create an index starting at commands that need to go
            let toWipeIndex = this.pointer + 1;
            // Wipe all elemnts after pointer
            this.list.splice(toWipeIndex, (this.getSize() - (this.pointer + 1)));
        }
        /*
        *  upArrow Function
        *    Displays & returns current pointer command, THEN decrement pointer
        */
        upArrow() {
            let command = this.list[this.pointer];
            this.pointer--;
            return command;
        }
        /*
        *  downArrow Function
        *    Displays & returns current pointer command, THEN increment pointer
        */
        downArrow() {
            // Touch this
            //let command = this.list[this.pointer];
            //this.pointer--;
        }
        /*
        *  toString Function
        *    Displays all commands in the list
        *    This would only be used for debugging purposes
        */
        toString() {
            var fullHistory = "";
            for (var i in this.list) {
                fullHistory += "[" + this.list[i] + "] ";
            }
            console.log(fullHistory);
        }
    }
    TSOS.CommandHistory = CommandHistory;
})(TSOS || (TSOS = {}));
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
*
*
*  {If user hits 'enter: "prompt" executes, pointer moves to "prompt", all commands proceeding are erased}
*  {Observe the results}
*                                                           Pointer here
*                                                                V
*  Commands Entered   ->  man , ver , help , whereami , date , prompt , ______
*/
//# sourceMappingURL=commandHistory.js.map