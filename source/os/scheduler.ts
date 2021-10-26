/* ------------
     Scheduler.ts

     Keeps track of processes & initiates context switches when necessary.
     Context switches are dependant on the Scheduling Methodology in action.
     The Scheduler does not actually handle context switches, thats the Dispatcher's job
     ------------ */

     module TSOS {

        export class Scheduler {

            private num : number;   // dummy variable

            constructor() {
                this.num = 0x000;
            }

        }
    }
    