/* ------------
     Kernel.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Kernel {
        //
        // OS Startup and Shutdown Routines
        //
        public krnBootstrap() {      // Page 8. 
            Control.hostLog("bootstrap", "host");  // Use hostLog because we ALWAYS want this, even if _Trace is off.

            // Initialize our global queues/data structures.
            _KernelInterruptQueue = new Queue();  // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array();         // Buffers... for the kernel.
            _KernelInputQueue = new Queue();      // Where device input lands before being processed out somewhere.
            _KernelCommandHistory = new CommandHistory();

            // Launch the Memory Manager software
            _MemoryManager = new MemoryManager();

            // Launch the Scheduling software
            _Scheduler = new Scheduler();

            // Trigger the Dispatching hardware
            _Dispatcher = new Dispatcher();

            // Initialize the console.
            _Console = new Console();             // The command line interface / console I/O device.
            _Console.init();

            // Initialize standard input and output to the _Console.
            _StdIn  = _Console;
            _StdOut = _Console;

            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new DeviceDriverKeyboard();     // Construct it.
            _krnKeyboardDriver.driverEntry();                    // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);

            //
            // ... more?
            //

            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();

            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new Shell();
            _OsShell.init();

            // Finally, initiate student testing protocol.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        }

        public krnShutdown() {
            this.krnTrace("begin shutdown OS");
            // TODO: Check for running processes.  If there are some, alert and stop. Else...
            // ... Disable the Interrupts.
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();

            this.krnTrace("Stoping CPU");
            _CPU.isExecuting = false;
            //
            // Unload the Device Drivers?
            // More?
            //
            this.krnTrace("end shutdown OS");
        }

        /*
        /   Kernel Initiate Program function
        /       Fires up the CPU to run the program in Memory.
        /       Upon termination, memory section in use is wiped.
        */
        public krnInitProg(PID : number) {
            // At this point:
            //  Ready Queue already checked by Run.
            //  Scheduler has sent a PID to run based on its philosophy.
                        
            // Send Base & Limit registers to MA
            _MemoryAccessor.base = PCBList[PID].base;
            _MemoryAccessor.limit = PCBList[PID].limit;

            // Ensure MemoryAccessor starts at appropriate address for MAR
            _MemoryAccessor.changeMAR(0);

            // Ask Kernel for CPU state
            _Kernel.krnLoadStates();
            // Trigger the CPU to run it.
            _CPU.run();                
        }

        /*
        / End Program Function
        /    Terminates the program in execution & deallocates that Memory range
        */
        public krnEndProg(pid : number, msg : string) {
            // Once the process terminates, clear memory for that specific block.
            
            // Deallocate memory block
            let partition = _MemoryManager.deallocateRange(pid);
            // Default to clearing Base & Limit registers in MA
            // This will be overriden if a different program was running.
            _MemoryAccessor.base = 0x000;
            _MemoryAccessor.limit = 0x000;

            // *Note: CPU will be reset upon running next program

            _StdOut.advanceLine();
            _StdOut.putText("PID: " + pid + " | Program Terminated " + msg);
            _StdOut.advanceLine();
            _OsShell.putPrompt();

            // Change PCB state to Terminated
            PCBList[pid].state = PCB.STATES[3];

            // Remove terminated pid from Ready Queue
            _SchedulerReadyQueue.dequeueValue(PCBList[pid]);
        
            // Display Terminated PCB results
            Control.displayPCB(PCBList[pid]);

            // Ensure registers in Memory are accurate by displaying results
            _MemoryAccessor.displayRegisters(PCBList[pid].base, PCBList[pid].limit);

            // May need to reinitialize MARSTATES based on partition
            MARSTATE[partition] = partition * 0x100;

            // If killed pid = PIDRUNNING, reset PIDRUNNING & quantum
            if (pid === PIDRUNNING) {
                // Stop CPU execution
                _CPU.isExecuting = false;
                PIDRUNNING = -1;
                // Reset Quantum
                _Scheduler.quantumVal = QUANTUM; 
            } else 
            // if there was a different program running at this time, ensure base & limit
            if (_CPU.isExecuting) {
                // Must do this, otherwise previous
                _MemoryAccessor.base = PCBList[PIDRUNNING].base;
                _MemoryAccessor.limit = PCBList[PIDRUNNING].limit;
            }
        }

        public krnCheckRunning() {
            // First check if PID has been reset (this happens prior to displaying, see Execute() case:00)
            if (PIDRUNNING !== -1) {
                // Display registers & Update PCB each cycle.  
                _MemoryAccessor.displayRegisters(PCBList[PIDRUNNING].base, PCBList[PIDRUNNING].limit);
                PCBList[PIDRUNNING].updatePCB();
                Control.displayPCB(PCBList[PIDRUNNING]);
            }
        }

        // Decrement Quantum
        public krnTraceInstr() {
            // * Note: CPU executes the instr
            //         then Quantum decrements
            _Scheduler.quantumVal--;
            if (_Scheduler.quantumVal === -1) {
                console.log("PID:" +PIDRUNNING + "| Last Instr:" + hexLog(_CPU.instrReg, 2) )
            }
        }

        public krnLoadStates() {
            // Provide state for CPU based on PCB
            _Dispatcher.loadState();
        }

        public krnOnCPUClockPulse() {
            /* This gets called from the host hardware simulation every time there is a hardware clock pulse.
               This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
               This, on the other hand, is the clock pulse from the hardware / VM / host that tells the kernel
               that it has to look for interrupts and process them if it finds any.                          
            */

            // Check for an interrupt, if there are any. Page 560
            if (_KernelInterruptQueue.getSize() > 0) {
                // Process the first interrupt on the interrupt queue.
                // TODO (maybe): Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            } else if (_CPU.isExecuting) { // If there are no interrupts then run one CPU cycle if there is anything being processed.
                _CPU.cycle();
                //console.log("Quantum:" + _Scheduler.quantumVal + "| PIDRUNN:" + PIDRUNNING);
            } else {                       // If there are no interrupts and there is nothing being executed then just be idle.
    
                //if (_MemoryManager.checkAllRange()) { // If at least one partition is occupied
                //_Scheduler.cycle();
                //}
                    this.krnTrace("Idle");
            }

                // Want to cycle the Scheduler last to avoid data inconsistencies.
                if (_MemoryManager.checkAllRange()) { // If at least one partition is occupied, cycle the Scheduler
                    _Scheduler.cycle();
                }
        }


        //
        // Interrupt Handling
        //
        public krnEnableInterrupts() {
            // Keyboard
            Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        }

        public krnDisableInterrupts() {
            // Keyboard
            Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        }

        public krnInterruptHandler(irq, params) {
            // This is the Interrupt Handler Routine.  See pages 8 and 560.
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on. Page 766.
            this.krnTrace("Handling IRQ~" + irq);

            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR();               // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params);   // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                case DISPATCH_IRQ:
                    // Now call Dispatcher for Context Switch
                    _Dispatcher.contextSwitch();
                    // Display out updated PCB (Just put to Ready)
                    Control.displayPCB(PCBList[PIDRUNNING]);
                    // Expire Quantum (to trigger time for new program) & schedule new program if Ready
                    _Scheduler.quantumVal = -1;
                    _Scheduler.schedIfReady();
                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        }

        public krnTimerISR() {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
            // Or do it elsewhere in the Kernel. We don't really need this.
        }

        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
        // Some ideas:
        // - ReadConsole
        // - WriteConsole
        // - CreateProcess
        // - ExitProcess
        // - WaitForProcessToExit
        // - CreateFile
        // - OpenFile
        // - ReadFile
        // - WriteFile
        // - CloseFile


        //
        // OS Utility Routines
        //
        public krnTrace(msg: string) {
             // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
             if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would quickly lag the browser quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        Control.hostLog(msg, "OS");
                    }
                } else {
                    Control.hostLog(msg, "OS");
                }
             }
        }

        public krnTrapError(msg) {
            Control.hostLog("OS ERROR - TRAP: " + msg);
            // TODO: Display error on console, perhaps in some sort of colored screen. (Maybe blue?)
            this.krnShutdown();
        }
    }
}
