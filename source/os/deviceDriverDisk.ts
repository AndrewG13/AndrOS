/* ----------------------------------
   DeviceDriverDisk.ts

   The Kernel Disk Device Driver.
   ---------------------------------- */

   module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverDisk extends DeviceDriver {

        constructor() {
            // Override the base method pointers.
            // MyTODO: look into what the hell ^ means...
           
            super();
            this.driverEntry = this.krnDskDriverEntry;
            //this.isr = ???
        }

        /*
        / KernelDiskStatus Method
        /    returns the format status of Disk
        */
        public krnDiskStatus() : boolean {
            return _Disk.status(); 
        }

        /*
        / KernelDiskDriverEntry Method
        /    Runs the initialization routine for this driver
        */
        public krnDskDriverEntry() {
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
        public krnDskCreateRtn(filename : string) {
            // check if formatted
            if (this.krnDiskStatus()) {
                // check if filename is available
                if (this.fileExists(filename) === "not found") {
                   // available, decode filename & create the file
                   filename = AsciiLib.decodeString(filename);
                   filename = this.appendAsciiFileend(filename);
                   _Disk.create(filename);
                   _StdOut.putText("File created");
                } else {
                   _StdOut.putText("File already exists");
                }
               
            } else {
                _StdOut.putText("Disk Unformatted. Run >format");
            }
        }

        /*
        / KernelDiskRead Routine
        /    Triggers the 'Read' function on Disk
        */
        public krnDskReadRtn(filename : string) {
            // check if formatted
            if (this.krnDiskStatus()) {
                // check if file exists
                let tsbLocation = this.fileExists(filename);
                if (tsbLocation !== "not found") {
                   // file exists, read its value
                   _StdOut.putText(_Disk.read(tsbLocation));
                } else {
                   _StdOut.putText("File not found");
                }
               
            } else {
                _StdOut.putText("Disk Unformatted. Run >format");
            }
        }

        /*
        / KernelDiskWrite Routine
        /    Triggers the 'Write' function on Disk
        */       
        public krnDskWriteRtn(filename : string, text : string) {
            if (this.krnDiskStatus()) {
            let tsbLocation = this.fileExists(filename);
            // variable to pass in potentially larger data portions/text
            let textTotal : string[] = new Array();
            if (tsbLocation !== "not found") {
                // get the ascii chars of the text
                text = AsciiLib.decodeString(text);
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

                } else {
                    // not exceeding, add fileend and proceed writing
                    text = this.appendAsciiFileend(text);
                    textTotal.push(text);
                }
                _StdOut.putText(_Disk.write(tsbLocation, textTotal));

            } else {
                _StdOut.putText("File does not exist");
            }
            } else {
                _StdOut.putText("Disk Unformatted. Run >format")
            }
        }

        /*
        / KernelDiskDelete Routine
        /    Triggers the 'Delete' function on Disk
        */       
        public krnDskDeleteRtn(filename : string) {
            // check if formatted
            if (this.krnDiskStatus()) {
                // check if file exists
                let tsbLocation = this.fileExists(filename);
                if (tsbLocation !== "not found") {
                    // file exists, delete it & possible its chains
                    _Disk.delete(tsbLocation);
                    _StdOut.putText("File deleted");
                } else {
                    _StdOut.putText("File not found");
                }
            } else {
                _StdOut.putText("Disk Unformatted. Run >format");
            }
        }
       
        /*
        / KernelDiskFormat Routine
        /    Triggers the 'Format' function on Disk
        */       
        public krnDskFormatRtn() {
            // check if already formatted
            if (!this.krnDiskStatus()) {
                // not formatted, do it
                _Disk.format();
            } else {
                _StdOut.putText("Disk Already Formatted");
            }
        }
       
        /*
        / KernelDiskListFiles Routine
        /    Triggers the 'LS' function on Disk
        */       
        public krnDskLSRtn() {
            // check if formatted
            if (this.krnDiskStatus()) {
                // check Disk for files, if none return special message
                let result : string = _Disk.ls();
                if (result === "") {
                   if (_SarcasticMode) {
                       _StdOut.putText("*Empty Directory, like your head.");
                   } else {
                       _StdOut.putText("*Empty Directory");
                   }
                } else {
                   _StdOut.putText(_Disk.ls());
                }
            } else {
                _StdOut.putText("Disk Unformatted. Run >format");
            }
        }

        /*
        / FileExists Method
        /    Helper function to check if a file exists on Disk
        /    Returns the tsb location if found & "not found" if not.
        */       
        private fileExists(filename : string) : string {
            // Starting index
            let tsb : string = "001";
            // "-" to signify the filename ending
            filename = (AsciiLib.decodeString(filename)) + "--";
            while (tsb !== "OOB") {
                let data : string = sessionStorage.getItem(tsb);
                data = data.substring(4);
                if (data.includes(filename)) {
                    // found file, return tsb location
                    return tsb;
                } else {
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
        private appendAsciiFileend(asciiFilename : string) : string {
            // 60 bytes in a data portion of a tsb
            // 1 byte = 2 characters
            let length = 60 * 2;
            for (let i = asciiFilename.length + 1; i < length; i++) {
                asciiFilename = asciiFilename + "-";
            }
            return asciiFilename;
        }

        private getInUseByte(tsb : string) {

        }

        private getPointerBytes(tsb : string) {

        }

        private getDataPortionBytes(tsb : string) {

        }

        private setInUseByte(tsb : string, iu : string) {

        }

        private setPointerBytes(tsb : string, p : string) {

        }

        private setDataPortionBytes(tsb : string, dp : string) {

        }

    }
}
