/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
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
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Loads a program to memory.");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellBeginAssault, "beginassault", "- Begin attack on Star Wolf!");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<PID> - Run the program with the specified PID");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
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
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }
        shellApology() {
            if (_SarcasticMode) {
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
            _StdOut.putText(APP_NAME + " version: " + APP_VERSION);
        }
        /*
        *  Help function
        *
        *      Displays helpful command info
        */
        shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }
        /*
        *  Shutdown function
        *
        *      Terminates the OS
        */
        shellShutdown(args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // I got that final prompt to not happen!
        }
        /*
        *  Cls function
        *
        *      Clears CLI
        */
        shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }
        /*
        *  Man function
        *
        *      Displays manual for specified command
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
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }
        /*
        *  Trace function
        *
        *      Shows a trace of the OS command flow
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
        *  Rot13 function
        *
        *      Ask Alan
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
        *  Prompt function
        *
        *      Changes prompt to passed in text
        */
        shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        /*
        *  Date function
        *
        *      Displays current time & date
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
        *  WhereAmI function
        *
        *      Displays user location
        */
        shellWhereami(args) {
            _StdOut.putText("The Lylat System: Corneria");
        }
        /*
        *  Status function
        *
        *      Displays user specified status
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
        *  DoABarrelRoll function
        *
        *      Rotates the canvas
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
            //setTimeout(_StdOut.init,2000);
        }
        /*
        *  Load function
        *
        *      Load user program into memory if valid
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
                if ((_MemoryManager.verifyMemory()) === false) {
                    failLog += "*Insufficient Memory ";
                }
                // If user code failed, display why and cease 'load'
                if (failLog !== "") {
                    _StdOut.putText("Load Failed: " + failLog);
                }
                else {
                    // Code successful!
                    // Assign a block by Manager
                    let startAddr = _MemoryManager.assignRange();
                    // Wipe leftover memory (may remove this?)
                    _MemoryAccessor.resetMem();
                    // Put into memory by Accessor
                    for (let reg = 0x00; reg < numOfBytes; reg += 0x01) {
                        let data = parseInt(input.substring(reg * 2, (reg * 2) + 2), 16);
                        _MemoryAccessor.writeImmediate(reg, data);
                    }
                    // Create a PCB & enqueue on Resident Queue (and PCB list)
                    let newPCB = new TSOS.PCB(_CPU.progCounter, _CPU.accumulator, _CPU.xReg, _CPU.yReg, _CPU.zFlag);
                    newPCB.startAddr = startAddr;
                    newPCB.endAddr = startAddr + 0xFF; // range of 256 bytes
                    _KernelResidentQueue.enqueue(newPCB);
                    PCBList[newPCB.PID] = newPCB;
                    // display registers (from start -> end) & PCB 
                    _MemoryAccessor.displayRegisters(startAddr, startAddr + 0xFF);
                    TSOS.Control.createPCBrow(newPCB);
                    _StdOut.putText("Load Successful: PID=" + newPCB.PID);
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
        /  Run function
        /
        /     Runs the program in memory.
        /     If no program or PID passed, display error.
        */
        shellRun(args) {
            console.log(_KernelResidentQueue.toString());
            if (args.length > 0) {
                let PID = parseInt(args[0]);
                // FailLog to verify PCB validity
                let failLog = "";
                // Check if any programs are Resident
                if (_KernelResidentQueue.isEmpty()) {
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
                if (failLog !== "") {
                    _StdOut.putText("Run Failed: " + failLog);
                }
                else {
                    // PCB valid and resident!
                    _Kernel.krnInitProg(PID);
                }
            }
            else {
                _StdOut.putText("Usage: run <PID>  Please supply a PID.");
            }
        }
        /*
        *  Error function
        *
        *      Initiates an error & BSOD
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
    }
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shell.js.map