/* ------------
     Scheduler.ts

     Keeps track of processes & initiates context switches when necessary.
     Context switches are dependant on the Scheduling Methodology in action.
     The Scheduler does not actually handle context switches, thats the Dispatcher's job
     ------------ */

     module TSOS {

        export class Scheduler {

            // Consider having KrnInitProg deqVal, then enq it to put it in the back of the ReadyQueue 
            // (its state will be "Running")
            
            private pidRunning : number;
            constructor() {
                this.pidRunning = _CPU.pidRunning;
            }

            public cycle() : void {
                
            }

            public scheduleProcess() {
                
            }

        }
    }
    