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
        public pointer: number;
      
        constructor(public list = new Array()) {
          pointer = 0;
        }

        public getSize() {
            return this.list.length;
        }

        public isEmpty() {
            return (this.list.length == 0);
        }

         
        public add(element) {
            // Touch this (FIFO Style)
            //this.list.push(element);
        }

        public wipeList() {
            // Touch this
          
            // Wipe all elements after pointer

        }

        public upArrow() {
            // Touch this
          
          
        }
        
        public downArrow() {
            // Touch this
          
          
        }
      
      
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
