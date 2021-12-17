var TSOS;
(function (TSOS) {
    class Swapper {
        // When swapping, do roll-out first, then roll-in.
        static rollOut() {
            // 1. take the most recently quantum-expired memory prog (back of ready queue)
            // 2. put its data on a free block in disk (involves swapper files, denoted with ~)
            // 3. save the location info (which partition removed from)
            // 4. wipe that partition (will immediately be populated again)
        }
        static rollIn() {
            // 1. take the next-to-run program on disk (in the front of the special disk queue)
            // 2. put its data in the freed partition from roll-out just performed
            // 3. save its tsb location for ease of restoring once done running
            // 4. wipe that Disk tsb's data (will receieve its updated data back if the prog doesnt finish running)
        }
    }
    TSOS.Swapper = Swapper;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=swapper.js.map