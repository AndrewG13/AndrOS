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
const APP_NAME: string    = "AndrOS"; // The name just came to me, ya know?
const APP_VERSION: string = "64";     // I'm trying to make you laugh like as if all thousands
 												  // of students you've taught haven't done the same.
												  // ... tough competition ...

const CPU_CLOCK_INTERVAL: number = 100;   // This is in ms (milliseconds) so 1000 = 1 second.

// Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
const TIMER_IRQ: number = 0;    // Interrupt for Timer, different from hardware/host clock pulses.
const KEYBOARD_IRQ: number = 1; // Interrupt for Keyboard device inputs.
const DISPATCH_IRQ: number = 2; // Interrupt for Dispatcher Context Switches
const LOAD_IRQ: number = 3;     // Interrupt for Loading a program into Memory while CPU is running (needed to pause Memory usage, mdr & mar)

// Main Memory 
const MEMORY_SIZE: number = 0x300;    // Main Memory size, 758 addresses, 1 byte stored at each address
const PARTITION_QUANTITY : number = 3; // Number of segments/divisions in Memory
                                      // Only needed to keep the partition array private for good practice. 

// Disk tsb memory limits
const TRACK_SIZE  : number = 4; // Tracks contain sectors
const SECTOR_SIZE : number = 8; // Sectors contain blocks
const BLOCK_SIZE  : number = 8; // Blocks hold the data

var QUANTUM: number = 6; // Default value for Round Robin

var PIDRUNNING: number;

// These are necessary for the Org & Arch implementation of this project.
var MARSTATE: number[] = [0x000, 0x100, 0x200]; // For keeping track of where a halted program's MAR is
var MDRSTATE: number[] = [0x00, 0x00, 0x00];    // Same for MDR

var goodluck = new Audio("distrib/images/Good_Luck_Starfo_ 64.mp3");

//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//

// Hardware (Host)
var _CPU: TSOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
var _Memory: TSOS.Memory;
var _MemoryAccessor: TSOS.MemoryAccessor;
var _Disk: TSOS.Disk;

// Software (OS)
var _MemoryManager: TSOS.MemoryManager = null;

var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas: HTMLCanvasElement;          // Initialized in Control.hostInit().
var _DrawingContext: any;                // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily: string = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize: number = 13;
var _FontHeightMargin: number = 4;       // Additional space added to font size when advancing a line.

var _Trace: boolean = true;              // Default the OS trace to be on.

// The OS Kernel and its queues/data structures
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue: TSOS.Queue = null;
var _KernelInputQueue: TSOS.Queue = null;
var _SchedulerReadyQueue: TSOS.Queue = null;
var _KernelBuffers = null;
var _KernelCommandHistory: TSOS.CommandHistory;
var PCBList = new Array<TSOS.PCB>(); // Index value = PID#
var _Scheduler: TSOS.Scheduler = null;
var _Dispatcher: TSOS.Dispatcher = null;

// Standard input and output
var _StdIn:  TSOS.Console = null;
var _StdOut: TSOS.Console = null;

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;
var _UserInput = document.getElementById("taProgramInput");
var _MemoryTableCells = new Array<HTMLTableCellElement>();
// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver: TSOS.DeviceDriverKeyboard = null;
var _krnDiskDriver:     TSOS.DeviceDriverDisk = null;

var _hardwareClockID: number = null;

// For testing (and enrichment)...
var Glados: any = null;  // This is the function Glados() in glados-ip*.js http://alanclasses.github.io/TSOS/test/ .
var _GLaDOS: any = null; // If the above is linked in, this is the instantiated instance of Glados.

var onDocumentLoad = function() {
	TSOS.Control.hostInit();
   //TSOS.Game.initAssets();
};

// Extra goodies added by yours truly
var timeDateDisplay = setInterval(timeDate, 1000);

// Flags for conflicting keycodes
var ampersand : boolean = false; // 38 ( & or ↑ )
var leftParen : boolean = false; // 40 ( ( or ↓ )

// All assets related to the Starfox Minigame
var _Game: HTMLCanvasElement;
var _GameContext: any;

function timeDate() {
   let currentTime = new Date();
   document.getElementById("timeAndDate").innerHTML = (currentTime.getMonth() + 1) + "/"
                                                    +  currentTime.getDate()       + "/"
                                                    +  currentTime.getFullYear()   + ", "
                                                    +  currentTime.toLocaleTimeString();

}

/*
/ HexLog function
/ Param: number (input), length (for padding)
/ Return: string
/ Takes in a number, and returns it in Hexadecimal format
*/
function hexLog(value : number, length : number) : string {
   // Formats value into Base16
   let output : string = value.toString(16);
   // Formats value padding 0s
   output = output.padStart(length, '0');
   // Console desired output
   return output.toUpperCase();
}
