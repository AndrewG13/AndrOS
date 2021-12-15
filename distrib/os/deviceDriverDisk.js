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
        krnDskCreateRtn() {
        }
        krnDskReadRtn() {
        }
        krnDskWriteRtn() {
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
            return false;
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