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
            this.driverEntry = this.krnDskDriverEntry;
            //this.isr = ???
        }
        krnDiskStatus() {
            return _Disk.status();
        }
        krnDskDriverEntry() {
            // Initialization routine for this, the kernel-mode Disk Device Driver.
            this.status = "loaded";
        }
        krnDskCreateRtn(filename) {
            if (this.fileExists(filename) === "not found") {
                filename = TSOS.AsciiLib.decodeString(filename);
                filename = this.appendAsciiFilename(filename);
                _Disk.create(filename);
                _StdOut.putText("File created");
            }
            else {
                _StdOut.putText("File already exists");
            }
        }
        krnDskReadRtn(filename) {
            let tsbLocation = this.fileExists(filename);
            if (tsbLocation !== "not found") {
                _StdOut.putText(_Disk.read(tsbLocation));
            }
            else {
                _StdOut.putText("File not found");
            }
        }
        krnDskWriteRtn(filename, text) {
            let tsbLocation = this.fileExists(filename);
            if (tsbLocation !== "not found") {
                text = TSOS.AsciiLib.decodeString(text);
                text = this.appendAsciiFilename(text);
                _StdOut.putText(_Disk.write(tsbLocation, text));
            }
            else {
                _StdOut.putText("File does not exist");
            }
        }
        krnDskDeleteRtn() {
        }
        krnDskFormatRtn() {
            if (!this.krnDiskStatus()) {
                _Disk.format();
            }
            else {
                _StdOut.putText("Disk Already Formatted");
            }
        }
        krnDskLSRtn() {
        }
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
        appendAsciiFilename(asciiFilename) {
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