/* ----------------------------------
   DeviceDriverDisk.ts

   The Kernel Disk Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverDisk extends TSOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // MyTODO: look into what the hell ^ means...
            super();
            this.RESERVED_TSB = 13; // index of tsb in a reserved file's name
            this.driverEntry = this.krnDskDriverEntry;
            //this.isr = ???
        }
        /*
        / KernelDiskStatus Method
        /    returns the format status of Disk
        */
        krnDiskStatus() {
            return _Disk.status();
        }
        /*
        / KernelDiskDriverEntry Method
        /    Runs the initialization routine for this driver
        */
        krnDskDriverEntry() {
            // Initialization routine for this, the kernel-mode Disk Device Driver.
            this.status = "loaded";
        }
        /*
        /  All details & failure notes for the following methods are within their respective Shell commands:
        */
        /*
        / KernelDiskCreate Routine
        /    Triggers the 'Create' function on Disk
        */
        krnDskCreateRtn(filename) {
            // check if formatted
            if (this.krnDiskStatus()) {
                // check if filename is available, or if this is a reserved file
                if (this.fileExists(filename) === "not found" || filename.indexOf("~") !== -1) {
                    // available, decode filename & create the file
                    filename = TSOS.AsciiLib.decodeString(filename);
                    filename = this.appendAsciiFileend(filename);
                    let tsb = _Disk.create(filename);
                    _StdOut.putText("File created ");
                    // return location
                    return tsb;
                }
                else {
                    _StdOut.putText("File already exists");
                }
            }
            else {
                _StdOut.putText("Disk Unformatted. Run >format");
            }
            // if not created, return useless result
            return "Not created";
        }
        /*
        / KernelDiskRead Routine
        /    Triggers the 'Read' function on Disk
        */
        krnDskReadRtn(filename) {
            // check if formatted
            if (this.krnDiskStatus()) {
                // check if file exists
                let tsbLocation = this.fileExists(filename);
                if (tsbLocation !== "not found") {
                    // file exists, read its value
                    _StdOut.putText(_Disk.read(tsbLocation));
                }
                else {
                    _StdOut.putText("File not found");
                }
            }
            else {
                _StdOut.putText("Disk Unformatted. Run >format");
            }
        }
        /*
        / KernelDiskWrite Routine
        /    Triggers the 'Write' function on Disk
        */
        krnDskWriteRtn(filename, text) {
            if (this.krnDiskStatus()) {
                // first check if we are dealing with a reserved file
                if (filename.indexOf("~") !== -1) {
                    // deal with the reserved file
                    // get its tsb appended at the end of this passed-in filename
                    let tsb = filename.substring(13);
                    let inputTotal = new Array();
                    // handle chars of user input 
                    while (text.length > 120) { // 60 bytes, each byte = 2 chars
                        let excessCode = text.substring(0, 120);
                        inputTotal.push(excessCode);
                        text = text.substring(120);
                    }
                    if (text.length !== 0) {
                        text = this.appendAsciiFileend(text);
                        inputTotal.push(text);
                    }
                    // write user code to reserved file
                    _Disk.write(tsb, inputTotal);
                }
                else {
                    let tsbLocation = this.fileExists(filename);
                    // variable to pass in potentially larger data portions/text
                    let textTotal = new Array();
                    if (tsbLocation !== "not found") {
                        // get the ascii chars of the text
                        text = TSOS.AsciiLib.decodeString(text);
                        // check if writing will be too large
                        // 1 byte = 2 characters,
                        // 60 bytes per data portion/text, so 120 is the max
                        if (text.length > 120) {
                            // exceeds max, process each 60 bytes (from front of text) as their own array element
                            while (text.length > 120) {
                                let excessBytes = text.substring(0, 120); // chars 0 - 119
                                textTotal.push(excessBytes);
                                text = text.substring(120); // trim front 60 bytes off
                            }
                            // check if there is remaining bytes (didnt exactly reach the end)
                            if (text.length !== 0) {
                                text = this.appendAsciiFileend(text);
                                textTotal.push(text);
                            }
                        }
                        else {
                            // not exceeding, add fileend and proceed writing
                            text = this.appendAsciiFileend(text);
                            textTotal.push(text);
                        }
                        _StdOut.putText(_Disk.write(tsbLocation, textTotal));
                    }
                    else {
                        _StdOut.putText("File does not exist");
                    }
                }
            }
            else {
                _StdOut.putText("Disk Unformatted. Run >format");
            }
        }
        /*
        / KernelDiskDelete Routine
        /    Triggers the 'Delete' function on Disk
        */
        krnDskDeleteRtn(filename) {
            // check if formatted
            if (this.krnDiskStatus()) {
                // check if file exists
                let tsbLocation = this.fileExists(filename);
                if (tsbLocation !== "not found") {
                    // file exists, delete it & possible its chains
                    _Disk.delete(tsbLocation);
                    _StdOut.putText("File deleted");
                }
                else {
                    _StdOut.putText("File not found");
                }
            }
            else {
                _StdOut.putText("Disk Unformatted. Run >format");
            }
        }
        /*
        / KernelDiskFormat Routine
        /    Triggers the 'Format' function on Disk
        */
        krnDskFormatRtn() {
            // check if already formatted
            if (!this.krnDiskStatus()) {
                // not formatted, do it
                _Disk.format();
            }
            else {
                _StdOut.putText("Disk Already Formatted");
            }
        }
        /*
        / KernelDiskListFiles Routine
        /    Triggers the 'LS' function on Disk
        */
        krnDskLSRtn() {
            // check if formatted
            if (this.krnDiskStatus()) {
                // check Disk for files, if none return special message
                let result = _Disk.ls();
                if (result === "") {
                    if (_SarcasticMode) {
                        _StdOut.putText("*Empty Directory, like your head.");
                    }
                    else {
                        _StdOut.putText("*Empty Directory");
                    }
                }
                else {
                    _StdOut.putText(_Disk.ls());
                }
            }
            else {
                _StdOut.putText("Disk Unformatted. Run >format");
            }
        }
        /*
        / FileExists Method
        /    Helper function to check if a file exists on Disk
        /    Returns the tsb location if found & "not found" if not.
        */
        fileExists(filename) {
            // Starting index
            let tsb = "001";
            // "-" to signify the filename ending
            filename = (TSOS.AsciiLib.decodeString(filename)) + "--";
            while (tsb !== "OOB") {
                let data = sessionStorage.getItem(tsb);
                data = data.substring(4);
                if (data.includes(filename)) {
                    // found file, return tsb location
                    return tsb;
                }
                else {
                    tsb = incrementTSB(tsb, "DIR");
                }
            }
            // file not found
            return "not found";
        }
        /*
        / AppendAsciiFileEnd Method
        /    Helper function to apply fileend tag to a file
        */
        appendAsciiFileend(asciiFilename) {
            // 60 bytes in a data portion of a tsb
            // 1 byte = 2 characters
            let length = 60 * 2;
            for (let i = asciiFilename.length + 1; i < length; i++) {
                asciiFilename = asciiFilename + "-";
            }
            return asciiFilename;
        }
        getInUseByte(tsb) {
        }
        getPointerBytes(tsb) {
        }
        getDataPortionBytes(tsb) {
        }
        setInUseByte(tsb, iu) {
        }
        setPointerBytes(tsb, p) {
        }
        setDataPortionBytes(tsb, dp) {
        }
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map