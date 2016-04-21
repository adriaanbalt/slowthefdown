// var linuxUnsafe = /\W/g; // detecting linux reserved chars. regex, get rid of forward slashes in URL

module.exports = (pathArr, outputZipDir) => String.prototype.concat(
    // returns all files found at specified paths (can accept wildcards)
    "find ",
    pathArr.map((val) => `./${val}`).join(' '), //make all paths relative to root, replace linux unsafe characters
    // clean hidden files/folders from folders specified aboce, pipe to zip
    " -path '*/.*' -prune -o -type f -print | zip ",
    // specify where to ouput file
    outputZipDir,
    // specify that input files should be read in from stdin
    " -@");
