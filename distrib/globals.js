/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in our text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */
//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
const APP_NAME = "AndrOS"; // The name just came to me, ya know?
const APP_VERSION = "64"; // I'm trying to make you laugh like as if all thousands
// of students you've taught haven't done the same.
// ... tough competition ...
const CPU_CLOCK_INTERVAL = 100; // This is in ms (milliseconds) so 1000 = 1 second.
const TIMER_IRQ = 0; // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const KEYBOARD_IRQ = 1;
const DISPATCH_IRQ = 2; // Interrupt for Dispatcher Context Switches
const LOAD_IRQ = 3; // Interrupt for Loading a program into Memory while CPU is running.
//   This is necessary to "pause" the CPU, so MA & MMU can be temporarily used.
const MEMORY_SIZE = 0x300; // Main Memory size, 758 addresses, 1 byte stored at each address
const PARTITIONQUANTITY = 3; // Number of segments/divisions in Memory
// Only needed to keep the partition array private for good practice. 
var QUANTUM = 6; // Default value for Round Robin
var PIDRUNNING;
// These are necessary for the Org & Arch implementation of this project.
var MARSTATE = [0x000, 0x100, 0x200]; // For keeping track of where a halted program's MAR is
var MDRSTATE = [0x00, 0x00, 0x00]; // Same for MDR
var goodluck = new Audio("distrib/images/Good_Luck_Starfo_ 64.mp3");
//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
// Hardware (Host)
var _CPU; // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
var _Memory;
var _MemoryAccessor;
// Software (OS)
var _MemoryManager = null;
var _OSclock = 0; // Page 23.
var _Mode = 0; // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.
var _Canvas; // Initialized in Control.hostInit().
var _DrawingContext; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4; // Additional space added to font size when advancing a line.
var _Trace = true; // Default the OS trace to be on.
// The OS Kernel and its queues/data structures
var _Kernel;
var _KernelInterruptQueue = null;
var _KernelInputQueue = null;
var _SchedulerReadyQueue = null;
var _KernelBuffers = null;
var _KernelCommandHistory;
var PCBList = new Array(); // Index value = PID#
var _Scheduler = null;
var _Dispatcher = null;
// Standard input and output
var _StdIn = null;
var _StdOut = null;
// UI
var _Console;
var _OsShell;
var _UserInput = document.getElementById("taProgramInput");
var _MemoryTableCells = new Array();
// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;
// Global Device Driver Objects - page 12
var _krnKeyboardDriver = null;
var _hardwareClockID = null;
// For testing (and enrichment)...
var Glados = null; // This is the function Glados() in glados-ip*.js http://alanclasses.github.io/TSOS/test/ .
var _GLaDOS = null; // If the above is linked in, this is the instantiated instance of Glados.
var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};
// Extra goodies added by yours truly
var timeDateDisplay = setInterval(timeDate, 1000);
// Flags for conflicting keycodes
var ampersand = false; // 38 ( & or ??? )
var leftParen = false; // 40 ( ( or ??? )
function timeDate() {
    let currentTime = new Date();
    document.getElementById("timeAndDate").innerHTML = (currentTime.getMonth() + 1) + "/"
        + currentTime.getDate() + "/"
        + currentTime.getFullYear() + ", "
        + currentTime.toLocaleTimeString();
}
/*
/ HexLog function
/ Param: number (input), length (for padding)
/ Return: string
/ Takes in a number, and returns it in Hexadecimal format
*/
function hexLog(value, length) {
    // Formats value into Base16
    let output = value.toString(16);
    // Formats value padding 0s
    output = output.padStart(length, '0');
    // Console desired output
    return output.toUpperCase();
}
//# sourceMappingURL=globals.js.map