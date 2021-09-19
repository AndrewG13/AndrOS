/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    class Console {
        constructor(currentFont = _DefaultFontFamily, currentFontSize = _DefaultFontSize, currentXPosition = 0, currentYPosition = _DefaultFontSize, buffer = "") {
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
        }
        init() {
            this.clearScreen();
            this.resetXY();
        }
        clearScreen() {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }
        resetXY() {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }
        handleInput() {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                }
                else if (chr === String.fromCharCode(8)) { // the Backspace key                    
                    // remove last key entered from buffer
                    let lastChar = this.buffer.charAt(this.buffer.length - 1);
                    this.buffer = this.buffer.slice(0, this.buffer.length - 1);
                    this.removeUserText();
                }
                else if (chr === String.fromCharCode(9)) { // the Tab key
                    if (this.buffer.length > 0) {
                        // Check if buffer could be a recognized command
                        for (let index = 0; index < _OsShell.commandList.length; index++) {
                            if (this.buffer.charAt(0) === _OsShell.commandList[index].command.charAt(0)) {
                                this.putText(_OsShell.commandList[index].command);
                            }
                        }
                    }
                }
                else if (chr === String.fromCharCode(38)) { // the Arrow Up key OR Ampersand
                    // Find out if this is an ampersand
                    if (ampersand) {
                        this.putText('&');
                        this.buffer += '&';
                        // Reset ampersand flag
                        ampersand = false;
                    }
                    else {
                        // Must be an up arrow.
                        // if we aren't on the FIRST inputted command, get latest (LIFO)
                        if (_KernelCommandHistory.pointer >= 0) {
                            this.buffer = _KernelCommandHistory.upArrow();
                            this.removeUserText();
                        }
                    }
                }
                else if (chr === String.fromCharCode(40)) { // the Arrow Down key OR LeftParen
                    // Find out if this is a left parenthesis
                    if (leftParen) {
                        this.putText('(');
                        this.buffer += '(';
                        // Reset leftParen flag
                        leftParen = false;
                    }
                    else {
                        // Must be a down arrow
                        // if we aren't on the LAST inputted command, get latest (LIFO)
                        if (_KernelCommandHistory.pointer + 2 < _KernelCommandHistory.getSize()) {
                            this.buffer = _KernelCommandHistory.downArrow();
                            this.removeUserText();
                        }
                    }
                    //this.buffer = _KernelCommandHistory.downArrow();
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        }
        /*
        *  removeUserText Function
        *    Clears any typed out keys, and re-displays the buffer
        *    This is for the Backspace, Up, Down keys
        */
        removeUserText() {
            // Clear the entire line (including prompt)
            _DrawingContext.fillRect(0, this.currentYPosition - 14, this.currentXPosition, this.currentYPosition + 4);
            // Display new buffer
            this.currentXPosition = 0;
            _OsShell.putPrompt();
            this.putText(this.buffer);
        }
        putText(text) {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        }
        advanceLine() {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            let advanceYPosition = _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            if ((this.currentYPosition + advanceYPosition) > 480) {
                let overflow = (this.currentYPosition + advanceYPosition - 480) * -1;
                TSOS.CanvasTextFunctions.scrollCanvas(_DrawingContext, overflow);
                this.currentYPosition += advanceYPosition + overflow;
            }
            else {
                this.currentYPosition += advanceYPosition;
                //console.log ("Y Pos: " + this.currentYPosition);
            }
        }
    }
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=console.js.map