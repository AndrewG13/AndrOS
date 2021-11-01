/* ------------
     Scheduler.ts

     Keeps track of processes & initiates context switches when necessary.
     Context switches are dependant on the Scheduling Methodology in action.
     The Scheduler does not actually handle context switches, thats the Dispatcher's job
     ------------ */
var TSOS;
(function (TSOS) {
    class Scheduler {
        constructor() {
            this.pidRunning = _CPU.pidRunning;
        }
        cycle() {
        }
        scheduleProcess() {
        }
    }
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map