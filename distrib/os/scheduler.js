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
            this.mode = Scheduler.AVAILABLEMODES[0]; // proj4, this will be settable
            PIDRUNNING = -1; // should initialize to -1 (nothings running!)
            _SchedulerReadyQueue = new TSOS.Queue(); // The Ready Queue, handled by the Scheduler
            this.quantumVal = QUANTUM;
        }
        cycle() {
            if (_CPU.isExecuting) {
                // Decrement Quantum
                // When Quantum hits -1, contact Dispatcher for Context Switch
                // Its -1, not 0. This is due to Quantum-- before checking it.
                // Check if RR Context Switch is needed
                if (this.quantumVal === -1) {
                    if (this.checkIfReady()) {
                        // Set the state to Ready
                        PCBList[PIDRUNNING].state = TSOS.PCB.STATES[1];
                        // It already is in the back of the Queue,
                        // So get next (occurs on next cycle)
                        // On next cycle since we are not supposed to Context Switch within
                        // one cycle, not realistic.
                        // Issues interrupt indicating Context Switch
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(DISPATCH_IRQ, [this.mode]));
                    }
                    else {
                        // Context Switch unneeded
                        this.quantumVal = QUANTUM;
                    }
                }
            }
            // Check if processes are Ready if one is not already running
            if (this.quantumVal === -1 || PIDRUNNING === -1) {
                this.schedIfReady();
            }
        }
        // Schedule a specific PID process
        schedulePIDProcess(PID) {
            // Set pidRunning accordingly
            PIDRUNNING = PID;
            // Set PCB to "Running"
            PCBList[PID].state = TSOS.PCB.STATES[2];
            // Ask kernel to run PCB
            _Kernel.krnInitProg(PID);
        }
        // Check if there are Ready processes. If so, schedule them!
        schedIfReady() {
            let qSize = _SchedulerReadyQueue.getSize(); // Need size in seperate variable
            let notFound = true; // Keep track if one process has already been initiated to run
            var pcbToRun = null;
            // For each PCB in Ready Queue, check if "Ready"
            // First to be Ready will be ran
            // Continue shifting the Queue until back to its original order (minus the dequeued PCB)
            for (let i = 0; i < qSize; i++) {
                let pcb = _SchedulerReadyQueue.dequeue();
                if ((pcb.state === "Ready") && (notFound)) {
                    pcbToRun = pcb;
                    notFound = false;
                }
                else {
                    _SchedulerReadyQueue.enqueue(pcb);
                }
            }
            // If a process found, initiate run.
            if (!(notFound)) {
                // First put running process to the back of the Ready Queue
                // * Note: The Ready Queue keeps track of both Ready & Running processes
                //         This is to help retain the order in which the processes were received.
                _SchedulerReadyQueue.enqueue(pcbToRun);
                // Now schedule this process.
                this.schedulePIDProcess(pcbToRun.PID);
            }
        }
        // Check if there are Ready processes, return true if there are.
        checkIfReady() {
            let qSize = _SchedulerReadyQueue.getSize(); // Need size in seperate variable
            let notFound = true; // Keep track if one process has already been initiated to run
            var pcbToRun = null;
            // For each PCB in Ready Queue, check if "Ready"
            // Continue shifting the Queue until back to its original order. 
            for (let i = 0; i < qSize; i++) {
                let pcb = _SchedulerReadyQueue.dequeue();
                if (pcb.state === "Ready") {
                    _SchedulerReadyQueue.enqueue(pcb);
                    return true;
                }
                else {
                    _SchedulerReadyQueue.enqueue(pcb);
                }
            }
            // None found
            return false;
        }
    }
    // Scheduling Philosophies
    Scheduler.AVAILABLEMODES = ["RR", "PRI", "FCFS"];
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map