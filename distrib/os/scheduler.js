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
            _SchedulerReadyQueue = new TSOS.Queue(); // The Ready Queue, handled by the Scheduler
        }
        cycle() {
            this.checkIfReady();
        }
        schedulePIDProcess(PID) {
            // Find PCB to run based on PID
            let runThisPCB = _SchedulerReadyQueue.dequeueValue(PCBList[PID]);
            // Consider adding it to the Schedule isRunning variable?
            _CPU.run(runThisPCB);
        }
        scheduleProcess() {
        }
        checkIfReady() {
            let qSize = _SchedulerReadyQueue.getSize(); // Need size in seperate variable
            let notFound = true; // Keep track if one process has already be initiated to run
            let pcbToRun;
            // For each PCB in Ready Queue, check if "Ready"
            // First to be Ready will be ran
            // Continue shifting the Queue until back to its original order (minus the dequeued PCB)
            for (let i = 0; i < qSize; i++) {
                let pcb = _SchedulerReadyQueue.dequeue();
                if ((pcb.state === "Ready") && (notFound)) {
                    pcbToRun = pcb;
                }
                else {
                    _SchedulerReadyQueue.enqueue(pcb);
                }
            }
            // If a process found, initiate run.
            if (!notFound) {
                this.schedulePIDProcess(pcbToRun.PID);
            }
        }
    }
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map