/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Disk Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverDisk extends TSOS.DeviceDriver {
        //private numSyms : number[] = [41,33,64,35,36,37,94,38,42,40];
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnDskDriverEntry;
            //this.isr = this.krnKbdDispatchKeyPress;
        }
        krnDiskStatus() {
            return _Disk.status();
        }
        krnDskDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        krnDskCreateRtn() {
        }
        krnDskReadRtn() {
        }
        krnDskWriteRtn() {
        }
        krnDskFormatRtn() {
            if (!this.krnDiskStatus()) {
                _Disk.format();
            }
            else {
                _StdOut.putText("Disk Already Formatted");
            }
        }
        krnDskDeleteRtn() {
        }
        krnDskLSRtn() {
        }
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map