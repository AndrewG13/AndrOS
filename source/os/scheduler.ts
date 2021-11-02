/* ------------
     Scheduler.ts

     Keeps track of processes & initiates context switches when necessary.
     Context switches are dependant on the Scheduling Methodology in action.
     The Scheduler does not actually handle context switches, thats the Dispatcher's job
     ------------ */

     module TSOS {

        export class Scheduler {

            // Scheduling Philosophies
            static AVAILABLEMODES : string[] = ["RR", "PRI", "FCFS"]; 

            // Consider having KrnInitProg deqVal, then enq it to put it in the back of the ReadyQueue 
            // (its state will be "Running")
            
            private mode : string;
            private quantumVal : number;

            constructor() {
                this.mode = Scheduler.AVAILABLEMODES[0]; // proj4, this will be settable
                PIDRUNNING = -1; // should initialize to -1 (nothings running!)
                _SchedulerReadyQueue = new Queue(); // The Ready Queue, handled by the Scheduler
                this.quantumVal = QUANTUM;
            }

            public cycle() : void {
                if (_CPU.isExecuting) {
                    // Decrement Quantum
                    this.quantumVal--;
                    // When Quantum hits -1, contact Dispatcher for Context Switch
                    // Its -1, not 0. This is due to Quantum-- before checking it.
                    
                    // Check if RR Context Switch is needed
                    if (this.quantumVal === -1) {
                        // Set the state
                        PCBList[PIDRUNNING].state = PCB.STATES[2];
                        // It already is in the back of the Queue,
                        // So get next 

                        // Now call Dispatcher for Context Switch
                        _Dispatcher.contextSwitch();
                    }
                }

                // Check if processes are Ready if one is not already running
                // May need to change
                if (PIDRUNNING === -1) {
                    this.checkIfReady();
                }
            }

            public schedulePIDProcess(PID : number) {
                // Set pidRunning accordingly
                PIDRUNNING = PID;
                // Set PCB to "Running"
                PCBList[PID].state = PCB.STATES[2];
                // Ask kernel to run PCB
                _Kernel.krnInitProg(PID);
            }

            public scheduleProcess() {

            }

            private checkIfReady() {
                let qSize = _SchedulerReadyQueue.getSize(); // Need size in seperate variable
                let notFound = true; // Keep track if one process has already been initiated to run
                var pcbToRun : PCB = null;

                // For each PCB in Ready Queue, check if "Ready"
                // First to be Ready will be ran
                // Continue shifting the Queue until back to its original order (minus the dequeued PCB)
                for (let i = 0; i < qSize; i++) {
                    let pcb : PCB = _SchedulerReadyQueue.dequeue();
                    if ((pcb.state === "Ready") && (notFound)) {
                        pcbToRun = pcb;
                        notFound = false;
                    } else {
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

        }
    }
    