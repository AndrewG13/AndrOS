/* ------------
   Queue.ts

   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the JavaScript Array documentation at
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
   Look at the push and shift methods, as they are the least obvious here.

   ------------ */

module TSOS {
    export class Queue {
        constructor(public q = new Array()) {
        }

        public getSize() {
            return this.q.length;
        }

        public isEmpty(){
            return (this.q.length == 0);
        }

        public enqueue(element) {
            this.q.push(element);
        }

        public dequeue() {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        }

        public toString() {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        }

        // This function assumes the value is in the Queue
        // This assumption is made for the KernelInitProg function
        public dequeueValue(value) {
            let retVal = null;
            let orgSize = this.getSize();
            for (let i = 0; i < orgSize; i++) {
                // Check if front of Queue is Value
                if (this.q[0] === value) {
                    retVal = this.dequeue()
                } else {
                    // Remove front element, put it 
                    let e = this.dequeue();
                    this.enqueue(e);
                }
            }
            return retVal;
        }
    }
}
