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

            if (this.fileExists(filename)) {

            }

        }

        public krnDskReadRtn() {
            
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
            let i : string = "001";
            // to signify the filename ending
            filename = filename + "-";
            while (i !== "OOB") {
                let data : string = sessionStorage.getItem(i);
                data = data.substring(4);
                if (data.includes("filename")) {
                    // work on this, also make sure filename is in the ASCII FORMAT
                }
            }

            return "not found";
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
