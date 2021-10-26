/* ------------
     Control.ts

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
//
// Control Services
//
var TSOS;
(function (TSOS) {
    class Control {
        static hostInit() {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = document.getElementById('display');
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("taHostLog").value = "";
            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();
            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }
        static hostLog(msg, source = "?") {
            // Note the OS CLOCK.
            var clock = _OSclock;
            // Note the REAL clock in milliseconds since January 1, 1970.
            var now = new Date().getTime();
            // Build the log string.
            var str = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";
            // Update the log console.
            var taLog = document.getElementById("taHostLog");
            taLog.value = str + taLog.value;
            // TODO in the future: Optionally update a log database or some streaming service.
        }
        //
        // Host Events
        //
        static hostBtnStartOS_click(btn) {
            // Disable the (passed-in) start button...
            btn.disabled = true;
            // .. enable the Halt and Reset buttons ...
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;
            // .. set focus on the OS console display ...
            document.getElementById("display").focus();
            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new TSOS.Cpu(); // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init(); //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            // ... Create and initialize Main Memory & Accessor
            _Memory = new TSOS.Memory();
            _Memory.init();
            _MemoryAccessor = new TSOS.MemoryAccessor();
            // Create the memory table display
            let memRows = MEMORY_SIZE / 0x08; // number of rows
            let memCols = 0x08; // number of columns (8 bytes)
            let htmlMemory = document.getElementById("tableMemory");
            for (let i = 0; i < memRows; i++) {
                let row = htmlMemory.insertRow();
                let label = row.insertCell();
                label.classList.add("addresses");
                label.innerHTML = "0x" + hexLog((i * memCols), 3);
                label.style["color"] = "coral";
                for (let reg = 0; reg < memCols; reg++) {
                    let newCell = row.insertCell();
                    newCell.classList.add("registers");
                    newCell.innerHTML = hexLog(0x00, 2); // initial value of regs, no need to check
                    _MemoryTableCells[(i * memCols) + reg] = newCell;
                }
            }
            // Load to Memory display 
            _MemoryAccessor.displayRegisters(0x00, 0xFF);
            // Display CPU
            Control.displayCPU();
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(TSOS.Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new TSOS.Kernel();
            _Kernel.krnBootstrap(); // _GLaDOS.afterStartup() will get called in there, if configured.
        }
        static hostBtnHaltOS_click(btn) {
            // Disable the (passed-in) halt button...
            btn.disabled = true;
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }
        static hostBtnReset_click(btn) {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload();
        }
        /*
        / Display CPU Function
        /   Updates the HTML CPU display
        */
        static displayCPU() {
            document.getElementById("CPU_PC").innerHTML = hexLog(_CPU.progCounter, 2);
            document.getElementById("CPU_IR").innerHTML = hexLog(_CPU.instrReg, 2);
            document.getElementById("CPU_ACC").innerHTML = hexLog(_CPU.accumulator, 2);
            document.getElementById("CPU_X").innerHTML = hexLog(_CPU.xReg, 2);
            document.getElementById("CPU_Y").innerHTML = hexLog(_CPU.yReg, 2);
            // Format boolean ZFlag as a numeric bit
            if (_CPU.zFlag) {
                document.getElementById("CPU_Z").innerHTML = hexLog(1, 1);
            }
            else {
                document.getElementById("CPU_Z").innerHTML = hexLog(0, 1);
            }
        }
        /*
        / Display PCB Function
        /   Updates HTML visual for specified PCB
        */
        static displayPCB(pcb) {
            Control.HtmlPCBs[0].innerHTML = "" + pcb.state;
            Control.HtmlPCBs[1].innerHTML = "" + pcb.PID;
            Control.HtmlPCBs[2].innerHTML = "" + hexLog(pcb.PC, 2);
            Control.HtmlPCBs[3].innerHTML = "" + hexLog(pcb.Acc, 2);
            Control.HtmlPCBs[4].innerHTML = "" + hexLog(pcb.Xreg, 2);
            Control.HtmlPCBs[5].innerHTML = "" + hexLog(pcb.Yreg, 2);
            Control.HtmlPCBs[7].innerHTML = "" + hexLog(pcb.base, 2);
            Control.HtmlPCBs[8].innerHTML = "" + hexLog(pcb.limit, 2);
            // Format boolean ZFlag as a numeric bit
            if (pcb.Zflag) {
                Control.HtmlPCBs[6].innerHTML = hexLog(1, 2);
            }
            else {
                Control.HtmlPCBs[6].innerHTML = hexLog(0, 2);
            }
        }
        /*
        / Create PCB Row Function
        /   Spawns a visual HTML row for a newly created PCB
        */
        static createPCBrow(pcb) {
            // Get the table, add PCB reference to list
            let htmlPCBTable = document.getElementById("tablePCB");
            let attributes = 9;
            // Insert a new row underneath prior ones
            let row = htmlPCBTable.insertRow();
            // Add the PCB attributes cells
            for (let i = 0; i < attributes; i++) {
                let newCell = row.insertCell();
                newCell.classList.add("registers");
                Control.HtmlPCBs[i] = newCell;
            }
            // Populate display with PCB attributes
            Control.displayPCB(pcb);
        }
    }
    // * Proj 3, this will be reworked for multiple running PCBs
    Control.HtmlPCBs = new Array();
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=control.js.map