/*
*  CommandHistory.ts
*  This is an Array that is more appealing & convenient to keep track of commands entered by the user.
*  It contains a pointer that, initially untouched, points to the current command entered (LIFO).
*  This allows for easy pivoting by the up/down keys.
*  Additionally, unneeded commands
*/

// Currently not done!

module TSOS {
    export class commandHistory {
        
        // points to the NEXT command to show (LIFO)
        
        public pointer: number;  //   arrow up would increment the pointer
                                 // arrow down would decrement the pointer
      
        constructor(public list = new Array()) {
            pointer = 0;
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
       *    Adds most recently entered command to top of list (FIFO)
       */
        public add(command) {
            // Touch this (FIFO Style)
            
            //this.list.push(command);
        }

       /*
       *  wipeList Function
       *    Deletes all elements proceeding the pointer index
       */
        public wipeList() {
            // Touch this
          
            // Wipe all elements after pointer

        }

       /*
       *  upArrow Function
       *    Displays current pointer command, then increments pointer
       */
        public upArrow() {
            // Touch this
          
          
        }
        
       /*
       *  downArrow Function
       *    Displays current pointer command, then decrements pointer
       */
        public downArrow() {
            // Touch this
          
          
        }
      
       /*
       *  toString Function
       *    Displays all commands in the list
       *    This would only be used for debugging purposes
       */
        public toString() {
            var retVal = "";
            for (var i in this.list) {
                retVal += "[" + this.list[i] + "] ";
            }
            return retVal;
        }
    }
}

/*
*  Example Diagram:
*  
*                     First entered                           Last entered. Pointer here
*                          V                                               V
*  Commands Entered   ->  man , ver , help , whereami , date , prompt , dance, ______
*      
*  {At this point, if the user does an 'arrow up', "dance" will be displayed & the pointer moves to "prompt"}
*  {Another 'arrow up' = "prompt" displayed & pointer at "date"}
*  {Heres the resulting list:}
* 
*                                                    Pointer here
*                                                         V
*  Commands Entered   ->  man , ver , help , whereami , date , prompt , dance, ______
*
*
*
*  {If the user hits 'enter', "date" executes & all commands after pointer are erased}
*  {Observe the results}
*                                                    Pointer here
*                                                         V
*  Commands Entered   ->  man , ver , help , whereami , date , ______
*/
