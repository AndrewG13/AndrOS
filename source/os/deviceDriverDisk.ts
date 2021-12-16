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
            if (this.fileExists(filename) === "not found") {
                filename = AsciiLib.decodeString(filename);
                filename = this.appendAsciiFilename(filename);
                _Disk.create(filename);
                _StdOut.putText("File created");
            } else {
                _StdOut.putText("File already exists");
            }

        }

        public krnDskReadRtn(filename : string) {
            if (this.fileExists(filename) !== "not found") {
                
                //_StdOut.putText(filename + ": " + );
            } else {
                _StdOut.putText("File already exists");
            }
        }

        public krnDskWriteRtn() {
            
        }

        public krnDskDeleteRtn() {
            
        }
       
        public krnDskFormatRtn() {
            if (!this.krnDiskStatus()) {
                _Disk.format();
            } else {
                _StdOut.putText("Disk Already Formatted");
            }
        }
       
        public krnDskLSRtn() {
            
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

        private appendAsciiFilename(filename : string) : string {
            // 60 bytes in a data portion of a tsb
            // 1 byte = 2 characters
            let length = 60 * 2;
            for (let i = filename.length + 1; i < length; i++) {
                filename = filename + "-";
            }
            return filename;
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
