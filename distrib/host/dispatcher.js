/* ------------
     Dispatcher.ts

     Handles the context switches (initiated by the Scheduler)
     More notes
     ------------ */
var TSOS;
(function (TSOS) {
    class Dispatcher {
        constructor() {
            this.num = 0x000;
        }
    }
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=dispatcher.js.map