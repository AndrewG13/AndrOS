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

        public krnDiskStatus() : boolean {
            return _Disk.status(); 
        }

        public krnDskDriverEntry() {
            // Initialization routine for this, the kernel-mode Disk Device Driver.
            this.status = "loaded";
        }

        public krnDskCreateRtn(filename : string) {
            if (this.krnDiskStatus()) {
            if (this.fileExists(filename) === "not found") {
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

        public krnDskReadRtn(filename : string) {
            if (this.krnDiskStatus()) {
            let tsbLocation = this.fileExists(filename);
            if (tsbLocation !== "not found") {
                _StdOut.putText(_Disk.read(tsbLocation));
            } else {
                _StdOut.putText("File not found");
            }
            } else {
                _StdOut.putText("Disk Unformatted. Run >format");
            }
        }

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

        public krnDskDeleteRtn(filename : string) {
            if (this.krnDiskStatus()) {
                let tsbLocation = this.fileExists(filename);
                if (tsbLocation !== "not found") {
                    _Disk.delete(tsbLocation);
                    _StdOut.putText("File deleted");
                } else {
                    _StdOut.putText("File not found");
                }
            } else {
                _StdOut.putText("Disk Unformatted. Run >format");
            }
        }
       
        public krnDskFormatRtn() {
            if (!this.krnDiskStatus()) {
                _Disk.format();
            } else {
                _StdOut.putText("Disk Already Formatted");
            }
        }
       
        public krnDskLSRtn() {
            if (this.krnDiskStatus()) {
            let result : string = _Disk.ls();
            if (result === "") {
                _StdOut.putText("*Empty Directory");
            } else {
                _StdOut.putText(_Disk.ls());
            }
        } else {
            _StdOut.putText("Disk Unformatted. Run >format");
        }
        }

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
