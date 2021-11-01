/* ------------
   Queue.ts

   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the JavaScript Array documentation at
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
   Look at the push and shift methods, as they are the least obvious here.

   ------------ */
var TSOS;
(function (TSOS) {
    class Queue {
        constructor(q = new Array()) {
            this.q = q;
        }
        getSize() {
            return this.q.length;
        }
        isEmpty() {
            return (this.q.length == 0);
        }
        enqueue(element) {
            this.q.push(element);
        }
        dequeue() {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        }
        toString() {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        }
        // This function assumes the value is in the Queue
        // This assumption is made for the KernelInitProg function
        dequeueValue(value) {
            let retVal = null;
            let orgSize = this.getSize();
            for (let i = 0; i < orgSize; i++) {
                // Check if front of Queue is Value
                if (this.q[0] === value) {
                    retVal = this.dequeue();
                }
                else {
                    // Remove front element, put it 
                    let e = this.dequeue();
                    this.enqueue(e);
                }
            }
            return retVal;
        }
    }
    TSOS.Queue = Queue;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=queue.js.map