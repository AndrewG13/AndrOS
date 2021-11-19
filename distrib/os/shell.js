/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
// Proj4 TODO: Make the MAN messages more descriptive, help less descriptive. 
//             Encourages users to ACTUALLY CONSULT THE MANUAL!
var TSOS;
(function (TSOS) {
    class Shell {
        constructor() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        init() {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the current Date & Time.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellWhereami, "whereami", "- Displays the user's location.");
            this.commandList[this.commandList.length] = sc;
            // doabarrelroll
            sc = new TSOS.ShellCommand(this.shellDoabarrelroll, "doabarrelroll", "- Impress Peppy Hare.");
            this.commandList[this.commandList.length] = sc;
            // status <string>
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Input a status to be displayed.");
            this.commandList[this.commandList.length] = sc;
            // error
            sc = new TSOS.ShellCommand(this.shellError, "error", "- Trigger the BSOD from Kernal error.");
            this.commandList[this.commandList.length] = sc;
            // load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Load a program into memory.");
            this.commandList[this.commandList.length] = sc;
            // beginassault
            sc = new TSOS.ShellCommand(this.shellBeginAssault, "beginassault", "- Begin attack on Star Wolf!");
            this.commandList[this.commandList.length] = sc;
            // run
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<PID> - Run the program with the specified PID");
            this.commandList[this.commandList.length] = sc;
            // runall
            sc = new TSOS.ShellCommand(this.shellRunall, "runall", "- Run all programs loaded in memory");
            this.commandList[this.commandList.length] = sc;
            // clearmem
            sc = new TSOS.ShellCommand(this.shellClearmem, "clearmem", "- Clear all memory partitions");
            this.commandList[this.commandList.length] = sc;
            // ps
            sc = new TSOS.ShellCommand(this.shellPs, "ps", "- List all inputted processes & info");
            this.commandList[this.commandList.length] = sc;
            // kill
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "<PID> - Kill the program with the specified PID");
            this.commandList[this.commandList.length] = sc;
            // killall
            sc = new TSOS.ShellCommand(this.shellKillall, "killall", "- Kill all programs in execution");
            this.commandList[this.commandList.length] = sc;
            // quantum
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "<int> - Set the Round Robin quantum with specified integer");
            this.commandList[this.commandList.length] = sc;
            // create
            sc = new TSOS.ShellCommand(this.shellCreate, "create", "<filename> - Create a new file");
            this.commandList[this.commandList.length] = sc;
            // read
            sc = new TSOS.ShellCommand(this.shellRead, "read", "<filename> - Read the contents of a file");
            this.commandList[this.commandList.length] = sc;
            // write
            sc = new TSOS.ShellCommand(this.shellWrite, "write", "<filename> - Write to a file");
            this.commandList[this.commandList.length] = sc;
            // delete
            sc = new TSOS.ShellCommand(this.shellDelete, "delete", "<filename> - Delete the specified file");
            this.commandList[this.commandList.length] = sc;
            // format
            sc = new TSOS.ShellCommand(this.shellFormat, "format", "- Format the Disk");
            this.commandList[this.commandList.length] = sc;
            // ls
            sc = new TSOS.ShellCommand(this.shellLs, "ls", "- List all files located on the Disk");
            this.commandList[this.commandList.length] = sc;
            // set schedule
            sc = new TSOS.ShellCommand(this.shellSetSchedule, "setschedule", "<algorithm> - Set the Scheduling algorithm [See Manual for options]");
            this.commandList[this.commandList.length] = sc;
            // get schedule
            sc = new TSOS.ShellCommand(this.shellGetSchedule, "getschedule", "- Check the currently enforced Scheduling algorithm");
            this.commandList[this.commandList.length] = sc;
            // Display the initial prompt.
            this.putPrompt();
        }
        putPrompt() {
            _StdOut.putText(this.promptStr);
        }
        handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
                // Add command to our Command History
                _KernelCommandHistory.add(buffer);
                _KernelCommandHistory.toString();
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    //_StdOut.putText(buffer);
                    this.execute(this.shellInvalidCommand);
                }
            }
        }
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        execute(fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again (if its not shutdown / error).
            if ((fn !== this.shellError) && (fn !== this.shellShutdown)) {
                this.putPrompt();
            }
        }
        parseInput(buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 3. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 3.1 Remove any left-over spaces & lower-case it
            cmd = TSOS.Utils.trim(cmd);
            cmd = cmd.toLowerCase();
            // 3.2 Record it in the return value.
            retVal.command = cmd;
            // 4. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }
        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }
        shellCurse() {
            _OsShell.promptStr = "8=D ";
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }
        shellApology() {
            if (_SarcasticMode) {
                _OsShell.promptStr = ">";
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        }
        // Although args is unused in some of these functions, it is always provided in the
        // actual parameter list when this function is called, so I feel like we need it.
        shellVer(args) {
            _StdOut.putText("Version: " + APP_NAME + "" + APP_VERSION);
        }
        /*
        / Help function
        /    Displays helpful command info
        */
        shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }
        /*
        / Shutdown function
        /    Terminates the OS
        */
        shellShutdown(args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // I got that final prompt to not happen!
        }
        /*
        / Cls function
        /    Clears CLI
        */
        shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }
        /*
        / Man function
        /    Displays manual for specified command.
        /    Not to be confused with the Woman function.
        */
        shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "ver":
                        _StdOut.putText("Displays the current version of AndrOS.");
                        break;
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands. This is a test for linewrap. Can't let you do that, Starfox.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shuts down AndrOS.");
                        break;
                    case "cls":
                        _StdOut.putText("Clears the screen & resets cursor position.");
                        break;
                    case "man":
                        _StdOut.putText("Prompts a brief description for a specified command.");
                        break;
                    case "trace":
                        _StdOut.putText("Turns the OS tracing on or off.");
                        break;
                    case "rot13":
                        _StdOut.putText("Does rot13 obfuscation on <string>.");
                        break;
                    case "prompt":
                        _StdOut.putText("Sets the prompt to the specified text.");
                        break;
                    case "date":
                        _StdOut.putText("Displays current Time & Date.");
                        break;
                    case "whereami":
                        _StdOut.putText("Displays user's location.");
                        break;
                    case "doabarrelroll":
                        _StdOut.putText("Its time you learned, Fox.");
                        break;
                    case "status":
                        _StdOut.putText("Displays a user-inputted status.");
                        break;
                    case "error":
                        _StdOut.putText("Tests Kernal error.");
                        break;
                    case "beginassault":
                        _StdOut.putText("Take flight and defeat Star Wolf.");
                        break;
                    case "load":
                        _StdOut.putText("Load a program into the system.");
                        break;
                    case "run":
                        _StdOut.putText("Runs the program in memory with PID given");
                        break;
                    case "runall":
                        _StdOut.putText("Run all programs");
                        break;
                    case "clearmem":
                        _StdOut.putText("Wipe entirety of memory");
                        break;
                    case "kill":
                        _StdOut.putText("Kill the process with PID given");
                        break;
                    case "killall":
                        _StdOut.putText("Kill all processes");
                        break;
                    case "ps":
                        _StdOut.putText("List all processes");
                        break;
                    case "quantum":
                        _StdOut.putText("Change RR quantum");
                        break;
                    case "create":
                        _StdOut.putText("Create a new file on the Disk with the specified name, if the name is unique");
                        break;
                    case "read":
                        _StdOut.putText("Read a file on the Disk with the specified name, if it exists");
                        break;
                    case "write":
                        _StdOut.putText("Write to a file on the Disk with the specified name, if it exists");
                        break;
                    case "delete":
                        _StdOut.putText("Delete a file on the Disk with the specified name, if it exists");
                        break;
                    case "format":
                        _StdOut.putText("Format the contents of the Disk");
                        break;
                    case "ls":
                        _StdOut.putText("List all contents of the Disk, if files exist");
                        break;
                    case "setschedule":
                        _StdOut.putText("Set the Scheduler algorithm: [RR, FCFS, PRI]");
                        break;
                    case "getschedule":
                        _StdOut.putText("Check the currently in-action Scheduler algorithm");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }
        /*
        / Trace function
        /    Shows a trace of the OS command flow
        */
        shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }
        /*
        / Rot13 function
        /    Ask Alan
        */
        shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }
        /*
        / Prompt function
        /    Changes prompt to passed in text
        */
        shellPrompt(args) {
            if (_SarcasticMode) {
                _StdOut.putText("Access Denied");
            }
            else if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        /*
        / Date function
        /    Displays current time & date
        */
        shellDate(args) {
            // Fetch current time
            let dateTime = new Date();
            // Fetch current hours (for Military Time handling)
            let hours = dateTime.getHours();
            let minutes = (dateTime.getMinutes()).toString();
            let meridiem = " AM";
            // If past afternoon, format like Standard Time
            if (hours > 12) {
                hours -= 12;
                meridiem = " PM";
            }
            _StdOut.putText("Time: " + hours + ":"
                + minutes.padStart(2, '0') + meridiem);
            _StdOut.advanceLine();
            _StdOut.putText("Date: " + (dateTime.getMonth() + 1) + "/"
                + dateTime.getDate() + "/"
                + dateTime.getFullYear());
        }
        /*
        / WhereAmI function
        /    Displays user location
        */
        shellWhereami(args) {
            _StdOut.putText("The Lylat System: Corneria");
        }
        /*
        / Status function
        /    Displays user specified status
        */
        shellStatus(args) {
            // Check if strings were inputted
            if (args.length > 0) {
                let index = 0;
                let statusMsg = "";
                // Concatenate all strings
                while (index < args.length) {
                    statusMsg += " " + args[index];
                    index++;
                }
                // Set the status message to the UI
                _StdOut.putText("Status updated: " + statusMsg);
                document.getElementById("status").innerHTML = statusMsg;
            }
            else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        }
        /*
        / DoABarrelRoll function
        /    Rotates the canvas.
        */
        shellDoabarrelroll(args) {
            // Initiate roll
            document.getElementById("divConsole").setAttribute("class", "barrelroll");
            // After two seconds, remove the rolling effect
            setTimeout(function () {
                document.getElementById("divConsole").removeAttribute("class");
            }, 2000);
            _StdOut.putText(" \"W H H A A A A AAAAAAAAAAA!!!\" ");
        }
        // This will be a little game if I get the time to implement it
        // Like the asteroids shooting game
        shellBeginAssault(args) {
            goodluck.play();
            _StdOut.putText(" \"Good Luck\" ");
            setTimeout(_Console.clearScreen, 2000);
            _Console.resetXY();
        }
        /*
        / Load function
        /    Load user program into memory if valid
        */
        shellLoad(args) {
            // Must cast into HTMLInputElement, since regular HTMLElements don't have .value (a textfield)
            let input = document.getElementById("taProgramInput").value;
            // Remove all whitespace from input:
            //    \s+ = Any neighboring whitespace/tabs/new lines
            //    /g  = for the entire String
            input = input.replace(/\s+/g, "");
            // Check if input is empty OR input contains non-hexadecimal characters
            let validity = ((input === "") || (input.search(/[^\dA-Fa-f]/)));
            // If none found, its valid
            if (validity == -1) {
                _StdOut.putText("Numeric Input: True");
                _StdOut.advanceLine();
                let failLog = ""; // Logs info IF user program failed
                let numOfBytes = input.length / 2;
                // check if input contains more than 256 bytes
                if (input.length % 2 == 1) {
                    failLog += "*1 uneven byte ";
                }
                // Check if input is too large
                if (numOfBytes > 0x100) {
                    if (_SarcasticMode) {
                        failLog += "*Size matters ;) ";
                    }
                    else {
                        failLog += "*Exceeds 256 bytes ";
                    }
                }
                // Contact the Memory Manager if memory is available
                let partition = _MemoryManager.verifyMemory();
                if (partition[0] === -1) {
                    failLog += "*Insufficient Memory ";
                }
                // If user code failed, display why and cease 'load'
                if (failLog !== "") {
                    _StdOut.putText("Load Failed: " + failLog);
                }
                else {
                    // Code successful!
                    // If CPU is currently running, interrupt to allow MA & MMU to load program.
                    // If CPU is not running, no need to interrupt!
                    if (_CPU.isExecuting) {
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(LOAD_IRQ, [partition, numOfBytes, input]));
                    }
                    else {
                        _OsShell.loadIntoMemory(partition, numOfBytes, input);
                    }
                }
            }
            else {
                if (_SarcasticMode) {
                    _StdOut.putText("Not a number doofus. Try looking while typing.");
                }
                else {
                    _StdOut.putText("Numeric Input: False");
                }
            }
        }
        /*
        / Helper function for shellLoad.
        */
        loadIntoMemory(partition, numOfBytes, input) {
            //console.log(partition[0] + " " + partition[1] + " " + partition[2]);
            // Note:
            // partition[0]: partition#
            // partition[1]: base reg
            // partition[2]: limit reg
            // Send Base & Limit registers to MA
            _MemoryAccessor.base = partition[1];
            _MemoryAccessor.limit = partition[2];
            // Assign a block by MMU (send in partition# & PID-to-use)
            _MemoryManager.assignRange(partition[0], TSOS.PCB.PID);
            // Wipe leftover memory in that parition
            _MemoryAccessor.resetBlock(partition[1], partition[2]);
            // Put into memory by Accessor
            for (let reg = 0; reg < numOfBytes; reg += 0x001) {
                let data = parseInt(input.substring(reg * 2, (reg * 2) + 2), 16);
                _MemoryAccessor.writeImmediate(reg, data);
            }
            // Create a PCB & enqueue on Ready Queue (and PCB list)
            let newPCB = new TSOS.PCB(0x000, 0x00, 0x00, 0x00, false);
            newPCB.base = partition[1];
            newPCB.limit = partition[2];
            _SchedulerReadyQueue.enqueue(newPCB);
            PCBList[newPCB.PID] = newPCB;
            // display registers (from start -> end) & PCB 
            _MemoryAccessor.displayRegisters(newPCB.base, newPCB.limit);
            TSOS.Control.createPCBrow(newPCB);
            // Log info
            _StdOut.putText("Load Successful: PID:" + newPCB.PID);
        }
        /*
        /  Run function
        /     Runs the program in memory.
        /     If no program or PID passed, display error.
        */
        shellRun(args) {
            //console.log(_SchedulerReadyQueue.toString());
            if (args.length > 0) {
                let PID = parseInt(args[0]);
                // FailLog to verify PCB validity
                let failLog = "";
                // Check if any programs are Resident
                if (_SchedulerReadyQueue.isEmpty()) {
                    failLog += "*Res. Queue Empty ";
                }
                // Check if PID is numeric
                let validity = (args[0].search(/[^\d]/));
                if (validity === 0) {
                    failLog += "*PID NaN ";
                }
                // Check if PID doesn't exist
                if (PCBList.length <= PID || PID < 0) {
                    failLog += "*PID Nonexistant ";
                }
                // Check if PCB was terminated
                if (PCBList.length > PID && PCBList[PID].state === "Terminated") {
                    failLog += "*PID Terminated ";
                }
                // Check if PCB is currently running
                if (PCBList.length > PID && PCBList[PID].state === "Running") {
                    failLog += "*PID Running ";
                }
                if (failLog !== "") {
                    _StdOut.putText("Run Failed: " + failLog);
                }
                else {
                    // PCB valid and resident!
                    // Set PCB state to "Ready"
                    PCBList[PID].state = TSOS.PCB.STATES[1];
                    TSOS.Control.displayPCB(PCBList[PID]);
                }
            }
            else {
                _StdOut.putText("Usage: run <PID>  Please supply a PID.");
            }
        }
        /*
        / Error function
        /    Initiates an error & BSOD
        */
        shellError(args) {
            let errorMsg = ["ERROR :", "0000x0H ", "0000xCR4P"];
            _OsShell.shellStatus(errorMsg);
            // Throw an error            
            let bsodImage = document.getElementById('bsod');
            _DrawingContext.clearRect(0, 0, 600, 500);
            _DrawingContext.drawImage(bsodImage, 0, 0, 600, 500);
            // Run a shutdown as normal
            _Kernel.krnShutdown();
        }
        /*
        / Runall function
        /     Run all processes
        */
        shellRunall(args) {
            let noProgs = true; // To keep track if any programs 
            // Check each block for PID
            for (let block = 0; block < PARTITIONQUANTITY; block++) {
                // Contact MMU for block info
                let PID = _MemoryManager.checkRange(block);
                // Check if it has a PCB & PID is "Ready"
                if (PID !== -1 && PCBList[PID].state === "Resident") {
                    noProgs = false;
                    args[0] = PID.toString();
                    _OsShell.shellRun(args);
                }
            }
            if (noProgs) {
                _StdOut.putText("No Programs to run.");
            }
        }
        /*
        / Clearmem function
        /     Clear memory & deallocate partitions.
        */
        shellClearmem(args) {
            if (!(_CPU.isExecuting)) {
                // Reset Memory
                _MemoryAccessor.resetMem();
                // Deallocate all partitions
                _MemoryManager.deallocateAll();
                // Update registers display (Memory range: 0x000 -> 0x2FF)
                _MemoryAccessor.displayRegisters(0x000, 0x2FF);
                _StdOut.putText("Memory Clear: Complete");
            }
            else {
                _StdOut.putText("Memory Clear: Denied");
            }
        }
        /*
        / Kill function
        /    Kill PID process
        */
        shellKill(args) {
            // Check if PID provided
            if (args.length > 0) {
                let pid = parseInt(args[0]);
                // Check if PID valid
                if (pid < 0 || pid >= PCBList.length) {
                    _StdOut.putText("Invalid PID.");
                }
                else 
                // Finally check if the process is running or ready
                if (PCBList[pid].state !== "Running" && PCBList[pid].state !== "Ready") {
                    _StdOut.putText("PID: " + pid + " not ready or executing.");
                }
                else {
                    // Process is valid & running!
                    //_StdOut.putText("Manual Kill Initiated")
                    // This kill could be killing a program not currently running
                    // therefor dont stop CPU 
                    // May need to retain quantum
                    // Ask Kernel to conclude program
                    _Kernel.krnEndProg(pid, "[Manually]");
                }
            }
            else {
                _StdOut.putText("Usage: kill <PID>  Please supply a PID.");
            }
        }
        /*
        /  Killall function
        /     Kill all processes
        */
        shellKillall(args) {
            if (PCBList.length === 0) {
                _StdOut.putText("No Programs in memory.");
            }
            else {
                for (let block = 0; block < PARTITIONQUANTITY; block++) {
                    // Check if block has a PCB
                    let PID = _MemoryManager.checkRange(block);
                    if (PID >= 0) {
                        // PCB exists, attempt to kill it
                        // Cast pid and pass it as a parameter to kill
                        args[0] = PID.toString();
                        _OsShell.shellKill(args);
                    }
                }
            }
        }
        /*
        / PS function
        /    List all processes (PID & State)
        */
        shellPs(args) {
            // Check if any processes were inputted
            if (PCBList.length === 0) {
                if (_SarcasticMode) {
                    _StdOut.putText("Really? Did you not read the help command?");
                    _StdOut.advanceLine();
                    _StdOut.putText("Do you not know how any of this works?");
                }
                else {
                    _StdOut.putText("No Processes Available");
                }
            }
            else {
                // There are processes to log!
                // Starting from PID 0, log until reaching the end
                let pid = 0;
                while (pid < PCBList.length) {
                    _StdOut.putText("PID:" + pid + " | State: " + PCBList[pid].state);
                    _StdOut.advanceLine();
                    pid++;
                }
            }
        }
        /*
        / Quantum function
        /    Set the RR quantum
        */
        shellQuantum(args) {
            if (args.length > 0) {
                let setQ = parseInt(args[0]);
                // Check if Quantum is numeric
                let validity = (args[0].search(/[^\d]/));
                if (validity === 0) {
                    _StdOut.putText("Quantum Not an Integer.");
                }
                else {
                    // Quantum is valid, set it
                    QUANTUM = setQ;
                }
            }
            else {
                _StdOut.putText("Usage: quantum <int>  Please supply an integer.");
            }
        }
        /*
        / Create function
        /    Create a file on the Disk, log response msg.
        /    -Log success if: file created
        /    -Log failure if: Disk not formatted, file name not unique, Disk full (maybe?)
        */
        shellCreate(args) {
            // Check if a filename was inputted
            if (args.length > 0) {
            }
            else {
                _StdOut.putText("Usage: status <filename>  Please supply a filename.");
            }
        }
        /*
        / Read function
        /    Read a file on the Disk, log its content.
        /    -Log failure if: Disk not formatted, file does not exist
        */
        shellRead(args) {
            // Check if a filename was inputted
            if (args.length > 0) {
            }
            else {
                _StdOut.putText("Usage: status <filename>  Please supply a filename.");
            }
        }
        /*
        / Write function
        /    Write to a file on the Disk, log response msg.
        /    -Log failure if: Disk not formatted, file does not exist
        */
        shellWrite(args) {
            // Check if a filename was inputted
            if (args.length > 0) {
            }
            else {
                _StdOut.putText("Usage: status <filename>  Please supply a filename.");
            }
        }
        /*
        / Delete function
        /    Delete a file on the Disk, log response msg.
        /    -Log success if: File successfully deleted
        /    -Log failure if: Disk not formatted, file does not exist, file is protected (maybe?)
        */
        shellDelete(args) {
            // Check if a filename was inputted
            if (args.length > 0) {
            }
            else {
                _StdOut.putText("Usage: status <filename>  Please supply a filename.");
            }
        }
        /*
        / Format function
        /    Format the contents of the Disk, log response msg
        /    -Log success if: Disk successfully formatted
        /    -Log failure if: (I dont know)
        /    This is initially required
        */
        shellFormat(args) {
        }
        /*
        / LS function
        /    List all files located on the Disk, log response msg
        /    -Log success if: Disk is formatted (if no files exist, a unique msg will display)
        /    -Log failure if: Disk not formatted
        */
        shellLs(args) {
        }
        /*
        / Set Schedule function
        /    Set the Scheduler to utilize the inputted scheduling algorithm
        */
        shellSetSchedule(args) {
            // Check if an algorithm was inputted
            if (args.length > 0) {
                // This OS ignores user-inputted case sensitivity because it is not petty
                args[0] = args[0].toUpperCase();
                // First check if inputted algorithm is already in-use
                if (args[0] === _Scheduler.getMode()) {
                    if (_SarcasticMode) {
                        _StdOut.putText("That one is currently in-use, bonehead.");
                    }
                    else {
                        _StdOut.putText("Mode " + args[0] + " Already Active.");
                    }
                }
                else {
                    // Not in-use, check if valid and set it
                    _Scheduler.setMode(args[0]);
                }
            }
            else {
                _StdOut.putText("Usage: status <algorithm>  Please supply a scheduling algorithm.");
            }
        }
        /*
        / Get Schedule function
        /    Display the currently active scheduling algorithm
        */
        shellGetSchedule(args) {
            if (_SarcasticMode) {
                _StdOut.putText("What's the matter? Can't remember?");
            }
            _StdOut.putText("Mode: " + _Scheduler.getMode());
        }
    }
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shell.js.map